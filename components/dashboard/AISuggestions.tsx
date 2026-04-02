'use client';

import Link from 'next/link';
import {
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  BoltIcon,
  ArrowUpRightIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

type Priority = 'high' | 'medium' | 'low';
type SuggestionType = 'optimization' | 'risk' | 'efficiency' | 'compliance';

interface Suggestion {
  id: string;
  type: SuggestionType;
  priority: Priority;
  title: string;
  description: string;
  impact: string;
  actionUrl: string;
  actionLabel: string;
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    type: 'risk',
    priority: 'high',
    title: 'Bulk Renewal Opportunity',
    description: '12 CSCS cards expiring in Q2 2026. Book a group training session to save 20% on costs.',
    impact: 'Save £240 · 4h admin reduction',
    actionUrl: '/people',
    actionLabel: 'View People',
  },
  {
    id: '2',
    type: 'compliance',
    priority: 'high',
    title: 'Missing Documentation',
    description: '3 recently added workers have no CSCS cards uploaded. Prevent site access issues.',
    impact: 'Avoid potential HSE compliance breach',
    actionUrl: '/people',
    actionLabel: 'Review',
  },
  {
    id: '3',
    type: 'efficiency',
    priority: 'medium',
    title: 'Automate MOT Reminders',
    description: 'Enable automated reminders for all vehicle MOTs 30 days before expiry.',
    impact: 'Zero missed renewals',
    actionUrl: '/settings',
    actionLabel: 'Enable',
  },
];

function TypeIcon({ type }: { type: SuggestionType }) {
  const cls = 'w-4 h-4';
  const s = { color: '#474747' };
  if (type === 'efficiency')   return <BoltIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'risk')         return <ShieldCheckIcon className={cls} style={s} strokeWidth={1.5} />;
  if (type === 'compliance')   return <ShieldCheckIcon className={cls} style={s} strokeWidth={1.5} />;
  return <ClockIcon className={cls} style={s} strokeWidth={1.5} />;
}

export default function AISuggestions() {
  const high   = suggestions.filter(s => s.priority === 'high');
  const medium = suggestions.filter(s => s.priority === 'medium');

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4" style={{ color: '#FFC107' }} strokeWidth={2} />
          <span className="label-sm">AI INSIGHTS</span>
        </div>
        <span className="label-sm">{suggestions.length} SUGGESTIONS</span>
      </div>

      {/* High priority */}
      {high.length > 0 && (
        <div>
          <div className="label-sm mb-3">HIGH PRIORITY</div>
          <div className="space-y-2">
            {high.map((s) => (
              <div key={s.id} className="p-4"
                style={{ backgroundColor: '#F9F9F9', border: '1px solid rgba(198,198,198,0.4)', borderRadius: '4px' }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                    <TypeIcon type={s.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm mb-1" style={{ color: '#1A1C1C' }}>{s.title}</div>
                    <p className="text-xs mb-3" style={{ color: '#474747', lineHeight: 1.6 }}>{s.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <LightBulbIcon className="w-3 h-3" style={{ color: '#FFC107' }} strokeWidth={2} />
                        <span className="text-xs" style={{ color: '#A3A3A3' }}>{s.impact}</span>
                      </div>
                      <Link href={s.actionUrl}
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: '#1A1C1C', textDecoration: 'none' }}>
                        {s.actionLabel}
                        <ArrowUpRightIcon className="w-3 h-3" strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medium priority */}
      {medium.length > 0 && (
        <div>
          <div className="label-sm mb-3">WORTH CONSIDERING</div>
          <div className="space-y-2">
            {medium.map((s) => (
              <div key={s.id} className="p-4"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(198,198,198,0.4)', borderRadius: '4px' }}>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                    <TypeIcon type={s.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-0.5" style={{ color: '#1A1C1C' }}>{s.title}</div>
                    <div className="text-xs mb-2" style={{ color: '#A3A3A3' }}>{s.impact}</div>
                    <Link href={s.actionUrl}
                      className="text-xs font-medium"
                      style={{ color: '#474747', textDecoration: 'none' }}>
                      {s.actionLabel} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
