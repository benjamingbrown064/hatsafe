'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import UploadDocumentModal from '@/components/documents/UploadDocumentModal';
import { MagnifyingGlassIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const documents = [
  { id: '1', title: 'CSCS Card',        entityName: 'John Smith',    entityType: 'person',  certificateNumber: 'CSCS123456', issueDate: '2024-01-15', expiryDate: '2029-01-15', status: 'valid',    daysUntilExpiry: 1095 },
  { id: '2', title: 'MOT Certificate',   entityName: 'AB12 CDE',      entityType: 'vehicle', certificateNumber: 'MOT987654',  issueDate: '2025-02-10', expiryDate: '2026-03-15', status: 'expiring', daysUntilExpiry: 7 },
  { id: '3', title: 'IPAF Certificate',  entityName: 'Sarah Johnson', entityType: 'person',  certificateNumber: 'IPAF456789', issueDate: '2023-06-20', expiryDate: '2026-02-01', status: 'expired',  daysUntilExpiry: -37 },
];

const breakdown = [
  { name: 'CSCS Cards', count: 142 },
  { name: 'IPAF',       count: 58 },
  { name: 'MOT',        count: 48 },
  { name: 'Insurance',  count: 95 },
  { name: 'LOLER',      count: 87 },
  { name: 'Other',      count: 57 },
];

function StatusBadge({ status, days }: { status: string; days: number }) {
  if (status === 'valid')    return <span className="badge badge-valid">Valid · {days}d</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring · {days}d</span>;
  return <span className="badge badge-expired">Overdue {Math.abs(days)}d</span>;
}

export default function DocumentsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
            { label: 'VALID',         value: '312' },
            { label: 'EXPIRING SOON', value: '98' },
            { label: 'EXPIRED',       value: '52', urgent: true },
            { label: 'PENDING REVIEW',value: '25' },
          ].map((s) => (
            <div key={s.label} className="card"
              style={s.urgent ? { backgroundColor: '#000', border: 'none' } : {}}>
              <div className="stat-label" style={s.urgent ? { color: 'rgba(255,255,255,0.5)' } : {}}>{s.label}</div>
              <div className="stat-value mt-2" style={s.urgent ? { color: '#fff' } : {}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Document table */}
        <div className="card-flush">
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
              {documents.map((doc) => (
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
                      <button className="btn btn-ghost text-xs">View</button>
                      <button className="btn btn-ghost text-xs">Download</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #F3F3F3' }}>
            <span className="label-sm">SHOWING 1–3 OF 487</span>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-xs">Previous</button>
              <button className="btn btn-black text-xs">Next</button>
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
