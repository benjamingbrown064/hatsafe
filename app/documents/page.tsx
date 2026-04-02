'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import UploadDocumentModal from '@/components/documents/UploadDocumentModal';
import Link from 'next/link';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ALL_DOCUMENTS = [
  { id: '1',  title: 'CSCS Card',           entityName: 'John Smith',     entityType: 'person',  certificateNumber: 'CSCS123456',   issueDate: '2024-01-15', expiryDate: '2029-01-15', status: 'valid',    daysUntilExpiry: 1095 },
  { id: '2',  title: 'MOT Certificate',      entityName: 'AB12 CDE',       entityType: 'vehicle', certificateNumber: 'MOT987654',    issueDate: '2025-02-10', expiryDate: '2026-03-15', status: 'expiring', daysUntilExpiry: 7 },
  { id: '3',  title: 'IPAF Certificate',     entityName: 'Sarah Johnson',  entityType: 'person',  certificateNumber: 'IPAF456789',   issueDate: '2023-06-20', expiryDate: '2026-02-01', status: 'expired',  daysUntilExpiry: -37 },
  { id: '4',  title: 'LOLER Inspection',     entityName: 'SCAF-001',       entityType: 'asset',   certificateNumber: 'LOLER2024-042',issueDate: '2024-11-15', expiryDate: '2026-04-20', status: 'expiring', daysUntilExpiry: 12 },
  { id: '5',  title: 'Vehicle Insurance',    entityName: 'FG34 HIJ',       entityType: 'vehicle', certificateNumber: 'INS123789',    issueDate: '2025-01-01', expiryDate: '2026-01-01', status: 'valid',    daysUntilExpiry: 298 },
  { id: '6',  title: 'First Aid Certificate',entityName: 'Mike Davies',    entityType: 'person',  certificateNumber: 'FA-2024-0821', issueDate: '2024-04-01', expiryDate: '2027-04-01', status: 'valid',    daysUntilExpiry: 365 },
  { id: '7',  title: 'PAT Test',             entityName: 'TOOL-042',       entityType: 'asset',   certificateNumber: 'PAT-042-2025', issueDate: '2025-01-10', expiryDate: '2026-01-10', status: 'valid',    daysUntilExpiry: 285 },
  { id: '8',  title: 'Road Tax',             entityName: 'KL56 MNO',       entityType: 'vehicle', certificateNumber: 'TAX-KL56-2025',issueDate: '2025-03-01', expiryDate: '2026-03-01', status: 'expiring', daysUntilExpiry: 14 },
  { id: '9',  title: 'CSCS Card',            entityName: 'Emma Wilson',    entityType: 'person',  certificateNumber: 'CSCS789012',   issueDate: '2023-09-01', expiryDate: '2028-09-01', status: 'valid',    daysUntilExpiry: 880 },
  { id: '10', title: 'Safety Certificate',   entityName: 'LIFT-008',       entityType: 'asset',   certificateNumber: 'CERT-LIFT-008',issueDate: '2024-03-15', expiryDate: '2027-03-15', status: 'valid',    daysUntilExpiry: 372 },
  { id: '11', title: 'MOT Certificate',      entityName: 'PQ78 RST',       entityType: 'vehicle', certificateNumber: 'MOT456321',    issueDate: '2025-01-20', expiryDate: '2026-01-20', status: 'valid',    daysUntilExpiry: 295 },
  { id: '12', title: 'PASMA Certificate',    entityName: 'James Brown',    entityType: 'person',  certificateNumber: 'PASMA-2024-091',issueDate: '2024-07-01', expiryDate: '2026-04-02', status: 'expiring', daysUntilExpiry: 0 },
  { id: '13', title: 'LOLER Inspection',     entityName: 'LIFT-012',       entityType: 'asset',   certificateNumber: 'LOLER-LIFT-012',issueDate: '2025-01-01', expiryDate: '2026-07-01', status: 'valid',    daysUntilExpiry: 183 },
  { id: '14', title: 'Working at Height',    entityName: 'Tom Harris',     entityType: 'person',  certificateNumber: 'WAH-2023-441', issueDate: '2023-11-15', expiryDate: '2025-11-15', status: 'expired',  daysUntilExpiry: -45 },
  { id: '15', title: 'Vehicle Insurance',    entityName: 'UV90 WXY',       entityType: 'vehicle', certificateNumber: 'INS-UV90-2025',issueDate: '2025-06-01', expiryDate: '2026-06-01', status: 'valid',    daysUntilExpiry: 150 },
  { id: '16', title: 'PAT Test',             entityName: 'COMP-023',       entityType: 'asset',   certificateNumber: 'PAT-023-2025', issueDate: '2025-02-01', expiryDate: '2026-02-01', status: 'valid',    daysUntilExpiry: 305 },
  { id: '17', title: 'CSCS Card',            entityName: 'Dan Booth',      entityType: 'person',  certificateNumber: 'CSCS345678',   issueDate: '2022-05-01', expiryDate: '2025-05-01', status: 'expired',  daysUntilExpiry: -330 },
  { id: '18', title: 'Service Record',       entityName: 'AB12 CDE',       entityType: 'vehicle', certificateNumber: 'SVC-2026-001', issueDate: '2026-01-15', expiryDate: '2026-07-15', status: 'valid',    daysUntilExpiry: 105 },
  { id: '19', title: 'IPAF Certificate',     entityName: 'Amy Clarke',     entityType: 'person',  certificateNumber: 'IPAF-AC-2024', issueDate: '2024-03-01', expiryDate: '2027-03-01', status: 'valid',    daysUntilExpiry: 335 },
  { id: '20', title: 'LOLER Inspection',     entityName: 'SCAF-002',       entityType: 'asset',   certificateNumber: 'LOLER-S2-2024',issueDate: '2024-06-01', expiryDate: '2026-06-01', status: 'valid',    daysUntilExpiry: 155 },
  { id: '21', title: 'Scaffold Licence',     entityName: 'Neil Harvey',    entityType: 'person',  certificateNumber: 'SCAF-NH-2023', issueDate: '2023-08-01', expiryDate: '2026-08-01', status: 'valid',    daysUntilExpiry: 213 },
  { id: '22', title: 'MOT Certificate',      entityName: 'DE22 FGH',       entityType: 'vehicle', certificateNumber: 'MOT-DE22-2025',issueDate: '2025-04-01', expiryDate: '2026-04-22', status: 'expiring', daysUntilExpiry: 20 },
  { id: '23', title: 'PAT Test',             entityName: 'TOOL-018',       entityType: 'asset',   certificateNumber: 'PAT-018-2025', issueDate: '2025-03-01', expiryDate: '2026-03-01', status: 'expiring', daysUntilExpiry: 3 },
  { id: '24', title: 'Manual Handling',      entityName: 'Emma Wilson',    entityType: 'person',  certificateNumber: 'MH-EW-2024',   issueDate: '2024-02-01', expiryDate: '2027-02-01', status: 'valid',    daysUntilExpiry: 400 },
  { id: '25', title: 'Vehicle Insurance',    entityName: 'IJ33 KLM',       entityType: 'vehicle', certificateNumber: 'INS-IJ33-2025',issueDate: '2025-05-01', expiryDate: '2026-05-01', status: 'valid',    daysUntilExpiry: 120 },
];

