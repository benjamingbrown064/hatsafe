export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        {/* Logo/Brand */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 bg-primary-400 rounded-lg flex items-center justify-center">
              <span className="text-3xl">🦺</span>
            </div>
            <h1 className="text-5xl font-bold text-secondary-800">
              HatSafe
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Compliance made simple. Never miss an expiry again.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-status-valid mb-2">✓</div>
            <div className="text-sm font-medium text-gray-600">Valid</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-status-expiring mb-2">⚠</div>
            <div className="text-sm font-medium text-gray-600">Expiring Soon</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-status-expired mb-2">✕</div>
            <div className="text-sm font-medium text-gray-600">Expired</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-status-missing mb-2">?</div>
            <div className="text-sm font-medium text-gray-600">Missing</div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4 mt-12">
          <button className="btn-primary px-8 py-3 text-base">
            Get Started
          </button>
          <p className="text-sm text-gray-500">
            Week 1: Foundation in progress 🚧
          </p>
        </div>

        {/* Tech Stack Badge */}
        <div className="mt-16 text-xs text-gray-400 space-y-1">
          <p>Built with Next.js 14 + TypeScript + Tailwind CSS</p>
          <p>Supabase (Auth + Database + Storage) · Vercel (Hosting) · Stripe (Billing)</p>
        </div>
      </div>
    </div>
  );
}
