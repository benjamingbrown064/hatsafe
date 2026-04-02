import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import {
  PencilIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowLeftIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  QrCodeIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function AssetProfilePage({ params }: { params: { id: string } }) {
  const asset = {
    id: params.id,
    assetId: 'SCAF-001',
    name: 'Aluminium Tower Scaffold',
    type: 'Scaffold',
    manufacturer: 'Boss',
    model: 'Zone 1',
    serialNumber: 'SN-2024-8721',
    purchaseDate: '2024-03-15',
    location: 'Site A – Manchester',
    site: 'Site A',
    owner: 'Mike Davies',
    condition: 'Good',
  };

  const documents = [
    { id: '1', title: 'LOLER Inspection',   issuer: 'Safety Inspections Ltd', certificateNumber: 'LOLER2024-042',     issueDate: '2024-11-15', expiryDate: '2026-03-20', status: 'expiring', daysUntilExpiry: 12 },
    { id: '2', title: 'Safety Certificate', issuer: 'Boss Equipment',          certificateNumber: 'CERT-SCAF-001-2024', issueDate: '2024-03-15', expiryDate: '2027-03-15', status: 'valid',    daysUntilExpiry: 372 },
    { id: '3', title: 'User Manual',         issuer: 'Boss Equipment',          certificateNumber: 'MAN-ZONE1-2024',    issueDate: '2024-03-15', expiryDate: null,          status: 'valid',    daysUntilExpiry: null },
  ];

  const maintenance = [
    { date: '2024-11-15', type: 'LOLER Inspection', performed: 'Safety Inspections Ltd', result: 'Passed',    notes: 'All components checked and verified' },
    { date: '2024-08-10', type: 'Routine Service',   performed: 'Site A Team',            result: 'Completed', notes: 'Cleaned and lubricated all moving parts' },
    { date: '2024-05-15', type: 'Safety Check',      performed: 'Mike Davies',            result: 'Passed',    notes: 'Visual inspection – no issues found' },
  ];

  const hasExpired  = documents.some(d => d.status === 'expired');
  const hasExpiring = documents.some(d => d.status === 'expiring');
  const complianceStatus = hasExpired ? 'expired' : hasExpiring ? 'expiring' : 'valid';

  function DocBadge({ status, days }: { status: string; days: number | null }) {
    if (days === null)      return <span className="badge badge-valid">No Expiry</span>;
    if (status === 'valid')    return <span className="badge badge-valid">Valid · {days}d</span>;
    if (status === 'expiring') return <span className="badge badge-expiring">Expiring · {days}d</span>;
    return <span className="badge badge-expired">Overdue {Math.abs(days!)}d</span>;
  }

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Back */}
        <Link href="/assets" className="inline-flex items-center gap-2 text-sm" style={{ color: '#474747' }}>
          <ArrowLeftIcon className="w-4 h-4" strokeWidth={1.5} />
          Back to Assets
        </Link>

        {/* Header card */}
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#F3F3F3', borderRadius: '6px' }}>
                <WrenchScrewdriverIcon className="w-7 h-7" style={{ color: '#474747' }} strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1C1C' }}>{asset.assetId}</h1>
                  <span className="badge badge-outline">{asset.condition}</span>
                  {complianceStatus === 'valid'    && <span className="badge badge-valid">Compliant</span>}
                  {complianceStatus === 'expiring' && <span className="badge badge-expiring">Expiring Soon</span>}
                  {complianceStatus === 'expired'  && <span className="badge badge-expired">Non-Compliant</span>}
                </div>
                <p className="mt-1" style={{ color: '#474747', fontSize: '15px' }}>{asset.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPinIcon className="w-3.5 h-3.5" style={{ color: '#A3A3A3' }} strokeWidth={1.5} />
                  <span className="text-xs" style={{ color: '#A3A3A3' }}>{asset.location}</span>
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

            {/* Details */}
            <div className="card">
              <div className="label-sm mb-4">ASSET DETAILS</div>
              <dl className="space-y-3">
                {[
                  { label: 'Asset ID',      value: asset.assetId,       mono: true },
                  { label: 'Type',          value: asset.type },
                  { label: 'Manufacturer',  value: asset.manufacturer },
                  { label: 'Model',         value: asset.model },
                  { label: 'Serial No.',    value: asset.serialNumber,  mono: true },
                  { label: 'Purchase Date', value: asset.purchaseDate },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt style={{ fontSize: '12px', color: '#A3A3A3', flexShrink: 0 }}>{row.label}</dt>
                    <dd style={{ fontSize: '13px', color: '#1A1C1C', fontWeight: 500, textAlign: 'right', fontFamily: row.mono ? 'monospace' : 'inherit' }}>
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Location */}
            <div className="card">
              <div className="label-sm mb-4">LOCATION & ASSIGNMENT</div>
              <dl className="space-y-3">
                {[
                  { label: 'Location', value: asset.location },
                  { label: 'Site',     value: asset.site },
                  { label: 'Owner',    value: asset.owner },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt style={{ fontSize: '12px', color: '#A3A3A3' }}>{row.label}</dt>
                    <dd style={{ fontSize: '13px', color: '#1A1C1C', fontWeight: 500, textAlign: 'right' }}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Compliance summary */}
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
                  <h2 style={{ fontSize: '1rem' }}>Documents & Certifications</h2>
                </div>
                <button className="btn btn-primary flex items-center gap-2" style={{ fontSize: '12px', padding: '7px 12px' }}>
                  <PlusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                  Upload
                </button>
              </div>
              <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                {documents.map((doc) => (
                  <div key={doc.id} className="px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
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
                              <div className="label-sm" style={{ fontSize: '9px' }}>ISSUE DATE</div>
                              <div className="text-xs" style={{ color: '#474747' }}>{doc.issueDate}</div>
                            </div>
                            {doc.expiryDate && (
                              <div>
                                <div className="label-sm" style={{ fontSize: '9px' }}>EXPIRY DATE</div>
                                <div className="text-xs font-medium" style={{ color: '#1A1C1C' }}>{doc.expiryDate}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4" style={{ paddingLeft: '52px' }}>
                      <button className="btn btn-secondary flex items-center gap-1.5" style={{ fontSize: '11px', padding: '5px 10px' }}>
                        <ArrowDownTrayIcon className="w-3 h-3" strokeWidth={2} />
                        Download
                      </button>
                      {doc.expiryDate && (
                        <button className="btn btn-ghost flex items-center gap-1.5" style={{ fontSize: '11px', padding: '5px 10px' }}>
                          <ArrowUpTrayIcon className="w-3 h-3" strokeWidth={2} />
                          Upload Renewal
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance history */}
            <div className="card-flush">
              <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div className="label-sm mb-1">HISTORY</div>
                <h2 style={{ fontSize: '1rem' }}>Maintenance Log</h2>
              </div>
              <div className="p-6 space-y-4">
                {maintenance.map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                      <CheckCircleIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{m.type}</span>
                        <span className="badge badge-outline" style={{ fontSize: '10px' }}>{m.result}</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>
                        {m.date} · {m.performed}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#474747' }}>{m.notes}</p>
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

        {/* Asset tracking — no emoji */}
        <div className="card">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="label-sm mb-2">ASSET TRACKING</div>
              <h2>QR Code</h2>
              <p className="mt-1">Scan to quickly pull up this asset's compliance record on site.</p>
            </div>
            <div className="w-28 h-28 flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#F3F3F3', borderRadius: '6px', border: '1px solid rgba(198,198,198,0.4)' }}>
              <QrCodeIcon className="w-14 h-14" style={{ color: '#C6C6C6' }} strokeWidth={1} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button className="btn btn-secondary flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.5} />
              Download QR
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <PrinterIcon className="w-4 h-4" strokeWidth={1.5} />
              Print Label
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
