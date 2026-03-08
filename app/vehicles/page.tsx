import AppLayout from '@/components/layout/AppLayout'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

export default function VehiclesPage() {
  // Placeholder data (will be replaced with real data from Supabase)
  const vehicles = [
    {
      id: '1',
      registration: 'AB12 CDE',
      make: 'Ford',
      model: 'Transit',
      type: 'Van',
      depot: 'Site A',
      documents: 4,
      expiring: 1,
      expired: 0,
      status: 'expiring',
    },
    {
      id: '2',
      registration: 'FG34 HIJ',
      make: 'Volkswagen',
      model: 'Caddy',
      type: 'Van',
      depot: 'Site B',
      documents: 3,
      expiring: 0,
      expired: 0,
      status: 'valid',
    },
    {
      id: '3',
      registration: 'KL56 MNO',
      make: 'Mercedes',
      model: 'Sprinter',
      type: 'Van',
      depot: 'Site A',
      documents: 4,
      expiring: 0,
      expired: 1,
      status: 'expired',
    },
    {
      id: '4',
      registration: 'PQ78 RST',
      make: 'Isuzu',
      model: 'D-Max',
      type: 'Pickup',
      depot: 'Site C',
      documents: 3,
      expiring: 0,
      expired: 0,
      status: 'valid',
    },
    {
      id: '5',
      registration: 'UV90 WXY',
      make: 'Renault',
      model: 'Master',
      type: 'Van',
      depot: 'Site B',
      documents: 4,
      expiring: 2,
      expired: 0,
      status: 'expiring',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <span className="badge-valid">Valid</span>
      case 'expiring':
        return <span className="badge-expiring">Expiring Soon</span>
      case 'expired':
        return <span className="badge-expired">Expired</span>
      default:
        return <span className="badge-missing">Unknown</span>
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Vehicles</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage fleet vehicles and compliance documents
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {/* Filters and search */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by registration, make, or model..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400"
              />
            </div>

            {/* Filter button */}
            <button className="btn-secondary flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Active filters (placeholder) */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700">
              All Types
              <button className="ml-2 text-primary-900 hover:text-primary-700">×</button>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700">
              All Depots
              <button className="ml-2 text-primary-900 hover:text-primary-700">×</button>
            </span>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-semibold text-gray-900">48</div>
            <div className="text-sm text-gray-600">Total Vehicles</div>
          </div>
          <div className="card text-center border-l-4 border-green-400">
            <div className="text-2xl font-semibold text-green-600">32</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </div>
          <div className="card text-center border-l-4 border-amber-400">
            <div className="text-2xl font-semibold text-amber-600">11</div>
            <div className="text-sm text-gray-600">Expiring Soon</div>
          </div>
          <div className="card text-center border-l-4 border-red-400">
            <div className="text-2xl font-semibold text-red-600">5</div>
            <div className="text-sm text-gray-600">Non-Compliant</div>
          </div>
        </div>

        {/* Vehicles table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Depot
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-lg">
                            🚗
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vehicle.registration}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.make} {vehicle.model}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.depot}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {vehicle.documents} total
                        {vehicle.expiring > 0 && (
                          <span className="ml-2 text-amber-600">({vehicle.expiring} expiring)</span>
                        )}
                        {vehicle.expired > 0 && (
                          <span className="ml-2 text-red-600">({vehicle.expired} expired)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(vehicle.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                <span className="font-medium">48</span> results
              </div>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm">Previous</button>
                <button className="btn-primary text-sm">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats by type */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🚐</div>
              <div className="text-lg font-semibold text-gray-900">32</div>
              <div className="text-sm text-gray-600">Vans</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🚙</div>
              <div className="text-lg font-semibold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Pickups</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🚛</div>
              <div className="text-lg font-semibold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Trucks</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🚜</div>
              <div className="text-lg font-semibold text-gray-900">3</div>
              <div className="text-sm text-gray-600">Plant</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
