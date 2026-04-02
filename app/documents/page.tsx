'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import UploadDocumentModal from '@/components/documents/UploadDocumentModal';
import Link from 'next/link';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportCsv } from '@/lib/exportCsv';
import { MOCK_DOCUMENTS } from '@/lib/mockData';

const ALL_DOCUMENTS = MOCK_DOCUMENTS;

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
            <button
              className="btn btn-secondary flex items-center gap-2"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => exportCsv('hatsafe-documents.csv', ALL_DOCUMENTS.map(d => ({
                Title: d.title, Entity: d.entityName, 'Entity Type': d.entityType,
                'Certificate No.': d.certificateNumber, 'Issue Date': d.issueDate,
                'Expiry Date': d.expiryDate, Status: d.status,
                'Days Until Expiry': d.daysUntilExpiry,
              })))}>
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
