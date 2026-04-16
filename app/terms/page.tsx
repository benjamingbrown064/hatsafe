export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: April 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Service Description</h2>
        <p>HatSafe is a compliance document management platform designed for construction and trades businesses. It enables organisations to store, track, and manage compliance documents for people, vehicles, and assets.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Acceptable Use</h2>
        <p className="mb-2">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Upload documents you do not have the right to process</li>
          <li>Use the service for unlawful purposes</li>
          <li>Attempt to reverse engineer, hack, or disrupt the service</li>
          <li>Upload malicious files or content</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Subscription Terms</h2>
        <p className="mb-2">HatSafe is offered on a monthly or annual subscription basis. Subscriptions auto-renew unless cancelled before the renewal date. You may cancel at any time through the billing portal in Settings. Refunds are at our discretion.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. AI Processing Disclosure</h2>
        <p>HatSafe uses AI (OpenAI) to extract structured data from uploaded documents. By enabling AI extraction, you consent to your document content being sent to OpenAI for processing. AI results should be reviewed for accuracy — HatSafe does not guarantee extraction accuracy.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Data Deletion</h2>
        <p>You may request deletion of your organisation and all associated data at any time. Deletion is scheduled with a 30-day grace period. After this period, data is permanently deleted and cannot be recovered.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Liability</h2>
        <p>HatSafe is provided &ldquo;as is&rdquo;. We are not liable for document expiry, compliance failures, or loss of data beyond what is covered by our backup procedures. Users are responsible for verifying compliance requirements.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Account Termination</h2>
        <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive usage, or fail to maintain a valid subscription.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
        <p>Questions about these terms? Contact us at <a href="mailto:legal@hatsafe.io" className="text-blue-600 underline">legal@hatsafe.io</a>.</p>
      </section>
    </main>
  );
}
