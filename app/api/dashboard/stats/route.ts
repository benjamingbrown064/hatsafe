import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
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

    const orgId = userData.organisation_id;
    const now = new Date().toISOString();
    const sevenDaysFromNow = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Count documents by status
    const { data: allDocs, error: docsError } = await supabase
      .from('documents')
      .select('expiry_date, status')
      .eq('organisation_id', orgId)
      .is('archived_at', null);

    if (docsError) {
      console.error('Error fetching documents:', docsError);
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    // Calculate stats
    const stats = {
      expired: 0,
      expiringSoon: 0,
      valid: 0,
      pendingReview: 0,
    };

    allDocs?.forEach((doc) => {
      if (doc.status === 'pending_review') {
        stats.pendingReview++;
      } else if (!doc.expiry_date) {
        // No expiry date - count as valid for now
        stats.valid++;
      } else if (doc.expiry_date < now) {
        stats.expired++;
      } else if (doc.expiry_date < sevenDaysFromNow) {
        stats.expiringSoon++;
      } else {
        stats.valid++;
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
