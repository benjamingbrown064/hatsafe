'use client';

import AppLayout from '@/components/layout/AppLayout';
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts';
import AISuggestions from '@/components/dashboard/AISuggestions';
import {
  ArrowUpRightIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// Centralised mock document data — same source as documents/page.tsx
const ALL_DOCUMENTS = [
  { status: 'valid',    daysUntilExpiry: 1095 },
  { status: 'expiring', daysUntilExpiry: 7 },
  { status: 'expired',  daysUntilExpiry: -37 },
  { status: 'expiring', daysUntilExpiry: 12 },
  { status: 'valid',    daysUntilExpiry: 298 },
  { status: 'valid',    daysUntilExpiry: 365 },
  { status: 'valid',    daysUntilExpiry: 285 },
  { status: 'expiring', daysUntilExpiry: 14 },
  { status: 'valid',    daysUntilExpiry: 880 },
  { status: 'valid',    daysUntilExpiry: 372 },
  { status: 'valid',    daysUntilExpiry: 295 },
  { status: 'expiring', daysUntilExpiry: 0 },
  { status: 'valid',    daysUntilExpiry: 183 },
  { status: 'expired',  daysUntilExpiry: -45 },
  { status: 'valid',    daysUntilExpiry: 150 },
  { status: 'valid',    daysUntilExpiry: 305 },
  { status: 'expired',  daysUntilExpiry: -330 },
  { status: 'valid',    daysUntilExpiry: 105 },
  { status: 'valid',    daysUntilExpiry: 335 },
  { status: 'valid',    daysUntilExpiry: 155 },
  { status: 'valid',    daysUntilExpiry: 213 },
  { status: 'expiring', daysUntilExpiry: 20 },
  { status: 'expiring', daysUntilExpiry: 3 },
  { status: 'valid',    daysUntilExpiry: 400 },
  { status: 'valid',    daysUntilExpiry: 120 },
];

const expired     = ALL_DOCUMENTS.filter(d => d.status === 'expired').length;
const expiringSoon= ALL_DOCUMENTS.filter(d => d.status === 'expiring').length;
const valid       = ALL_DOCUMENTS.filter(d => d.status === 'valid').length;
const pendingReview = 4; // AI review queue placeholder

export default function DashboardPage() {
  const stats4 = [
    { label: 'EXPIRED',        value: String(expired),      urgent: true },
    { label: 'EXPIRING SOON',  value: String(expiringSoon), urgent: false },
    { label: 'COMPLIANT',      value: String(valid),        urgent: false },
    { label: 'PENDING REVIEW', value: String(pendingReview),urgent: false },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats4.map((s, i) => (
            <div key={s.label} className="card"
              style={i === 0 && s.value !== '0' && s.value !== '—' ? {
                backgroundColor: '#000000',
                color: '#FFFFFF',
                border: 'none',
              } : {}}>
              <div className="stat-label" style={i === 0 && s.value !== '0' && s.value !== '—' ? { color: 'rgba(255,255,255,0.5)' } : {}}>
                {s.label}
              </div>
              <div className="stat-value mt-2" style={i === 0 && s.value !== '0' && s.value !== '—' ? { color: '#FFFFFF' } : {}}>
                {s.value}
              </div>
              {i === 0 && s.value !== '0' && s.value !== '—' && (
                <div className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>
                  REQUIRES IMMEDIATE ATTENTION
                </div>
              )}
              {i === 1 && (
                <div className="mt-2 label-sm">NEXT 30 DAYS</div>
              )}
              {i === 3 && (
                <div className="mt-2 label-sm">AI REVIEW QUEUE</div>
              )}
            </div>
          ))}
        </div>

        {/* Main content — two column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Expiry alerts — left 2 cols */}
          <div className="lg:col-span-2">
            <div className="card-flush">
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div>
                  <div className="label-sm mb-1">UPCOMING ACTIONS</div>
                  <h2>Expiring Documents</h2>
                </div>
                <a href="/documents" className="flex items-center gap-1 text-xs font-medium" style={{ color: '#474747' }}>
                  VIEW ALL <ArrowUpRightIcon className="w-3 h-3" />
                </a>
              </div>
              <div className="p-6">
                <ExpiryAlerts />
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            {/* AI suggestions */}
            <div className="card-flush">
              <div className="px-5 py-4" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div className="label-sm mb-1">AI ADVISOR</div>
                <h2 style={{ fontSize: '1rem' }}>Recommendations</h2>
              </div>
              <div className="p-5">
                <AISuggestions />
              </div>
            </div>

            {/* Quick actions */}
            <div className="card" style={{ padding: '20px' }}>
              <div className="label-sm mb-4">QUICK ACTIONS</div>
              <div className="space-y-2">
                {[
                  { icon: UserPlusIcon, label: 'Add Person', sub: 'Register new worker' },
                  { icon: DocumentTextIcon, label: 'Upload Document', sub: 'Cert, licence, MOT…' },
                  { icon: ArrowDownTrayIcon, label: 'Export Report', sub: 'Compliance summary' },
                ].map((a) => (
                  <button key={a.label}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                    style={{ borderRadius: '4px' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                      <a.icon className="w-4 h-4" style={{ color: '#1A1C1C' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>{a.label}</div>
                      <div className="text-xs" style={{ color: '#A3A3A3' }}>{a.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 30-day calendar strip */}
        <div className="card-flush">
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <div>
              <div className="label-sm mb-1">NEXT 30 DAYS</div>
              <h2>Expiry Calendar</h2>
            </div>
            <a href="/calendar" className="flex items-center gap-1 text-xs font-medium" style={{ color: '#474747' }}>
              FULL CALENDAR <ArrowUpRightIcon className="w-3 h-3" />
            </a>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-10 gap-2">
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const hasExpiry = [3, 7, 12, 18, 24].includes(i);
                const isCritical = [7].includes(i);
                return (
                  <a key={i} href={`/calendar?day=${day}`}
                    className="aspect-square flex flex-col items-center justify-center transition-all"
                    style={{
                      borderRadius: '4px',
                      backgroundColor: isCritical ? '#000000' : hasExpiry ? '#FFF8E1' : '#F9F9F9',
                      border: hasExpiry && !isCritical ? '1px solid #FFC107' : '1px solid #F3F3F3',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => { if (!isCritical) e.currentTarget.style.opacity = '0.75'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                    <span className="text-xs font-medium"
                      style={{ color: isCritical ? '#FFFFFF' : '#1A1C1C' }}>
                      {day}
                    </span>
                    {hasExpiry && (
                      <span className="text-[9px] font-semibold" style={{ color: isCritical ? 'rgba(255,255,255,0.7)' : '#92400E' }}>
                        {isCritical ? '!' : '↑'}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#000000' }} />
                <span className="label-sm">CRITICAL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FFC107' }} />
                <span className="label-sm">EXPIRING</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F3F3F3', border: '1px solid #C6C6C6' }} />
                <span className="label-sm">CLEAR</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
