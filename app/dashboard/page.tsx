import AppLayout from '@/components/layout/AppLayout';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let stats = { expired: 0, expiringSoon: 0, valid: 0, pendingReview: 0 };
  let recentAlerts: Array<{
    id: string;
    title: string;
    entityName: string;
    entityType: string;
    entityId: string;
    documentType: string;
    expiryDate: string;
    daysUntilExpiry: number;
    severity: 'critical' | 'warning';
  }> = [];

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('organisation_id')
      .eq('id', user.id)
      .single();

    if (userData) {
      const orgId = userData.organisation_id;
      const now = new Date();
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const nowStr = now.toISOString().split('T')[0];
      const thirtyDaysStr = thirtyDaysFromNow.toISOString().split('T')[0];

      // Fetch all documents with entity info for alerts
      const { data: allDocs } = await supabase
        .from('documents')
        .select(`
          id,
          title,
          entity_type,
          entity_id,
          expiry_date,
          status,
          review_status,
          document_types (name)
        `)
        .eq('organisation_id', orgId)
        .order('expiry_date', { ascending: true });

      if (allDocs) {
        allDocs.forEach(doc => {
          if (doc.status === 'pending_review' || doc.review_status === 'pending') {
            stats.pendingReview++;
          } else if (!doc.expiry_date) {
            stats.valid++;
          } else if (doc.expiry_date < nowStr) {
            stats.expired++;
          } else if (doc.expiry_date <= thirtyDaysStr) {
            stats.expiringSoon++;
          } else {
            stats.valid++;
          }
        });

        // Build alerts — expired + expiring within 30 days, sorted by urgency
        const alertDocs = allDocs
          .filter(d => d.expiry_date && (d.expiry_date < nowStr || d.expiry_date <= thirtyDaysStr))
          .filter(d => d.status !== 'pending_review')
          .slice(0, 8);

        // Fetch entity names in bulk
        const peopleIds = alertDocs.filter(d => d.entity_type === 'person').map(d => d.entity_id);
        const vehicleIds = alertDocs.filter(d => d.entity_type === 'vehicle').map(d => d.entity_id);
        const assetIds = alertDocs.filter(d => d.entity_type === 'asset').map(d => d.entity_id);
        const supplierIds = alertDocs.filter(d => d.entity_type === 'supplier').map(d => d.entity_id);

        const entityNameMap: Record<string, string> = {};

        if (peopleIds.length > 0) {
          const { data: p } = await supabase.from('people').select('id, name').in('id', peopleIds);
          p?.forEach(x => { entityNameMap[x.id] = x.name; });
        }
        if (vehicleIds.length > 0) {
          const { data: v } = await supabase.from('vehicles').select('id, registration').in('id', vehicleIds);
          v?.forEach(x => { entityNameMap[x.id] = x.registration; });
        }
        if (assetIds.length > 0) {
          const { data: a } = await supabase.from('assets').select('id, name').in('id', assetIds);
          a?.forEach(x => { entityNameMap[x.id] = x.name; });
        }
        if (supplierIds.length > 0) {
          const { data: s } = await supabase.from('suppliers').select('id, company_name').in('id', supplierIds);
          s?.forEach(x => { entityNameMap[x.id] = x.company_name; });
        }

        recentAlerts = alertDocs.map(doc => {
          const expiry = new Date(doc.expiry_date!);
          const daysUntil = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const docTypeName = (doc.document_types as unknown as { name: string } | null)?.name ?? doc.title;
          return {
            id: doc.id,
            title: `${docTypeName} ${daysUntil < 0 ? 'Expired' : 'Expiring Soon'}`,
            entityName: entityNameMap[doc.entity_id] ?? 'Unknown',
            entityType: doc.entity_type,
            entityId: doc.entity_id,
            documentType: docTypeName,
            expiryDate: doc.expiry_date!,
            daysUntilExpiry: daysUntil,
            severity: (daysUntil < 0 || daysUntil <= 7) ? 'critical' as const : 'warning' as const,
          };
        });
      }
    }
  }

  return (
    <AppLayout>
      <DashboardClient stats={stats} recentAlerts={recentAlerts} />
    </AppLayout>
  );
}
