'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { TruckIcon } from '@heroicons/react/24/outline';

const ALL_VEHICLES = [
  { id: '1',  registration: 'AB12 CDE', make: 'Ford',       model: 'Transit',  type: 'Van',    depot: 'Site A', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '2',  registration: 'FG34 HIJ', make: 'Volkswagen', model: 'Caddy',    type: 'Van',    depot: 'Site B', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '3',  registration: 'KL56 MNO', make: 'Mercedes',   model: 'Sprinter', type: 'Van',    depot: 'Site A', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '4',  registration: 'PQ78 RST', make: 'Isuzu',      model: 'D-Max',    type: 'Pickup', depot: 'Site C', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '5',  registration: 'UV90 WXY', make: 'Renault',    model: 'Master',   type: 'Van',    depot: 'Site B', documents: 4, expiring: 2, expired: 0, status: 'expiring' },
  { id: '6',  registration: 'YZ11 ABC', make: 'Ford',       model: 'Ranger',   type: 'Pickup', depot: 'Site A', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '7',  registration: 'DE22 FGH', make: 'Vauxhall',   model: 'Movano',   type: 'Van',    depot: 'Depot',  documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '8',  registration: 'IJ33 KLM', make: 'Mercedes',   model: 'Vito',     type: 'Van',    depot: 'Site C', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '9',  registration: 'NO44 PQR', make: 'Fiat',       model: 'Ducato',   type: 'Van',    depot: 'Site B', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '10', registration: 'ST55 UVW', make: 'Toyota',     model: 'Hilux',    type: 'Pickup', depot: 'Site A', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '11', registration: 'XY66 ZAB', make: 'Ford',       model: 'Transit',  type: 'Van',    depot: 'Depot',  documents: 3, expiring: 2, expired: 0, status: 'expiring' },
  { id: '12', registration: 'CD77 EFG', make: 'Volkswagen', model: 'Transporter', type: 'Van', depot: 'Site C', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '13', registration: 'HI88 JKL', make: 'Renault',    model: 'Trafic',   type: 'Van',    depot: 'Site A', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '14', registration: 'MN99 OPQ', make: 'Isuzu',      model: 'D-Max',    type: 'Pickup', depot: 'Site B', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '15', registration: 'RS10 TUV', make: 'Mercedes',   model: 'Sprinter', type: 'Van',    depot: 'Depot',  documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '16', registration: 'WX11 YZA', make: 'Ford',       model: 'Transit',  type: 'Van',    depot: 'Site C', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '17', registration: 'BC12 DEF', make: 'Vauxhall',   model: 'Vivaro',   type: 'Van',    depot: 'Site A', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '18', registration: 'GH13 IJK', make: 'Peugeot',    model: 'Boxer',    type: 'Van',    depot: 'Site B', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '19', registration: 'LM14 NOP', make: 'Toyota',     model: 'Proace',   type: 'Van',    depot: 'Site C', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '20', registration: 'QR15 STU', make: 'Ford',       model: 'Ranger',   type: 'Pickup', depot: 'Depot',  documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '21', registration: 'VW16 XYZ', make: 'Volkswagen', model: 'Crafter',  type: 'Van',    depot: 'Site A', documents: 3, expiring: 2, expired: 0, status: 'expiring' },
  { id: '22', registration: 'AB17 CDE', make: 'Mercedes',   model: 'Actros',   type: 'Truck',  depot: 'Depot',  documents: 5, expiring: 0, expired: 0, status: 'valid' },
  { id: '23', registration: 'FG18 HIJ', make: 'Volvo',      model: 'FH',       type: 'Truck',  depot: 'Depot',  documents: 5, expiring: 1, expired: 0, status: 'expiring' },
  { id: '24', registration: 'KL19 MNO', make: 'DAF',        model: 'XF',       type: 'Truck',  depot: 'Depot',  documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '25', registration: 'PQ20 RST', make: 'JCB',        model: '3CX',      type: 'Plant',  depot: 'Site A', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '26', registration: 'UV21 WXY', make: 'Caterpillar',model: '320',      type: 'Plant',  depot: 'Site B', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '27', registration: 'YZ22 ABC', make: 'Komatsu',    model: 'PC200',    type: 'Plant',  depot: 'Site C', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '28', registration: 'DE23 FGH', make: 'Ford',       model: 'Transit',  type: 'Van',    depot: 'Site A', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '29', registration: 'IJ24 KLM', make: 'Vauxhall',   model: 'Movano',   type: 'Van',    depot: 'Site B', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '30', registration: 'NO25 PQR', make: 'Renault',    model: 'Master',   type: 'Van',    depot: 'Depot',  documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '31', registration: 'ST26 UVW', make: 'Volkswagen', model: 'Caddy',    type: 'Van',    depot: 'Site C', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '32', registration: 'XY27 ZAB', make: 'Mercedes',   model: 'Vito',     type: 'Van',    depot: 'Site A', documents: 4, expiring: 0, expired: 1, status: 'expired' },
  { id: '33', registration: 'CD28 EFG', make: 'Toyota',     model: 'Hilux',    type: 'Pickup', depot: 'Site B', documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '34', registration: 'HI29 JKL', make: 'Isuzu',      model: 'D-Max',    type: 'Pickup', depot: 'Site C', documents: 4, expiring: 1, expired: 0, status: 'expiring' },
  { id: '35', registration: 'MN30 OPQ', make: 'Ford',       model: 'Ranger',   type: 'Pickup', depot: 'Depot',  documents: 3, expiring: 0, expired: 0, status: 'valid' },
  { id: '36', registration: 'RS31 TUV', make: 'Peugeot',    model: 'Partner',  type: 'Van',    depot: 'Site A', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '37', registration: 'WX32 YZA', make: 'Citroen',    model: 'Berlingo', type: 'Van',    depot: 'Site B', documents: 3, expiring: 2, expired: 0, status: 'expiring' },
  { id: '38', registration: 'BC33 DEF', make: 'Ford',       model: 'Transit',  type: 'Van',    depot: 'Site C', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '39', registration: 'GH34 IJK', make: 'Mercedes',   model: 'Sprinter', type: 'Van',    depot: 'Site A', documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '40', registration: 'LM35 NOP', make: 'Volkswagen', model: 'Transporter', type: 'Van', depot: 'Site B', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '41', registration: 'QR36 STU', make: 'Vauxhall',   model: 'Movano',   type: 'Van',    depot: 'Depot',  documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '42', registration: 'VW37 XYZ', make: 'Renault',    model: 'Master',   type: 'Van',    depot: 'Site C', documents: 2, expiring: 0, expired: 0, status: 'valid' },
  { id: '43', registration: 'AB38 CDE', make: 'Ford',       model: 'Transit',  type: 'Van',    depot: 'Site A', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '44', registration: 'FG39 HIJ', make: 'Toyota',     model: 'Proace',   type: 'Van',    depot: 'Site B', documents: 3, expiring: 1, expired: 0, status: 'expiring' },
  { id: '45', registration: 'KL40 MNO', make: 'Mercedes',   model: 'Vito',     type: 'Van',    depot: 'Site C', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '46', registration: 'PQ41 RST', make: 'Fiat',       model: 'Ducato',   type: 'Van',    depot: 'Depot',  documents: 3, expiring: 0, expired: 1, status: 'expired' },
  { id: '47', registration: 'UV42 WXY', make: 'Volkswagen', model: 'Crafter',  type: 'Van',    depot: 'Site A', documents: 4, expiring: 0, expired: 0, status: 'valid' },
  { id: '48', registration: 'YZ43 ABC', make: 'Ford',       model: 'Ranger',   type: 'Pickup', depot: 'Site B', documents: 3, expiring: 2, expired: 0, status: 'expiring' },
];

const PER_PAGE = 10;
const breakdown = [
  { label: 'VANS',    value: 32 },
  { label: 'PICKUPS', value: 8  },
  { label: 'TRUCKS',  value: 5  },
  { label: 'PLANT',   value: 3  },
];

function StatusBadge({ status }: { status: string }) {
  if (status === 'valid')    return <span className="badge badge-valid">Valid</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring Soon</span>;
  if (status === 'expired')  return <span className="badge badge-expired">Expired</span>;
  return <span className="badge badge-missing">Unknown</span>;
}

export default function VehiclesPage() {
  const [page, setPage] = useState(1);
  const total = ALL_VEHICLES.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const visible = ALL_VEHICLES.slice(start, start + PER_PAGE);

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL VEHICLES', value: String(total) },
            { label: 'COMPLIANT',      value: String(ALL_VEHICLES.filter(v => v.status === 'valid').length) },
            { label: 'EXPIRING SOON',  value: String(ALL_VEHICLES.filter(v => v.status === 'expiring').length) },
            { label: 'NON-COMPLIANT',  value: String(ALL_VEHICLES.filter(v => v.status === 'expired').length), urgent: true },
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
              {visible.map((v) => (
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
