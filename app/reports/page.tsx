'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  ArrowDownTrayIcon,
  DocumentChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  TableCellsIcon,
  PlusIcon,
  UsersIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { exportCsv } from '@/lib/exportCsv';

// ── Shared mock data ──────────────────────────────────────────────────────────
const ALL_PEOPLE = [
  { Name: 'John Smith',    Role: 'Carpenter',    Team: 'Site A', Documents: 3, Expiring: 1, Expired: 0, Status: 'expiring' },
  { Name: 'Sarah Johnson', Role: 'Electrician',  Team: 'Site B', Documents: 5, Expiring: 0, Expired: 0, Status: 'valid' },
  { Name: 'Mike Davies',   Role: 'Site Manager', Team: 'Site A', Documents: 4, Expiring: 0, Expired: 1, Status: 'expired' },
  { Name: 'Emma Wilson',   Role: 'Labourer',     Team: 'Site C', Documents: 2, Expiring: 0, Expired: 0, Status: 'valid' },
  { Name: 'James Brown',   Role: 'Scaffolder',   Team: 'Site B', Documents: 4, Expiring: 2, Expired: 0, Status: 'expiring' },
];

const ALL_VEHICLES = [
  { Registration: 'AB12 CDE', Make: 'Ford',       Model: 'Transit',  Type: 'Van',    Depot: 'Site A', Documents: 4, Expiring: 1, Expired: 0, Status: 'expiring' },
  { Registration: 'FG34 HIJ', Make: 'Volkswagen', Model: 'Caddy',    Type: 'Van',    Depot: 'Site B', Documents: 3, Expiring: 0, Expired: 0, Status: 'valid' },
  { Registration: 'KL56 MNO', Make: 'Mercedes',   Model: 'Sprinter', Type: 'Van',    Depot: 'Site A', Documents: 4, Expiring: 0, Expired: 1, Status: 'expired' },
  { Registration: 'PQ78 RST', Make: 'Isuzu',      Model: 'D-Max',    Type: 'Pickup', Depot: 'Site C', Documents: 3, Expiring: 0, Expired: 0, Status: 'valid' },
  { Registration: 'UV90 WXY', Make: 'Renault',    Model: 'Master',   Type: 'Van',    Depot: 'Site B', Documents: 4, Expiring: 2, Expired: 0, Status: 'expiring' },
];

const ALL_ASSETS = [
  { 'Asset ID': 'SCAF-001', Name: 'Aluminium Tower Scaffold', Type: 'Scaffold',   Location: 'Site A', Documents: 3, Expiring: 1, Expired: 0, Status: 'expiring' },
  { 'Asset ID': 'COMP-023', Name: 'Air Compressor 50L',       Type: 'Compressor', Location: 'Depot',  Documents: 2, Expiring: 0, Expired: 0, Status: 'valid' },
  { 'Asset ID': 'LADD-015', Name: 'Extension Ladder 6m',      Type: 'Ladder',     Location: 'Site B', Documents: 2, Expiring: 0, Expired: 1, Status: 'expired' },
  { 'Asset ID': 'LIFT-008', Name: 'Scissor Lift 8m',          Type: 'Access',     Location: 'Site C', Documents: 4, Expiring: 0, Expired: 0, Status: 'valid' },
  { 'Asset ID': 'TOOL-042', Name: 'Portable Angle Grinder',   Type: 'Power Tool', Location: 'Site A', Documents: 1, Expiring: 1, Expired: 0, Status: 'expiring' },
];

