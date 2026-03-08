'use client';

import AppLayout from '@/components/layout/AppLayout';
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts';
import AISuggestions from '@/components/dashboard/AISuggestions';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  // Placeholder data (will be replaced with real data from Supabase)
  const stats = [
    {
      name: 'Expired',
      value: '8',
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      name: 'Expiring Soon',
      value: '23',
      icon: ClockIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      name: 'Valid',
      value: '156',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Pending',
      value: '4',
      icon: DocumentTextIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Compliance overview for your organisation
          </p>
        </div>

        {/* AI Feature Banner */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-gray-900" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                AI-Powered Compliance Assistant
              </h3>
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                HatSafe automatically monitors all your documents, predicts compliance issues before they happen, 
                and provides intelligent recommendations to keep your team safe and legal.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Auto-extract document data
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Smart expiry predictions
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  Cost optimization insights
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Expiry Alerts - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <ExpiryAlerts />
            </div>
          </div>

          {/* AI Suggestions - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <AISuggestions />
            </div>
          </div>
        </div>

        {/* Calendar Preview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Expiries</h2>
              <p className="text-sm text-gray-600 mt-1">Next 30 days</p>
            </div>
            <button className="btn-secondary text-sm">
              View Calendar
            </button>
          </div>

          {/* Simple calendar preview */}
          <div className="grid grid-cols-7 gap-2">
            {[...Array(30)].map((_, i) => {
              const hasExpiry = [3, 7, 12, 18, 24].includes(i);
              const count = hasExpiry ? Math.floor(Math.random() * 5) + 1 : 0;
              
              return (
                <div
                  key={i}
                  className={`
                    aspect-square flex flex-col items-center justify-center rounded-md text-sm cursor-pointer transition-colors
                    ${hasExpiry 
                      ? 'bg-amber-50 border border-amber-200 hover:bg-amber-100' 
                      : 'border border-gray-100 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="font-medium text-gray-700">{i + 1}</span>
                  {hasExpiry && (
                    <span className="text-xs text-amber-700 font-medium">{count}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-yellow-50 transition-colors">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Add Person</div>
                <div className="text-sm text-gray-600">Register new worker</div>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-yellow-50 transition-colors">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Upload Document</div>
                <div className="text-sm text-gray-600">Add certificate or license</div>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-yellow-50 transition-colors">
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
  );
}
