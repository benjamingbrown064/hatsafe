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
    const { data: profile } = await supabase
      .from('profiles')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (!profile?.organisation_id) {
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

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${profile.organisation_id}/${fileName}`;

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

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Determine document type and category
    const documentType = extractedData?.documentType || 'Other';
    const category = categorizeDocument(documentType);

    // Calculate expiry status
    let expiryStatus: 'valid' | 'expiring_soon' | 'expired' | 'no_expiry' = 'no_expiry';
    
    if (extractedData?.expiryDate) {
      const expiryDate = new Date(extractedData.expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        expiryStatus = 'expired';
      } else if (daysUntilExpiry <= 30) {
        expiryStatus = 'expiring_soon';
      } else {
        expiryStatus = 'valid';
      }
    }

    // Create document record
    const documentData: any = {
      organisation_id: profile.organisation_id,
      document_type: documentType,
      category,
      file_name: file.name,
      file_path: filePath,
      file_url: urlData.publicUrl,
      file_size: file.size,
      mime_type: file.type,
      uploaded_by: user.id,
      expiry_status: expiryStatus,
      ai_extracted: !!extractedData,
      ai_confidence: extractedData?.confidence || null
    };

    // Add extracted fields if available
    if (extractedData) {
      if (extractedData.documentNumber) {
        documentData.document_number = extractedData.documentNumber;
      }
      if (extractedData.issueDate) {
        documentData.issue_date = extractedData.issueDate;
      }
      if (extractedData.expiryDate) {
        documentData.expiry_date = extractedData.expiryDate;
      }
      if (extractedData.issuer) {
        documentData.issuer = extractedData.issuer;
      }
      if (extractedData.rawText) {
        documentData.notes = extractedData.rawText;
      }
    }

    // Link to entity if provided
    if (entityType && entityId) {
      documentData.entity_type = entityType;
      documentData.entity_id = entityId;
    }

    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      
      // Try to clean up uploaded file
      await supabase.storage
        .from('documents')
        .remove([filePath]);
      
      throw new Error('Failed to create document record');
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

function categorizeDocument(documentType: string): string {
  const type = documentType.toLowerCase();
  
  // People-related documents
  if (type.includes('cscs') || type.includes('card') || type.includes('certification') || type.includes('qualification')) {
    return 'certification';
  }
  if (type.includes('driving') || type.includes('license') || type.includes('licence')) {
    return 'license';
  }
  if (type.includes('dbs') || type.includes('criminal') || type.includes('check')) {
    return 'background_check';
  }
  
  // Vehicle-related documents
  if (type.includes('mot') || type.includes('test')) {
    return 'inspection';
  }
  if (type.includes('insurance') || type.includes('policy')) {
    return 'insurance';
  }
  if (type.includes('tax') || type.includes('ved')) {
    return 'tax';
  }
  if (type.includes('registration') || type.includes('v5')) {
    return 'registration';
  }
  
  // Asset-related documents
  if (type.includes('pat') || type.includes('electrical') || type.includes('safety')) {
    return 'safety';
  }
  if (type.includes('calibration') || type.includes('maintenance')) {
    return 'maintenance';
  }
  if (type.includes('warranty') || type.includes('guarantee')) {
    return 'warranty';
  }
  
  // Fallback
  return 'other';
}
