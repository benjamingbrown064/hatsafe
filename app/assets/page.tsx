'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  WrenchScrewdriverIcon,
  ArrowsPointingOutIcon,
  BoltIcon,
  Square3Stack3DIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

const ALL_ASSETS = [
  { id: '1',  assetId: 'SCAF-001', name: 'Aluminium Tower Scaffold',   type: 'Scaffold',        location: 'Site A', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2',  assetId: 'COMP-023', name: 'Air Compressor 50L',          type: 'Compressor',      location: 'Depot',  documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '3',  assetId: 'LADD-015', name: 'Extension Ladder 6m',         type: 'Ladder',          location: 'Site B', documents: 2, expiring: 0, expired: 1, status: 'expired' },
  { id: '4',  assetId: 'LIFT-008', name: 'Scissor Lift 8m',             type: 'Access Equipment',location: 'Site C', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '5',  assetId: 'TOOL-042', name: 'Portable Angle Grinder',      type: 'Power Tool',      location: 'Site A', documents: 1, expiring: 1, expired: 0, status: 'expiring' },
  { id: '6',  assetId: 'SCAF-002', name: 'Kwikstage Scaffold System',   type: 'Scaffold',        location: 'Site B', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '7',  assetId: 'LIFT-012', name: 'Cherry Picker 12m',           type: 'Access Equipment',location: 'Site A', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '8',  assetId: 'TOOL-018', name: 'SDS Rotary Hammer Drill',     type: 'Power Tool',      location: 'Site C', documents: 1, expiring: 0, expired: 0, status: 'valid' },
  { id: '9',  assetId: 'GENE-005', name: 'Diesel Generator 10kVA',      type: 'Generator',       location: 'Depot',  documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '10', assetId: 'LADD-022', name: 'Step Ladder 3m',              type: 'Ladder',          location: 'Site B', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '11', assetId: 'COMP-011', name: 'Breaker & Compressor Kit',    type: 'Compressor',      location: 'Site A', documents: 2, expiring: 1, expired: 0, status: 'expiring' },
  { id: '12', assetId: 'LIFT-019', name: 'Telehandler 10m',             type: 'Access Equipment',location: 'Site C', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '13', assetId: 'TOOL-061', name: 'Concrete Mixer 120L',         type: 'Power Tool',      location: 'Depot',  documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '14', assetId: 'SCAF-007', name: 'Mobile Scaffold Tower',       type: 'Scaffold',        location: 'Site B', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '15', assetId: 'GENE-009', name: 'Petrol Generator 5kVA',       type: 'Generator',       location: 'Site A', documents: 2, expiring: 1, expired: 0, status: 'expiring' },
  { id: '16', assetId: 'LADD-031', name: 'Platform Ladder 2m',          type: 'Ladder',          location: 'Site C', documents: 1, expiring: 0, expired: 0, status: 'valid' },
  { id: '17', assetId: 'LIFT-003', name: 'Boom Lift 15m',               type: 'Access Equipment',location: 'Site A', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '18', assetId: 'TOOL-075', name: 'Pressure Washer 240 bar',     type: 'Power Tool',      location: 'Site B', documents: 1, expiring: 2, expired: 0, status: 'expiring' },
  { id: '19', assetId: 'COMP-034', name: 'Air Compressor 100L',         type: 'Compressor',      location: 'Depot',  documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '20', assetId: 'SCAF-014', name: 'Tube & Fitting Scaffold',     type: 'Scaffold',        location: 'Site C', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '21', assetId: 'LIFT-027', name: 'Scissor Lift 12m',            type: 'Access Equipment',location: 'Site B', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '22', assetId: 'TOOL-088', name: 'Cut-Off Saw Petrol',          type: 'Power Tool',      location: 'Site A', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '23', assetId: 'GENE-016', name: 'Diesel Generator 20kVA',      type: 'Generator',       location: 'Depot',  documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '24', assetId: 'LADD-044', name: 'Combination Ladder 3.8m',     type: 'Ladder',          location: 'Site C', documents: 1, expiring: 1, expired: 0, status: 'expiring' },
  { id: '25', assetId: 'LIFT-031', name: 'Mast Climber 50m',            type: 'Access Equipment',location: 'Site A', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '26', assetId: 'TOOL-099', name: 'Nail Gun (Framing)',          type: 'Power Tool',      location: 'Site B', documents: 1, expiring: 0, expired: 1, status: 'expired' },
  { id: '27', assetId: 'COMP-047', name: 'Portable Compressor 25L',     type: 'Compressor',      location: 'Site C', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '28', assetId: 'SCAF-021', name: 'System Scaffold (Cuplok)',    type: 'Scaffold',        location: 'Site A', documents: 4, expiring: 2, expired: 0, status: 'expiring' },
  { id: '29', assetId: 'GENE-023', name: 'Solar Generator 3kW',         type: 'Generator',       location: 'Site B', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '30', assetId: 'LIFT-039', name: 'Knuckle Boom Lift 20m',       type: 'Access Equipment',location: 'Depot',  documents: 5, expiring: 0, expired: 1, status: 'expired' },
];

const PER_PAGE = 10;

const breakdown = [
  { label: 'ACCESS',      value: 24, Icon: ArrowsPointingOutIcon },
  { label: 'TOOLS',       value: 31, Icon: WrenchScrewdriverIcon },
  { label: 'POWER TOOLS', value: 18, Icon: BoltIcon },
  { label: 'HEAVY PLANT', value: 8,  Icon: Square3Stack3DIcon },
  { label: 'OTHER',       value: 6,  Icon: ArchiveBoxIcon },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'valid')    return <span className="badge badge-valid">Valid</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring Soon</span>;
  if (status === 'expired')  return <span className="badge badge-expired">Expired</span>;
  return <span className="badge badge-missing">Unknown</span>;
}