const PER_PAGE = 10;

// Derive breakdown counts from actual data
function countByKeyword(keyword: string) {
  return ALL_DOCUMENTS.filter(d =>
    d.title.toLowerCase().includes(keyword.toLowerCase())
  ).length;
}

const breakdown = [
  { name: 'CSCS CARDS', count: countByKeyword('cscs') },
  { name: 'IPAF',        count: countByKeyword('ipaf') },
  { name: 'MOT',         count: countByKeyword('mot') },
  { name: 'INSURANCE',   count: countByKeyword('insurance') },
  { name: 'LOLER',       count: countByKeyword('loler') },
  { name: 'OTHER',       count: ALL_DOCUMENTS.filter(d =>
      !['cscs','ipaf','mot','insurance','loler'].some(k =>
        d.title.toLowerCase().includes(k)
      )
    ).length },
];

function StatusBadge({ status, days }: { status: string; days: number }) {
  if (status === 'valid')    return <span className="badge badge-valid">Valid · {days}d</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring · {days}d</span>;
  return <span className="badge badge-expired">Overdue {Math.abs(days)}d</span>;
}

export default function DocumentsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const total = ALL_DOCUMENTS.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = ALL_DOCUMENTS.slice(start, start + PER_PAGE);

  return (
    <AppLayout>
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => setIsUploadModalOpen(false)}
      />

      <div className="space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'VALID',          value: String(ALL_DOCUMENTS.filter(d => d.status === 'valid').length) },
            { label: 'EXPIRING SOON',  value: String(ALL_DOCUMENTS.filter(d => d.status === 'expiring').length) },
            { label: 'EXPIRED',        value: String(ALL_DOCUMENTS.filter(d => d.status === 'expired').length), urgent: true },
            { label: 'TOTAL DOCS',     value: String(total) },
          ].map((s) => (
            <div key={s.label} className="card"
              style={(s as any).urgent ? { backgroundColor: '#000', border: 'none' } : {}}>
              <div className="stat-label" style={(s as any).urgent ? { color: 'rgba(255,255,255,0.5)' } : {}}>{s.label}</div>
              <div className="stat-value mt-2" style={(s as any).urgent ? { color: '#fff' } : {}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Document table */}
        <div className="card-flush">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <span className="label-sm">ALL DOCUMENTS</span>
            <button className="btn btn-secondary flex items-center gap-2" style={{ fontSize: '12px', padding: '6px 12px' }}>
              <ArrowDownTrayIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
              Export
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>DOCUMENT</th>
                <th>ENTITY</th>
                <th>CERT. NO.</th>
                <th>EXPIRY DATE</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <span className="font-medium" style={{ color: '#1A1C1C' }}>{doc.title}</span>
                  </td>
                  <td style={{ color: '#474747' }}>{doc.entityName}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#474747' }}>
                      {doc.certificateNumber}
                    </span>
                  </td>
                  <td style={{ color: '#1A1C1C', fontWeight: 500 }}>{doc.expiryDate}</td>
                  <td><StatusBadge status={doc.status} days={doc.daysUntilExpiry} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/documents/${doc.id}`}
                        className="btn btn-ghost text-xs"
                        style={{ display: 'inline-flex', textDecoration: 'none' }}>
                        View
                      </Link>
                      <button className="btn btn-ghost text-xs">Download</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #F3F3F3' }}>
            <span className="label-sm">SHOWING {start + 1}–{Math.min(start + PER_PAGE, total)} OF {total}</span>
            <div className="flex items-center gap-2">
              <button className="btn btn-secondary text-xs" disabled={page === 1}
                style={{ opacity: page === 1 ? 0.4 : 1 }}
                onClick={() => setPage(p => Math.max(1, p - 1))}>
                Previous
              </button>
              <span className="label-sm px-2">{page} / {totalPages}</span>
              <button className="btn btn-black text-xs" disabled={page === totalPages}
                style={{ opacity: page === totalPages ? 0.4 : 1 }}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Type breakdown */}
        <div>
          <div className="label-sm mb-4">DOCUMENT TYPE BREAKDOWN</div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {breakdown.map((b) => (
              <div key={b.name} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="stat-value" style={{ fontSize: '1.75rem' }}>{b.count}</div>
                <div className="label-sm mt-2">{b.name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
