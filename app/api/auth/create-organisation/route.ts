import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { seedDemoData } from '@/lib/demoSeed'

export async function POST(request: Request) {
  try {
    const { user_id, organisation_name, user_name } = await request.json()

    if (!user_id || !organisation_name || !user_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use service role client to bypass RLS
    const supabase = createServiceClient()

    // Step 1: Create organisation
    const { data: org, error: orgError } = await supabase
      .from('organisations')
      .insert({
        name: organisation_name,
        subscription_status: 'trial',
        subscription_tier: 'starter',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      })
      .select()
      .single()

    if (orgError) {
      console.error('Error creating organisation:', orgError)
      return NextResponse.json(
        { error: 'Failed to create organisation' },
        { status: 500 }
      )
    }

    // Step 2: Fetch email from Supabase Auth
    const { data: authUser } = await supabase.auth.admin.getUserById(user_id)
    const userEmail = authUser?.user?.email ?? ''

    // Create user record (linked to org)
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: user_id,
        organisation_id: org.id,
        email: userEmail,
        name: user_name,
        role: 'admin', // First user is admin
      })

    if (userError) {
      console.error('Error creating user record:', userError)
      // Rollback: delete organisation
      await supabase.from('organisations').delete().eq('id', org.id)
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    // Step 3: Create default document types for this org
    const defaultDocTypes = [
      {
        organisation_id: org.id,
        name: 'CSCS Card',
        category: 'certification',
        entity_types: ['people'],
        is_renewable: true,
        default_lead_times: [30, 14, 7],
        required_fields: ['certificate_number', 'issue_date', 'expiry_date'],
      },
      {
        organisation_id: org.id,
        name: 'IPAF',
        category: 'certification',
        entity_types: ['people'],
        is_renewable: true,
        default_lead_times: [30, 14, 7],
        required_fields: ['certificate_number', 'issue_date', 'expiry_date'],
      },
      {
        organisation_id: org.id,
        name: 'MOT Certificate',
        category: 'inspection',
        entity_types: ['vehicles'],
        is_renewable: true,
        default_lead_times: [30, 14, 7],
        required_fields: ['certificate_number', 'issue_date', 'expiry_date'],
      },
      {
        organisation_id: org.id,
        name: 'Vehicle Insurance',
        category: 'insurance',
        entity_types: ['vehicles'],
        is_renewable: true,
        default_lead_times: [30, 14, 7],
        required_fields: ['certificate_number', 'issue_date', 'expiry_date'],
      },
      {
        organisation_id: org.id,
        name: 'LOLER Inspection',
        category: 'inspection',
        entity_types: ['assets'],
        is_renewable: true,
        default_lead_times: [30, 14, 7],
        required_fields: ['certificate_number', 'issue_date', 'expiry_date'],
      },
    ]

    const { error: docTypesError } = await supabase
      .from('document_types')
      .insert(defaultDocTypes)

    if (docTypesError) {
      console.error('Error creating default document types:', docTypesError)
      // Non-fatal - continue anyway
    }

    // Step 4: Seed demo data for new organisations (non-blocking — failure won't block signup)
    seedDemoData(org.id).catch(err =>
      console.error('[create-organisation] demo seed failed:', err)
    )

    return NextResponse.json({
      success: true,
      organisation_id: org.id,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
