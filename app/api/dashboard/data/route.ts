import { NextResponse } from 'next/server'
import logger from '@/lib/logger';
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Use authenticated user's client — RLS enforced via migration 004 SECURITY DEFINER functions
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit
    const rl = await checkRateLimit(user.id, 'general')
    if (!rl.success) return rl.response!

    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single()

    if (!userData?.organisation_id) {
      return NextResponse.json({ error: 'User organisation not found' }, { status: 404 })
    }

    const orgId = userData.organisation_id
    const now = new Date()
    const nowStr = now.toISOString().split('T')[0]
    const thirtyDaysStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { data: allDocs, error: docsError } = await supabase
      .from('documents')
      .select('id, title, entity_type, entity_id, expiry_date, status, review_status')
      .eq('organisation_id', orgId)
      .order('expiry_date', { ascending: true })

    if (docsError) {
      logger.error({ err: docsError }, 'Failed to fetch documents for dashboard')
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    const stats = { expired: 0, expiringSoon: 0, valid: 0, pendingReview: 0 }
    allDocs?.forEach(doc => {
      if (doc.review_status === 'pending')    { stats.pendingReview++; return }
      if (!doc.expiry_date)                   { stats.valid++;          return }
      if (doc.expiry_date < nowStr)           { stats.expired++;        return }
      if (doc.expiry_date <= thirtyDaysStr)   { stats.expiringSoon++;   return }
      stats.valid++
    })

    const allAlertDocs = (allDocs ?? [])
      .filter(d => d.expiry_date && (d.expiry_date < nowStr || d.expiry_date <= thirtyDaysStr))

    const expiredDocs  = allAlertDocs.filter(d => d.expiry_date! < nowStr).sort((a, b) => b.expiry_date!.localeCompare(a.expiry_date!))
    const expiringDocs = allAlertDocs.filter(d => d.expiry_date! >= nowStr).sort((a, b) => a.expiry_date!.localeCompare(b.expiry_date!))
    const alertDocs = [...expiredDocs, ...expiringDocs].slice(0, 8)

    const calendarDays: Record<string, 'critical' | 'warning'> = {}
    allAlertDocs
      .filter(d => d.expiry_date && d.expiry_date >= nowStr)
      .forEach(doc => {
        if (!doc.expiry_date) return
        const daysUntil = Math.round((new Date(doc.expiry_date).getTime() - now.getTime()) / 86400000)
        const sev: 'critical' | 'warning' = daysUntil <= 7 ? 'critical' : 'warning'
        if (!calendarDays[doc.expiry_date] || sev === 'critical') calendarDays[doc.expiry_date] = sev
      })

    const peopleIds   = [...new Set(alertDocs.filter(d => d.entity_type === 'person').map(d => d.entity_id))]
    const vehicleIds  = [...new Set(alertDocs.filter(d => d.entity_type === 'vehicle').map(d => d.entity_id))]
    const assetIds    = [...new Set(alertDocs.filter(d => d.entity_type === 'asset').map(d => d.entity_id))]
    const supplierIds = [...new Set(alertDocs.filter(d => d.entity_type === 'supplier').map(d => d.entity_id))]

    const nameMap: Record<string, string> = {}
    if (peopleIds.length > 0) {
      const { data: p } = await supabase.from('people').select('id, name').in('id', peopleIds)
      p?.forEach(x => { nameMap[x.id] = x.name })
    }
    if (vehicleIds.length > 0) {
      const { data: v } = await supabase.from('vehicles').select('id, registration').in('id', vehicleIds)
      v?.forEach(x => { nameMap[x.id] = x.registration })
    }
    if (assetIds.length > 0) {
      const { data: a } = await supabase.from('assets').select('id, name').in('id', assetIds)
      a?.forEach(x => { nameMap[x.id] = x.name })
    }
    if (supplierIds.length > 0) {
      const { data: s } = await supabase.from('suppliers').select('id, company_name').in('id', supplierIds)
      s?.forEach(x => { nameMap[x.id] = x.company_name })
    }

    const alerts = alertDocs.map(doc => {
      const daysUntil = Math.round((new Date(doc.expiry_date!).getTime() - now.getTime()) / 86400000)
      return {
        id: doc.id,
        title: `${doc.title} ${daysUntil < 0 ? 'Expired' : 'Expiring Soon'}`,
        entityName: nameMap[doc.entity_id] ?? 'Unknown',
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
    logger.error({ err: error }, '[dashboard/data] error')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
