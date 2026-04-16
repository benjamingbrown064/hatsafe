import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateAssetSchema, PaginationSchema, SearchSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rateLimit';
import { checkPlanLimit } from '@/lib/planLimits';
import { requireContributor } from '@/lib/middleware/rbac';
import { logAuditEvent } from '@/lib/auditLog';
import logger from '@/lib/logger';

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

    // Rate limit
    const rl = await checkRateLimit(user.id, 'general');
    if (!rl.success) return rl.response!;

    // Validate pagination
    const paginationResult = PaginationSchema.merge(SearchSchema).safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
    });
    if (!paginationResult.success) {
      return NextResponse.json({ error: 'Invalid query params' }, { status: 400 });
    }

    const { page, limit, search } = paginationResult.data;
    const assetType = searchParams.get('type');
    const siteId = searchParams.get('site');
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
      logger.error({ err: assetsError }, 'Error fetching assets');
      return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
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
    logger.error({ err: error }, 'Assets API error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = await checkRateLimit(user.id, 'general');
    if (!rl.success) return rl.response!;

    const rbac = await requireContributor(supabase, user.id);
    if (!rbac.allowed) return rbac.response!;

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (!userData?.organisation_id) {
      return NextResponse.json({ error: 'User organisation not found' }, { status: 404 });
    }

    const planCheck = await checkPlanLimit(supabase, userData.organisation_id, 'assets');
    if (!planCheck.allowed) return planCheck.response!;

    const rawBody = await request.json();
    const validation = CreateAssetSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }
    const body = validation.data;

    const { data: asset, error: createError } = await supabase
      .from('assets')
      .insert({
        organisation_id: userData.organisation_id,
        name: body.name,
        type: body.asset_type,
        manufacturer: body.manufacturer,
        model: body.model,
        serial_number: body.serial_number,
        site_id: body.site_id,
        notes: body.notes,
      })
      .select()
      .single();

    if (createError) {
      logger.error({ err: createError }, 'Error creating asset');
      return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
    }

    await logAuditEvent(supabase, {
      organisation_id: userData.organisation_id,
      user_id: user.id,
      action: 'create',
      resource_type: 'asset',
      resource_id: asset.id,
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    logger.error({ err: error }, 'Create asset error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