export default function AssetsPage() {
  const [page, setPage] = useState(1);
  const total = ALL_ASSETS.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = ALL_ASSETS.slice(start, start + PER_PAGE);

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL ASSETS',  value: String(total) },
            { label: 'COMPLIANT',     value: String(ALL_ASSETS.filter(a => a.status === 'valid').length) },
            { label: 'EXPIRING SOON', value: String(ALL_ASSETS.filter(a => a.status === 'expiring').length) },
            { label: 'NON-COMPLIANT', value: String(ALL_ASSETS.filter(a => a.status === 'expired').length), urgent: true },
          ].map((s) => (
            <div key={s.label} className="card"
              style={(s as any).urgent ? { backgroundColor: '#000', border: 'none' } : {}}>
              <div className="stat-label" style={(s as any).urgent ? { color: 'rgba(255,255,255,0.5)' } : {}}>{s.label}</div>
              <div className="stat-value mt-2" style={(s as any).urgent ? { color: '#fff' } : {}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card-flush">
          <table>
            <thead>
              <tr>
                <th>ASSET ID</th>
                <th>NAME</th>
                <th>TYPE</th>
                <th>LOCATION</th>
                <th>DOCUMENTS</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                        <WrenchScrewdriverIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                      </div>
                      <span className="font-mono font-medium text-sm" style={{ color: '#1A1C1C' }}>{a.assetId}</span>
                    </div>
                  </td>
                  <td style={{ color: '#1A1C1C', fontWeight: 500 }}>{a.name}</td>
                  <td style={{ color: '#474747' }}>{a.type}</td>
                  <td style={{ color: '#474747' }}>{a.location}</td>
                  <td>
                    <span style={{ color: '#1A1C1C' }}>{a.documents}</span>
                    {a.expiring > 0 && <span className="ml-2 text-xs" style={{ color: '#92400E' }}>{a.expiring} expiring</span>}
                    {a.expired  > 0 && <span className="ml-2 text-xs font-semibold" style={{ color: '#1A1C1C' }}>{a.expired} expired</span>}
                  </td>
                  <td><StatusBadge status={a.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/assets/${a.id}`}>
                      <button className="btn btn-ghost text-xs">View →</button>
                    </Link>
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

        {/* Breakdown */}
        <div>
          <div className="label-sm mb-4">ASSET BREAKDOWN BY TYPE</div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {breakdown.map((b) => (
              <div key={b.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <b.Icon className="w-5 h-5 mx-auto mb-3" style={{ color: '#A3A3A3' }} strokeWidth={1.5} />
                <div className="stat-value" style={{ fontSize: '1.75rem' }}>{b.value}</div>
                <div className="label-sm mt-1">{b.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
