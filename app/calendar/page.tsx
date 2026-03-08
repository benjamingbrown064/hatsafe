import AppLayout from '@/components/layout/AppLayout'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function CalendarPage() {
  // Placeholder data (will be replaced with real data from Supabase)
  const currentMonth = 'March 2026'
  const daysInMonth = 31
  const firstDayOfWeek = 6 // Saturday (0 = Sunday)

  // Mock expiry data
  const expiryData: Record<number, { count: number; severity: 'low' | 'medium' | 'high' }> = {
    5: { count: 2, severity: 'low' },
    8: { count: 1, severity: 'high' },
    12: { count: 4, severity: 'medium' },
    15: { count: 3, severity: 'low' },
    18: { count: 1, severity: 'high' },
    22: { count: 5, severity: 'medium' },
    25: { count: 2, severity: 'high' },
    28: { count: 3, severity: 'low' },
  }

  // Generate calendar days
  const calendarDays = []
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false })
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      expiries: expiryData[i] || null,
      isToday: i === 8, // Mock today as 8th
    })
  }

  const getSeverityColor = (severity?: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-400 text-red-900'
      case 'medium':
        return 'bg-amber-100 border-amber-400 text-amber-900'
      case 'low':
        return 'bg-green-100 border-green-400 text-green-900'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Calendar</h1>
            <p className="mt-2 text-sm text-gray-700">
              Document expiry dates and renewal timeline
            </p>
          </div>

          {/* Month navigation */}
          <div className="flex items-center space-x-4">
            <button className="btn-secondary p-2">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
              {currentMonth}
            </div>
            <button className="btn-secondary p-2">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <button className="btn-primary">Today</button>
          </div>
        </div>

        {/* Legend */}
        <div className="card">
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-sm font-medium text-gray-700">Legend:</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-400"></div>
              <span className="text-sm text-gray-600">High Priority (≤7 days)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-amber-100 border border-amber-400"></div>
              <span className="text-sm text-gray-600">Medium (8-14 days)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-400"></div>
              <span className="text-sm text-gray-600">Low (15-30 days)</span>
            </div>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="card overflow-hidden p-0">
          {/* Week day headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-sm font-medium text-gray-700"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((dayData, index) => (
              <div
                key={index}
                className={`
                  min-h-[120px] border-r border-b border-gray-200 p-2
                  ${dayData.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${dayData.isToday ? 'ring-2 ring-primary-400' : ''}
                  hover:bg-gray-50 transition-colors
                `}
              >
                {dayData.day && (
                  <>
                    {/* Day number */}
                    <div
                      className={`
                        inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                        ${dayData.isToday
                          ? 'bg-primary-400 text-secondary-800 font-semibold'
                          : 'text-gray-700'
                        }
                      `}
                    >
                      {dayData.day}
                    </div>

                    {/* Expiry indicator */}
                    {dayData.expiries && (
                      <div className="mt-2">
                        <div
                          className={`
                            text-xs font-medium px-2 py-1 rounded border
                            ${getSeverityColor(dayData.expiries.severity)}
                            cursor-pointer hover:shadow-sm transition-shadow
                          `}
                        >
                          {dayData.expiries.count} expiring
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming expiries list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Next 7 days */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next 7 Days</h3>
            <div className="space-y-3">
              {[
                { date: 'Mar 8', entity: 'AB12 CDE', type: 'MOT', days: 0 },
                { date: 'Mar 10', entity: 'John Smith', type: 'CSCS Card', days: 2 },
                { date: 'Mar 12', entity: 'Scaffold-01', type: 'LOLER', days: 4 },
                { date: 'Mar 14', entity: 'Sarah Johnson', type: 'IPAF', days: 6 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900">{item.entity}</div>
                    <div className="text-sm text-gray-600">{item.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{item.date}</div>
                    <div className="text-xs text-gray-600">
                      {item.days === 0 ? 'Today' : `${item.days} days`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary w-full mt-4">View All Urgent</button>
          </div>

          {/* Next 30 days */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next 30 Days</h3>
            <div className="space-y-3">
              {[
                { date: 'Mar 18', entity: 'FG34 HIJ', type: 'Insurance', days: 10 },
                { date: 'Mar 22', entity: 'Mike Davies', type: 'First Aid', days: 14 },
                { date: 'Mar 25', entity: 'Van-002', type: 'Service', days: 17 },
                { date: 'Mar 28', entity: 'Emma Wilson', type: 'PASMA', days: 20 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900">{item.entity}</div>
                    <div className="text-sm text-gray-600">{item.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{item.date}</div>
                    <div className="text-xs text-gray-600">{item.days} days</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary w-full mt-4">View All Upcoming</button>
          </div>
        </div>

        {/* Export options */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Calendar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="btn-secondary justify-center">
              Download as CSV
            </button>
            <button className="btn-secondary justify-center">
              Download as PDF
            </button>
            <button className="btn-secondary justify-center">
              Subscribe (iCal)
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
