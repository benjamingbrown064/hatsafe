import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const vehicles = [
  { id: '1', registration: 'AB12 CDE', make: 'Ford',       model: 'Transit', type: 'Van',    depot: 'Site A', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2', registration: 'FG34 HIJ', make: 'Volkswagen', model: 'Caddy',   type: 'Van',    depot: 'Site B', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '3', registration: 'KL56 MNO', make: 'Mercedes',   model: 'Sprinter',type: 'Van',    depot: 'Site A', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '4', registration: 'PQ78 RST', make: 'Isuzu',      model: 'D-Max',   type: 'Pickup', depot: 'Site C', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '5', registration: 'UV90 WXY', make: 'Renault',    model: 'Master',  type: 'Van',    depot: 'Site B', documents: 4, expiring: 2, expired: 0, status: 'expiring' },
];

const breakdown = [
  { label: 'VANS',   value: 32 },
  { label: 'PICKUPS',value: 8 },
  { label: 'TRUCKS', value: 5 },
  { label: 'PLANT',  value: 3 },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'valid')    return <span className="badge badge-valid">Valid</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring Soon</span>;
  if (status === 'expired')  return <span className="badge badge-expired">Expired</span>;
  return <span className="badge badge-missing">Unknown</span>;
}

export default function VehiclesPage() {
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL VEHICLES', value: '48' },
            { label: 'COMPLIANT',      value: '32' },
            { label: 'EXPIRING SOON',  value: '11' },
            { label: 'NON-COMPLIANT',  value: '5', urgent: true },
          ].map((s) => (
            <div key={s.label} className="card"
              style={s.urgent ? { backgroundColor: '#000', border: 'none' } : {}}>
              <div className="stat-label" style={s.urgent ? { color: 'rgba(255,255,255,0.5)' } : {}}>{s.label}</div>
              <div className="stat-value mt-2" style={s.urgent ? { color: '#fff' } : {}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="card-flush">
          <table>
            <thead>
              <tr>
                <th>REGISTRATION</th>
                <th>VEHICLE</th>
                <th>TYPE</th>
                <th>DEPOT</th>
                <th>DOCUMENTS</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                        <TruckIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                      </div>
                      <span className="font-mono font-medium text-sm" style={{ color: '#1A1C1C' }}>{v.registration}</span>
                    </div>
                  </td>
                  <td style={{ color: '#1A1C1C', fontWeight: 500 }}>{v.make} {v.model}</td>
                  <td style={{ color: '#474747' }}>{v.type}</td>
                  <td style={{ color: '#474747' }}>{v.depot}</td>
                  <td>
                    <span style={{ color: '#1A1C1C' }}>{v.documents}</span>
                    {v.expiring > 0 && <span className="ml-2 text-xs" style={{ color: '#92400E' }}>{v.expiring} expiring</span>}
                    {v.expired  > 0 && <span className="ml-2 text-xs font-semibold" style={{ color: '#1A1C1C' }}>{v.expired} expired</span>}
                  </td>
                  <td><StatusBadge status={v.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/vehicles/${v.id}`}>
                      <button className="btn btn-ghost text-xs">View →</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #F3F3F3' }}>
            <span className="label-sm">SHOWING 1–5 OF 48</span>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-xs">Previous</button>
              <button className="btn btn-black text-xs">Next</button>
            </div>
          </div>
        </div>

        {/* Fleet breakdown */}
        <div>
          <div className="label-sm mb-4">FLEET BREAKDOWN BY TYPE</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {breakdown.map((b) => (
              <div key={b.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                <TruckIcon className="w-5 h-5 mx-auto mb-3" style={{ color: '#A3A3A3' }} strokeWidth={1.5} />
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
