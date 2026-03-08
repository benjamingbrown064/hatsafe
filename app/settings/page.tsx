import AppLayout from '@/components/layout/AppLayout'
import {
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  BellIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your organisation settings and preferences
          </p>
        </div>

        {/* Settings sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organisation Settings */}
          <div className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Organisation</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Company name, logo, and basic details
                </p>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-900 font-medium">
                  Manage →
                </button>
              </div>
            </div>
          </div>

          {/* Users & Teams */}
          <div className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Users & Teams</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage users, roles, and team structure
                </p>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-900 font-medium">
                  Manage →
                </button>
              </div>
            </div>
          </div>

          {/* Document Types */}
          <div className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Document Types</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure certificate and license types
                </p>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-900 font-medium">
                  Manage →
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <BellIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Email alerts and reminder settings
                </p>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-900 font-medium">
                  Manage →
                </button>
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Password, 2FA, and audit logs
                </p>
                <button className="mt-4 text-sm text-primary-600 hover:text-primary-900 font-medium">
                  Manage →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Organisation Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Organisation Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400"
                placeholder="Acme Construction Ltd"
                value="Acme Construction Ltd"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subdomain
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-primary-400 focus:border-primary-400"
                  placeholder="acme"
                  value="acme"
                  readOnly
                />
                <span className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                  .hatsafe.com
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400">
                <option>Construction</option>
                <option>Facilities Management</option>
                <option>Logistics</option>
                <option>Events</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400">
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>201-500 employees</option>
                <option>500+ employees</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <button className="btn-primary">Save Changes</button>
            <button className="btn-secondary">Cancel</button>
          </div>
        </div>

        {/* Subscription & Billing */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription & Billing</h2>
          <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary-400 bg-primary-50">
            <div>
              <div className="text-lg font-semibold text-gray-900">Professional Plan</div>
              <div className="text-sm text-gray-600 mt-1">£99/month · Renews on April 1, 2026</div>
            </div>
            <div className="flex space-x-3">
              <button className="btn-secondary">Change Plan</button>
              <button className="btn-primary">Manage Billing</button>
            </div>
          </div>

          {/* Usage stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="text-sm text-gray-600">People</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">142 / 200</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-primary-400 h-2 rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="text-sm text-gray-600">Vehicles</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">48 / 100</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-primary-400 h-2 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="text-sm text-gray-600">Documents</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">487 / 2000</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-primary-400 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { label: 'Email alerts for expiring documents', enabled: true, description: '30, 14, and 7 days before expiry' },
              { label: 'Daily urgent digest', enabled: true, description: 'Expiring in next 7 days + overdue' },
              { label: 'Weekly upcoming expiries', enabled: true, description: 'Sent every Monday at 9:00 AM' },
              { label: 'Document upload notifications', enabled: false, description: 'When new documents are uploaded' },
              { label: 'Review queue alerts', enabled: true, description: 'When documents need approval' },
            ].map((pref, index) => (
              <div key={index} className="flex items-start justify-between p-4 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{pref.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{pref.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input type="checkbox" className="sr-only peer" defaultChecked={pref.enabled} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-400"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button className="btn-primary">Save Preferences</button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-2 border-red-200">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
              <div>
                <div className="font-medium text-red-900">Export All Data</div>
                <div className="text-sm text-red-700 mt-1">
                  Download a complete backup of all your data
                </div>
              </div>
              <button className="btn-secondary text-red-600 hover:bg-red-50">
                Export
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
              <div>
                <div className="font-medium text-red-900">Delete Organisation</div>
                <div className="text-sm text-red-700 mt-1">
                  Permanently delete your organisation and all data
                </div>
              </div>
              <button className="btn-secondary text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
