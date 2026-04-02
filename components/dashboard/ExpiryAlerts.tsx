'use client';

import Link from 'next/link';
import {
  UserIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/outline';

type Severity = 'critical' | 'warning' | 'info';
type EntityType = 'person' | 'vehicle' | 'asset';

interface Alert {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  entityName: string;
  entityType: EntityType;
  documentType: string;
  expiryDate: string;
  daysUntilExpiry: number;
  actionUrl: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'CSCS Card Expired',
    description: 'Cannot work on site without valid certification',
    entityName: 'John Smith',
    entityType: 'person',
    documentType: 'CSCS Card',
    expiryDate: '2026-02-01',
    daysUntilExpiry: -7,
    actionUrl: '/people/1',
  },
  {
    id: '2',
    severity: 'critical',
    title: 'MOT Due in 3 Days',
    description: 'Vehicle cannot be driven legally after expiry',
    entityName: 'AB12 CDE',
    entityType: 'vehicle',
    documentType: 'MOT Certificate',
    expiryDate: '2026-04-05',
    daysUntilExpiry: 3,
    actionUrl: '/vehicles/1',
  },
  {
    id: '3',
    severity: 'warning',
    title: 'Insurance Renewal in 14 Days',
    description: 'Schedule renewal to avoid lapse in cover',
    entityName: 'FG34 HIJ',
    entityType: 'vehicle',
    documentType: 'Vehicle Insurance',
    expiryDate: '2026-04-16',
    daysUntilExpiry: 14,
    actionUrl: '/vehicles/2',
  },
  {
    id: '4',
    severity: 'warning',
    title: 'LOLER Inspection Due',
    description: 'Statutory inspection required before continued use',
    entityName: 'SCAF-001',
    entityType: 'asset',
    documentType: 'LOLER Inspection',
    expiryDate: '2026-04-14',
    daysUntilExpiry: 12,
    actionUrl: '/assets/1',
  },
];

function EntityIcon({ type }: { type: EntityType }) {
  const cls = 'w-4 h-4 flex-shrink-0';
  const s = { color: '#474747' };
  if (type === 'vehicle') return <TruckIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'asset')   return <WrenchScrewdriverIcon className={cls} style={s} strokeWidth={1.5} />;
  return <UserIcon className={cls} style={s} strokeWidth={1.5} />;
}

function daysLabel(days: number) {
  if (days < 0)  return `Overdue ${Math.abs(days)}d`;
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  return `${days}d remaining`;
}

export default function ExpiryAlerts() {
  const critical = alerts.filter(a => a.severity === 'critical');
  const warning  = alerts.filter(a => a.severity === 'warning');

  return (
    <div className="space-y-5">

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3">
        <div style={{ backgroundColor: '#000000', borderRadius: '4px', padding: '14px 16px' }}>
          <div className="label-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>CRITICAL</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>{critical.length}</div>
          <div className="mt-1 label-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>IMMEDIATE ACTION</div>
        </div>
        <div style={{ backgroundColor: '#FFF8E1', border: '1px solid #FFC107', borderRadius: '4px', padding: '14px 16px' }}>
          <div className="label-sm mb-1" style={{ color: '#92400E' }}>WARNING</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1C1C', lineHeight: 1 }}>{warning.length}</div>
          <div className="mt-1 label-sm" style={{ color: '#92400E' }}>ACTION NEEDED SOON</div>
        </div>
      </div>

      {/* Critical alerts */}
      {critical.length > 0 && (
        <div>
          <div className="label-sm mb-3">CRITICAL — ACTION REQUIRED</div>
          <div className="space-y-2">
            {critical.map((a) => (
              <Link key={a.id} href={a.actionUrl}
                className="flex items-start gap-4 p-4 transition-colors"
                style={{
                  backgroundColor: '#F9F9F9',
                  border: '1px solid rgba(198,198,198,0.4)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'flex',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F9F9F9')}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#000000', borderRadius: '4px' }}>
                  <DocumentTextIcon className="w-4 h-4" style={{ color: '#FFC107' }} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-sm" style={{ color: '#1A1C1C' }}>{a.title}</span>
                    <span className="badge badge-expired flex-shrink-0">{daysLabel(a.daysUntilExpiry)}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#474747' }}>{a.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <EntityIcon type={a.entityType} />
                    <span className="text-xs font-medium" style={{ color: '#474747' }}>{a.entityName}</span>
                    <span style={{ color: '#C6C6C6', fontSize: '10px' }}>·</span>
                    <span className="text-xs" style={{ color: '#A3A3A3' }}>{a.documentType}</span>
                  </div>
                </div>
                <ArrowUpRightIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#C6C6C6' }} strokeWidth={2} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Warning alerts */}
      {warning.length > 0 && (
        <div>
          <div className="label-sm mb-3">WARNINGS — PLAN SOON</div>
          <div className="space-y-2">
            {warning.map((a) => (
              <Link key={a.id} href={a.actionUrl}
                className="flex items-start gap-4 p-4 transition-colors"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(198,198,198,0.4)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'flex',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F9F9F9')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                  <DocumentTextIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{a.title}</span>
                    <span className="badge badge-expiring flex-shrink-0">{daysLabel(a.daysUntilExpiry)}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#474747' }}>{a.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <EntityIcon type={a.entityType} />
                    <span className="text-xs font-medium" style={{ color: '#474747' }}>{a.entityName}</span>
                    <span style={{ color: '#C6C6C6', fontSize: '10px' }}>·</span>
                    <span className="text-xs" style={{ color: '#A3A3A3' }}>{a.documentType}</span>
                  </div>
                </div>
                <ArrowUpRightIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#C6C6C6' }} strokeWidth={2} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="text-center py-10">
          <DocumentTextIcon className="w-8 h-8 mx-auto mb-3" style={{ color: '#C6C6C6' }} strokeWidth={1} />
          <div className="label-sm mb-1">ALL CLEAR</div>
          <p style={{ fontSize: '13px', color: '#A3A3A3' }}>No compliance alerts at this time</p>
        </div>
      )}
    </div>
  );
}
