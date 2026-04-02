import AppLayout from '@/components/layout/AppLayout';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const people = [
  { id: '1', name: 'John Smith',   role: 'Carpenter',     team: 'Site A', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2', name: 'Sarah Johnson',role: 'Electrician',   team: 'Site B', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '3', name: 'Mike Davies',  role: 'Site Manager',  team: 'Site A', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '4', name: 'Emma Wilson',  role: 'Labourer',      team: 'Site C', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '5', name: 'James Brown',  role: 'Scaffolder',    team: 'Site B', documents: 4, expiring: 2, expired: 0, status: 'expiring' },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'valid')    return <span className="badge badge-valid">Valid</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring Soon</span>;
  if (status === 'expired')  return <span className="badge badge-expired">Expired</span>;
  return <span className="badge badge-missing">Unknown</span>;
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('');
}

export default function PeoplePage() {
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="label-sm mb-1">WORKFORCE</p>
            <h1>People</h1>
            <p className="mt-1">Manage workers, staff, and subcontractors</p>
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-4 h-4" strokeWidth={2} />
            Add Person
          </button>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL PEOPLE',    value: '142' },
            { label: 'COMPLIANT',       value: '98' },
            { label: 'EXPIRING SOON',   value: '32' },
            { label: 'NON-COMPLIANT',   value: '12', urgent: true },
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
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#A3A3A3' }} strokeWidth={1.5} />
              <input type="text" placeholder="Search by name, role, or team…"
                style={{ paddingLeft: '36px' }} />
            </div>
            <button className="btn btn-secondary">Filter</button>
          </div>
        </div>

        {/* Table */}
        <div className="card-flush">
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>ROLE</th>
                <th>TEAM</th>
                <th>DOCUMENTS</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#F3F3F3', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#474747' }}>
                        {initials(p.name)}
                      </div>
                      <span className="font-medium" style={{ color: '#1A1C1C' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#474747' }}>{p.role}</td>
                  <td style={{ color: '#474747' }}>{p.team}</td>
                  <td>
                    <span style={{ color: '#1A1C1C' }}>{p.documents}</span>
                    {p.expiring > 0 && <span className="ml-2 text-xs" style={{ color: '#92400E' }}>{p.expiring} expiring</span>}
                    {p.expired  > 0 && <span className="ml-2 text-xs" style={{ color: '#1A1C1C', fontWeight: 600 }}>{p.expired} expired</span>}
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost text-xs">View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: '1px solid #F3F3F3' }}>
            <span className="label-sm">SHOWING 1–5 OF 142</span>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-xs">Previous</button>
              <button className="btn btn-black text-xs">Next</button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
