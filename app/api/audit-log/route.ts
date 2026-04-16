import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/middleware/rbac';
import { PaginationSchema } from '@/lib/validation';
import logger from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Audit log is admin-only
    const rbac = await requireAdmin(supabase, user.id);
    if (!rbac.allowed) return rbac.response!;

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (!userData?.organisation_id) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const paginationResult = PaginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });
    if (!paginationResult.success) {
      return NextResponse.json({ error: 'Invalid pagination params' }, { status: 400 });
    }
    const { page, limit } = paginationResult.data;
    const offset = (page - 1) * limit;

    const { data: logs, error, count } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .eq('organisation_id', userData.organisation_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error({ err: error }, 'Failed to fetch audit logs');
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Audit log GET error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
