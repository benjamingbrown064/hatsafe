'use client';

import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';
import {
  PencilIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock data keyed by id
const PEOPLE: Record<string, {
  id: string; name: string; role: string; team: string; site: string;
  manager: string; employmentStatus: string;
  contactEmail: string; contactPhone: string;
}> = {
  '1':  { id: '1',  name: 'John Smith',    role: 'Carpenter',        team: 'Site A Team', site: 'Site A – Manchester', manager: 'Mike Davies', employmentStatus: 'active', contactEmail: 'john.smith@company.com',    contactPhone: '+44 7700 900123' },
  '2':  { id: '2',  name: 'Sarah Johnson', role: 'Electrician',      team: 'Site B Team', site: 'Site B – Leeds',      manager: 'Diane Foster',employmentStatus: 'active', contactEmail: 'sarah.johnson@company.com', contactPhone: '+44 7700 900456' },
  '3':  { id: '3',  name: 'Mike Davies',   role: 'Site Manager',     team: 'Site A Team', site: 'Site A – Manchester', manager: 'Pam Dixon',   employmentStatus: 'active', contactEmail: 'mike.davies@company.com',   contactPhone: '+44 7700 900789' },
  '4':  { id: '4',  name: 'Emma Wilson',   role: 'Labourer',         team: 'Site C Team', site: 'Site C – Sheffield',  manager: 'Mike Davies', employmentStatus: 'active', contactEmail: 'emma.wilson@company.com',   contactPhone: '+44 7700 900012' },
  '5':  { id: '5',  name: 'James Brown',   role: 'Scaffolder',       team: 'Site B Team', site: 'Site B – Leeds',      manager: 'Diane Foster',employmentStatus: 'active', contactEmail: 'james.brown@company.com',   contactPhone: '+44 7700 900345' },
};

const DOCS_BY_PERSON: Record<string, Array<{
  id: string; title: string; issuer: string; certificateNumber: string;
  issueDate: string; expiryDate: string; status: string; daysUntilExpiry: number;
}>> = {
  '1': [
    { id: '1', title: 'CSCS Card',            issuer: 'CITB',               certificateNumber: 'CSCS123456',   issueDate: '2024-01-15', expiryDate: '2029-01-15', status: 'valid',    daysUntilExpiry: 1095 },
    { id: '2', title: 'IPAF Certificate',     issuer: 'IPAF',               certificateNumber: 'IPAF456789',   issueDate: '2023-06-20', expiryDate: '2026-04-19', status: 'expiring', daysUntilExpiry: 17 },
    { id: '3', title: 'First Aid Certificate',issuer: 'St John Ambulance',  certificateNumber: 'FA2024-1234',  issueDate: '2024-02-01', expiryDate: '2027-02-01', status: 'valid',    daysUntilExpiry: 703 },
  ],
  '2': [
    { id: '4', title: 'CSCS Card',            issuer: 'CITB',               certificateNumber: 'CSCS789012',   issueDate: '2023-09-01', expiryDate: '2028-09-01', status: 'valid',    daysUntilExpiry: 880 },
    { id: '5', title: 'IPAF Certificate',     issuer: 'IPAF',               certificateNumber: 'IPAF-AC-2024', issueDate: '2024-03-01', expiryDate: '2027-03-01', status: 'valid',    daysUntilExpiry: 335 },
    { id: '6', title: '18th Edition Wiring',  issuer: 'City & Guilds',      certificateNumber: 'CG-18E-2023',  issueDate: '2023-05-01', expiryDate: '2028-05-01', status: 'valid',    daysUntilExpiry: 760 },
    { id: '7', title: 'ECS Card',             issuer: 'JIB',                certificateNumber: 'ECS-SJ-2024',  issueDate: '2024-01-01', expiryDate: '2026-04-10', status: 'expiring', daysUntilExpiry: 8 },
    { id: '8', title: 'First Aid',            issuer: 'St John Ambulance',  certificateNumber: 'FA-SJ-2024',   issueDate: '2024-06-01', expiryDate: '2027-06-01', status: 'valid',    daysUntilExpiry: 425 },
  ],
  '3': [
    { id: '9',  title: 'CSCS Card',           issuer: 'CITB',               certificateNumber: 'CSCS345678',   issueDate: '2022-05-01', expiryDate: '2025-05-01', status: 'expired',  daysUntilExpiry: -330 },
    { id: '10', title: 'SMSTS',               issuer: 'CIOB',               certificateNumber: 'SMSTS-MD-2021',issueDate: '2021-09-01', expiryDate: '2026-09-01', status: 'valid',    daysUntilExpiry: 517 },
    { id: '11', title: 'First Aid',           issuer: 'St John Ambulance',  certificateNumber: 'FA-MD-2024',   issueDate: '2024-03-01', expiryDate: '2027-03-01', status: 'valid',    daysUntilExpiry: 335 },
    { id: '12', title: 'Asbestos Awareness',  issuer: 'Citrus Training',    certificateNumber: 'ASBES-2024',   issueDate: '2024-01-01', expiryDate: '2025-01-01', status: 'expired',  daysUntilExpiry: -92 },
  ],
};

const activity = [
  { action: 'Document uploaded',  detail: 'CSCS Card',         time: '2 hours ago',  user: 'Admin User' },
  { action: 'Profile updated',    detail: 'Team changed',      time: '1 day ago',    user: 'Mike Davies' },
  { action: 'Document approved',  detail: 'IPAF Certificate',  time: '3 days ago',   user: 'Admin User' },
];

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('');
}

