'use client';

import { Sparkles, TrendingUp, Shield, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface Suggestion {
  id: string;
  type: 'optimization' | 'risk' | 'efficiency' | 'compliance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  actionUrl: string;
  actionLabel: string;
}

export default function AISuggestions() {
  // This will be replaced with real AI-generated suggestions based on:
  // - Historical data patterns
  // - Common compliance issues
  // - Industry best practices
  // - Usage patterns
  const suggestions: Suggestion[] = [
    {
      id: '1',
      type: 'risk',
      priority: 'high',
      title: 'Bulk Renewal Opportunity',
      description: '12 CSCS cards expiring in Q2 2026. Consider booking group training session to save 20% on certification costs.',
      impact: 'Save £240 and reduce admin time by 4 hours',
      actionUrl: '/people?filter=cscs-expiring',
      actionLabel: 'View List'
    },
    {
      id: '2',
      type: 'compliance',
      priority: 'high',
      title: 'Missing Documentation Detected',
      description: '3 new employees have been added but no CSCS cards uploaded. Ensure compliance before site deployment.',
      impact: 'Prevent site access issues and potential fines',
      actionUrl: '/people?filter=missing-docs',
      actionLabel: 'Review Now'
    },
    {
      id: '3',
      type: 'efficiency',
      priority: 'medium',
      title: 'Automate MOT Reminders',
      description: 'Set up automated reminders for all vehicle MOTs 30 days before expiry. Reduces missed renewals by 85%.',
      impact: 'Zero missed renewals, save 2 hours/month',
      actionUrl: '/settings/notifications',
      actionLabel: 'Enable'
    },
    {
      id: '4',
      type: 'optimization',
      priority: 'medium',
      title: 'Insurance Policy Review',
      description: 'You have 8 vehicles with insurance expiring in March. Switching to fleet policy could save £1,200/year.',
      impact: 'Potential annual savings: £1,200',
      actionUrl: '/vehicles?filter=insurance-expiring',
      actionLabel: 'Analyze'
    },
    {
      id: '5',
      type: 'risk',
      priority: 'low',
      title: 'Equipment Utilization Insight',
      description: 'Scissor Lift 8m has not been deployed in 45 days. Consider hiring out or disposing to reduce LOLER costs.',
      impact: 'Save £300/year in inspection costs',
      actionUrl: '/assets/scissor-lift-8m',
      actionLabel: 'Review'
    }
  ];

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'risk':
        return <Shield className="w-5 h-5 text-red-600" />;
      case 'efficiency':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'compliance':
        return <Shield className="w-5 h-5 text-amber-600" />;
    }
  };

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'optimization':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'risk':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'efficiency':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'compliance':
        return 'bg-amber-50 border-amber-200 text-amber-900';
    }
  };

  const getPriorityBadge = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const highPriority = suggestions.filter(s => s.priority === 'high');
  const mediumPriority = suggestions.filter(s => s.priority === 'medium');
  const lowPriority = suggestions.filter(s => s.priority === 'low');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">AI Suggestions</h2>
        </div>
        <span className="text-sm text-gray-600">
          {suggestions.length} recommendations
        </span>
      </div>

      {/* High Priority */}
      {highPriority.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            High Priority
          </h3>
          <div className="space-y-3">
            {highPriority.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 border rounded-lg ${getTypeColor(suggestion.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                      <span className={`text-xs px-2 py-0.5 border rounded font-medium ${getPriorityBadge(suggestion.priority)}`}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium opacity-80">
                        💡 {suggestion.impact}
                      </span>
                      <Link
                        href={suggestion.actionUrl}
                        className="text-xs font-medium px-3 py-1.5 bg-black text-white rounded hover:bg-gray-800"
                      >
                        {suggestion.actionLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority */}
      {mediumPriority.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Medium Priority
          </h3>
          <div className="space-y-3">
            {mediumPriority.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 border rounded-lg ${getTypeColor(suggestion.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                    </div>
                    <p className="text-sm mb-3">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium opacity-80">
                        💡 {suggestion.impact}
                      </span>
                      <Link
                        href={suggestion.actionUrl}
                        className="text-xs font-medium px-3 py-1.5 bg-black text-white rounded hover:bg-gray-800"
                      >
                        {suggestion.actionLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Priority */}
      {lowPriority.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Consider Later
          </h3>
          <div className="space-y-2">
            {lowPriority.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-gray-600">{suggestion.impact}</p>
                  </div>
                  <Link
                    href={suggestion.actionUrl}
                    className="text-xs font-medium text-gray-700 hover:text-black"
                  >
                    {suggestion.actionLabel} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
