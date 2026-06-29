const T = { bg: '#13141F', surface: '#1A1C2E', border: '#2A2D4A', text: '#E2E8F0', muted: '#94A3B8', indigo: '#5C6BC0' }

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, color: T.text, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: T.indigo }}>PropCRM</span>
        <span style={{ color: T.muted }}>/ Privacy Policy</span>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: T.muted, marginBottom: 40 }}>Last updated: June 29, 2025</p>
        {[
          { title: '1. Information We Collect', body: 'We collect information you provide when creating an account (name, email, phone), business details, and data you enter into PropCRM (leads, projects, site visits). We also collect usage data such as pages visited and features used to improve the Service.' },
          { title: '2. How We Use Your Information', body: 'We use your information to provide and improve the Service, process payments, send transactional emails (account confirmations, subscription receipts), and respond to support requests. We do not use your data for advertising purposes.' },
          { title: '3. Data Storage', body: 'Your data is stored securely on Supabase (PostgreSQL), hosted on AWS infrastructure. All data is encrypted at rest and in transit using industry-standard SSL/TLS encryption.' },
          { title: '4. Data Sharing', body: 'We do not sell, trade, or rent your personal data to third parties. We share data only with service providers necessary to operate PropCRM (Supabase for database, Razorpay for payments, Resend for emails) and only to the extent necessary to provide the Service.' },
          { title: '5. Payment Data', body: 'Payment processing is handled entirely by Razorpay. PropCRM does not store your credit card or banking details. Razorpay\'s privacy policy governs the handling of your payment information.' },
          { title: '6. Cookies', body: 'PropCRM uses essential cookies and local storage to maintain your login session. We do not use tracking or advertising cookies. You can clear cookies via your browser settings, though this will log you out of the Service.' },
          { title: '7. Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. To request data deletion or export, contact us at ckwalia01@gmail.com. We will process your request within 30 days.' },
          { title: '8. Data Retention', body: 'We retain your data for as long as your account is active. If you delete your account, your data will be permanently deleted within 30 days, except where retention is required by law.' },
          { title: '9. Children\'s Privacy', body: 'PropCRM is not intended for users under the age of 18. We do not knowingly collect personal information from minors.' },
          { title: '10. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email. Continued use of the Service after changes constitutes acceptance of the updated policy.' },
          { title: '11. Contact', body: 'For privacy-related questions or requests, contact us at: ckwalia01@gmail.com' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: T.indigo, marginBottom: 10 }}>{s.title}</h2>
            <p style={{ color: T.muted, lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${T.border}`, color: T.muted, fontSize: 14, textAlign: 'center' }}>
          © 2025 PropCRM · <a href="/terms" style={{ color: T.indigo }}>Terms</a> · <a href="/refunds" style={{ color: T.indigo }}>Refund Policy</a> · <a href="/contact" style={{ color: T.indigo }}>Contact Us</a>
        </div>
      </div>
    </div>
  )
}