const ALL_DOCS = [
  { Title: 'CSCS Card',           Entity: 'John Smith',    'Entity Type': 'person',  'Certificate No': 'CSCS123456',    'Issue Date': '2024-01-15', 'Expiry Date': '2029-01-15', Status: 'valid',    'Days Until Expiry': 1095 },
  { Title: 'MOT Certificate',     Entity: 'AB12 CDE',      'Entity Type': 'vehicle', 'Certificate No': 'MOT987654',     'Issue Date': '2025-02-10', 'Expiry Date': '2026-03-15', Status: 'expiring', 'Days Until Expiry': 7 },
  { Title: 'IPAF Certificate',    Entity: 'Sarah Johnson', 'Entity Type': 'person',  'Certificate No': 'IPAF456789',    'Issue Date': '2023-06-20', 'Expiry Date': '2026-02-01', Status: 'expired',  'Days Until Expiry': -37 },
  { Title: 'LOLER Inspection',    Entity: 'SCAF-001',      'Entity Type': 'asset',   'Certificate No': 'LOLER2024-042', 'Issue Date': '2024-11-15', 'Expiry Date': '2026-04-20', Status: 'expiring', 'Days Until Expiry': 12 },
  { Title: 'Vehicle Insurance',   Entity: 'FG34 HIJ',      'Entity Type': 'vehicle', 'Certificate No': 'INS123789',     'Issue Date': '2025-01-01', 'Expiry Date': '2026-01-01', Status: 'valid',    'Days Until Expiry': 298 },
  { Title: 'First Aid',           Entity: 'Mike Davies',   'Entity Type': 'person',  'Certificate No': 'FA-2024-0821',  'Issue Date': '2024-04-01', 'Expiry Date': '2027-04-01', Status: 'valid',    'Days Until Expiry': 365 },
  { Title: 'PAT Test',            Entity: 'TOOL-042',      'Entity Type': 'asset',   'Certificate No': 'PAT-042-2025',  'Issue Date': '2025-01-10', 'Expiry Date': '2026-01-10', Status: 'valid',    'Days Until Expiry': 285 },
  { Title: 'Road Tax',            Entity: 'KL56 MNO',      'Entity Type': 'vehicle', 'Certificate No': 'TAX-KL56-2025', 'Issue Date': '2025-03-01', 'Expiry Date': '2026-03-01', Status: 'expiring', 'Days Until Expiry': 14 },
  { Title: 'CSCS Card',           Entity: 'Emma Wilson',   'Entity Type': 'person',  'Certificate No': 'CSCS789012',    'Issue Date': '2023-09-01', 'Expiry Date': '2028-09-01', Status: 'valid',    'Days Until Expiry': 880 },
  { Title: 'Safety Certificate',  Entity: 'LIFT-008',      'Entity Type': 'asset',   'Certificate No': 'CERT-LIFT-008', 'Issue Date': '2024-03-15', 'Expiry Date': '2027-03-15', Status: 'valid',    'Days Until Expiry': 372 },
];

// ── Report generators ─────────────────────────────────────────────────────────
function genComplianceSummary() {
  const rows = [
    { Category: 'People',   Total: ALL_PEOPLE.length,   Compliant: ALL_PEOPLE.filter(r => r.Status === 'valid').length,   Expiring: ALL_PEOPLE.filter(r => r.Status === 'expiring').length,   NonCompliant: ALL_PEOPLE.filter(r => r.Status === 'expired').length   },
    { Category: 'Vehicles', Total: ALL_VEHICLES.length, Compliant: ALL_VEHICLES.filter(r => r.Status === 'valid').length, Expiring: ALL_VEHICLES.filter(r => r.Status === 'expiring').length, NonCompliant: ALL_VEHICLES.filter(r => r.Status === 'expired').length },
    { Category: 'Assets',   Total: ALL_ASSETS.length,   Compliant: ALL_ASSETS.filter(r => r.Status === 'valid').length,   Expiring: ALL_ASSETS.filter(r => r.Status === 'expiring').length,   NonCompliant: ALL_ASSETS.filter(r => r.Status === 'expired').length   },
  ];
  exportCsv(`hatsafe-compliance-summary-${today()}.csv`, rows);
}

function genExpiryReport() {
  const rows = ALL_DOCS
    .filter(d => d.Status === 'expiring' || d.Status === 'expired')
    .sort((a, b) => (a['Days Until Expiry'] as number) - (b['Days Until Expiry'] as number));
  exportCsv(`hatsafe-expiry-report-${today()}.csv`, rows);
}

