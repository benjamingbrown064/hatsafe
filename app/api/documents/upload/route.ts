import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's organisation
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.organisation_id) {
      console.error('User lookup error:', userError);
      return NextResponse.json(
        { error: 'No organisation found' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entityType = formData.get('entityType') as string | null;
    const entityId = formData.get('entityId') as string | null;
    const extractedDataStr = formData.get('extractedData') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Parse extracted data if available
    const extractedData = extractedDataStr ? JSON.parse(extractedDataStr) : null;
    
    // For MVP: use placeholder entity if not provided
    const finalEntityType = entityType || 'person';
    const finalEntityId = entityId || '00000000-0000-0000-0000-000000000000'; // Placeholder

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userData.organisation_id}/${fileName}`;

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload file to storage');
    }

    // Calculate document status
    let status = 'pending_review';
    if (extractedData?.expiryDate) {
      const expiryDate = new Date(extractedData.expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        status = 'expired';
      } else if (daysUntilExpiry <= 30) {
        status = 'expiring_soon';
      } else {
        status = 'valid';
      }
    }

    // 1. Create document record
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        organisation_id: userData.organisation_id,
        entity_type: finalEntityType,
        entity_id: finalEntityId,
        title: extractedData?.documentType || file.name,
        issuer: extractedData?.issuer || null,
        certificate_number: extractedData?.documentNumber || null,
        issue_date: extractedData?.issueDate || null,
        expiry_date: extractedData?.expiryDate || null,
        status,
        review_status: extractedData?.confidence > 0.7 ? 'approved' : 'pending',
        confidence_score: extractedData?.confidence || null,
        created_by: user.id
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      
      // Try to clean up uploaded file
      await supabase.storage
        .from('documents')
        .remove([filePath]);
      
      throw new Error(`Failed to create document record: ${dbError.message}`);
    }

    // 2. Create document version record
    const { error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_id: document.id,
        version_number: 1,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        extraction_data: extractedData || {},
        uploaded_by: user.id
      });

    if (versionError) {
      console.error('Version insert error:', versionError);
    }

    return NextResponse.json({
      success: true,
      document
    });

  } catch (error) {
    console.error('Document upload error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
