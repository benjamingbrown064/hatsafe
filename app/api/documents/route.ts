import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get current user and org
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's organisation
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (userDataError || !userData) {
      return NextResponse.json(
        { error: 'User organisation not found' },
        { status: 404 }
      );
    }

    const orgId = userData.organisation_id;

    // Parse query params
    const search = searchParams.get('search') || '';
    const entityType = searchParams.get('entity_type');
    const status = searchParams.get('status');
    const documentType = searchParams.get('document_type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('documents')
      .select(
        `
        *,
        person:people(id, name),
        vehicle:vehicles(id, registration),
        asset:assets(id, name)
      `,
        { count: 'exact' }
      )
      .eq('organisation_id', orgId)
      .is('archived_at', null);

    // Apply filters
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,certificate_number.ilike.%${search}%`
      );
    }

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (documentType) {
      query = query.eq('document_type', documentType);
    }

    // Execute query
    const { data: documents, error: docsError, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (docsError) {
      logger.error({ err: docsError }, 'Error fetching documents:');
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    // Format documents with entity name
    const formattedDocs = documents?.map((doc) => {
      let entityName = 'Unknown';
      if (doc.entity_type === 'person' && doc.person) {
        entityName = doc.person.name;
      } else if (doc.entity_type === 'vehicle' && doc.vehicle) {
        entityName = doc.vehicle.registration;
      } else if (doc.entity_type === 'asset' && doc.asset) {
        entityName = doc.asset.name;
      }

      return {
        ...doc,
        entity_name: entityName,
      };
    });

    return NextResponse.json({
      documents: formattedDocs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Documents API error:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
