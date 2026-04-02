'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

// --- Types ---
type Severity = 'critical' | 'medium' | 'low';

interface ExpiryItem {
  entity: string;
  type: string;
  entityType: 'person' | 'vehicle' | 'asset';
  daysLeft: number;
  status: 'expired' | 'expiring' | 'upcoming';
}

interface DayData {
  count: number;
  severity: Severity;
  items: ExpiryItem[];
}

// --- Mock data per day ---
const expiryData: Record<number, DayData> = {
  2: {
    count: 1, severity: 'critical',
    items: [
      { entity: 'AB12 CDE',     type: 'MOT Certificate', entityType: 'vehicle', daysLeft: 0, status: 'expired' },
    ],
  },
  5: {
    count: 2, severity: 'low',
    items: [
      { entity: 'Emma Wilson',  type: 'PASMA Certificate', entityType: 'person',  daysLeft: 3,  status: 'expiring' },
      { entity: 'LIFT-008',     type: 'LOLER Inspection',  entityType: 'asset',   daysLeft: 3,  status: 'expiring' },
    ],
  },
  8: {
    count: 1, severity: 'critical',
    items: [
      { entity: 'John Smith',   type: 'CSCS Card',         entityType: 'person',  daysLeft: 6,  status: 'expiring' },
    ],
  },
  12: {
    count: 4, severity: 'medium',
    items: [
      { entity: 'FG34 HIJ',     type: 'Vehicle Insurance', entityType: 'vehicle', daysLeft: 10, status: 'expiring' },
      { entity: 'Sarah Johnson',type: 'IPAF Certificate',  entityType: 'person',  daysLeft: 10, status: 'expiring' },
      { entity: 'SCAF-001',     type: 'LOLER Inspection',  entityType: 'asset',   daysLeft: 10, status: 'expiring' },
      { entity: 'Mike Davies',  type: 'First Aid',         entityType: 'person',  daysLeft: 10, status: 'expiring' },
    ],
  },
  15: {
    count: 3, severity: 'low',
    items: [
      { entity: 'KL56 MNO',     type: 'Road Tax',          entityType: 'vehicle', daysLeft: 13, status: 'expiring' },
      { entity: 'James Brown',  type: 'CSCS Card',         entityType: 'person',  daysLeft: 13, status: 'expiring' },
      { entity: 'COMP-023',     type: 'PAT Test',          entityType: 'asset',   daysLeft: 13, status: 'expiring' },
    ],
  },
  18: {
    count: 1, severity: 'critical',
    items: [
      { entity: 'UV90 WXY',     type: 'MOT Certificate',   entityType: 'vehicle', daysLeft: 16, status: 'expiring' },
    ],
  },
  22: {
    count: 5, severity: 'medium',
    items: [
      { entity: 'Van-002',      type: 'Service Record',    entityType: 'vehicle', daysLeft: 20, status: 'expiring' },
      { entity: 'Tom Harris',   type: 'Working at Height', entityType: 'person',  daysLeft: 20, status: 'expiring' },
      { entity: 'LADD-015',     type: 'Inspection Cert',   entityType: 'asset',   daysLeft: 20, status: 'expiring' },
      { entity: 'PQ78 RST',     type: 'Vehicle Insurance', entityType: 'vehicle', daysLeft: 20, status: 'expiring' },
      { entity: 'Amy Clarke',   type: 'IPAF Certificate',  entityType: 'person',  daysLeft: 20, status: 'expiring' },
    ],
  },
  25: {
    count: 2, severity: 'critical',
    items: [
      { entity: 'TOOL-042',     type: 'PAT Test',          entityType: 'asset',   daysLeft: 23, status: 'expiring' },
      { entity: 'Dan Booth',    type: 'Scaffold Licence',  entityType: 'person',  daysLeft: 23, status: 'expiring' },
    ],
  },
  28: {
    count: 3, severity: 'low',
    items: [
      { entity: 'Emma Wilson',  type: 'Manual Handling',   entityType: 'person',  daysLeft: 26, status: 'expiring' },
      { entity: 'LIFT-008',     type: 'Service Record',    entityType: 'asset',   daysLeft: 26, status: 'expiring' },
      { entity: 'AB12 CDE',     type: 'Vehicle Insurance', entityType: 'vehicle', daysLeft: 26, status: 'expiring' },
    ],
  },
};

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

