import { NextResponse } from 'next/server';
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
    const assetType = searchParams.get('type');
    const siteId = searchParams.get('site');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('assets')
      .select(
        `
        *,
        site:sites(id, name),
        documents:documents(id, status, expiry_date)
      `,
        { count: 'exact' }
      )
      .eq('organisation_id', orgId)
      .is('archived_at', null);

    // Apply filters
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,asset_id.ilike.%${search}%,type.ilike.%${search}%`
      );
    }

    if (assetType) {
      query = query.eq('type', assetType);
    }

    if (siteId) {
      query = query.eq('site_id', siteId);
    }

    // Execute query
    const { data: assets, error: assetsError, count } = await query
      .order('name')
      .range(offset, offset + limit - 1);

    if (assetsError) {
      console.error('Error fetching assets:', assetsError);
      return NextResponse.json(
        { error: 'Failed to fetch assets' },
        { status: 500 }
      );
    }

    // Calculate document stats for each asset
    const now = new Date().toISOString();
    const sevenDaysFromNow = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const assetsWithStats = assets?.map((asset) => {
      const docs = asset.documents || [];
      let expired = 0;
      let expiring = 0;
      let valid = 0;

      docs.forEach((doc: any) => {
        if (!doc.expiry_date) {
          valid++;
        } else if (doc.expiry_date < now) {
          expired++;
        } else if (doc.expiry_date < sevenDaysFromNow) {
          expiring++;
        } else {
          valid++;
        }
      });

      // Determine overall status
      let assetStatus = 'valid';
      if (expired > 0) assetStatus = 'expired';
      else if (expiring > 0) assetStatus = 'expiring';

      return {
        id: asset.id,
        asset_id: asset.asset_id,
        name: asset.name,
        type: asset.type,
        manufacturer: asset.manufacturer,
        site: asset.site,
        documents: {
          total: docs.length,
          expired,
          expiring,
          valid,
        },
        status: assetStatus,
        created_at: asset.created_at,
      };
    });

    return NextResponse.json({
      assets: assetsWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Assets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

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

    // Create asset
    const { data: asset, error: createError } = await supabase
      .from('assets')
      .insert({
        organisation_id: userData.organisation_id,
        asset_id: body.asset_id,
        name: body.name,
        type: body.type,
        manufacturer: body.manufacturer,
        model: body.model,
        serial_number: body.serial_number,
        site_id: body.site_id,
        purchase_date: body.purchase_date,
        warranty_expiry: body.warranty_expiry,
        notes: body.notes,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating asset:', createError);
      return NextResponse.json(
        { error: 'Failed to create asset' },
        { status: 500 }
      );
    }

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Create asset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
