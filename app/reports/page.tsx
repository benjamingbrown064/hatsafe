import AppLayout from '@/components/layout/AppLayout'
import {
  ArrowDownTrayIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-2 text-sm text-gray-700">
            Generate compliance reports and export data
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="card text-center border-l-4 border-primary-400">
            <div className="text-2xl font-semibold text-gray-900">487</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </div>
          <div className="card text-center border-l-4 border-green-400">
            <div className="text-2xl font-semibold text-green-600">64%</div>
            <div className="text-sm text-gray-600">Compliance Rate</div>
          </div>
          <div className="card text-center border-l-4 border-amber-400">
            <div className="text-2xl font-semibold text-amber-600">98</div>
            <div className="text-sm text-gray-600">Expiring Soon</div>
          </div>
          <div className="card text-center border-l-4 border-red-400">
            <div className="text-2xl font-semibold text-red-600">52</div>
            <div className="text-sm text-gray-600">Expired</div>
          </div>
        </div>

        {/* Report types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Summary Report */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Compliance Summary</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Overall compliance status across all entities
                </p>
              </div>
              <DocumentChartBarIcon className="h-8 w-8 text-primary-400" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Date Range</span>
                <span className="font-medium text-gray-900">All Time</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Entity Types</span>
                <span className="font-medium text-gray-900">All Types</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Format</span>
                <span className="font-medium text-gray-900">PDF</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="btn-primary w-full flex items-center justify-center space-x-2">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Generate Report</span>
              </button>
              <button className="btn-secondary w-full text-sm">
                Customize Parameters
              </button>
            </div>
          </div>

          {/* Expiry Report */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Expiry Report</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Documents expiring in specified timeframe
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-primary-400" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Timeframe</span>
                <span className="font-medium text-gray-900">Next 30 Days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Include Expired</span>
                <span className="font-medium text-gray-900">Yes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Format</span>
                <span className="font-medium text-gray-900">CSV</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="btn-primary w-full flex items-center justify-center space-x-2">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Generate Report</span>
              </button>
              <button className="btn-secondary w-full text-sm">
                Customize Parameters
              </button>
            </div>
          </div>

          {/* Missing Documents Report */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Missing Documents</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Entities without required documents
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-primary-400" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Entity Type</span>
                <span className="font-medium text-gray-900">All Types</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Document Types</span>
                <span className="font-medium text-gray-900">All Required</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Format</span>
                <span className="font-medium text-gray-900">PDF</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="btn-primary w-full flex items-center justify-center space-x-2">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Generate Report</span>
              </button>
              <button className="btn-secondary w-full text-sm">
                Customize Parameters
              </button>
            </div>
          </div>

          {/* Document Coverage Report */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Document Coverage</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Coverage breakdown by entity type
                </p>
              </div>
              <DocumentChartBarIcon className="h-8 w-8 text-primary-400" />
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Group By</span>
                <span className="font-medium text-gray-900">Entity Type</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Include Charts</span>
                <span className="font-medium text-gray-900">Yes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Format</span>
                <span className="font-medium text-gray-900">PDF</span>
              </div>
            </div>

            <div className="space-y-2">
              <button className="btn-primary w-full flex items-center justify-center space-x-2">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Generate Report</span>
              </button>
              <button className="btn-secondary w-full text-sm">
                Customize Parameters
              </button>
            </div>
          </div>
        </div>

        {/* Recent reports */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {[
              { name: 'Compliance Summary - March 2026', date: '2 hours ago', size: '2.4 MB', format: 'PDF' },
              { name: 'Expiry Report - Q1 2026', date: 'Yesterday', size: '856 KB', format: 'CSV' },
              { name: 'Missing Documents', date: '3 days ago', size: '1.2 MB', format: 'PDF' },
              { name: 'Document Coverage - All Entities', date: '1 week ago', size: '3.1 MB', format: 'PDF' },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <DocumentChartBarIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-600">
                      {report.date} · {report.size} · {report.format}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-secondary text-sm">
                    Download
                  </button>
                  <button className="btn-secondary text-sm">
                    Regenerate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled reports */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
            <button className="btn-primary text-sm">Schedule New Report</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Weekly Compliance Digest', frequency: 'Every Monday 9:00 AM', recipients: 'admin@company.com' },
              { name: 'Monthly Expiry Summary', frequency: 'First of each month', recipients: 'managers@company.com' },
            ].map((schedule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div>
                  <div className="font-medium text-gray-900">{schedule.name}</div>
                  <div className="text-sm text-gray-600">
                    {schedule.frequency} · {schedule.recipients}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="btn-secondary text-sm">Edit</button>
                  <button className="btn-secondary text-sm text-red-600">Disable</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export raw data */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Raw Data</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download all data for external analysis or backup purposes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="btn-secondary justify-center flex items-center space-x-2">
              <span>Export All People</span>
            </button>
            <button className="btn-secondary justify-center flex items-center space-x-2">
              <span>Export All Vehicles</span>
            </button>
            <button className="btn-secondary justify-center flex items-center space-x-2">
              <span>Export All Assets</span>
            </button>
            <button className="btn-secondary justify-center flex items-center space-x-2">
              <span>Export All Documents</span>
            </button>
            <button className="btn-secondary justify-center flex items-center space-x-2">
              <span>Export Audit Log</span>
            </button>
            <button className="btn-primary justify-center flex items-center space-x-2">
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Export Everything</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
