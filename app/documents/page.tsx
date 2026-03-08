'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout'
import UploadDocumentModal from '@/components/documents/UploadDocumentModal';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

export default function DocumentsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // Placeholder data (will be replaced with real data from Supabase)
  const documents = [
    {
      id: '1',
      title: 'CSCS Card',
      entityName: 'John Smith',
      entityType: 'person',
      issuer: 'CITB',
      certificateNumber: 'CSCS123456',
      issueDate: '2024-01-15',
      expiryDate: '2029-01-15',
      status: 'valid',
      daysUntilExpiry: 1095,
    },
    {
      id: '2',
      title: 'MOT Certificate',
      entityName: 'AB12 CDE',
      entityType: 'vehicle',
      issuer: 'Quick Fit MOT Centre',
      certificateNumber: 'MOT987654',
      issueDate: '2025-02-10',
      expiryDate: '2026-03-15',
      status: 'expiring',
      daysUntilExpiry: 7,
    },
    {
      id: '3',
      title: 'IPAF Certificate',
      entityName: 'Sarah Johnson',
      entityType: 'person',
      issuer: 'IPAF',
      certificateNumber: 'IPAF456789',
      issueDate: '2023-06-20',
      expiryDate: '2026-02-01',
      status: 'expired',
      daysUntilExpiry: -37,
    },
    {
      id: '4',
      title: 'Vehicle Insurance',
      entityName: 'FG34 HIJ',
      entityType: 'vehicle',
      issuer: 'Insurance Co Ltd',
      certificateNumber: 'INS123789',
      issueDate: '2025-01-01',
      expiryDate: '2026-01-01',
      status: 'valid',
      daysUntilExpiry: 298,
    },
    {
      id: '5',
      title: 'LOLER Inspection',
      entityName: 'Scissor Lift 8m',
      entityType: 'asset',
      issuer: 'Safety Inspections Ltd',
      certificateNumber: 'LOLER2024-042',
      issueDate: '2024-11-15',
      expiryDate: '2026-03-20',
      status: 'expiring',
      daysUntilExpiry: 12,
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

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'person':
        return '👤'
      case 'vehicle':
        return '🚗'
      case 'asset':
        return '🔧'
      default:
        return '📄'
    }
  }

  return (
    <AppLayout>
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          setIsUploadModalOpen(false);
          // TODO: Refresh documents list
        }}
      />
      
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Documents</h1>
            <p className="mt-2 text-sm text-gray-700">
              All compliance documents across people, vehicles, and assets
            </p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Upload Document</span>
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
                placeholder="Search by title, entity, certificate number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-400 focus:border-primary-400"
              />
            </div>

            {/* Filter button */}
            <button className="btn-secondary flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>

            {/* Export button */}
            <button className="btn-secondary flex items-center space-x-2">
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>

          {/* Active filters (placeholder) */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700">
              All Types
              <button className="ml-2 text-primary-900 hover:text-primary-700">×</button>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700">
              All Statuses
              <button className="ml-2 text-primary-900 hover:text-primary-700">×</button>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700">
              All Entities
              <button className="ml-2 text-primary-900 hover:text-primary-700">×</button>
            </span>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-semibold text-gray-900">487</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </div>
          <div className="card text-center border-l-4 border-green-400">
            <div className="text-2xl font-semibold text-green-600">312</div>
            <div className="text-sm text-gray-600">Valid</div>
          </div>
          <div className="card text-center border-l-4 border-amber-400">
            <div className="text-2xl font-semibold text-amber-600">98</div>
            <div className="text-sm text-gray-600">Expiring Soon</div>
          </div>
          <div className="card text-center border-l-4 border-red-400">
            <div className="text-2xl font-semibold text-red-600">52</div>
            <div className="text-sm text-gray-600">Expired</div>
          </div>
          <div className="card text-center border-l-4 border-gray-400">
            <div className="text-2xl font-semibold text-gray-600">25</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
        </div>

        {/* Documents table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
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
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                          <div className="text-xs text-gray-500">{doc.issuer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getEntityIcon(doc.entityType)}</span>
                        <div className="text-sm text-gray-900">{doc.entityName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{doc.certificateNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.issueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.expiryDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.status, doc.daysUntilExpiry)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button className="text-primary-600 hover:text-primary-900">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Download
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
                <span className="font-medium">487</span> results
              </div>
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm">Previous</button>
                <button className="btn-primary text-sm">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Document type breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Type Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'CSCS Cards', count: 142, icon: '🎫' },
              { name: 'IPAF', count: 58, icon: '🏗️' },
              { name: 'MOT', count: 48, icon: '🚗' },
              { name: 'Insurance', count: 95, icon: '📋' },
              { name: 'LOLER', count: 87, icon: '🔧' },
              { name: 'Other', count: 57, icon: '📄' },
            ].map((type) => (
              <div key={type.name} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-lg font-semibold text-gray-900">{type.count}</div>
                <div className="text-xs text-gray-600">{type.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
