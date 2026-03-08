import AppLayout from '@/components/layout/AppLayout'
import {
  PencilIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AssetProfilePage({ params }: { params: { id: string } }) {
  // Placeholder data (will be replaced with real data from Supabase)
  const asset = {
    id: params.id,
    assetId: 'SCAF-001',
    name: 'Aluminium Tower Scaffold',
    type: 'Scaffold',
    manufacturer: 'Boss',
    model: 'Zone 1',
    serialNumber: 'SN-2024-8721',
    purchaseDate: '2024-03-15',
    location: 'Site A - Manchester',
    site: 'Site A',
    owner: 'Mike Davies',
    condition: 'Good',
  }

  const documents = [
    {
      id: '1',
      title: 'LOLER Inspection',
      issuer: 'Safety Inspections Ltd',
      certificateNumber: 'LOLER2024-042',
      issueDate: '2024-11-15',
      expiryDate: '2026-03-20',
      status: 'expiring',
      daysUntilExpiry: 12,
    },
    {
      id: '2',
      title: 'Safety Certificate',
      issuer: 'Boss Equipment',
      certificateNumber: 'CERT-SCAF-001-2024',
      issueDate: '2024-03-15',
      expiryDate: '2027-03-15',
      status: 'valid',
      daysUntilExpiry: 372,
    },
    {
      id: '3',
      title: 'User Manual',
      issuer: 'Boss Equipment',
      certificateNumber: 'MAN-ZONE1-2024',
      issueDate: '2024-03-15',
      expiryDate: null,
      status: 'valid',
      daysUntilExpiry: null,
    },
  ]

  const getStatusBadge = (status: string, daysUntil: number | null) => {
    if (daysUntil === null) {
      return <span className="badge-valid">No Expiry</span>
    }
    switch (status) {
      case 'valid':
        return <span className="badge-valid">Valid ({daysUntil} days)</span>
      case 'expiring':
        return <span className="badge-expiring">Expiring ({daysUntil} days)</span>
      case 'expired':
        return <span className="badge-expired">Overdue ({Math.abs(daysUntil)} days)</span>
      default:
        return <span className="badge-missing">Unknown</span>
    }
  }

  // Calculate compliance status
  const hasExpired = documents.some(d => d.status === 'expired')
  const hasExpiring = documents.some(d => d.status === 'expiring')
  const complianceStatus = hasExpired ? 'expired' : hasExpiring ? 'expiring' : 'valid'

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back button */}
        <Link href="/assets" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Assets
        </Link>

        {/* Profile header */}
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              {/* Asset icon */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-lg bg-primary-50 flex items-center justify-center text-3xl">
                  🔧
                </div>
              </div>

              {/* Basic info */}
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-semibold text-gray-900">{asset.assetId}</h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {asset.condition}
                  </span>
                </div>
                <p className="text-lg text-gray-600 mt-1">{asset.name}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {asset.type}
                  </span>
                  {complianceStatus === 'valid' && (
                    <span className="badge-valid">Compliant</span>
                  )}
                  {complianceStatus === 'expiring' && (
                    <span className="badge-expiring">Expiring Soon</span>
                  )}
                  {complianceStatus === 'expired' && (
                    <span className="badge-expired">Non-Compliant</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button className="btn-secondary flex items-center space-x-2">
                <PencilIcon className="h-5 w-5" />
                <span>Edit</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Add Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Asset details */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Details</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Asset ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{asset.assetId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.manufacturer}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Model</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.model}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{asset.serialNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.purchaseDate}</dd>
                </div>
              </dl>
            </div>

            {/* Location & Assignment */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location & Assignment</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Site</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.site}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Owner</dt>
                  <dd className="mt-1 text-sm text-gray-900">{asset.owner}</dd>
                </div>
              </dl>
            </div>

            {/* Compliance summary */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Documents</span>
                  <span className="text-lg font-semibold text-gray-900">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valid</span>
                  <span className="text-lg font-semibold text-green-600">
                    {documents.filter(d => d.status === 'valid').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expiring Soon</span>
                  <span className="text-lg font-semibold text-amber-600">
                    {documents.filter(d => d.status === 'expiring').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Expired</span>
                  <span className="text-lg font-semibold text-red-600">
                    {documents.filter(d => d.status === 'expired').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Documents */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Documents & Certifications</h2>
                <button className="text-sm text-primary-600 hover:text-primary-900">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{doc.title}</h3>
                            {getStatusBadge(doc.status, doc.daysUntilExpiry)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{doc.issuer}</p>
                          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div>
                              <dt className="text-gray-500">Certificate No.</dt>
                              <dd className="text-gray-900 font-mono">{doc.certificateNumber}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Issue Date</dt>
                              <dd className="text-gray-900">{doc.issueDate}</dd>
                            </div>
                            {doc.expiryDate && (
                              <div>
                                <dt className="text-gray-500">Expiry Date</dt>
                                <dd className="text-gray-900 font-medium">{doc.expiryDate}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button className="text-sm text-primary-600 hover:text-primary-900">
                        View
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-900">
                        Download
                      </button>
                      {doc.expiryDate && (
                        <button className="text-sm text-gray-600 hover:text-gray-900">
                          Upload Renewal
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance history */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance History</h2>
          <div className="space-y-3">
            {[
              { date: '2024-11-15', type: 'LOLER Inspection', performed: 'Safety Inspections Ltd', result: 'Passed', notes: 'All components checked and verified' },
              { date: '2024-08-10', type: 'Routine Service', performed: 'Site A Team', result: 'Completed', notes: 'Cleaned and lubricated all moving parts' },
              { date: '2024-05-15', type: 'Safety Check', performed: 'Mike Davies', result: 'Passed', notes: 'Visual inspection - no issues found' },
            ].map((maintenance, index) => (
              <div key={index} className="flex items-start space-x-3 text-sm p-3 rounded-lg bg-gray-50">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <DocumentTextIcon className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{maintenance.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      maintenance.result === 'Passed' || maintenance.result === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {maintenance.result}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    {maintenance.date} · Performed by {maintenance.performed}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">{maintenance.notes}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-secondary w-full mt-4">View Full Maintenance History</button>
        </div>

        {/* QR Code / Asset Tracking */}
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Asset Tracking</h2>
              <p className="text-sm text-gray-600">
                Scan QR code to quickly access asset information
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
                <span className="text-4xl">📱</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button className="btn-secondary">Download QR Code</button>
            <button className="btn-secondary">Print Asset Label</button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
