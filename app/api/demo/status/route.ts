import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ demoActive: false })

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single()

    if (!userData) return NextResponse.json({ demoActive: false })

    const { data: org } = await supabase
      .from('organisations')
      .select('demo_seeded')
      .eq('id', userData.organisation_id)
      .single()

    return NextResponse.json({ demoActive: org?.demo_seeded ?? false })
  } catch {
    return NextResponse.json({ demoActive: false })
  }
}
