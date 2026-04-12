import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single()

    if (userDataError || !userData) {
      return NextResponse.json({ error: 'User organisation not found' }, { status: 404 })
    }

    const orgId = userData.organisation_id
    const now = new Date()
    const nowStr = now.toISOString().split('T')[0]
    const thirtyDaysStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Fetch all documents
    const { data: allDocs, error: docsError } = await supabase
      .from('documents')
      .select('id, title, entity_type, entity_id, expiry_date, status, review_status')
      .eq('organisation_id', orgId)
      .order('expiry_date', { ascending: true })

    if (docsError) {
      console.error('[dashboard/data] docs error:', docsError.message)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Calculate stats
    const stats = { expired: 0, expiringSoon: 0, valid: 0, pendingReview: 0 }
    allDocs?.forEach(doc => {
      if (doc.review_status === 'pending') {
        stats.pendingReview++
      } else if (!doc.expiry_date) {
        stats.valid++
      } else if (doc.expiry_date < nowStr) {
        stats.expired++
      } else if (doc.expiry_date <= thirtyDaysStr) {
        stats.expiringSoon++
      } else {
        stats.valid++
      }
    })

    // Build alert docs
    const alertDocs = (allDocs ?? [])
      .filter(d => d.expiry_date && (d.expiry_date < nowStr || d.expiry_date <= thirtyDaysStr))
      .slice(0, 8)

    // Fetch entity names
    const peopleIds   = [...new Set(alertDocs.filter(d => d.entity_type === 'person').map(d => d.entity_id))]
    const vehicleIds  = [...new Set(alertDocs.filter(d => d.entity_type === 'vehicle').map(d => d.entity_id))]
    const assetIds    = [...new Set(alertDocs.filter(d => d.entity_type === 'asset').map(d => d.entity_id))]
    const supplierIds = [...new Set(alertDocs.filter(d => d.entity_type === 'supplier').map(d => d.entity_id))]

    const entityNameMap: Record<string, string> = {}
    if (peopleIds.length > 0) {
      const { data: p } = await supabase.from('people').select('id, name').in('id', peopleIds)
      p?.forEach(x => { entityNameMap[x.id] = x.name })
    }
    if (vehicleIds.length > 0) {
      const { data: v } = await supabase.from('vehicles').select('id, registration').in('id', vehicleIds)
      v?.forEach(x => { entityNameMap[x.id] = x.registration })
    }
    if (assetIds.length > 0) {
      const { data: a } = await supabase.from('assets').select('id, name').in('id', assetIds)
      a?.forEach(x => { entityNameMap[x.id] = x.name })
    }
    if (supplierIds.length > 0) {
      const { data: s } = await supabase.from('suppliers').select('id, company_name').in('id', supplierIds)
      s?.forEach(x => { entityNameMap[x.id] = x.company_name })
    }

    // Build expiry calendar — next 30 days with alert markers
    const calendarDays: Record<string, 'critical' | 'warning'> = {}
    alertDocs.forEach(doc => {
      if (!doc.expiry_date) return
      const existing = calendarDays[doc.expiry_date]
      const expiry = new Date(doc.expiry_date)
      const daysUntil = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const severity = (daysUntil < 0 || daysUntil <= 7) ? 'critical' : 'warning'
      if (!existing || severity === 'critical') {
        calendarDays[doc.expiry_date] = severity
      }
    })

    const alerts = alertDocs.map(doc => {
      const expiry = new Date(doc.expiry_date!)
      const daysUntil = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        id: doc.id,
        title: `${doc.title} ${daysUntil < 0 ? 'Expired' : 'Expiring Soon'}`,
        entityName: entityNameMap[doc.entity_id] ?? 'Unknown',
        entityType: doc.entity_type,
        entityId: doc.entity_id,
        documentType: doc.title,
        expiryDate: doc.expiry_date!,
        daysUntilExpiry: daysUntil,
        severity: (daysUntil < 0 || daysUntil <= 7) ? 'critical' as const : 'warning' as const,
      }
    })

    return NextResponse.json({ stats, alerts, calendarDays })
  } catch (error) {
    console.error('[dashboard/data] unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
