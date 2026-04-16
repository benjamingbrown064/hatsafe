import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { CreateOrganisationSchema } from '@/lib/validation'
import { checkRateLimit } from '@/lib/rateLimit'
import logger from '@/lib/logger'

// Admin client for auth.admin operations (supabase-js, not @supabase/ssr)
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const rl = await checkRateLimit(ip, 'auth');
    if (!rl.success) return rl.response!;

    const rawBody = await request.json()
    const validation = CreateOrganisationSchema.safeParse(rawBody)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      )
    }
    const { user_id, organisation_name, user_name } = validation.data

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
      logger.error({ err: orgError }, 'Error creating organisation')
      return NextResponse.json({ error: 'Failed to create organisation' }, { status: 500 })
    }

    // Step 2: Fetch email from Supabase Auth using admin client
    const adminClient = createAdminClient()
    const { data: authUser } = await adminClient.auth.admin.getUserById(user_id)
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
      logger.error({ err: userError }, 'Error creating user record')
      await supabase.from('organisations').delete().eq('id', org.id)
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
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
      logger.warn({ err: docTypesError }, 'Error creating default document types (non-fatal)')
      // Non-fatal - continue anyway
    }

    // Demo data is NOT auto-seeded on signup.
    // Users can opt in via Settings → "Try with sample data" (trial accounts only).

    return NextResponse.json({
      success: true,
      organisation_id: org.id,
    })
  } catch (error) {
    logger.error({ err: error }, 'Unexpected error in create-organisation')
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
