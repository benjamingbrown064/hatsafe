export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">What Cookies We Use</h2>
        <p className="mb-4">HatSafe uses a minimal number of cookies required to operate the service.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left">Cookie</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Purpose</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Duration</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-2">sb-auth-token</td>
                <td className="border border-gray-200 px-4 py-2">Authentication session (Supabase)</td>
                <td className="border border-gray-200 px-4 py-2">Session</td>
                <td className="border border-gray-200 px-4 py-2">Essential</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">sb-refresh-token</td>
                <td className="border border-gray-200 px-4 py-2">Auth token refresh</td>
                <td className="border border-gray-200 px-4 py-2">30 days</td>
                <td className="border border-gray-200 px-4 py-2">Essential</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-2">cookie-consent</td>
                <td className="border border-gray-200 px-4 py-2">Remembers your cookie preferences</td>
                <td className="border border-gray-200 px-4 py-2">1 year</td>
                <td className="border border-gray-200 px-4 py-2">Functional</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Essential Cookies</h2>
        <p>Authentication cookies are strictly necessary to operate HatSafe. They cannot be disabled without logging out. No consent is required for these cookies under UK/EU law.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Analytics Cookies</h2>
        <p>If you consent to analytics, we may collect anonymised usage data to improve the product. Analytics data is never sold to third parties.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
        <p>You can control cookies through your browser settings. Disabling authentication cookies will prevent you from logging in. You can also update your preferences using the consent banner.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Contact</h2>
        <p>Cookie questions: <a href="mailto:privacy@hatsafe.io" className="text-blue-600 underline">privacy@hatsafe.io</a></p>
      </section>
    </main>
  );
}
