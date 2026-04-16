export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Who We Are</h2>
        <p>HatSafe is operated by One Beyond. We are registered in the United Kingdom. This policy describes how we collect and use your data.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. What Data We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Account data:</strong> Name, email address, organisation name</li>
          <li><strong>Uploaded documents:</strong> PDFs and images you upload for compliance tracking</li>
          <li><strong>Entity data:</strong> Names, roles, registration numbers for people, vehicles, and assets</li>
          <li><strong>Usage data:</strong> Pages visited, features used, timestamps</li>
          <li><strong>Billing data:</strong> Handled entirely by Stripe — we do not store card details</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide the HatSafe compliance management service</li>
          <li>To send expiry notifications and compliance alerts</li>
          <li>To process AI document extraction (with your explicit consent)</li>
          <li>To process subscription payments</li>
          <li>To provide customer support</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. AI Processing</h2>
        <p>When you enable AI document extraction, document content (including any personal data visible in documents) is sent to OpenAI for processing. We will always ask for your explicit consent before enabling this feature. You may withdraw consent at any time in Settings.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Third-Party Processors</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Supabase</strong> — database and file storage (EU region)</li>
          <li><strong>OpenAI</strong> — AI document extraction (opt-in only)</li>
          <li><strong>Stripe</strong> — payment processing</li>
          <li><strong>Vercel</strong> — application hosting</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Your GDPR Rights</h2>
        <p className="mb-2">Under UK/EU GDPR, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Access:</strong> Request a copy of your data (Settings → Export My Data)</li>
          <li><strong>Erasure:</strong> Request deletion of your data (Settings → Delete Organisation)</li>
          <li><strong>Portability:</strong> Export your data in machine-readable format</li>
          <li><strong>Correction:</strong> Update inaccurate data at any time</li>
          <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
        <p>We retain your data for as long as your account is active. After account deletion, a 30-day grace period applies before permanent deletion. Audit logs are retained for 12 months.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
        <p>Privacy questions or data requests: <a href="mailto:privacy@hatsafe.io" className="text-blue-600 underline">privacy@hatsafe.io</a></p>
      </section>
    </main>
  );
}
