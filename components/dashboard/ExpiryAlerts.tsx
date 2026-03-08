'use client';

import { AlertTriangle, Clock, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  entityName: string;
  entityType: 'person' | 'vehicle' | 'asset';
  documentType: string;
  expiryDate: string;
  daysUntilExpiry: number;
  actionUrl: string;
}

export default function ExpiryAlerts() {
  // This will be replaced with real data from Supabase
  // AI will generate these alerts based on expiry dates, compliance rules, and risk assessment
  const alerts: Alert[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'CSCS Card Expired',
      description: 'John Smith cannot work on site without valid certification',
      entityName: 'John Smith',
      entityType: 'person',
      documentType: 'CSCS Card',
      expiryDate: '2026-02-01',
      daysUntilExpiry: -7,
      actionUrl: '/people/john-smith'
    },
    {
      id: '2',
      severity: 'critical',
      title: 'MOT Due in 3 Days',
      description: 'Vehicle AB12 CDE cannot be driven legally after expiry',
      entityName: 'AB12 CDE',
      entityType: 'vehicle',
      documentType: 'MOT Certificate',
      expiryDate: '2026-03-11',
      daysUntilExpiry: 3,
      actionUrl: '/vehicles/ab12-cde'
    },
    {
      id: '3',
      severity: 'warning',
      title: 'Insurance Renewal in 14 Days',
      description: 'FG34 HIJ insurance expires soon. Book renewal now.',
      entityName: 'FG34 HIJ',
      entityType: 'vehicle',
      documentType: 'Vehicle Insurance',
      expiryDate: '2026-03-22',
      daysUntilExpiry: 14,
      actionUrl: '/vehicles/fg34-hij'
    },
    {
      id: '4',
      severity: 'warning',
      title: 'LOLER Inspection Due',
      description: 'Scissor Lift 8m requires inspection within 21 days',
      entityName: 'Scissor Lift 8m',
      entityType: 'asset',
      documentType: 'LOLER Inspection',
      expiryDate: '2026-03-29',
      daysUntilExpiry: 21,
      actionUrl: '/assets/scissor-lift-8m'
    },
    {
      id: '5',
      severity: 'info',
      title: 'IPAF Certificate Renewal Reminder',
      description: 'Sarah Johnson\'s certificate expires in 45 days. Consider booking renewal.',
      entityName: 'Sarah Johnson',
      entityType: 'person',
      documentType: 'IPAF Certificate',
      expiryDate: '2026-04-22',
      daysUntilExpiry: 45,
      actionUrl: '/people/sarah-johnson'
    }
  ];

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityBadgeClass = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getEntityIcon = (type: Alert['entityType']) => {
    switch (type) {
      case 'person':
        return '👤';
      case 'vehicle':
        return '🚗';
      case 'asset':
        return '🔧';
    }
  };

  const formatDaysUntilExpiry = (days: number) => {
    if (days < 0) {
      return `Overdue by ${Math.abs(days)} days`;
    } else if (days === 0) {
      return 'Expires today';
    } else if (days === 1) {
      return 'Expires tomorrow';
    } else {
      return `${days} days remaining`;
    }
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');
  const infoAlerts = alerts.filter(a => a.severity === 'info');

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <span className="font-medium">AI-Powered Compliance Tracking</span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
          <div className="text-xs text-red-700 mt-1">Requires immediate action</div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">Warning</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{warningAlerts.length}</div>
          <div className="text-xs text-amber-700 mt-1">Action needed soon</div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Upcoming</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{infoAlerts.length}</div>
          <div className="text-xs text-blue-700 mt-1">Plan ahead</div>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Critical - Action Required Now
          </h3>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <Link
                key={alert.id}
                href={alert.actionUrl}
                className="block p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getEntityIcon(alert.entityType)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-red-900">{alert.title}</h4>
                      <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded font-medium">
                        {formatDaysUntilExpiry(alert.daysUntilExpiry)}
                      </span>
                    </div>
                    <p className="text-sm text-red-800 mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-red-700">
                      <span className="font-medium">{alert.entityName}</span>
                      <span>•</span>
                      <span>{alert.documentType}</span>
                      <span>•</span>
                      <span>Expires: {new Date(alert.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700">
                      Take Action
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Warnings - Plan Soon
          </h3>
          <div className="space-y-3">
            {warningAlerts.map((alert) => (
              <Link
                key={alert.id}
                href={alert.actionUrl}
                className="block p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getEntityIcon(alert.entityType)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-amber-900">{alert.title}</h4>
                      <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded font-medium">
                        {formatDaysUntilExpiry(alert.daysUntilExpiry)}
                      </span>
                    </div>
                    <p className="text-sm text-amber-800 mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-amber-700">
                      <span className="font-medium">{alert.entityName}</span>
                      <span>•</span>
                      <span>{alert.documentType}</span>
                      <span>•</span>
                      <span>Expires: {new Date(alert.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Info Alerts */}
      {infoAlerts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Upcoming - Stay Prepared
          </h3>
          <div className="space-y-2">
            {infoAlerts.map((alert) => (
              <Link
                key={alert.id}
                href={alert.actionUrl}
                className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{getEntityIcon(alert.entityType)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-blue-900 text-sm">{alert.title}</h4>
                      <span className="text-xs px-2 py-0.5 bg-blue-200 text-blue-800 rounded">
                        {formatDaysUntilExpiry(alert.daysUntilExpiry)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-blue-700">
                      <span className="font-medium">{alert.entityName}</span>
                      <span>•</span>
                      <span>{alert.documentType}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Alerts */}
      {alerts.length === 0 && (
        <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-900 mb-1">All Clear!</h3>
          <p className="text-sm text-green-700">
            No compliance alerts at this time. All documents are up to date.
          </p>
        </div>
      )}
    </div>
  );
}