function EntityIcon({ type }: { type: string }) {
  const cls = "w-3.5 h-3.5 flex-shrink-0";
  const s = { color: '#A3A3A3' };
  if (type === 'vehicle') return <TruckIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'asset')   return <WrenchScrewdriverIcon className={cls} style={s} strokeWidth={1.5} />;
  return <UserIcon className={cls} style={s} strokeWidth={1.5} />;
}

function severityBg(severity: Severity) {
  if (severity === 'critical') return { backgroundColor: '#000000', color: '#FFFFFF', borderColor: '#000000' };
  if (severity === 'medium')   return { backgroundColor: '#FFF8E1', color: '#92400E', borderColor: '#FFC107' };
  return { backgroundColor: '#F3F3F3', color: '#474747', borderColor: '#C6C6C6' };
}

function ItemBadge({ status }: { status: string }) {
  if (status === 'expired')  return <span className="badge badge-expired">Expired</span>;
  if (status === 'expiring') return <span className="badge badge-expiring">Expiring</span>;
  return <span className="badge badge-valid">Upcoming</span>;
}

function CalendarInner() {
  const today = new Date();
  const searchParams = useSearchParams();
  const [showAllUrgent,   setShowAllUrgent]   = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    const d = searchParams.get('day');
    return d ? parseInt(d, 10) : null;
  });

  useEffect(() => {
    const d = searchParams.get('day');
    if (d) setSelectedDay(parseInt(d, 10));
  }, [searchParams]);

  const dim = daysInMonth[month] + (month === 1 && year % 4 === 0 ? 1 : 0);
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun

  const calendarDays: Array<{ day: number | null; data?: DayData; isToday?: boolean }> = [];
  for (let i = 0; i < firstDow; i++) calendarDays.push({ day: null });
  for (let i = 1; i <= dim; i++) {
    calendarDays.push({
      day: i,
      data: expiryData[i] || undefined,
      isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
    });
  }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1); } else setMonth(m => m + 1); setSelectedDay(null); };
  const goToday  = () => { setMonth(today.getMonth()); setYear(today.getFullYear()); setSelectedDay(today.getDate()); };

  const selectedData = selectedDay ? expiryData[selectedDay] : null;

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Month navigation */}
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary" style={{ padding: '8px 10px' }} onClick={prevMonth}>
              <ChevronLeftIcon className="w-4 h-4" strokeWidth={2} />
            </button>
            <span className="font-semibold text-sm" style={{ color: '#1A1C1C', minWidth: '130px', textAlign: 'center' }}>
              {months[month]} {year}
            </span>
            <button className="btn btn-secondary" style={{ padding: '8px 10px' }} onClick={nextMonth}>
              <ChevronRightIcon className="w-4 h-4" strokeWidth={2} />
            </button>
            <button className="btn btn-primary" onClick={goToday}>Today</button>
          </div>
        </div>

        {/* Legend */}
        <div className="card" style={{ padding: '14px 20px' }}>
          <div className="flex flex-wrap items-center gap-6">
            <span className="label-sm">LEGEND</span>
            {[
              { label: 'CRITICAL / EXPIRED',   bg: '#000000', border: '#000000' },
              { label: 'EXPIRING (8–14 DAYS)',  bg: '#FFF8E1', border: '#FFC107' },
              { label: 'UPCOMING (15–30 DAYS)', bg: '#F3F3F3', border: '#C6C6C6' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5" style={{ backgroundColor: l.bg, borderRadius: '2px', border: `1px solid ${l.border}` }} />
                <span className="label-sm">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar + detail panel */}
        <div className="flex gap-6">

          {/* Calendar */}
          <div className="flex-1 min-w-0 card-flush">
            {/* Weekday headers */}
            <div className="grid grid-cols-7" style={{ borderBottom: '1px solid #F3F3F3', backgroundColor: '#F9F9F9' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="py-3 text-center label-sm">{d}</div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((d, idx) => {
                const isSelected = d.day === selectedDay;
                return (
                  <div key={idx}
                    onClick={() => d.day && setSelectedDay(d.day === selectedDay ? null : d.day)}
                    className="min-h-[90px] p-2 transition-colors"
                    style={{
                      borderRight: '1px solid #F3F3F3',
                      borderBottom: '1px solid #F3F3F3',
                      backgroundColor: isSelected
                        ? '#FFFBEA'
                        : d.isToday ? '#FAFAFA'
                        : d.day ? '#FFFFFF' : '#F9F9F9',
                      cursor: d.day ? 'pointer' : 'default',
                      outline: isSelected ? '2px solid #FFC107' : d.isToday ? '1px solid rgba(255,193,7,0.4)' : 'none',
                      outlineOffset: '-2px',
                    }}
                    onMouseEnter={e => { if (d.day && !isSelected) e.currentTarget.style.backgroundColor = '#F9F9F9'; }}
                    onMouseLeave={e => { if (d.day && !isSelected) e.currentTarget.style.backgroundColor = d.isToday ? '#FAFAFA' : '#FFFFFF'; }}
                  >
                    {d.day && (
                      <>
                        <div className="flex items-center justify-center w-6 h-6 mb-1"
                          style={{
                            borderRadius: '50%',
                            backgroundColor: d.isToday ? '#FFC107' : 'transparent',
                            fontSize: '12px',
                            fontWeight: d.isToday ? 700 : 400,
                            color: '#474747',
                          }}>
                          {d.day}
                        </div>
                        {d.data && (
                          <div className="text-xs px-1.5 py-0.5 font-medium"
                            style={{
                              borderRadius: '2px',
                              border: '1px solid',
                              fontSize: '10px',
                              letterSpacing: '0.02em',
                              ...severityBg(d.data.severity),
                            }}>
                            {d.data.count} expiring
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div style={{ width: '300px', flexShrink: 0 }}>
            {selectedDay && selectedData ? (
              <div className="card-flush" style={{ position: 'sticky', top: '24px' }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F3F3F3' }}>
                  <div>
                    <div className="label-sm mb-0.5">{months[month]} {selectedDay}</div>
                    <h2 style={{ fontSize: '1rem' }}>{selectedData.count} expiring</h2>
                  </div>
                  <button onClick={() => setSelectedDay(null)}
                    className="w-7 h-7 flex items-center justify-center"
                    style={{ borderRadius: '4px', backgroundColor: '#F3F3F3', color: '#474747' }}>
                    <XMarkIcon className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
                <div className="divide-y">
                  {selectedData.items.map((item, i) => (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                            <DocumentTextIcon className="w-4 h-4" style={{ color: '#474747' }} strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate" style={{ color: '#1A1C1C' }}>{item.type}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <EntityIcon type={item.entityType} />
                              <span className="text-xs truncate" style={{ color: '#A3A3A3' }}>{item.entity}</span>
                            </div>
                          </div>
                        </div>
                        <ItemBadge status={item.status} />
                      </div>
                      {item.daysLeft === 0 ? (
                        <div className="mt-2 label-sm" style={{ color: '#1A1C1C' }}>EXPIRED TODAY</div>
                      ) : (
                        <div className="mt-2 label-sm">{item.daysLeft} DAYS REMAINING</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4" style={{ borderTop: '1px solid #F3F3F3' }}>
                  <button className="btn btn-black w-full text-xs">
                    View All Documents →
                  </button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
                <CalendarDaysIcon className="w-8 h-8 mx-auto mb-3" style={{ color: '#C6C6C6' }} strokeWidth={1} />
                <div className="label-sm mb-1">SELECT A DAY</div>
                <p style={{ fontSize: '13px', color: '#A3A3A3' }}>
                  Click any highlighted day to see what's expiring
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming list — derived from expiryData */}
        {(() => {
          // Flatten all items across all days with their day number
          const allItems = Object.entries(expiryData).flatMap(([dayStr, dayData]) =>
            dayData.items.map(item => ({ ...item, day: parseInt(dayStr, 10) }))
          ).sort((a, b) => a.day - b.day);

          const urgentItems   = allItems.filter(i => i.daysLeft <= 7);
          const upcomingItems = allItems.filter(i => i.daysLeft > 7 && i.daysLeft <= 30);
          const PREVIEW = 3;

          const visibleUrgent   = showAllUrgent   ? urgentItems   : urgentItems.slice(0, PREVIEW);
          const visibleUpcoming = showAllUpcoming ? upcomingItems : upcomingItems.slice(0, PREVIEW);

          function ItemRow({ item, critical }: { item: typeof allItems[0]; critical?: boolean }) {
            return (
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F3F3F3' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: critical ? '#000000' : '#F3F3F3', borderRadius: '4px' }}>
                    <CalendarDaysIcon className="w-4 h-4"
                      style={{ color: critical ? '#FFC107' : '#474747' }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>{item.entity}</div>
                    <div className="text-xs" style={{ color: '#A3A3A3' }}>{item.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: '#1A1C1C' }}>
                    {months[month]} {item.day}
                  </div>
                  <div className="text-xs font-semibold"
                    style={{ color: item.daysLeft <= 0 ? '#1A1C1C' : '#A3A3A3' }}>
                    {item.daysLeft <= 0 ? 'TODAY' : `${item.daysLeft}d`}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Next 7 days */}
              <div className="card-flush">
                <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                  <div className="label-sm mb-1">URGENT</div>
                  <h2 style={{ fontSize: '1rem' }}>
                    Next 7 Days
                    <span className="ml-2 label-sm" style={{ color: '#A3A3A3' }}>
                      {urgentItems.length} ITEM{urgentItems.length !== 1 ? 'S' : ''}
                    </span>
                  </h2>
                </div>
                <div>
                  {urgentItems.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <div className="label-sm" style={{ color: '#A3A3A3' }}>ALL CLEAR</div>
                    </div>
                  ) : (
                    visibleUrgent.map((item, i) => (
                      <ItemRow key={i} item={item} critical={item.daysLeft <= 0} />
                    ))
                  )}
                </div>
                {urgentItems.length > PREVIEW && (
                  <div className="px-6 pb-5 pt-3">
                    <button
                      className="btn btn-black w-full text-sm"
                      onClick={() => setShowAllUrgent(v => !v)}>
                      {showAllUrgent
                        ? 'Show Less'
                        : `View All ${urgentItems.length} Urgent Items`}
                    </button>
                  </div>
                )}
                {urgentItems.length > 0 && urgentItems.length <= PREVIEW && (
                  <div className="px-6 pb-5 pt-3">
                    <button className="btn btn-black w-full text-sm" disabled style={{ opacity: 0.4 }}>
                      All urgent items shown
                    </button>
                  </div>
                )}
              </div>

              {/* Next 30 days */}
              <div className="card-flush">
                <div className="px-6 py-5" style={{ borderBottom: '1px solid #F3F3F3' }}>
                  <div className="label-sm mb-1">UPCOMING</div>
                  <h2 style={{ fontSize: '1rem' }}>
                    Next 30 Days
                    <span className="ml-2 label-sm" style={{ color: '#A3A3A3' }}>
                      {upcomingItems.length} ITEM{upcomingItems.length !== 1 ? 'S' : ''}
                    </span>
                  </h2>
                </div>
                <div>
                  {upcomingItems.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <div className="label-sm" style={{ color: '#A3A3A3' }}>NOTHING UPCOMING</div>
                    </div>
                  ) : (
                    visibleUpcoming.map((item, i) => (
                      <ItemRow key={i} item={item} />
                    ))
                  )}
                </div>
                {upcomingItems.length > PREVIEW && (
                  <div className="px-6 pb-5 pt-3">
                    <button
                      className="btn btn-secondary w-full text-sm"
                      onClick={() => setShowAllUpcoming(v => !v)}>
                      {showAllUpcoming
                        ? 'Show Less'
                        : `View All ${upcomingItems.length} Upcoming Items`}
                    </button>
                  </div>
                )}
                {upcomingItems.length > 0 && upcomingItems.length <= PREVIEW && (
                  <div className="px-6 pb-5 pt-3">
                    <button className="btn btn-secondary w-full text-sm" disabled style={{ opacity: 0.4 }}>
                      All upcoming items shown
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

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

export default function CalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarInner />
    </Suspense>
  );
}
