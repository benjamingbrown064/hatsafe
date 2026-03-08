'use client';

import AppLayout from '@/components/layout/AppLayout'
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts'
import AISuggestions from '@/components/dashboard/AISuggestions'
import {
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  // Placeholder data (will be replaced with real data from Supabase)
  const stats = [
    {
      name: 'Expired',
      value: '8',
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      name: 'Expiring Soon',
      value: '23',
      icon: ClockIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      name: 'Valid',
      value: '156',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      name: 'Pending Review',
      value: '4',
      icon: DocumentTextIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ]

  const urgentItems = [
    { entity: 'John Smith', type: 'CSCS Card', daysUntil: -3, status: 'expired' },
    { entity: 'ABC-123', type: 'MOT Certificate', daysUntil: 2, status: 'expiring' },
    { entity: 'Sarah Johnson', type: 'IPAF', daysUntil: 5, status: 'expiring' },
    { entity: 'Van-002', type: 'Insurance', daysUntil: 7, status: 'expiring' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Compliance overview for your organisation
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className={`card border-l-4 ${stat.borderColor}`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI-Powered Banner */}
        <div className="card bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-black" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                AI-Powered Compliance Assistant
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                HatSafe automatically monitors all your documents, predicts compliance issues before they happen, 
                and provides intelligent recommendations to keep your team safe and legal.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Auto-extract document data
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Smart expiry predictions
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Cost optimization insights
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* AI Expiry Alerts - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="card">
              <ExpiryAlerts />
            </div>
          </div>

          {/* AI Suggestions - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="card">
              <AISuggestions />
            </div>
          </div>
        </div>

        {/* Calendar preview */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Expiries</h2>
              <p className="text-sm text-gray-600">Next 30 days</p>
            </div>
            <button className="btn-secondary text-sm">
              View Calendar
            </button>
          </div>

          {/* Simple calendar preview - will be replaced with proper calendar component */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(30)].map((_, i) => {
              const hasExpiry = [3, 7, 12, 18, 24].includes(i)
              const count = hasExpiry ? Math.floor(Math.random() * 5) + 1 : 0
              
              return (
                <div
                  key={i}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-lg border text-sm
                    ${hasExpiry 
                      ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' 
                      : 'border-gray-200 hover:bg-gray-50'
                    }
                    cursor-pointer transition-colors
                  `}
                >
                  <span className="font-medium text-gray-700">{i + 1}</span>
                  {hasExpiry && (
                    <span className="text-xs text-amber-600 font-medium">{count}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button className="card hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Add Person</div>
                <div className="text-sm text-gray-600">Register new worker</div>
              </div>
            </div>
          </button>

          <button className="card hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Upload Document</div>
                <div className="text-sm text-gray-600">Add certificate or license</div>
              </div>
            </div>
          </button>

          <button className="card hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Generate Report</div>
                <div className="text-sm text-gray-600">Export compliance status</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
