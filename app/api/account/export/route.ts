import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/auditLog';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (!userData?.organisation_id) {
      return NextResponse.json({ error: 'Organisation not found' }, { status: 404 });
    }

    const orgId = userData.organisation_id;

    // Gather all org data
    const [org, users, people, vehicles, assets, documents, sites, teams] = await Promise.all([
      supabase.from('organisations').select('*').eq('id', orgId).single(),
      supabase.from('users').select('id, name, email, role, created_at').eq('organisation_id', orgId),
      supabase.from('people').select('*').eq('organisation_id', orgId),
      supabase.from('vehicles').select('*').eq('organisation_id', orgId),
      supabase.from('assets').select('*').eq('organisation_id', orgId),
      supabase.from('documents').select('*').eq('organisation_id', orgId),
      supabase.from('sites').select('*').eq('organisation_id', orgId),
      supabase.from('teams').select('*').eq('organisation_id', orgId),
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: user.id,
      organisation: org.data,
      users: users.data || [],
      people: people.data || [],
      vehicles: vehicles.data || [],
      assets: assets.data || [],
      documents: documents.data || [],
      sites: sites.data || [],
      teams: teams.data || [],
    };

    await logAuditEvent(supabase, {
      organisation_id: orgId,
      user_id: user.id,
      action: 'data_export',
      metadata: { format: 'json', recordCount: Object.values(exportData).flat().length },
    });

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="hatsafe-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Data export error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
