import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreatePersonSchema, PaginationSchema, SearchSchema } from '@/lib/validation';
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
    const teamId = searchParams.get('team');
    const siteId = searchParams.get('site');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('people')
      .select(
        `
        *,
        team:teams(id, name),
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
        `name.ilike.%${search}%,email.ilike.%${search}%,role.ilike.%${search}%`
      );
    }

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    if (siteId) {
      query = query.eq('site_id', siteId);
    }

    // Execute query
    const { data: people, error: peopleError, count } = await query
      .order('name')
      .range(offset, offset + limit - 1);

    if (peopleError) {
      logger.error({ err: peopleError }, 'Error fetching people');
      return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
    }

    // Calculate document stats for each person
    const now = new Date().toISOString();
    const sevenDaysFromNow = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const peopleWithStats = people?.map((person) => {
      const docs = person.documents || [];
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
      let personStatus = 'valid';
      if (expired > 0) personStatus = 'expired';
      else if (expiring > 0) personStatus = 'expiring';

      return {
        id: person.id,
        name: person.name,
        email: person.email,
        phone: person.phone,
        role: person.role,
        team: person.team,
        site: person.site,
        documents: {
          total: docs.length,
          expired,
          expiring,
          valid,
        },
        status: personStatus,
        created_at: person.created_at,
      };
    });

    // Filter by status if requested
    let filteredPeople = peopleWithStats;
    if (status) {
      filteredPeople = peopleWithStats?.filter((p) => p.status === status);
    }

    return NextResponse.json({
      people: filteredPeople,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'People API error:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit
    const rl = await checkRateLimit(user.id, 'general');
    if (!rl.success) return rl.response!;

    // RBAC: contributor+
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

    // Plan limit
    const planCheck = await checkPlanLimit(supabase, userData.organisation_id, 'people');
    if (!planCheck.allowed) return planCheck.response!;

    // Validate body
    const rawBody = await request.json();
    const validation = CreatePersonSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }
    const body = validation.data;

    const { data: person, error: createError } = await supabase
      .from('people')
      .insert({
        organisation_id: userData.organisation_id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        team_id: body.team_id,
        site_id: body.site_id,
        employee_id: body.employee_id,
        date_of_birth: body.date_of_birth,
        address: body.address,
        emergency_contact: body.emergency_contact,
        notes: body.notes,
      })
      .select()
      .single();

    if (createError) {
      logger.error({ err: createError }, 'Error creating person');
      return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
    }

    await logAuditEvent(supabase, {
      organisation_id: userData.organisation_id,
      user_id: user.id,
      action: 'create',
      resource_type: 'person',
      resource_id: person.id,
    });

    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    logger.error({ err: error }, 'Create person error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
