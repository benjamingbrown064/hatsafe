/**
 * HatSafe Demo Mode Seed
 * ---------------------
 * Populates a new organisation with realistic sample data for
 * "Apex Construction Ltd" (~30 workers). Idempotent — safe to call multiple times.
 *
 * All seeded records carry is_demo = true so they can be bulk-deleted cleanly.
 * Respects existing Supabase RLS by using the service-role client.
 */

import { createServiceClient } from '@/lib/supabase/server'
import logger from '@/lib/logger';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SeedResult {
  success: boolean
  error?: string
  alreadySeeded?: boolean
}

// ---------------------------------------------------------------------------
// Date helpers — all dates relative to "now" so demo always looks fresh
// ---------------------------------------------------------------------------

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function daysAgo(days: number): string {
  return daysFromNow(-days)
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

export async function seedDemoData(orgId: string): Promise<SeedResult> {
  const supabase = createServiceClient()

  // ── Idempotency check ────────────────────────────────────────────────────
  // If the migration hasn't been applied yet (column doesn't exist), skip silently.
  const { data: org, error: orgCheckError } = await supabase
    .from('organisations')
    .select('demo_seeded')
    .eq('id', orgId)
    .single()

  if (orgCheckError) {
    // Column doesn't exist yet (migration pending) — skip seed, don't fail signup
    if (orgCheckError.code === '42703' || orgCheckError.message?.includes('column')) {
      return { success: true, alreadySeeded: true }
    }
    // Any other error — fail silently, don't block signup
    return { success: false, error: orgCheckError.message }
  }

  if (org?.demo_seeded) {
    return { success: true, alreadySeeded: true }
  }

  try {
    // ── 1. Document types ────────────────────────────────────────────────────
    const docTypeDefs = [
      { name: 'CSCS Card',             category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'CPCS Licence',          category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [60, 30, 14] },
      { name: 'IPAF Certificate',      category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'PASMA Certificate',     category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'First Aid at Work',     category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [60, 30, 14] },
      { name: 'Manual Handling',       category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'Asbestos Awareness',    category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'Working at Height',     category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'Fire Safety',           category: 'certification', entity_types: ['people'],             is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'MOT Certificate',       category: 'inspection',    entity_types: ['vehicles'],           is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'Vehicle Insurance',     category: 'insurance',     entity_types: ['vehicles'],           is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'LOLER Inspection',      category: 'inspection',    entity_types: ['assets'],             is_renewable: true,  default_lead_times: [30, 14, 7] },
      { name: 'Public Liability',      category: 'insurance',     entity_types: ['suppliers'],          is_renewable: true,  default_lead_times: [60, 30, 14] },
      { name: 'Employers Liability',   category: 'insurance',     entity_types: ['suppliers'],          is_renewable: true,  default_lead_times: [60, 30, 14] },
    ]

    const { data: insertedDocTypes, error: dtError } = await supabase
      .from('document_types')
      .insert(docTypeDefs.map(dt => ({
        ...dt,
        organisation_id: orgId,
        is_demo: true,
        required_fields: ['certificate_number', 'issue_date', 'expiry_date'],
        settings: {},
      })))
      .select('id, name')

    if (dtError) throw new Error(`document_types: ${dtError.message}`)

    const dtMap: Record<string, string> = {}
    insertedDocTypes?.forEach(dt => { dtMap[dt.name] = dt.id })

    // ── 2. Sites ─────────────────────────────────────────────────────────────
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .insert([
        { organisation_id: orgId, name: 'Riverside Quarter — Phase 1', client: 'Urban Properties Ltd', address: 'Riverside Way, Manchester', postcode: 'M1 5QP', is_demo: true },
        { organisation_id: orgId, name: 'Thornton Business Park',       client: 'Thornton Estates',      address: 'Thornton Road, Leeds',     postcode: 'LS1 2AB', is_demo: true },
        { organisation_id: orgId, name: 'Apex Head Office — Depot',     client: 'Internal',              address: '14 Depot Lane, Sheffield', postcode: 'S9 3WR', is_demo: true },
      ])
      .select('id, name')

    if (sitesError) throw new Error(`sites: ${sitesError.message}`)
    const siteA = sites![0].id
    const siteB = sites![1].id
    const siteC = sites![2].id

    // ── 3. People ─────────────────────────────────────────────────────────────
    const peopleDefs = [
      { name: 'Jack Hewitt',      role: 'Site Manager',          employment_status: 'active',     site_id: siteA },
      { name: 'Diane Walsh',      role: 'Health & Safety Officer', employment_status: 'active',   site_id: siteA },
      { name: 'Craig Foster',     role: 'Plant Operator',         employment_status: 'active',     site_id: siteA },
      { name: 'Pete Ashworth',    role: 'Scaffolder',             employment_status: 'active',     site_id: siteB },
      { name: 'Anita Sharma',     role: 'Electrician',            employment_status: 'active',     site_id: siteB },
      { name: 'Marcus Bell',      role: 'Labourer',               employment_status: 'active',     site_id: siteB },
      { name: 'Sharon Doyle',     role: 'First Aider',            employment_status: 'active',     site_id: siteA },
      { name: 'Tom Garside',      role: 'Labourer',               employment_status: 'active',     site_id: siteC },
      { name: 'Vijay Nair',       role: 'Carpenter',              employment_status: 'active',     site_id: siteC },
      { name: 'Fiona McAllister', role: 'Project Manager',        employment_status: 'active',     site_id: siteB },
      { name: 'Lee Cartwright',   role: 'Scaffolder',             employment_status: 'contractor', site_id: siteA },
      { name: 'Rajan Patel',      role: 'Plant Operator',         employment_status: 'contractor', site_id: siteB },
    ]

    const { data: people, error: peopleError } = await supabase
      .from('people')
      .insert(peopleDefs.map(p => ({
        ...p,
        organisation_id: orgId,
        is_demo: true,
        metadata: {},
      })))
      .select('id, name')

    if (peopleError) throw new Error(`people: ${peopleError.message}`)

    const pMap: Record<string, string> = {}
    people?.forEach(p => { pMap[p.name] = p.id })

    // ── 4. Vehicles ───────────────────────────────────────────────────────────
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .insert([
        { organisation_id: orgId, registration: 'YR73 APX', make: 'Ford',       model: 'Transit',    vehicle_type: 'van',   owner: 'Apex Construction Ltd', depot_site_id: siteC, is_demo: true },
        { organisation_id: orgId, registration: 'SN22 HFC', make: 'Volkswagen', model: 'Crafter',    vehicle_type: 'van',   owner: 'Apex Construction Ltd', depot_site_id: siteC, is_demo: true },
        { organisation_id: orgId, registration: 'PK21 MBD', make: 'Toyota',     model: 'Hilux',      vehicle_type: 'truck', owner: 'Apex Construction Ltd', depot_site_id: siteA, is_demo: true },
      ])
      .select('id, registration')

    if (vehiclesError) throw new Error(`vehicles: ${vehiclesError.message}`)
    const v1 = vehicles![0].id
    const v2 = vehicles![1].id
    const v3 = vehicles![2].id

    // ── 5. Assets ─────────────────────────────────────────────────────────────
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .insert([
        { organisation_id: orgId, asset_id: 'APEX-EXC-001', name: 'JCB 3CX Backhoe Excavator', type: 'plant',      location: 'Site A', site_id: siteA, is_demo: true, metadata: {} },
        { organisation_id: orgId, asset_id: 'APEX-TEL-001', name: 'Manitou MT 1840 Telehandler', type: 'plant',    location: 'Site B', site_id: siteB, is_demo: true, metadata: {} },
      ])
      .select('id, name')

    if (assetsError) throw new Error(`assets: ${assetsError.message}`)
    const a1 = assets![0].id
    const a2 = assets![1].id

    // ── 6. Suppliers ──────────────────────────────────────────────────────────
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .insert([
        { organisation_id: orgId, company_name: 'BrightSpark Electrical Ltd', contact_name: 'Gary Moore',  contact_email: 'gary@brightspark.co.uk', category: 'subcontractor', is_demo: true, metadata: {} },
        { organisation_id: orgId, company_name: 'Northern Scaffold Co.',       contact_name: 'Trish Holt',  contact_email: 'trish@northscaf.co.uk',  category: 'subcontractor', is_demo: true, metadata: {} },
        { organisation_id: orgId, company_name: 'Rapid Plant Hire',            contact_name: 'Alan Duffy',  contact_email: 'hire@rapidplant.co.uk',  category: 'equipment_hire', is_demo: true, metadata: {} },
      ])
      .select('id, company_name')

    if (suppliersError) throw new Error(`suppliers: ${suppliersError.message}`)
    const s1 = suppliers![0].id
    const s2 = suppliers![1].id
    const s3 = suppliers![2].id

    // ── 7. Documents ──────────────────────────────────────────────────────────
    // Spread across valid (months away), expiring soon (within 30d), and expired
    const docs: Array<{
      organisation_id: string
      entity_type: string
      entity_id: string
      document_type_id: string
      title: string
      issuer: string
      certificate_number: string
      issue_date: string
      expiry_date: string
      status: string
      review_status: string
      confidence_score: number
      is_demo: boolean
      metadata: object
    }> = []

    function addDoc(
      entityType: string,
      entityId: string,
      typeName: string,
      issuer: string,
      certNum: string,
      issueDaysAgo: number,
      expiryDaysFromNow: number,
    ) {
      const dtId = dtMap[typeName]
      if (!dtId) return
      const expiry = daysFromNow(expiryDaysFromNow)
      const issue = daysAgo(issueDaysAgo)
      let status: string
      if (expiryDaysFromNow < 0) {
        status = 'expired'
      } else if (expiryDaysFromNow <= 30) {
        status = 'expiring_soon'
      } else {
        status = 'valid'
      }
      docs.push({
        organisation_id: orgId,
        entity_type: entityType,
        entity_id: entityId,
        document_type_id: dtId,
        title: typeName,
        issuer,
        certificate_number: certNum,
        issue_date: issue,
        expiry_date: expiry,
        status,
        review_status: 'approved',
        confidence_score: 0.95,
        is_demo: true,
        metadata: {},
      })
    }

    // Jack Hewitt — Site Manager
    addDoc('person', pMap['Jack Hewitt'], 'CSCS Card', 'CITB', 'CSCS-JH-7743', 365, 730)       // valid
    addDoc('person', pMap['Jack Hewitt'], 'First Aid at Work', 'St John Ambulance', 'FA-JH-2024', 400, 3 * 365)  // valid
    addDoc('person', pMap['Jack Hewitt'], 'Asbestos Awareness', 'CITB', 'AA-JH-2023', 600, 18)  // expiring soon

    // Diane Walsh — H&S Officer
    addDoc('person', pMap['Diane Walsh'], 'CSCS Card', 'CITB', 'CSCS-DW-8812', 180, 900)        // valid
    addDoc('person', pMap['Diane Walsh'], 'Fire Safety', 'FPA', 'FS-DW-2024', 270, 90)           // valid
    addDoc('person', pMap['Diane Walsh'], 'First Aid at Work', 'British Red Cross', 'FA-DW-2023', 700, -14) // expired

    // Craig Foster — Plant Operator
    addDoc('person', pMap['Craig Foster'], 'CSCS Card', 'CITB', 'CSCS-CF-5521', 90, 1080)        // valid
    addDoc('person', pMap['Craig Foster'], 'CPCS Licence', 'CPCS', 'CPCS-CF-A57-220', 300, 25)   // expiring soon
    addDoc('person', pMap['Craig Foster'], 'IPAF Certificate', 'IPAF Ltd', 'IPAF-CF-445312', 700, -60) // expired

    // Pete Ashworth — Scaffolder
    addDoc('person', pMap['Pete Ashworth'], 'CSCS Card', 'CITB', 'CSCS-PA-3302', 200, 60)        // valid
    addDoc('person', pMap['Pete Ashworth'], 'PASMA Certificate', 'PASMA', 'PASMA-PA-2024', 150, 14) // expiring soon
    addDoc('person', pMap['Pete Ashworth'], 'Working at Height', 'IPAF Ltd', 'WAH-PA-2023', 500, -90) // expired

    // Anita Sharma — Electrician
    addDoc('person', pMap['Anita Sharma'], 'CSCS Card', 'CITB', 'CSCS-AS-9944', 500, 600)        // valid
    addDoc('person', pMap['Anita Sharma'], 'First Aid at Work', 'St John Ambulance', 'FA-AS-2024', 300, 540) // valid
    addDoc('person', pMap['Anita Sharma'], 'Manual Handling', 'Manual Handling Solutions', 'MH-AS-2024', 120, 7) // expiring soon

    // Marcus Bell — Labourer
    addDoc('person', pMap['Marcus Bell'], 'CSCS Card', 'CITB', 'CSCS-MB-1127', 60, 1460)         // valid
    addDoc('person', pMap['Marcus Bell'], 'Asbestos Awareness', 'CITB', 'AA-MB-2025', 30, 330)   // valid

    // Sharon Doyle — First Aider
    addDoc('person', pMap['Sharon Doyle'], 'CSCS Card', 'CITB', 'CSCS-SD-6631', 400, 200)        // valid
    addDoc('person', pMap['Sharon Doyle'], 'First Aid at Work', 'British Red Cross', 'FA-SD-2024', 350, 3 * 365) // valid
    addDoc('person', pMap['Sharon Doyle'], 'Fire Safety', 'FPA', 'FS-SD-2023', 800, -30)         // expired

    // Tom Garside — Labourer
    addDoc('person', pMap['Tom Garside'], 'CSCS Card', 'CITB', 'CSCS-TG-4410', 100, 1560)        // valid
    addDoc('person', pMap['Tom Garside'], 'Manual Handling', 'Manual Handling Solutions', 'MH-TG-2024', 90, 270) // valid

    // Vijay Nair — Carpenter
    addDoc('person', pMap['Vijay Nair'], 'CSCS Card', 'CITB', 'CSCS-VN-2235', 800, -7)           // expired
    addDoc('person', pMap['Vijay Nair'], 'Working at Height', 'IPAF Ltd', 'WAH-VN-2024', 200, 180) // valid

    // Fiona McAllister — PM
    addDoc('person', pMap['Fiona McAllister'], 'CSCS Card', 'CITB', 'CSCS-FM-5567', 150, 2 * 365) // valid
    addDoc('person', pMap['Fiona McAllister'], 'First Aid at Work', 'St John Ambulance', 'FA-FM-2024', 300, 2 * 365) // valid

    // Lee Cartwright — Scaffolder (contractor)
    addDoc('person', pMap['Lee Cartwright'], 'CSCS Card', 'CITB', 'CSCS-LC-8823', 180, 400)      // valid
    addDoc('person', pMap['Lee Cartwright'], 'PASMA Certificate', 'PASMA', 'PASMA-LC-2024', 700, -45) // expired

    // Rajan Patel — Plant Operator (contractor)
    addDoc('person', pMap['Rajan Patel'], 'CPCS Licence', 'CPCS', 'CPCS-RP-B68-441', 360, 2 * 365) // valid
    addDoc('person', pMap['Rajan Patel'], 'IPAF Certificate', 'IPAF Ltd', 'IPAF-RP-778221', 180, 20) // expiring soon

    // Vehicles
    addDoc('vehicle', v1, 'MOT Certificate',   'DVSA', 'MOT-YR73APX-25', 200, 165)               // valid
    addDoc('vehicle', v1, 'Vehicle Insurance', 'Aviva Commercial', 'AVI-YR73-2025', 45, 320)      // valid
    addDoc('vehicle', v2, 'MOT Certificate',   'DVSA', 'MOT-SN22HFC-25', 300, 28)                 // expiring soon
    addDoc('vehicle', v2, 'Vehicle Insurance', 'AXA Business', 'AXA-SN22-2025', 10, 355)          // valid
    addDoc('vehicle', v3, 'MOT Certificate',   'DVSA', 'MOT-PK21MBD-24', 400, -10)               // expired
    addDoc('vehicle', v3, 'Vehicle Insurance', 'Zurich Commercial', 'ZUR-PK21-2025', 60, 305)     // valid

    // Assets
    addDoc('asset', a1, 'LOLER Inspection', 'SAFEcontractor', 'LOLER-EXC001-25', 180, 45)        // valid
    addDoc('asset', a2, 'LOLER Inspection', 'SAFEcontractor', 'LOLER-TEL001-24', 550, 8)          // expiring soon

    // Suppliers — public liability + employers liability
    addDoc('supplier', s1, 'Public Liability',    'Hiscox', 'HL-BSEL-2025', 30, 335)
    addDoc('supplier', s1, 'Employers Liability', 'Hiscox', 'EL-BSEL-2025', 30, 335)
    addDoc('supplier', s2, 'Public Liability',    'AXA',    'HL-NSC-2025', 90, 275)
    addDoc('supplier', s2, 'Employers Liability', 'AXA',    'EL-NSC-2025', 90, 20)   // expiring soon
    addDoc('supplier', s3, 'Public Liability',    'Markel', 'HL-RPH-2024', 400, -20) // expired

    const { error: docsError } = await supabase.from('documents').insert(docs)
    if (docsError) throw new Error(`documents: ${docsError.message}`)

    // ── 8. Mark org as demo-seeded ────────────────────────────────────────────
    await supabase
      .from('organisations')
      .update({ demo_seeded: true, demo_seeded_at: new Date().toISOString() })
      .eq('id', orgId)

    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.error({ err: msg }, '[demoSeed] error:')
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// Clear demo data
// ---------------------------------------------------------------------------

export async function clearDemoData(orgId: string): Promise<SeedResult> {
  const supabase = createServiceClient()
  try {
    // Delete in FK-safe order: documents first, then entities
    await supabase.from('documents').delete().eq('organisation_id', orgId).eq('is_demo', true)
    await supabase.from('people').delete().eq('organisation_id', orgId).eq('is_demo', true)
    await supabase.from('vehicles').delete().eq('organisation_id', orgId).eq('is_demo', true)
    await supabase.from('assets').delete().eq('organisation_id', orgId).eq('is_demo', true)
    await supabase.from('suppliers').delete().eq('organisation_id', orgId).eq('is_demo', true)
    await supabase.from('sites').delete().eq('organisation_id', orgId).eq('is_demo', true)
    await supabase.from('document_types').delete().eq('organisation_id', orgId).eq('is_demo', true)

    // Reset the demo_seeded flag so the org can be re-seeded if desired
    await supabase
      .from('organisations')
      .update({ demo_seeded: false, demo_seeded_at: null })
      .eq('id', orgId)

    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.error({ err: msg }, '[clearDemoData] error:')
    return { success: false, error: msg }
  }
}
