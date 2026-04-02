import AppLayout from '@/components/layout/AppLayout';
import { ChevronLeftIcon, ChevronRightIcon, ArrowDownTrayIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const currentMonth = 'April 2026';
const daysInMonth = 30;
const firstDayOfWeek = 3; // Wednesday

const expiryData: Record<number, { count: number; severity: 'low' | 'medium' | 'high' }> = {
  5:  { count: 2, severity: 'low' },
  8:  { count: 1, severity: 'high' },
  12: { count: 4, severity: 'medium' },
  15: { count: 3, severity: 'low' },
  18: { count: 1, severity: 'high' },
  22: { count: 5, severity: 'medium' },
  25: { count: 2, severity: 'high' },
  28: { count: 3, severity: 'low' },
};

const urgent = [
  { date: 'Apr 8',  entity: 'AB12 CDE',      type: 'MOT',       days: 0 },
  { date: 'Apr 10', entity: 'John Smith',     type: 'CSCS Card', days: 2 },
  { date: 'Apr 12', entity: 'Scaffold-01',    type: 'LOLER',     days: 4 },
  { date: 'Apr 14', entity: 'Sarah Johnson',  type: 'IPAF',      days: 6 },
];

const upcoming = [
  { date: 'Apr 18', entity: 'FG34 HIJ',     type: 'Insurance', days: 10 },
  { date: 'Apr 22', entity: 'Mike Davies',  type: 'First Aid', days: 14 },
  { date: 'Apr 25', entity: 'Van-002',      type: 'Service',   days: 17 },
  { date: 'Apr 28', entity: 'Emma Wilson',  type: 'PASMA',     days: 20 },
];

// Build calendar grid
const calendarDays: Array<{ day: number | null; expiries?: { count: number; severity: string } | null; isToday?: boolean }> = [];
for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push({ day: null });
for (let i = 1; i <= daysInMonth; i++) {
  calendarDays.push({ day: i, expiries: expiryData[i] || null, isToday: i === 2 });
}

function severityStyle(severity: string): React.CSSProperties {
  if (severity === 'high')   return { backgroundColor: '#000000', color: '#FFFFFF', borderColor: '#000000' };
  if (severity === 'medium') return { backgroundColor: '#FFF8E1', color: '#92400E', borderColor: '#FFC107' };
  return { backgroundColor: '#F3F3F3', color: '#474747', borderColor: '#C6C6C6' };
}

export default function CalendarPage() {
  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="label-sm mb-1">EXPIRY TRACKING</p>
            <h1>Calendar</h1>
            <p className="mt-1">Document expiry dates and renewal timeline</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary" style={{ padding: '8px 10px' }}>
              <ChevronLeftIcon className="w-4 h-4" strokeWidth={2} />
            </button>
            <span className="font-semibold text-sm" style={{ color: '#1A1C1C', minWidth: '110px', textAlign: 'center' }}>
              {currentMonth}
            </span>
            <button className="btn btn-secondary" style={{ padding: '8px 10px' }}>
              <ChevronRightIcon className="w-4 h-4" strokeWidth={2} />
            </button>
            <button className="btn btn-primary">Today</button>
          </div>
        </div>

        {/* Legend */}
        <div className="card" style={{ padding: '14px 20px' }}>
          <div className="flex flex-wrap items-center gap-6">
            <span className="label-sm">LEGEND</span>
            {[
              { label: 'CRITICAL (≤7 days)',  bg: '#000000', text: '#FFFFFF' },
              { label: 'EXPIRING (8–14 days)', bg: '#FFF8E1', text: '#92400E', border: '#FFC107' },
              { label: 'UPCOMING (15–30 days)', bg: '#F3F3F3', text: '#474747', border: '#C6C6C6' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-4 h-4" style={{ backgroundColor: l.bg, borderRadius: '2px', border: `1px solid ${l.border || l.bg}` }} />
                <span className="label-sm">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="card-flush">
          {/* Weekday headers */}
          <div className="grid grid-cols-7" style={{ borderBottom: '1px solid #F3F3F3', backgroundColor: '#F9F9F9' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-3 text-center label-sm">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((d, idx) => (
              <div key={idx}
                className="min-h-[100px] p-2 transition-colors cursor-pointer"
                style={{
                  borderRight: '1px solid #F3F3F3',
                  borderBottom: '1px solid #F3F3F3',
                  backgroundColor: d.isToday ? '#FFFBEA' : d.day ? '#FFFFFF' : '#F9F9F9',
                  outline: d.isToday ? '2px solid #FFC107' : 'none',
                  outlineOffset: '-2px',
                }}>
                {d.day && (
                  <>
                    <div className="flex items-center justify-center w-6 h-6 mb-1"
                      style={{
                        borderRadius: '50%',
                        backgroundColor: d.isToday ? '#FFC107' : 'transparent',
                        fontSize: '12px',
                        fontWeight: d.isToday ? 700 : 400,
                        color: d.isToday ? '#1A1C1C' : '#474747',
                      }}>
                      {d.day}
                    </div>
                    {d.expiries && (
                      <div className="text-xs px-1.5 py-0.5 mt-1 font-medium"
                        style={{
                          borderRadius: '2px',
                          border: '1px solid',
                          fontSize: '10px',
                          ...severityStyle(d.expiries.severity),
                        }}>
                        {d.expiries.count} expiring
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Next 7 days */}
          <div className="card-flush">
            <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
              <div className="label-sm mb-1">URGENT</div>
              <h2 style={{ fontSize: '1rem' }}>Next 7 Days</h2>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
              {urgent.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.days === 0 ? '#000000' : '#F3F3F3', borderRadius: '4px' }}>
                      <CalendarDaysIcon className="w-4 h-4" style={{ color: item.days === 0 ? '#FFFFFF' : '#474747' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>{item.entity}</div>
                      <div className="text-xs" style={{ color: '#A3A3A3' }}>{item.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>{item.date}</div>
                    <div className="text-xs" style={{ color: item.days === 0 ? '#1A1C1C' : '#A3A3A3', fontWeight: item.days === 0 ? 600 : 400 }}>
                      {item.days === 0 ? 'TODAY' : `${item.days} days`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 pt-3">
              <button className="btn btn-black w-full text-sm">View All Urgent</button>
            </div>
          </div>

          {/* Next 30 days */}
          <div className="card-flush">
            <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
              <div className="label-sm mb-1">UPCOMING</div>
              <h2 style={{ fontSize: '1rem' }}>Next 30 Days</h2>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
              {upcoming.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                      <CalendarDaysIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>{item.entity}</div>
                      <div className="text-xs" style={{ color: '#A3A3A3' }}>{item.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>{item.date}</div>
                    <div className="text-xs" style={{ color: '#A3A3A3' }}>{item.days} days</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-5 pt-3">
              <button className="btn btn-secondary w-full text-sm">View All Upcoming</button>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="card">
          <div className="label-sm mb-4">EXPORT CALENDAR</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.5} />
              Download CSV
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={1.5} />
              Download PDF
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4" strokeWidth={1.5} />
              Subscribe (iCal)
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
