'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowUpRightIcon,
  UserPlusIcon,
  DocumentTextIcon,
  TruckIcon,
  CheckCircleIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import AISuggestions from './AISuggestions';

interface Alert {
  id: string;
  title: string;
  entityName: string;
  entityType: string;
  entityId: string;
  documentType: string;
  expiryDate: string;
  daysUntilExpiry: number;
  severity: 'critical' | 'warning';
}

interface Stats {
  expired: number;
  expiringSoon: number;
  valid: number;
  pendingReview: number;
}

function daysLabel(days: number) {
  if (days < 0)   return `Overdue ${Math.abs(days)}d`;
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow';
  return `${days}d remaining`;
}

function EntityIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4 flex-shrink-0';
  const s = { color: '#474747' };
  if (type === 'vehicle')  return <TruckIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'asset')    return <WrenchScrewdriverIcon className={cls} style={s} strokeWidth={1.5} />;
  return <UserIcon className={cls} style={s} strokeWidth={1.5} />;
}

function entityUrl(type: string, id: string) {
  if (type === 'vehicle')  return `/vehicles/${id}`;
  if (type === 'asset')    return `/assets/${id}`;
  if (type === 'supplier') return `/suppliers/${id}`;
  return `/people/${id}`;
}

export default function DashboardClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploaded,     setUploaded]     = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [stats,        setStats]        = useState<Stats>({ expired: 0, expiringSoon: 0, valid: 0, pendingReview: 0 });
  const [alerts,       setAlerts]       = useState<Alert[]>([]);
  const [calendarDays, setCalendarDays] = useState<Record<string, 'critical' | 'warning'>>({});

  useEffect(() => {
    fetch('/api/dashboard/data')
      .then(r => r.json())
      .then(d => {
        if (d.stats) {
          setStats(d.stats);
          setAlerts(d.alerts ?? []);
          setCalendarDays(d.calendarDays ?? {});
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('[DashboardClient] fetch error:', err);
        setLoading(false);
      });
  }, []);

  function handleUploadClick() { fileInputRef.current?.click(); }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
    e.target.value = '';
  }

  const stats4 = [
    { label: 'EXPIRED',        value: loading ? '—' : String(stats.expired),      urgent: !loading && stats.expired > 0 },
    { label: 'EXPIRING SOON',  value: loading ? '—' : String(stats.expiringSoon), urgent: false },
    { label: 'COMPLIANT',      value: loading ? '—' : String(stats.valid),        urgent: false },
    { label: 'PENDING REVIEW', value: loading ? '—' : String(stats.pendingReview),urgent: false },
  ];

  const critical = alerts.filter(a => a.severity === 'critical');
  const warnings = alerts.filter(a => a.severity === 'warning');

  return (
    <div className="space-y-8">

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats4.map((s, i) => (
          <div key={s.label} className="card"
            style={i === 0 && s.urgent ? { backgroundColor: '#000000', color: '#FFFFFF', border: 'none' } : {}}>
            <div className="stat-label" style={i === 0 && s.urgent ? { color: 'rgba(255,255,255,0.5)' } : {}}>
              {s.label}
            </div>
            <div className="stat-value mt-2" style={i === 0 && s.urgent ? { color: '#FFFFFF' } : {}}>
              {s.value}
            </div>
            {i === 0 && s.urgent && (
              <div className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>
                REQUIRES IMMEDIATE ATTENTION
              </div>
            )}
            {i === 1 && <div className="mt-2 label-sm">NEXT 30 DAYS</div>}
            {i === 3 && <div className="mt-2 label-sm">AI REVIEW QUEUE</div>}
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Expiry alerts */}
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
            <div className="p-6 space-y-5">
              {loading && (
                <div className="text-center py-10"><div className="label-sm">LOADING…</div></div>
              )}
              {!loading && alerts.length === 0 && (
                <div className="text-center py-10">
                  <DocumentTextIcon className="w-8 h-8 mx-auto mb-3" style={{ color: '#C6C6C6' }} strokeWidth={1} />
                  <div className="label-sm mb-1">ALL CLEAR</div>
                  <p style={{ fontSize: '13px', color: '#A3A3A3' }}>No compliance alerts at this time</p>
                </div>
              )}
              {!loading && alerts.length > 0 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div style={{ backgroundColor: '#000000', borderRadius: '4px', padding: '14px 16px' }}>
                      <div className="label-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>CRITICAL</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>{critical.length}</div>
                      <div className="mt-1 label-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>IMMEDIATE ACTION</div>
                    </div>
                    <div style={{ backgroundColor: '#FFF8E1', border: '1px solid #FFC107', borderRadius: '4px', padding: '14px 16px' }}>
                      <div className="label-sm mb-1" style={{ color: '#92400E' }}>WARNING</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1C1C', lineHeight: 1 }}>{warnings.length}</div>
                      <div className="mt-1 label-sm" style={{ color: '#92400E' }}>ACTION NEEDED SOON</div>
                    </div>
                  </div>
                  {critical.length > 0 && (
                    <div>
                      <div className="label-sm mb-3">CRITICAL — ACTION REQUIRED</div>
                      <div className="space-y-2">
                        {critical.map(a => (
                          <Link key={a.id} href={entityUrl(a.entityType, a.entityId)}
                            className="flex items-start gap-4 p-4 transition-colors"
                            style={{ backgroundColor: '#F9F9F9', border: '1px solid rgba(198,198,198,0.4)', borderRadius: '4px', textDecoration: 'none', display: 'flex' }}
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
                  {warnings.length > 0 && (
                    <div>
                      <div className="label-sm mb-3">WARNINGS — PLAN SOON</div>
                      <div className="space-y-2">
                        {warnings.map(a => (
                          <Link key={a.id} href={entityUrl(a.entityType, a.entityId)}
                            className="flex items-start gap-4 p-4 transition-colors"
                            style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(198,198,198,0.4)', borderRadius: '4px', textDecoration: 'none', display: 'flex' }}
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <div className="card-flush">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #F3F3F3' }}>
              <div className="label-sm mb-1">AI ADVISOR</div>
              <h2 style={{ fontSize: '1rem' }}>Recommendations</h2>
            </div>
            <div className="p-5"><AISuggestions /></div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div className="label-sm mb-4">QUICK ACTIONS</div>
            <div className="space-y-2">
              <Link href="/people" className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors"
                style={{ borderRadius: '4px', textDecoration: 'none', display: 'flex' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                  <UserPlusIcon className="w-4 h-4" style={{ color: '#1A1C1C' }} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>Add Person</div>
                  <div className="text-xs" style={{ color: '#A3A3A3' }}>Register new worker</div>
                </div>
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                style={{ borderRadius: '4px' }} onClick={handleUploadClick}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: uploaded ? '#000000' : '#F3F3F3', borderRadius: '4px' }}>
                  {uploaded
                    ? <CheckCircleIcon className="w-4 h-4" style={{ color: '#FFC107' }} strokeWidth={2} />
                    : <DocumentTextIcon className="w-4 h-4" style={{ color: '#1A1C1C' }} strokeWidth={1.5} />}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>{uploaded ? 'Document Uploaded ✓' : 'Upload Document'}</div>
                  <div className="text-xs" style={{ color: '#A3A3A3' }}>Cert, licence, MOT…</div>
                </div>
              </button>
              <Link href="/vehicles" className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors"
                style={{ borderRadius: '4px', textDecoration: 'none', display: 'flex' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                  <TruckIcon className="w-4 h-4" style={{ color: '#1A1C1C' }} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>Add Vehicle</div>
                  <div className="text-xs" style={{ color: '#A3A3A3' }}>Register fleet vehicle</div>
                </div>
              </Link>
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              style={{ display: 'none' }} onChange={handleFileChange} />
          </div>
        </div>
      </div>

      {/* Calendar */}
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
              const dayDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              const severity = calendarDays[dayDate];
              const isCritical = severity === 'critical';
              const hasAlert   = !!severity;
              return (
                <a key={i} href={`/calendar?day=${i + 1}`}
                  className="aspect-square flex flex-col items-center justify-center transition-all"
                  style={{
                    borderRadius: '4px',
                    backgroundColor: isCritical ? '#000000' : hasAlert ? '#FFF8E1' : '#F9F9F9',
                    border: hasAlert && !isCritical ? '1px solid #FFC107' : '1px solid #F3F3F3',
                    cursor: 'pointer', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { if (!isCritical) e.currentTarget.style.opacity = '0.75'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                  <span className="text-xs font-medium" style={{ color: isCritical ? '#FFFFFF' : '#1A1C1C' }}>{i + 1}</span>
                  {hasAlert && (
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
  );
}
