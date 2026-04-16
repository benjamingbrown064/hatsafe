import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ConsentSchema } from '@/lib/validation';
import { logAuditEvent } from '@/lib/auditLog';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase
      .from('users')
      .select('ai_processing_consent, ai_consent_date')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      consented: !!data?.ai_processing_consent,
      consentDate: data?.ai_consent_date || null,
    });
  } catch (error) {
    logger.error({ err: error }, 'Consent GET error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawBody = await request.json();
    const validation = ConsentSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid consent request' }, { status: 400 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('users')
      .update({ ai_processing_consent: true, ai_consent_date: now })
      .eq('id', user.id);

    if (updateError) {
      logger.error({ err: updateError }, 'Consent update error');
      return NextResponse.json({ error: 'Failed to save consent' }, { status: 500 });
    }

    if (userData?.organisation_id) {
      await logAuditEvent(supabase, {
        organisation_id: userData.organisation_id,
        user_id: user.id,
        action: 'consent_given',
        metadata: { type: 'ai_processing', timestamp: now },
      });
    }

    return NextResponse.json({ success: true, consentDate: now });
  } catch (error) {
    logger.error({ err: error }, 'Consent POST error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
