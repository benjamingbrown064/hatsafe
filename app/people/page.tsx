'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportCsv } from '@/lib/exportCsv';

const ALL_PEOPLE = [
  { id: '1',  name: 'John Smith',      role: 'Carpenter',           team: 'Site A', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2',  name: 'Sarah Johnson',   role: 'Electrician',         team: 'Site B', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '3',  name: 'Mike Davies',     role: 'Site Manager',        team: 'Site A', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '4',  name: 'Emma Wilson',     role: 'Labourer',            team: 'Site C', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '5',  name: 'James Brown',     role: 'Scaffolder',          team: 'Site B', documents: 4, expiring: 2, expired: 0, status: 'expiring' },
  { id: '6',  name: 'Amy Clarke',      role: 'Health & Safety',     team: 'Site A', documents: 6, expiring: 0, expired: 0, status: 'valid' },
  { id: '7',  name: 'Tom Harris',      role: 'Plasterer',           team: 'Site C', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '8',  name: 'Lisa Patel',      role: 'Project Manager',     team: 'Site B', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '9',  name: 'Dan Booth',       role: 'Electrician',         team: 'Site A', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '10', name: 'Rachel Green',    role: 'Labourer',            team: 'Site C', documents: 2, expiring: 0, expired: 1, status: 'expired' },
  { id: '11', name: 'Chris Turner',    role: 'Bricklayer',          team: 'Site B', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '12', name: 'Diane Foster',    role: 'Site Manager',        team: 'Site A', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '13', name: 'Paul Evans',      role: 'Plumber',             team: 'Site C', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '14', name: 'Nina Shah',       role: 'Surveyor',            team: 'Site B', documents: 3, expiring: 2, expired: 0, status: 'expiring' },
  { id: '15', name: 'Owen Price',      role: 'Scaffolder',          team: 'Site A', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '16', name: 'Karen Bell',      role: 'Administrator',       team: 'Site B', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '17', name: 'Steve Morgan',    role: 'Carpenter',           team: 'Site C', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '18', name: 'Julie Wood',      role: 'Electrician',         team: 'Site A', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '19', name: 'Frank Hunt',      role: 'Bricklayer',          team: 'Site B', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '20', name: 'Tina West',       role: 'Labourer',            team: 'Site C', documents: 2, expiring: 0, expired: 1, status: 'expired' },
  { id: '21', name: 'Barry Cole',      role: 'Plant Operator',      team: 'Site A', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '22', name: 'Sandra King',     role: 'H&S Advisor',         team: 'Site B', documents: 6, expiring: 0, expired: 0, status: 'valid' },
  { id: '23', name: 'Gary Webb',       role: 'Roofer',              team: 'Site C', documents: 3, expiring: 2, expired: 0, status: 'expiring' },
  { id: '24', name: 'Helen Cook',      role: 'Quantity Surveyor',   team: 'Site A', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '25', name: 'Mark Hill',       role: 'Steel Fixer',         team: 'Site B', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '26', name: 'Carol Scott',     role: 'Architect',           team: 'Site C', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '27', name: 'Keith Young',     role: 'Plumber',             team: 'Site A', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '28', name: 'Donna Mills',     role: 'Labourer',            team: 'Site B', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '29', name: 'Ray Austin',      role: 'Carpenter',           team: 'Site C', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '30', name: 'Pam Dixon',       role: 'Site Manager',        team: 'Site A', documents: 5, expiring: 2, expired: 0, status: 'expiring' },
  { id: '31', name: 'Alan Ward',       role: 'Bricklayer',          team: 'Site B', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '32', name: 'Mandy Black',     role: 'Electrician',         team: 'Site C', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '33', name: 'Neil Harvey',     role: 'Scaffolder',          team: 'Site A', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '34', name: 'Shirley Long',    role: 'Administrator',       team: 'Site B', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '35', name: 'Derek Fox',       role: 'Plant Operator',      team: 'Site C', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '36', name: 'Chloe Hughes',    role: 'Plumber',             team: 'Site A', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '37', name: 'Roy Graham',      role: 'Roofer',              team: 'Site B', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '38', name: 'Tracy Simmons',   role: 'H&S Advisor',         team: 'Site C', documents: 6, expiring: 0, expired: 0, status: 'valid' },
  { id: '39', name: 'Phil Carr',       role: 'Carpenter',           team: 'Site A', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '40', name: 'Anita Rose',      role: 'Steel Fixer',         team: 'Site B', documents: 4, expiring: 2, expired: 0, status: 'expiring' },
  { id: '41', name: 'Colin Gray',      role: 'Bricklayer',          team: 'Site C', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '42', name: 'Elaine Cross',    role: 'Labourer',            team: 'Site A', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '43', name: 'Leonard Ryan',    role: 'Electrician',         team: 'Site B', documents: 5, expiring: 1, expired: 0, status: 'expiring' },
  { id: '44', name: 'Brenda Hart',     role: 'Project Manager',     team: 'Site C', documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '45', name: 'Vic Stone',       role: 'Scaffolder',          team: 'Site A', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '46', name: 'Rose Walsh',      role: 'Plumber',             team: 'Site B', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '47', name: 'Len Murphy',      role: 'Carpenter',           team: 'Site C', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '48', name: 'June Reid',       role: 'Administrator',       team: 'Site A', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '49', name: 'Stan Dunn',       role: 'Plant Operator',      team: 'Site B', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '50', name: 'Iris Lane',       role: 'H&S Advisor',         team: 'Site C', documents: 6, expiring: 2, expired: 0, status: 'expiring' },
];

const PER_PAGE = 10;

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
  const [page, setPage] = useState(1);
  const total = ALL_PEOPLE.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = ALL_PEOPLE.slice(start, start + PER_PAGE);

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL PEOPLE',  value: String(total) },
            { label: 'COMPLIANT',     value: String(ALL_PEOPLE.filter(p => p.status === 'valid').length) },
            { label: 'EXPIRING SOON', value: String(ALL_PEOPLE.filter(p => p.status === 'expiring').length) },
            { label: 'NON-COMPLIANT', value: String(ALL_PEOPLE.filter(p => p.status === 'expired').length), urgent: true },
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
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <span className="label-sm">ALL PEOPLE</span>
            <button
              className="btn btn-secondary flex items-center gap-2"
              style={{ fontSize: '12px', padding: '6px 12px' }}
              onClick={() => exportCsv('hatsafe-people.csv', ALL_PEOPLE.map(p => ({
                Name: p.name, Role: p.role, Team: p.team,
                Documents: p.documents, Expiring: p.expiring,
                Expired: p.expired, Status: p.status,
              })))}>
              <ArrowDownTrayIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
              Export
            </button>
          </div>
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
              {visible.map((p) => (
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
                    {p.expired  > 0 && <span className="ml-2 text-xs font-semibold" style={{ color: '#1A1C1C' }}>{p.expired} expired</span>}
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/people/${p.id}`}
                      className="btn btn-ghost text-xs"
                      style={{ display: 'inline-flex', textDecoration: 'none' }}>
                      View →
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

      </div>
    </AppLayout>
  );
}
