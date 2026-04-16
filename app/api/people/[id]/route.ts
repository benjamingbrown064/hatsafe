import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/middleware/rbac';
import { logAuditEvent } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

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

    // Get person with related data
    const { data: person, error: personError } = await supabase
      .from('people')
      .select(
        `
        *,
        team:teams(id, name),
        site:sites(id, name),
        manager:people!people_manager_id_fkey(id, name),
        documents:documents(
          id,
          title,
          certificate_number,
          issue_date,
          expiry_date,
          status,
          file_url,
          created_at
        )
      `
      )
      .eq('id', id)
      .eq('organisation_id', userData.organisation_id)
      .is('archived_at', null)
      .single();

    if (personError || !person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    return NextResponse.json(person);
  } catch (error) {
    logger.error({ err: error }, 'Get person error:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Update person
    const { data: person, error: updateError } = await supabase
      .from('people')
      .update({
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        team_id: body.team_id,
        site_id: body.site_id,
        manager_id: body.manager_id,
        employee_id: body.employee_id,
        date_of_birth: body.date_of_birth,
        address: body.address,
        emergency_contact: body.emergency_contact,
        notes: body.notes,
      })
      .eq('id', id)
      .eq('organisation_id', userData.organisation_id)
      .select()
      .single();

    if (updateError) {
      logger.error({ err: updateError }, 'Error updating person:');
      return NextResponse.json(
        { error: 'Failed to update person' },
        { status: 500 }
      );
    }

    return NextResponse.json(person);
  } catch (error) {
    logger.error({ err: error }, 'Update person error:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

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
      return NextResponse.json({ error: 'User organisation not found' }, { status: 404 });
    }

    // DELETE requires admin role
    const rbac = await requireAdmin(supabase, user.id);
    if (!rbac.allowed) return rbac.response!;

    // Soft delete (set archived_at)
    const { error: deleteError } = await supabase
      .from('people')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id)
      .eq('organisation_id', userData.organisation_id);

    if (deleteError) {
      logger.error({ err: deleteError }, 'Error deleting person:');
      return NextResponse.json(
        { error: 'Failed to delete person' },
        { status: 500 }
      );
    }

    await logAuditEvent(supabase, {
      organisation_id: userData.organisation_id,
      user_id: user.id,
      action: 'delete',
      resource_type: 'person',
      resource_id: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ err: error }, 'Delete person error:');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
