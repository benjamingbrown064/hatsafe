import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { checkRateLimit } from '@/lib/rateLimit';
import { checkPlanLimit } from '@/lib/planLimits';
import { requireContributor } from '@/lib/middleware/rbac';
import { logAuditEvent } from '@/lib/auditLog';
import logger from '@/lib/logger';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Magic byte signatures
const MAGIC_BYTES: Record<string, number[][]> = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]],  // %PDF
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/heic': [[0x66, 0x74, 0x79, 0x70]],         // ftyp at offset 4 — checked separately
  'image/heif': [[0x66, 0x74, 0x79, 0x70]],
};

function checkMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;
  return signatures.some((sig) => {
    // HEIC/HEIF: ftyp appears at byte offset 4
    const offset = (mimeType === 'image/heic' || mimeType === 'image/heif') ? 4 : 0;
    return sig.every((byte, i) => buffer[offset + i] === byte);
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit
    const rl = await checkRateLimit(user.id, 'upload');
    if (!rl.success) return rl.response!;

    // RBAC
    const rbac = await requireContributor(supabase, user.id);
    if (!rbac.allowed) return rbac.response!;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.organisation_id) {
      return NextResponse.json({ error: 'No organisation found' }, { status: 400 });
    }

    // Plan limit
    const planCheck = await checkPlanLimit(supabase, userData.organisation_id, 'documents');
    if (!planCheck.allowed) return planCheck.response!;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entityType = formData.get('entityType') as string | null;
    const entityId = formData.get('entityId') as string | null;
    const extractedDataStr = formData.get('extractedData') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Server-side file validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Accepted: PDF, JPEG, PNG, HEIC' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10 MB' },
        { status: 413 }
      );
    }

    // Read bytes and validate magic bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!checkMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: 'File content does not match its declared type' },
        { status: 400 }
      );
    }

    // Parse extracted data if available
    let extractedData: Record<string, unknown> | null = null;
    if (extractedDataStr) {
      try {
        extractedData = JSON.parse(extractedDataStr);
      } catch {
        return NextResponse.json({ error: 'Invalid extractedData JSON' }, { status: 400 });
      }
    }

    const finalEntityType = entityType || 'person';
    const finalEntityId = entityId || '00000000-0000-0000-0000-000000000000';

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userData.organisation_id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      logger.error({ err: uploadError }, 'Storage upload error');
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    let status = 'pending_review';
    if (extractedData?.expiryDate) {
      const expiryDate = new Date(extractedData.expiryDate as string);
      const now = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 0) status = 'expired';
      else if (daysUntilExpiry <= 30) status = 'expiring_soon';
      else status = 'valid';
    }

    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        organisation_id: userData.organisation_id,
        entity_type: finalEntityType,
        entity_id: finalEntityId,
        title: (extractedData?.documentType as string) || file.name,
        issuer: (extractedData?.issuer as string) || null,
        certificate_number: (extractedData?.documentNumber as string) || null,
        issue_date: (extractedData?.issueDate as string) || null,
        expiry_date: (extractedData?.expiryDate as string) || null,
        status,
        review_status: (extractedData?.confidence as number) > 0.7 ? 'approved' : 'pending',
        confidence_score: (extractedData?.confidence as number) || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (dbError) {
      logger.error({ err: dbError }, 'Database insert error');
      await supabase.storage.from('documents').remove([filePath]);
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 });
    }

    await supabase.from('document_versions').insert({
      document_id: document.id,
      version_number: 1,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      extraction_data: extractedData || {},
      uploaded_by: user.id,
    });

    await logAuditEvent(supabase, {
      organisation_id: userData.organisation_id,
      user_id: user.id,
      action: 'file_upload',
      resource_type: 'document',
      resource_id: document.id,
      metadata: { fileName: file.name, fileSize: file.size, mimeType: file.type },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    logger.error({ err: error }, 'Document upload error');
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}