function DocBadge({ status, days }: { status: string; days: number }) {
  if (status === 'valid')    return <span className="badge badge-valid">Valid · {days}d</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring · {days}d</span>;
  return <span className="badge badge-expired">Overdue {Math.abs(days)}d</span>;
}

export default function PersonProfilePage({ params }: { params: { id: string } }) {
  const person    = PEOPLE[params.id]    ?? PEOPLE['1'];
  const documents = DOCS_BY_PERSON[params.id] ?? DOCS_BY_PERSON['1'];

  const hasExpired  = documents.some(d => d.status === 'expired');
  const hasExpiring = documents.some(d => d.status === 'expiring');
  const complianceStatus = hasExpired ? 'expired' : hasExpiring ? 'expiring' : 'valid';

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Back */}
        <Link href="/people" className="inline-flex items-center gap-2 text-sm"
          style={{ color: '#474747', textDecoration: 'none' }}>
          <ArrowLeftIcon className="w-4 h-4" strokeWidth={1.5} />
          Back to People
        </Link>

        {/* Header */}
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 font-bold text-lg"
                style={{ backgroundColor: '#1A1C1C', borderRadius: '6px', color: '#FFFFFF' }}>
                {initials(person.name)}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1A1C1C' }}>{person.name}</h1>
                  <span className="badge badge-outline"
                    style={person.employmentStatus === 'active'
                      ? { backgroundColor: '#F3F3F3', color: '#1A1C1C', border: '1px solid #C6C6C6' }
                      : {}}>
                    {person.employmentStatus === 'active' ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  {complianceStatus === 'valid'    && <span className="badge badge-valid">Compliant</span>}
                  {complianceStatus === 'expiring' && <span className="badge badge-expiring">Expiring Soon</span>}
                  {complianceStatus === 'expired'  && <span className="badge badge-expired">Non-Compliant</span>}
                </div>
                <p className="mt-1" style={{ color: '#474747', fontSize: '15px' }}>{person.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPinIcon className="w-3.5 h-3.5" style={{ color: '#A3A3A3' }} strokeWidth={1.5} />
                  <span className="text-xs" style={{ color: '#A3A3A3' }}>{person.site}</span>
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

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left sidebar */}
          <div className="space-y-4">

            {/* Contact */}
            <div className="card">
              <div className="label-sm mb-4">CONTACT</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                    <EnvelopeIcon className="w-3.5 h-3.5" style={{ color: '#474747' }} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm" style={{ color: '#1A1C1C' }}>{person.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                    <PhoneIcon className="w-3.5 h-3.5" style={{ color: '#474747' }} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm" style={{ color: '#1A1C1C' }}>{person.contactPhone}</span>
                </div>
              </div>
            </div>

            {/* Work details */}
            <div className="card">
              <div className="label-sm mb-4">WORK DETAILS</div>
              <dl className="space-y-3">
                {[
                  { label: 'Team',    value: person.team,    Icon: UserGroupIcon },
                  { label: 'Site',    value: person.site,    Icon: MapPinIcon },
                  { label: 'Manager', value: person.manager, Icon: null },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt style={{ fontSize: '12px', color: '#A3A3A3', flexShrink: 0 }}>{row.label}</dt>
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
              <div className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div>
                  <div className="label-sm mb-1">ATTACHED</div>
                  <h2 style={{ fontSize: '1rem' }}>Documents & Certifications</h2>
                </div>
                <button className="btn btn-primary flex items-center gap-2"
                  style={{ fontSize: '12px', padding: '7px 12px' }}>
                  <PlusIcon className="w-3.5 h-3.5" strokeWidth={2} />
                  Upload
                </button>
              </div>

              {documents.length === 0 ? (
                <div className="empty-state">
                  <DocumentTextIcon className="empty-state-icon" strokeWidth={1} />
                  <div className="label-sm mb-1">NO DOCUMENTS</div>
                  <p style={{ fontSize: '13px', color: '#A3A3A3' }}>Upload the first document for this person</p>
                </div>
              ) : (
                <div>
                  {documents.map((doc, i) => (
                    <div key={doc.id} className="px-6 py-5"
                      style={{ borderBottom: i < documents.length - 1 ? '1px solid #F3F3F3' : 'none' }}>
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
                            <Link href={`/documents/${doc.id}`}
                              className="btn btn-secondary flex items-center gap-1.5"
                              style={{ fontSize: '11px', padding: '5px 10px', textDecoration: 'none', display: 'inline-flex' }}>
                              View
                            </Link>
                            <button className="btn btn-secondary flex items-center gap-1.5"
                              style={{ fontSize: '11px', padding: '5px 10px' }}>
                              <ArrowDownTrayIcon className="w-3 h-3" strokeWidth={2} />
                              Download
                            </button>
                            <button className="btn btn-ghost flex items-center gap-1.5"
                              style={{ fontSize: '11px', padding: '5px 10px' }}>
                              <ArrowUpTrayIcon className="w-3 h-3" strokeWidth={2} />
                              Upload Renewal
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="card-flush">
              <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div className="label-sm mb-1">HISTORY</div>
                <h2 style={{ fontSize: '1rem' }}>Recent Activity</h2>
              </div>
              <div className="p-6 space-y-4">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                      <ClockIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: '#1A1C1C' }}>
                        <span className="font-medium">{a.action}</span>
                        <span style={{ color: '#474747' }}> — {a.detail}</span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: '#A3A3A3' }}>
                        {a.time} · {a.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