function genMissingDocs() {
  // People with fewer than 3 documents flagged as potentially missing
  const rows = ALL_PEOPLE
    .filter(p => p.Documents < 3)
    .map(p => ({ Name: p.Name, Role: p.Role, Team: p.Team, 'Documents Held': p.Documents, 'Suggested Action': 'Review required documents' }));
  exportCsv(`hatsafe-missing-documents-${today()}.csv`, rows);
}

function genCoverage() {
  const byType = (arr: typeof ALL_DOCS, type: string) => arr.filter(d => d['Entity Type'] === type);
  const rows = [
    { 'Entity Type': 'People',   'Total Docs': byType(ALL_DOCS, 'person').length,  Valid: byType(ALL_DOCS, 'person').filter(d => d.Status === 'valid').length,   Expiring: byType(ALL_DOCS, 'person').filter(d => d.Status === 'expiring').length,   Expired: byType(ALL_DOCS, 'person').filter(d => d.Status === 'expired').length },
    { 'Entity Type': 'Vehicles', 'Total Docs': byType(ALL_DOCS, 'vehicle').length, Valid: byType(ALL_DOCS, 'vehicle').filter(d => d.Status === 'valid').length,  Expiring: byType(ALL_DOCS, 'vehicle').filter(d => d.Status === 'expiring').length,  Expired: byType(ALL_DOCS, 'vehicle').filter(d => d.Status === 'expired').length },
    { 'Entity Type': 'Assets',   'Total Docs': byType(ALL_DOCS, 'asset').length,   Valid: byType(ALL_DOCS, 'asset').filter(d => d.Status === 'valid').length,    Expiring: byType(ALL_DOCS, 'asset').filter(d => d.Status === 'expiring').length,    Expired: byType(ALL_DOCS, 'asset').filter(d => d.Status === 'expired').length   },
  ];
  exportCsv(`hatsafe-document-coverage-${today()}.csv`, rows);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const REPORT_GENERATORS: Record<string, () => void> = {
  'Compliance Summary': genComplianceSummary,
  'Expiry Report':      genExpiryReport,
  'Missing Documents':  genMissingDocs,
  'Document Coverage':  genCoverage,
};

// ── Component ──────────────────────────────────────────────────────────────────
const reportTypes = [
  {
    Icon: DocumentChartBarIcon,
    title: 'Compliance Summary',
    desc: 'Overall compliance status across all entities',
    params: [
      { label: 'DATE RANGE',   value: 'All Time' },
      { label: 'ENTITY TYPES', value: 'All Types' },
      { label: 'FORMAT',       value: 'CSV' },
    ],
  },
  {
    Icon: CalendarDaysIcon,
    title: 'Expiry Report',
    desc: 'Documents expiring or already expired',
    params: [
      { label: 'TIMEFRAME',       value: 'All' },
      { label: 'INCLUDE EXPIRED', value: 'Yes' },
      { label: 'FORMAT',          value: 'CSV' },
    ],
  },
  {
    Icon: ClockIcon,
    title: 'Missing Documents',
    desc: 'Entities with fewer documents than expected',
    params: [
      { label: 'ENTITY TYPE',    value: 'People' },
      { label: 'THRESHOLD',      value: '< 3 docs' },
      { label: 'FORMAT',         value: 'CSV' },
    ],
  },
  {
    Icon: TableCellsIcon,
    title: 'Document Coverage',
    desc: 'Coverage breakdown by entity type',
    params: [
      { label: 'GROUP BY',       value: 'Entity Type' },
      { label: 'INCLUDE CHARTS', value: 'Yes' },
      { label: 'FORMAT',         value: 'CSV' },
    ],
  },
];

const recentReports = [
  { name: 'Compliance Summary – April 2026', date: '2 hours ago',  size: '2.4 KB', format: 'CSV', generator: 'Compliance Summary' },
  { name: 'Expiry Report – Q1 2026',          date: 'Yesterday',    size: '1.1 KB', format: 'CSV', generator: 'Expiry Report' },
  { name: 'Missing Documents',                date: '3 days ago',   size: '0.8 KB', format: 'CSV', generator: 'Missing Documents' },
  { name: 'Document Coverage – All Entities', date: '1 week ago',   size: '0.6 KB', format: 'CSV', generator: 'Document Coverage' },
];

const scheduled = [
  { name: 'Weekly Compliance Digest',  frequency: 'Every Monday 9:00 AM',  recipients: 'admin@company.com' },
  { name: 'Monthly Expiry Summary',    frequency: 'First of each month',    recipients: 'managers@company.com' },
];

const rawExports = [
  { label: 'All People',    Icon: UsersIcon,               fn: () => exportCsv(`hatsafe-people-${today()}.csv`, ALL_PEOPLE) },
  { label: 'All Vehicles',  Icon: TruckIcon,               fn: () => exportCsv(`hatsafe-vehicles-${today()}.csv`, ALL_VEHICLES) },
  { label: 'All Assets',    Icon: WrenchScrewdriverIcon,   fn: () => exportCsv(`hatsafe-assets-${today()}.csv`, ALL_ASSETS) },
  { label: 'All Documents', Icon: DocumentTextIcon,        fn: () => exportCsv(`hatsafe-documents-${today()}.csv`, ALL_DOCS) },
  { label: 'Audit Log',     Icon: ClipboardDocumentListIcon, fn: () => exportCsv(`hatsafe-audit-log-${today()}.csv`, [
    { Timestamp: '2026-04-02 22:00', User: 'Admin User',   Action: 'Document uploaded',   Detail: 'CSCS Card – John Smith' },
    { Timestamp: '2026-04-02 21:30', User: 'Mike Davies',  Action: 'Profile updated',     Detail: 'Team changed – Emma Wilson' },
    { Timestamp: '2026-04-01 09:15', User: 'Admin User',   Action: 'Document approved',   Detail: 'IPAF Certificate – Sarah Johnson' },
    { Timestamp: '2026-03-31 14:00', User: 'Admin User',   Action: 'Report generated',    Detail: 'Compliance Summary' },
  ]) },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated,  setGenerated]  = useState<Set<string>>(new Set());
  const [regenerating, setRegenerating] = useState<string | null>(null);

  function generate(title: string) {
    setGenerating(title);
    setTimeout(() => {
      REPORT_GENERATORS[title]?.();
      setGenerated(prev => new Set(prev).add(title));
      setGenerating(null);
    }, 800);
  }

  function regenerate(name: string, generatorKey: string) {
    setRegenerating(name);
    setTimeout(() => {
      REPORT_GENERATORS[generatorKey]?.();
      setRegenerating(null);
    }, 800);
  }

  function downloadRecent(generatorKey: string) {
    REPORT_GENERATORS[generatorKey]?.();
  }

  function exportAll() {
    rawExports.forEach(e => e.fn());
  }

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL DOCUMENTS', value: String(ALL_DOCS.length) },
            { label: 'COMPLIANCE RATE', value: `${Math.round(ALL_DOCS.filter(d => d.Status === 'valid').length / ALL_DOCS.length * 100)}%` },
            { label: 'EXPIRING SOON',   value: String(ALL_DOCS.filter(d => d.Status === 'expiring').length) },
            { label: 'EXPIRED',         value: String(ALL_DOCS.filter(d => d.Status === 'expired').length), urgent: true },
          ].map((s) => (
            <div key={s.label} className="card"
              style={(s as any).urgent ? { backgroundColor: '#000', border: 'none' } : {}}>
              <div className="stat-label" style={(s as any).urgent ? { color: 'rgba(255,255,255,0.5)' } : {}}>{s.label}</div>
              <div className="stat-value mt-2" style={(s as any).urgent ? { color: '#fff' } : {}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Generate reports */}
        <div>
          <div className="label-sm mb-4">GENERATE A REPORT</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reportTypes.map((r) => (
              <div key={r.title} className="card">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="label-sm mb-1">REPORT TYPE</div>
                    <h2 style={{ fontSize: '1rem' }}>{r.title}</h2>
                    <p className="mt-0.5" style={{ fontSize: '13px' }}>{r.desc}</p>
                  </div>
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                    <r.Icon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  {r.params.map((p) => (
                    <div key={p.label} className="flex items-center justify-between">
                      <span style={{ fontSize: '11px', color: '#A3A3A3', letterSpacing: '0.06em' }}>{p.label}</span>
                      <span style={{ fontSize: '13px', color: '#1A1C1C', fontWeight: 500 }}>{p.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-primary flex items-center gap-2 flex-1 justify-center"
                    disabled={generating === r.title}
                    style={{ opacity: generating === r.title ? 0.7 : 1 }}
                    onClick={() => generate(r.title)}>
                    {generating === r.title ? (
                      <><ArrowPathIcon className="w-4 h-4 animate-spin" strokeWidth={2} /> Generating…</>
                    ) : generated.has(r.title) ? (
                      <><CheckCircleIcon className="w-4 h-4" strokeWidth={2} /> Downloaded</>
                    ) : (
                      <><ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.5} /> Generate & Download</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reports */}
        <div className="card-flush">
          <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <div className="label-sm mb-1">HISTORY</div>
            <h2 style={{ fontSize: '1rem' }}>Recent Reports</h2>
          </div>
          <div>
            {recentReports.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: i < recentReports.length - 1 ? '1px solid #F3F3F3' : 'none' }}>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                    <DocumentChartBarIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{r.name}</div>
                    <div className="text-xs" style={{ color: '#A3A3A3' }}>{r.date} · {r.size} · {r.format}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-secondary text-xs flex items-center gap-1.5"
                    onClick={() => downloadRecent(r.generator)}>
                    <ArrowDownTrayIcon className="w-3 h-3" strokeWidth={2} />
                    Download
                  </button>
                  <button
                    className="btn btn-ghost text-xs flex items-center gap-1.5"
                    disabled={regenerating === r.name}
                    style={{ opacity: regenerating === r.name ? 0.6 : 1 }}
                    onClick={() => regenerate(r.name, r.generator)}>
                    <ArrowPathIcon className={`w-3 h-3 ${regenerating === r.name ? 'animate-spin' : ''}`} strokeWidth={2} />
                    {regenerating === r.name ? 'Regenerating…' : 'Regenerate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled reports */}
        <div className="card-flush">
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
            <div>
              <div className="label-sm mb-1">AUTOMATION</div>
              <h2 style={{ fontSize: '1rem' }}>Scheduled Reports</h2>
            </div>
            <button className="btn btn-primary flex items-center gap-2" style={{ fontSize: '12px', padding: '7px 12px' }}>
              <PlusIcon className="w-3.5 h-3.5" strokeWidth={2} />
              Schedule New
            </button>
          </div>
          <div>
            {scheduled.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: i < scheduled.length - 1 ? '1px solid #F3F3F3' : 'none' }}>
                <div>
                  <div className="font-medium text-sm" style={{ color: '#1A1C1C' }}>{s.name}</div>
                  <div className="text-xs" style={{ color: '#A3A3A3' }}>{s.frequency} · {s.recipients}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary text-xs">Edit</button>
                  <button className="btn btn-ghost text-xs" style={{ color: '#474747' }}>Disable</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Raw data export */}
        <div className="card">
          <div className="label-sm mb-1">DATA EXPORT</div>
          <h2 className="mb-1" style={{ fontSize: '1rem' }}>Export Raw Data</h2>
          <p className="mb-5" style={{ fontSize: '13px' }}>Download any dataset as a CSV for external analysis or backup</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {rawExports.map((e) => (
              <button key={e.label}
                className="btn btn-secondary flex items-center gap-2 justify-center"
                onClick={e.fn}>
                <e.Icon className="w-4 h-4" strokeWidth={1.5} />
                {e.label}
              </button>
            ))}
            <button
              className="btn btn-black flex items-center gap-2 justify-center lg:col-span-3"
              onClick={exportAll}>
              <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.5} />
              Export Everything
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
