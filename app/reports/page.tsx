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
} from '@heroicons/react/24/outline';

const reportTypes = [
  {
    Icon: DocumentChartBarIcon,
    title: 'Compliance Summary',
    desc: 'Overall compliance status across all entities',
    params: [
      { label: 'Date Range',    value: 'All Time' },
      { label: 'Entity Types',  value: 'All Types' },
      { label: 'Format',        value: 'PDF' },
    ],
  },
  {
    Icon: CalendarDaysIcon,
    title: 'Expiry Report',
    desc: 'Documents expiring in specified timeframe',
    params: [
      { label: 'Timeframe',       value: 'Next 30 Days' },
      { label: 'Include Expired', value: 'Yes' },
      { label: 'Format',          value: 'CSV' },
    ],
  },
  {
    Icon: ClockIcon,
    title: 'Missing Documents',
    desc: 'Entities without required documents',
    params: [
      { label: 'Entity Type',     value: 'All Types' },
      { label: 'Document Types',  value: 'All Required' },
      { label: 'Format',          value: 'PDF' },
    ],
  },
  {
    Icon: TableCellsIcon,
    title: 'Document Coverage',
    desc: 'Coverage breakdown by entity type',
    params: [
      { label: 'Group By',       value: 'Entity Type' },
      { label: 'Include Charts', value: 'Yes' },
      { label: 'Format',         value: 'PDF' },
    ],
  },
];

const recent = [
  { name: 'Compliance Summary – April 2026', date: '2 hours ago',  size: '2.4 MB', format: 'PDF' },
  { name: 'Expiry Report – Q1 2026',          date: 'Yesterday',    size: '856 KB', format: 'CSV' },
  { name: 'Missing Documents',                date: '3 days ago',   size: '1.2 MB', format: 'PDF' },
  { name: 'Document Coverage – All Entities', date: '1 week ago',   size: '3.1 MB', format: 'PDF' },
];

const scheduled = [
  { name: 'Weekly Compliance Digest',  frequency: 'Every Monday 9:00 AM',  recipients: 'admin@company.com' },
  { name: 'Monthly Expiry Summary',    frequency: 'First of each month',    recipients: 'managers@company.com' },
];

const exports = [
  { label: 'All People',   Icon: UsersIcon },
  { label: 'All Vehicles', Icon: TruckIcon },
  { label: 'All Assets',   Icon: WrenchScrewdriverIcon },
  { label: 'All Documents',Icon: DocumentTextIcon },
  { label: 'Audit Log',    Icon: ClipboardDocumentListIcon },
];

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL DOCUMENTS', value: '487' },
            { label: 'COMPLIANCE RATE', value: '64%' },
            { label: 'EXPIRING SOON',   value: '98' },
            { label: 'EXPIRED',         value: '52', urgent: true },
          ].map((s) => (
            <div key={s.label} className="card"
              style={s.urgent ? { backgroundColor: '#000', border: 'none' } : {}}>
              <div className="stat-label" style={s.urgent ? { color: 'rgba(255,255,255,0.5)' } : {}}>{s.label}</div>
              <div className="stat-value mt-2" style={s.urgent ? { color: '#fff' } : {}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Report type cards */}
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
                      <span style={{ fontSize: '12px', color: '#A3A3A3' }}>{p.label}</span>
                      <span style={{ fontSize: '13px', color: '#1A1C1C', fontWeight: 500 }}>{p.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-primary flex items-center gap-2 flex-1 justify-center">
                    <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.5} />
                    Generate
                  </button>
                  <button className="btn btn-secondary text-sm">Customise</button>
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
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: i < recent.length - 1 ? '1px solid #F3F3F3' : 'none' }}>
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
                  <button className="btn btn-secondary text-xs flex items-center gap-1.5">
                    <ArrowDownTrayIcon className="w-3 h-3" strokeWidth={2} />
                    Download
                  </button>
                  <button className="btn btn-ghost text-xs">Regenerate</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled */}
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

        {/* Raw export */}
        <div className="card">
          <div className="label-sm mb-1">DATA EXPORT</div>
          <h2 className="mb-1" style={{ fontSize: '1rem' }}>Export Raw Data</h2>
          <p className="mb-5" style={{ fontSize: '13px' }}>Download all data for external analysis or backup purposes</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {exports.map((e) => (
              <button key={e.label} className="btn btn-secondary flex items-center gap-2 justify-center">
                <e.Icon className="w-4 h-4" strokeWidth={1.5} />
                {e.label}
              </button>
            ))}
            <button className="btn btn-black flex items-center gap-2 justify-center lg:col-span-3">
              <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.5} />
              Export Everything
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
