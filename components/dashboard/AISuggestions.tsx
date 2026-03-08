'use client';

import { Sparkles, TrendingUp, Shield, Clock } from 'lucide-react';
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
  // This will be replaced with real AI-generated suggestions
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
      title: 'Missing Documentation',
      description: '3 new employees have been added but no CSCS cards uploaded.',
      impact: 'Prevent site access issues',
      actionUrl: '/people?filter=missing-docs',
      actionLabel: 'Review'
    },
    {
      id: '3',
      type: 'efficiency',
      priority: 'medium',
      title: 'Automate MOT Reminders',
      description: 'Set up automated reminders for all vehicle MOTs 30 days before expiry.',
      impact: 'Zero missed renewals',
      actionUrl: '/settings/notifications',
      actionLabel: 'Enable'
    },
  ];

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'risk':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'efficiency':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'compliance':
        return <Shield className="w-4 h-4 text-amber-600" />;
    }
  };

  const highPriority = suggestions.filter(s => s.priority === 'high');
  const mediumPriority = suggestions.filter(s => s.priority === 'medium');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
        </div>
        <span className="text-sm text-gray-600">
          {suggestions.length} suggestions
        </span>
      </div>

      {/* High Priority */}
      {highPriority.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
            High Priority
          </h3>
          {highPriority.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      💡 {suggestion.impact}
                    </span>
                    <Link
                      href={suggestion.actionUrl}
                      className="text-xs font-medium text-yellow-600 hover:text-yellow-700"
                    >
                      {suggestion.actionLabel} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medium Priority */}
      {mediumPriority.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
            Worth Considering
          </h3>
          {mediumPriority.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {suggestion.impact}
                  </p>
                  <Link
                    href={suggestion.actionUrl}
                    className="text-xs font-medium text-gray-700 hover:text-gray-900"
                  >
                    {suggestion.actionLabel} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
