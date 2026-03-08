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
      description: 'FG34 HIJ insurance expires soon',
      entityName: 'FG34 HIJ',
      entityType: 'vehicle',
      documentType: 'Vehicle Insurance',
      expiryDate: '2026-03-22',
      daysUntilExpiry: 14,
      actionUrl: '/vehicles/fg34-hij'
    },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold text-gray-900">AI Compliance Alerts</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Critical</span>
          </div>
          <div className="text-2xl font-semibold text-red-600">{criticalAlerts.length}</div>
          <div className="text-xs text-red-700 mt-1">Requires immediate action</div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">Warning</span>
          </div>
          <div className="text-2xl font-semibold text-amber-600">{warningAlerts.length}</div>
          <div className="text-xs text-amber-700 mt-1">Action needed soon</div>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-red-900 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Critical - Action Required
          </h3>
          {criticalAlerts.map((alert) => (
            <Link
              key={alert.id}
              href={alert.actionUrl}
              className="block bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl mt-0.5">{getEntityIcon(alert.entityType)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-red-900 text-sm">{alert.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-red-200 text-red-900 rounded font-medium">
                      {formatDaysUntilExpiry(alert.daysUntilExpiry)}
                    </span>
                  </div>
                  <p className="text-sm text-red-800 mb-2">{alert.description}</p>
                  <div className="flex items-center gap-3 text-xs text-red-700">
                    <span className="font-medium">{alert.entityName}</span>
                    <span>•</span>
                    <span>{alert.documentType}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Warnings - Plan Soon
          </h3>
          {warningAlerts.map((alert) => (
            <Link
              key={alert.id}
              href={alert.actionUrl}
              className="block bg-amber-50 border border-amber-200 rounded-lg p-4 hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-xl mt-0.5">{getEntityIcon(alert.entityType)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-amber-900 text-sm">{alert.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-900 rounded">
                      {formatDaysUntilExpiry(alert.daysUntilExpiry)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-amber-700">
                    <span className="font-medium">{alert.entityName}</span>
                    <span>•</span>
                    <span>{alert.documentType}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Alerts */}
      {alerts.length === 0 && (
        <div className="text-center py-8 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-green-900 mb-1">All Clear!</h3>
          <p className="text-sm text-green-700">
            No compliance alerts at this time.
          </p>
        </div>
      )}
    </div>
  );
}
