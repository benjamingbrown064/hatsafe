import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/middleware/rbac';
import { seedDemoData } from '@/lib/demoSeed';
import logger from '@/lib/logger';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Admin only
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

    // Only available during trial
    const { data: org } = await supabase
      .from('organisations')
      .select('subscription_status, trial_ends_at')
      .eq('id', userData.organisation_id)
      .single();

    if (org?.subscription_status !== 'trial') {
      return NextResponse.json(
        { error: 'Sample data is only available during your trial period' },
        { status: 403 }
      );
    }

    await seedDemoData(userData.organisation_id);
    return NextResponse.json({ success: true, message: 'Sample data loaded' });
  } catch (error) {
    logger.error({ err: error }, 'Demo seed error');
    return NextResponse.json({ error: 'Failed to seed demo data' }, { status: 500 });
  }
}
