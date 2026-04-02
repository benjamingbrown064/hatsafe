import Link from 'next/link';
import {
  SparklesIcon,
  BellAlertIcon,
  CurrencyPoundIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    Icon: SparklesIcon,
    title: 'AI Extraction',
    desc: 'Upload a certificate — AI reads expiry dates, certificate numbers, and entity details instantly.',
  },
  {
    Icon: BellAlertIcon,
    title: 'Smart Alerts',
    desc: 'Automated reminders 30, 14, and 7 days before documents expire.',
  },
  {
    Icon: CurrencyPoundIcon,
    title: 'Cost Visibility',
    desc: 'Bulk renewal opportunities and cost optimisation insights surfaced automatically.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: '#F9F9F9' }}>
      <div className="w-full" style={{ maxWidth: '560px' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#FFC107', borderRadius: '4px' }}>
            <span className="font-bold text-sm" style={{ color: '#1A1C1C' }}>H</span>
          </div>
          <div>
            <div className="font-semibold" style={{ color: '#1A1C1C', fontSize: '15px', letterSpacing: '-0.01em' }}>HatSafe</div>
            <div className="label-sm" style={{ fontSize: '9px' }}>COMPLIANCE PLATFORM</div>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-12">
          <p className="label-sm mb-3">AI-POWERED · CONSTRUCTION & TRADES</p>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1A1C1C', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Never miss a compliance expiry again.
          </h1>
          <p className="mt-4" style={{ color: '#474747', fontSize: '16px', lineHeight: 1.7 }}>
            Track certificates, licences, and inspections across your workforce, vehicles, and equipment — all in one place.
          </p>
        </div>

        {/* Feature tiles */}
        <div className="space-y-3 mb-12">
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#F3F3F3', borderRadius: '4px' }}>
                <f.Icon className="w-4 h-4" style={{ color: '#1A1C1C' }} strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: '#1A1C1C' }}>{f.title}</div>
                <div className="text-sm mt-0.5" style={{ color: '#474747' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/signup" className="flex-1">
            <button className="btn btn-primary w-full" style={{ padding: '12px', fontWeight: 600 }}>
              Start free trial
            </button>
          </Link>
          <Link href="/login" className="flex-1">
            <button className="btn btn-secondary w-full" style={{ padding: '12px' }}>
              Sign in
            </button>
          </Link>
        </div>

        <p className="mt-8 text-center" style={{ fontSize: '12px', color: '#A3A3A3' }}>
          14-day free trial · No credit card required · © 2026 HatSafe
        </p>
      </div>
    </div>
  );
}
