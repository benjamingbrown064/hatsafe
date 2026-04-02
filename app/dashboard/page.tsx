'use client';

import AppLayout from '@/components/layout/AppLayout';
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts';
import AISuggestions from '@/components/dashboard/AISuggestions';
import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  ArrowUpRightIcon,
  UserPlusIcon,
  DocumentTextIcon,
  TruckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import { MOCK_DOCUMENTS } from '@/lib/mockData';

const expired      = MOCK_DOCUMENTS.filter(d => d.status === 'expired').length;
const expiringSoon = MOCK_DOCUMENTS.filter(d => d.status === 'expiring').length;
const valid        = MOCK_DOCUMENTS.filter(d => d.status === 'valid').length;
const pendingReview = 4;

export default function DashboardPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);

  function handleUploadClick() { fileInputRef.current?.click(); }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
    e.target.value = '';
  }
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

                {/* Add Person → /people */}
                <Link href="/people"
                  className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors"
                  style={{ borderRadius: '4px', textDecoration: 'none', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                    <UserPlusIcon className="w-4 h-4" style={{ color: '#1A1C1C' }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>Add Person</div>
                    <div className="text-xs" style={{ color: '#A3A3A3' }}>Register new worker</div>
                  </div>
                </Link>

                {/* Upload Document → file picker */}
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                  style={{ borderRadius: '4px' }}
                  onClick={handleUploadClick}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: uploaded ? '#000000' : '#F3F3F3', borderRadius: '4px' }}>
                    {uploaded
                      ? <CheckCircleIcon className="w-4 h-4" style={{ color: '#FFC107' }} strokeWidth={2} />
                      : <DocumentTextIcon className="w-4 h-4" style={{ color: '#1A1C1C' }} strokeWidth={1.5} />
                    }
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>
                      {uploaded ? 'Document Uploaded ✓' : 'Upload Document'}
                    </div>
                    <div className="text-xs" style={{ color: '#A3A3A3' }}>Cert, licence, MOT…</div>
                  </div>
                </button>

                {/* Add Vehicle → /vehicles */}
                <Link href="/vehicles"
                  className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors"
                  style={{ borderRadius: '4px', textDecoration: 'none', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                    <TruckIcon className="w-4 h-4" style={{ color: '#1A1C1C' }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>Add Vehicle</div>
                    <div className="text-xs" style={{ color: '#A3A3A3' }}>Register fleet vehicle</div>
                  </div>
                </Link>

              </div>

              {/* Hidden file input */}
              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                style={{ display: 'none' }} onChange={handleFileChange} />
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
