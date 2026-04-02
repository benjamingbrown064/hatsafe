'use client';

import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CalendarDaysIcon,
  HashtagIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Mock document data — keyed by id
const DOCUMENTS: Record<string, {
  id: string; title: string; entityName: string; entityType: string;
  entityId: string; certificateNumber: string; issuer: string;
  issueDate: string; expiryDate: string | null; status: string;
  daysUntilExpiry: number | null; notes: string;
}> = {
  '1':  { id: '1',  title: 'CSCS Card',             entityName: 'John Smith',    entityType: 'person',  entityId: '1', certificateNumber: 'CSCS123456',    issuer: 'CITB',                    issueDate: '2024-01-15', expiryDate: '2029-01-15', status: 'valid',    daysUntilExpiry: 1095, notes: '' },
  '2':  { id: '2',  title: 'MOT Certificate',        entityName: 'AB12 CDE',      entityType: 'vehicle', entityId: '1', certificateNumber: 'MOT987654',     issuer: 'Quick Fit MOT Centre',    issueDate: '2025-02-10', expiryDate: '2026-03-15', status: 'expiring', daysUntilExpiry: 7,    notes: 'Due for renewal' },
  '3':  { id: '3',  title: 'IPAF Certificate',       entityName: 'Sarah Johnson', entityType: 'person',  entityId: '2', certificateNumber: 'IPAF456789',    issuer: 'IPAF',                    issueDate: '2023-06-20', expiryDate: '2026-02-01', status: 'expired',  daysUntilExpiry: -37,  notes: '' },
  '4':  { id: '4',  title: 'LOLER Inspection',       entityName: 'SCAF-001',      entityType: 'asset',   entityId: '1', certificateNumber: 'LOLER2024-042', issuer: 'Safety Inspections Ltd',  issueDate: '2024-11-15', expiryDate: '2026-04-20', status: 'expiring', daysUntilExpiry: 12,   notes: '' },
  '5':  { id: '5',  title: 'Vehicle Insurance',      entityName: 'FG34 HIJ',      entityType: 'vehicle', entityId: '2', certificateNumber: 'INS123789',     issuer: 'Insurance Co Ltd',        issueDate: '2025-01-01', expiryDate: '2026-01-01', status: 'valid',    daysUntilExpiry: 298,  notes: '' },
  '6':  { id: '6',  title: 'First Aid Certificate',  entityName: 'Mike Davies',   entityType: 'person',  entityId: '3', certificateNumber: 'FA-2024-0821',  issuer: 'St John Ambulance',       issueDate: '2024-04-01', expiryDate: '2027-04-01', status: 'valid',    daysUntilExpiry: 365,  notes: '' },
  '7':  { id: '7',  title: 'PAT Test',               entityName: 'TOOL-042',      entityType: 'asset',   entityId: '5', certificateNumber: 'PAT-042-2025',  issuer: 'PAT Testing Services',    issueDate: '2025-01-10', expiryDate: '2026-01-10', status: 'valid',    daysUntilExpiry: 285,  notes: '' },
  '8':  { id: '8',  title: 'Road Tax',               entityName: 'KL56 MNO',      entityType: 'vehicle', entityId: '3', certificateNumber: 'TAX-KL56-2025', issuer: 'DVLA',                    issueDate: '2025-03-01', expiryDate: '2026-03-01', status: 'expiring', daysUntilExpiry: 14,   notes: '' },
  '9':  { id: '9',  title: 'CSCS Card',              entityName: 'Emma Wilson',   entityType: 'person',  entityId: '4', certificateNumber: 'CSCS789012',    issuer: 'CITB',                    issueDate: '2023-09-01', expiryDate: '2028-09-01', status: 'valid',    daysUntilExpiry: 880,  notes: '' },
  '10': { id: '10', title: 'Safety Certificate',     entityName: 'LIFT-008',      entityType: 'asset',   entityId: '4', certificateNumber: 'CERT-LIFT-008', issuer: 'Boss Equipment',           issueDate: '2024-03-15', expiryDate: '2027-03-15', status: 'valid',    daysUntilExpiry: 372,  notes: '' },
};

function entityHref(type: string, id: string) {
  if (type === 'vehicle') return `/vehicles/${id}`;
  if (type === 'asset')   return `/assets/${id}`;
  return `/people/${id}`;
}

function EntityIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4'; const s = { color: '#474747' };
  if (type === 'vehicle') return <TruckIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'asset')   return <WrenchScrewdriverIcon className={cls} style={s} strokeWidth={1.5} />;
  return <UserIcon className={cls} style={s} strokeWidth={1.5} />;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'valid')    return <span className="badge badge-valid">Valid</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring Soon</span>;
  return <span className="badge badge-expired">Expired</span>;
}

export default function DocumentProfilePage({ params }: { params: { id: string } }) {
  const doc = DOCUMENTS[params.id] ?? DOCUMENTS['1'];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploading, setUploading]       = useState(false);

  function handleDownload() {
    // Generate a text-based placeholder certificate and trigger download
    const content = [
      `HatSafe — Document Record`,
      `${'─'.repeat(40)}`,
      `Document:          ${doc.title}`,
      `Certificate No.:   ${doc.certificateNumber}`,
      `Entity:            ${doc.entityName}`,
      `Issuer:            ${doc.issuer}`,
      `Issue Date:        ${doc.issueDate}`,
      `Expiry Date:       ${doc.expiryDate ?? 'No expiry'}`,
      `Status:            ${doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}`,
      `${'─'.repeat(40)}`,
      `Downloaded from HatSafe on ${new Date().toLocaleDateString('en-GB')}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${doc.certificateNumber}-${doc.title.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploadedFile(file.name);
      setUploading(false);
    }, 1200);
    // Reset so same file can be re-selected if needed
    e.target.value = '';
  }

  const details = [
    { label: 'CERTIFICATE NO.',  value: doc.certificateNumber, mono: true },
    { label: 'ISSUER',           value: doc.issuer },
    { label: 'ISSUE DATE',       value: doc.issueDate },
    { label: 'EXPIRY DATE',      value: doc.expiryDate ?? 'No expiry' },
    { label: 'DOCUMENT TYPE',    value: doc.title },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Back */}
        <Link href="/documents" className="inline-flex items-center gap-2 text-sm" style={{ color: '#474747', textDecoration: 'none' }}>
          <ArrowLeftIcon className="w-4 h-4" strokeWidth={1.5} />
          Back to Documents
        </Link>

        {/* Header */}
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#F3F3F3', borderRadius: '6px' }}>
                <DocumentTextIcon className="w-7 h-7" style={{ color: '#474747' }} strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1C1C' }}>{doc.title}</h1>
                  <StatusBadge status={doc.status} />
                </div>
                <p className="mt-1" style={{ color: '#474747', fontSize: '15px' }}>
                  {doc.certificateNumber}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <EntityIcon type={doc.entityType} />
                  <Link href={entityHref(doc.entityType, doc.entityId)}
                    className="text-xs font-medium" style={{ color: '#474747', textDecoration: 'none' }}>
                    {doc.entityName}
                  </Link>
                  <span style={{ color: '#C6C6C6' }}>·</span>
                  <span className="text-xs" style={{ color: '#A3A3A3', textTransform: 'capitalize' }}>
                    {doc.entityType}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="btn btn-secondary flex items-center gap-2" onClick={handleDownload}>
                <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.5} />
                Download
              </button>
              {doc.expiryDate && (
                <button
                  className="btn btn-primary flex items-center gap-2"
                  onClick={handleUploadClick}
                  disabled={uploading}
                  style={{ opacity: uploading ? 0.7 : 1 }}>
                  {uploading
                    ? <span style={{ fontSize: '12px' }}>Uploading…</span>
                    : uploadedFile
                      ? <><CheckCircleIcon className="w-4 h-4" strokeWidth={2} /> Uploaded</>
                      : <><ArrowUpTrayIcon className="w-4 h-4" strokeWidth={2} /> Upload Renewal</>
                  }
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Upload confirmation */}
        {uploadedFile && (
          <div className="flex items-center gap-3 px-4 py-3"
            style={{ backgroundColor: '#F9F9F9', border: '1px solid rgba(198,198,198,0.4)', borderRadius: '4px' }}>
            <CheckCircleIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#1A1C1C' }} strokeWidth={2} />
            <div>
              <span className="text-sm font-medium" style={{ color: '#1A1C1C' }}>Renewal uploaded: </span>
              <span className="text-sm font-mono" style={{ color: '#474747' }}>{uploadedFile}</span>
            </div>
            <button className="ml-auto label-sm" style={{ color: '#A3A3A3' }} onClick={() => setUploadedFile(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — details */}
          <div className="space-y-4">
            <div className="card">
              <div className="label-sm mb-4">DOCUMENT DETAILS</div>
              <dl className="space-y-3">
                {details.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt style={{ fontSize: '12px', color: '#A3A3A3', flexShrink: 0 }}>{row.label}</dt>
                    <dd style={{
                      fontSize: '13px', color: '#1A1C1C', fontWeight: 500,
                      textAlign: 'right', fontFamily: row.mono ? 'monospace' : 'inherit',
                    }}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Linked entity */}
            <div className="card">
              <div className="label-sm mb-4">LINKED TO</div>
              <Link href={entityHref(doc.entityType, doc.entityId)}
                className="flex items-center gap-3 p-3 transition-colors"
                style={{ backgroundColor: '#F9F9F9', borderRadius: '4px', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F3F3F3')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F9F9F9')}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                  <EntityIcon type={doc.entityType} />
                </div>
                <div>
                  <div className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{doc.entityName}</div>
                  <div className="label-sm" style={{ fontSize: '9px', textTransform: 'capitalize' }}>{doc.entityType}</div>
                </div>
              </Link>
            </div>

            {/* Expiry status */}
            {doc.expiryDate && (
              <div className="card"
                style={doc.status === 'expired' ? { backgroundColor: '#000', border: 'none' } : {}}>
                <div className="label-sm mb-2"
                  style={doc.status === 'expired' ? { color: 'rgba(255,255,255,0.5)' } : {}}>
                  EXPIRY STATUS
                </div>
                <div style={{
                  fontSize: '2rem', fontWeight: 700, lineHeight: 1,
                  color: doc.status === 'expired' ? '#FFFFFF' : '#1A1C1C',
                }}>
                  {doc.daysUntilExpiry === null ? '—'
                    : doc.daysUntilExpiry < 0 ? `${Math.abs(doc.daysUntilExpiry)}d overdue`
                    : doc.daysUntilExpiry === 0 ? 'Today'
                    : `${doc.daysUntilExpiry}d`}
                </div>
                <div className="mt-1 label-sm"
                  style={doc.status === 'expired' ? { color: 'rgba(255,255,255,0.4)' } : {}}>
                  {doc.status === 'expired' ? 'EXPIRED — RENEW IMMEDIATELY'
                    : doc.status === 'expiring' ? 'UNTIL EXPIRY'
                    : 'REMAINING'}
                </div>
              </div>
            )}
          </div>

          {/* Right — history / notes */}
          <div className="lg:col-span-2 space-y-4">

            {/* Version history */}
            <div className="card-flush">
              <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div className="label-sm mb-1">HISTORY</div>
                <h2 style={{ fontSize: '1rem' }}>Version History</h2>
              </div>
              <div className="divide-y">
                {[
                  { version: 'Current',  date: doc.issueDate,    note: 'Latest version uploaded', current: true },
                  { version: 'Previous', date: '2022-01-15',     note: 'Superseded on renewal',   current: false },
                ].map((v, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: v.current ? '#000000' : '#F3F3F3',
                        borderRadius: '4px',
                      }}>
                      <DocumentTextIcon className="w-4 h-4"
                        style={{ color: v.current ? '#FFC107' : '#A3A3A3' }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{v.version}</span>
                        {v.current && <span className="badge badge-valid" style={{ fontSize: '9px' }}>ACTIVE</span>}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>
                        {v.date} · {v.note}
                      </div>
                    </div>
                    <button className="btn btn-secondary text-xs flex items-center gap-1.5"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                      onClick={handleDownload}>
                      <ArrowDownTrayIcon className="w-3 h-3" strokeWidth={2} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="card-flush">
              <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div className="label-sm mb-1">METADATA</div>
                <h2 style={{ fontSize: '1rem' }}>Additional Information</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { Icon: HashtagIcon,        label: 'Certificate Number', value: doc.certificateNumber },
                  { Icon: BuildingOfficeIcon, label: 'Issuing Body',       value: doc.issuer },
                  { Icon: CalendarDaysIcon,   label: 'Issue Date',         value: doc.issueDate },
                  { Icon: CalendarDaysIcon,   label: 'Expiry Date',        value: doc.expiryDate ?? 'No expiry' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                      <row.Icon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="label-sm" style={{ fontSize: '9px' }}>{row.label}</div>
                      <div className="text-sm font-medium" style={{ color: '#1A1C1C', fontFamily: row.label.includes('Number') ? 'monospace' : 'inherit' }}>
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}

                {doc.notes && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid #F3F3F3' }}>
                    <div className="label-sm mb-2">NOTES</div>
                    <p style={{ fontSize: '13px', color: '#474747' }}>{doc.notes}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}
