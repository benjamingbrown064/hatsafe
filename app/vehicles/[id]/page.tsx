import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import {
  PencilIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowLeftIcon,
  TruckIcon,
  MapPinIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';

export default function VehicleProfilePage({ params }: { params: { id: string } }) {
  const vehicle = {
    id: params.id,
    registration: 'AB12 CDE',
    make: 'Ford',
    model: 'Transit',
    type: 'Van',
    year: '2022',
    color: 'White',
    owner: 'Company Fleet',
    depot: 'Site A – Manchester',
    mileage: '45,231',
    lastService: '2026-01-15',
  };

  const documents = [
    { id: '1', title: 'MOT Certificate',  issuer: 'Quick Fit MOT Centre', certificateNumber: 'MOT987654',        issueDate: '2025-02-10', expiryDate: '2026-03-15', status: 'expiring', daysUntilExpiry: 7 },
    { id: '2', title: 'Vehicle Insurance',issuer: 'Insurance Co Ltd',      certificateNumber: 'INS123789',        issueDate: '2025-01-01', expiryDate: '2026-01-01', status: 'valid',    daysUntilExpiry: 298 },
    { id: '3', title: 'Service Record',   issuer: 'Ford Service Centre',   certificateNumber: 'SVC-2026-001',     issueDate: '2026-01-15', expiryDate: '2026-07-15', status: 'valid',    daysUntilExpiry: 129 },
    { id: '4', title: 'Road Tax',         issuer: 'DVLA',                  certificateNumber: 'TAX-AB12CDE-2025', issueDate: '2025-03-01', expiryDate: '2026-03-01', status: 'valid',    daysUntilExpiry: 283 },
  ];

  const serviceHistory = [
    { date: '2026-01-15', type: 'Full Service',  mileage: '45,000', location: 'Ford Service Centre', cost: '£245' },
    { date: '2025-07-10', type: 'MOT Test',       mileage: '38,500', location: 'Quick Fit MOT',       cost: '£54.85' },
    { date: '2025-01-08', type: 'Full Service',  mileage: '33,200', location: 'Ford Service Centre', cost: '£285' },
  ];

  const hasExpired  = documents.some(d => d.status === 'expired');
  const hasExpiring = documents.some(d => d.status === 'expiring');
  const complianceStatus = hasExpired ? 'expired' : hasExpiring ? 'expiring' : 'valid';

  function DocBadge({ status, days }: { status: string; days: number }) {
    if (status === 'valid')    return <span className="badge badge-valid">Valid · {days}d</span>;
    if (status === 'expiring') return <span className="badge badge-expiring">Expiring · {days}d</span>;
    return <span className="badge badge-expired">Overdue {Math.abs(days)}d</span>;
  }

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Back */}
        <Link href="/vehicles" className="inline-flex items-center gap-2 text-sm" style={{ color: '#474747' }}>
          <ArrowLeftIcon className="w-4 h-4" strokeWidth={1.5} />
          Back to Vehicles
        </Link>

        {/* Header */}
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#F3F3F3', borderRadius: '6px' }}>
                <TruckIcon className="w-7 h-7" style={{ color: '#474747' }} strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1C1C' }}>{vehicle.registration}</h1>
                  <span className="badge badge-outline">{vehicle.type}</span>
                  {complianceStatus === 'valid'    && <span className="badge badge-valid">Compliant</span>}
                  {complianceStatus === 'expiring' && <span className="badge badge-expiring">Expiring Soon</span>}
                  {complianceStatus === 'expired'  && <span className="badge badge-expired">Non-Compliant</span>}
                </div>
                <p className="mt-1" style={{ color: '#474747', fontSize: '15px' }}>{vehicle.make} {vehicle.model} · {vehicle.year}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPinIcon className="w-3.5 h-3.5" style={{ color: '#A3A3A3' }} strokeWidth={1.5} />
                  <span className="text-xs" style={{ color: '#A3A3A3' }}>{vehicle.depot}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="btn btn-secondary flex items-center gap-2">
                <PencilIcon className="w-4 h-4" strokeWidth={1.5} />
                Edit
              </button>
              <button className="btn btn-primary flex items-center gap-2">
                <PlusIcon className="w-4 h-4" strokeWidth={2} />
                Add Document
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left sidebar */}
          <div className="space-y-4">
            <div className="card">
              <div className="label-sm mb-4">VEHICLE DETAILS</div>
              <dl className="space-y-3">
                {[
                  { label: 'Make & Model', value: `${vehicle.make} ${vehicle.model}` },
                  { label: 'Year',         value: vehicle.year },
                  { label: 'Colour',       value: vehicle.color },
                  { label: 'Type',         value: vehicle.type },
                  { label: 'Mileage',      value: `${vehicle.mileage} mi` },
                  { label: 'Last Service', value: vehicle.lastService },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt style={{ fontSize: '12px', color: '#A3A3A3', flexShrink: 0 }}>{row.label}</dt>
                    <dd style={{ fontSize: '13px', color: '#1A1C1C', fontWeight: 500, textAlign: 'right' }}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="card">
              <div className="label-sm mb-4">LOCATION</div>
              <dl className="space-y-3">
                {[
                  { label: 'Owner', value: vehicle.owner },
                  { label: 'Depot', value: vehicle.depot },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt style={{ fontSize: '12px', color: '#A3A3A3' }}>{row.label}</dt>
                    <dd style={{ fontSize: '13px', color: '#1A1C1C', fontWeight: 500, textAlign: 'right' }}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="card">
              <div className="label-sm mb-4">COMPLIANCE SUMMARY</div>
              <div className="space-y-3">
                {[
                  { label: 'Total Documents', value: documents.length },
                  { label: 'Valid',           value: documents.filter(d => d.status === 'valid').length },
                  { label: 'Expiring Soon',   value: documents.filter(d => d.status === 'expiring').length },
                  { label: 'Expired',         value: documents.filter(d => d.status === 'expired').length },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span style={{ fontSize: '13px', color: '#474747' }}>{row.label}</span>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#1A1C1C' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — documents */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card-flush">
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div>
                  <div className="label-sm mb-1">ATTACHED</div>
                  <h2 style={{ fontSize: '1rem' }}>Documents</h2>
                </div>
                <button className="btn btn-primary flex items-center gap-2" style={{ fontSize: '12px', padding: '7px 12px' }}>
                  <PlusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                  Upload
                </button>
              </div>
              <div>
                {documents.map((doc) => (
                  <div key={doc.id} className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                        <DocumentTextIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <h3 className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{doc.title}</h3>
                          <DocBadge status={doc.status} days={doc.daysUntilExpiry} />
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#A3A3A3' }}>{doc.issuer}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
                          <div>
                            <div className="label-sm" style={{ fontSize: '9px' }}>CERT. NO.</div>
                            <div className="text-xs font-mono" style={{ color: '#474747' }}>{doc.certificateNumber}</div>
                          </div>
                          <div>
                            <div className="label-sm" style={{ fontSize: '9px' }}>EXPIRY DATE</div>
                            <div className="text-xs font-medium" style={{ color: '#1A1C1C' }}>{doc.expiryDate}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="btn btn-secondary flex items-center gap-1.5" style={{ fontSize: '11px', padding: '5px 10px' }}>
                            <ArrowDownTrayIcon className="w-3 h-3" strokeWidth={2} />
                            Download
                          </button>
                          <button className="btn btn-ghost flex items-center gap-1.5" style={{ fontSize: '11px', padding: '5px 10px' }}>
                            <ArrowUpTrayIcon className="w-3 h-3" strokeWidth={2} />
                            Upload Renewal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service history */}
            <div className="card-flush">
              <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div className="label-sm mb-1">HISTORY</div>
                <h2 style={{ fontSize: '1rem' }}>Service Log</h2>
              </div>
              <div className="p-6 space-y-4">
                {serviceHistory.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                      <WrenchIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{s.type}</span>
                        <span className="text-sm font-semibold" style={{ color: '#1A1C1C' }}>{s.cost}</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>
                        {s.date} · {s.mileage} mi · {s.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-5">
                <button className="btn btn-secondary w-full text-sm">View Full History</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
