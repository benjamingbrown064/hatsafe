import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { clearDemoData } from '@/lib/demoSeed'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Auth check — must be signed in
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's org
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('organisation_id, role')
      .eq('id', user.id)
      .single()

    if (userDataError || !userData) {
      return NextResponse.json({ error: 'User organisation not found' }, { status: 404 })
    }

    // Only admins/managers can clear demo data
    if (!['admin', 'manager'].includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const result = await clearDemoData(userData.organisation_id)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to clear demo data' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Demo clear error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
