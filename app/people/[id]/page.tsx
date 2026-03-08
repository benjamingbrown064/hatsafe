import AppLayout from '@/components/layout/AppLayout'
import {
  PencilIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function PersonProfilePage({ params }: { params: { id: string } }) {
  // Placeholder data (will be replaced with real data from Supabase)
  const person = {
    id: params.id,
    name: 'John Smith',
    role: 'Carpenter',
    team: 'Site A Team',
    site: 'Site A - Manchester',
    manager: 'Mike Davies',
    employmentStatus: 'active',
    contactEmail: 'john.smith@company.com',
    contactPhone: '+44 7700 900123',
    photoUrl: null,
  }

  const documents = [
    {
      id: '1',
      title: 'CSCS Card',
      issuer: 'CITB',
      certificateNumber: 'CSCS123456',
      issueDate: '2024-01-15',
      expiryDate: '2029-01-15',
      status: 'valid',
      daysUntilExpiry: 1095,
    },
    {
      id: '2',
      title: 'IPAF Certificate',
      issuer: 'IPAF',
      certificateNumber: 'IPAF456789',
      issueDate: '2023-06-20',
      expiryDate: '2026-03-25',
      status: 'expiring',
      daysUntilExpiry: 17,
    },
    {
      id: '3',
      title: 'First Aid Certificate',
      issuer: 'St John Ambulance',
      certificateNumber: 'FA2024-1234',
      issueDate: '2024-02-01',
      expiryDate: '2027-02-01',
      status: 'valid',
      daysUntilExpiry: 703,
    },
  ]

  const getStatusBadge = (status: string, daysUntil: number) => {
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
        <Link href="/people" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to People
        </Link>

        {/* Profile header */}
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-medium text-gray-600">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              {/* Basic info */}
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">{person.name}</h1>
                <p className="text-lg text-gray-600 mt-1">{person.role}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    person.employmentStatus === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {person.employmentStatus === 'active' ? 'Active' : 'Inactive'}
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
            {/* Contact information */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.contactEmail || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.contactPhone || 'Not provided'}</dd>
                </div>
              </dl>
            </div>

            {/* Work details */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Details</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Team</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.team}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Site</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.site}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Manager</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.manager}</dd>
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
                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
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
                            <div>
                              <dt className="text-gray-500">Expiry Date</dt>
                              <dd className="text-gray-900 font-medium">{doc.expiryDate}</dd>
                            </div>
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
                      <button className="text-sm text-gray-600 hover:text-gray-900">
                        Upload Renewal
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty state if no documents */}
              {documents.length === 0 && (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
                  <div className="mt-6">
                    <button className="btn-primary">
                      Upload First Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity timeline (placeholder) */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: 'Document uploaded', detail: 'CSCS Card', time: '2 hours ago', user: 'Admin User' },
              { action: 'Profile updated', detail: 'Team changed to Site A', time: '1 day ago', user: 'Mike Davies' },
              { action: 'Document approved', detail: 'IPAF Certificate', time: '3 days ago', user: 'Admin User' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 text-sm">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center">
                  <DocumentTextIcon className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-medium">{activity.action}</span> - {activity.detail}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {activity.time} by {activity.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
