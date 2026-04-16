import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/middleware/rbac';
import { logAuditEvent } from '@/lib/auditLog';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Must be admin
    const rbac = await requireAdmin(supabase, user.id);
    if (!rbac.allowed) return rbac.response!;

    const { organisationName } = await request.json();
    if (!organisationName || typeof organisationName !== 'string') {
      return NextResponse.json({ error: 'Organisation name required for confirmation' }, { status: 400 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (!userData?.organisation_id) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    const orgId = userData.organisation_id;

    // Verify org name matches
    const { data: org } = await supabase
      .from('organisations')
      .select('name')
      .eq('id', orgId)
      .single();

    if (!org || org.name.toLowerCase() !== organisationName.toLowerCase()) {
      return NextResponse.json({ error: 'Organisation name does not match' }, { status: 400 });
    }

    // Log deletion intent BEFORE executing
    await logAuditEvent(supabase, {
      organisation_id: orgId,
      user_id: user.id,
      action: 'org_delete',
      metadata: { orgName: org.name, scheduledAt: new Date().toISOString() },
    });

    // Soft delete: set deleted_at with 30-day grace period
    const { error: softDeleteError } = await supabase
      .from('organisations')
      .update({
        deleted_at: new Date().toISOString(),
        purge_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', orgId);

    if (softDeleteError) {
      logger.error({ err: softDeleteError }, 'Failed to soft-delete organisation');
      return NextResponse.json({ error: 'Failed to schedule deletion' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Organisation scheduled for deletion. All data will be permanently deleted in 30 days.',
      purgeAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    logger.error({ err: error }, 'Delete organisation error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
