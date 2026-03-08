export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center">
            <span className="text-black font-bold text-2xl">H</span>
          </div>
          <h1 className="text-4xl font-semibold text-gray-900">HatSafe</h1>
        </div>

        {/* Hero Text */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
            AI-Powered Compliance for Construction
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            Automatically track certificates, licenses, and inspections across your team, 
            vehicles, and equipment. Never miss an expiry date again.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Extraction</h3>
            <p className="text-sm text-gray-600">
              Upload a certificate, AI reads it instantly
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-3xl mb-3">⚠️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Alerts</h3>
            <p className="text-sm text-gray-600">
              Get notified before documents expire
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Save Money</h3>
            <p className="text-sm text-gray-600">
              Bulk renewals and cost optimization insights
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Launching Soon
            </h3>
            <p className="text-gray-700 mb-6">
              HatSafe is currently in private beta. We're working with select construction 
              companies to perfect the platform before public launch.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:benjamin@onebeyond.studio?subject=HatSafe Beta Access"
                className="btn-primary inline-flex items-center justify-center"
              >
                Request Beta Access
              </a>
              <a
                href="/login"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-12 text-sm text-gray-500">
          <p>© 2026 HatSafe. Built for construction teams who take safety seriously.</p>
        </div>
      </div>
    </div>
  );
}
