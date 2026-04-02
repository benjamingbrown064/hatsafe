import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  ArrowsPointingOutIcon,
  BoltIcon,
  CubeIcon,
  Square3Stack3DIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

const assets = [
  { id: '1', assetId: 'SCAF-001', name: 'Aluminium Tower Scaffold', type: 'Scaffold',        location: 'Site A', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2', assetId: 'COMP-023', name: 'Air Compressor 50L',        type: 'Compressor',      location: 'Depot',  documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '3', assetId: 'LADD-015', name: 'Extension Ladder 6m',       type: 'Ladder',          location: 'Site B', documents: 2, expiring: 0, expired: 1, status: 'expired' },
  { id: '4', assetId: 'LIFT-008', name: 'Scissor Lift 8m',           type: 'Access Equipment',location: 'Site C', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '5', assetId: 'TOOL-042', name: 'Portable Angle Grinder',    type: 'Power Tool',      location: 'Site A', documents: 1, expiring: 1, expired: 0, status: 'expiring' },
];

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
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="label-sm mb-1">EQUIPMENT & MACHINERY</p>
            <h1>Assets</h1>
            <p className="mt-1">Manage equipment, machinery, and tools</p>
          </div>
          <Link href="/assets/new">
            <button className="btn btn-primary flex items-center gap-2">
              <PlusIcon className="w-4 h-4" strokeWidth={2} />
              Add Asset
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL ASSETS',  value: '87' },
            { label: 'COMPLIANT',     value: '58' },
            { label: 'EXPIRING SOON', value: '18' },
            { label: 'NON-COMPLIANT', value: '11', urgent: true },
          ].map((s) => (
            <div key={s.label} className="card"
              style={s.urgent ? { backgroundColor: '#000', border: 'none' } : {}}>
              <div className="stat-label" style={s.urgent ? { color: 'rgba(255,255,255,0.5)' } : {}}>{s.label}</div>
              <div className="stat-value mt-2" style={s.urgent ? { color: '#fff' } : {}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon
                className="absolute w-4 h-4 pointer-events-none"
                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A3A3A3' }}
                strokeWidth={1.5}
              />
              <input
                type="search"
                placeholder="Search by asset ID, name, or type…"
                style={{ paddingLeft: '36px' }}
              />
            </div>
            <button className="btn btn-secondary">Filter</button>
          </div>
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
              {assets.map((a) => (
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
            <span className="label-sm">SHOWING 1–5 OF 87</span>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-xs">Previous</button>
              <button className="btn btn-black text-xs">Next</button>
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
