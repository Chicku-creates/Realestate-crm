const T = {
  bg: '#13141F',
  surface: '#1A1C2E',
  border: '#2A2D4A',
  text: '#E2E8F0',
  muted: '#94A3B8',
  indigo: '#5C6BC0',
}

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, color: T.text, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: T.indigo }}>PropCRM</span>
        <span style={{ color: T.muted }}>/ Terms and Conditions</span>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Terms and Conditions</h1>
        <p style={{ color: T.muted, marginBottom: 40 }}>Last updated: June 29, 2025</p>
        {[
          { title: '1. Acceptance of Terms', body: 'By accessing or using PropCRM ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service. These terms apply to all users including real estate agents and brokerages who subscribe to PropCRM.' },
          { title: '2. Description of Service', body: 'PropCRM is a cloud-based CRM platform designed for independent real estate agents and small brokerages in India. Features include lead management, pipeline tracking, inventory management, site visit scheduling, and related tools accessible via a web browser.' },
          { title: '3. User Accounts', body: 'You must create an account to use PropCRM. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must provide accurate information during registration. We reserve the right to terminate accounts that violate these terms.' },
          { title: '4. Subscription and Payments', body: 'PropCRM offers paid subscription plans (Monthly, Quarterly, Half-Yearly, and Annual). All payments are processed securely through Razorpay. Subscription fees are charged in advance. We reserve the right to change pricing with 30 days notice.' },
          { title: '5. Free Trial', body: 'New users may be eligible for a free trial period. At the end of the trial, continued access requires a paid subscription. We reserve the right to modify or discontinue the free trial offer at any time.' },
          { title: '6. Acceptable Use', body: 'You agree to use PropCRM only for lawful purposes. You must not use the Service to store or transmit unlawful or harmful content, violate applicable laws, or infringe on intellectual property rights of others.' },
          { title: '7. Data and Privacy', body: 'Your use of PropCRM is governed by our Privacy Policy. You retain ownership of all data you enter into PropCRM. We will not sell or share your data with third parties except as described in our Privacy Policy or as required by law.' },
          { title: '8. Intellectual Property', body: 'PropCRM and its original content, features, and functionality are owned by PropCRM and protected by applicable intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the Service.' },
          { title: '9. Limitation of Liability', body: 'PropCRM is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount paid for the Service in the three months preceding the claim.' },
          { title: '10. Termination', body: 'We reserve the right to suspend or terminate your account if you violate these Terms. Upon termination, your right to use the Service ceases immediately.' },
          { title: '11. Changes to Terms', body: 'We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or in-app notice. Continued use of the Service after changes constitutes acceptance of the new Terms.' },
          { title: '12. Contact', body: 'For questions about these Terms, contact us at: ckwalia01@gmail.com' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: T.indigo, marginBottom: 10 }}>{s.title}</h2>
            <p style={{ color: T.muted, lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${T.border}`, color: T.muted, fontSize: 14, textAlign: 'center' }}>
          © 2025 PropCRM · <a href="/privacy" style={{ color: T.indigo }}>Privacy Policy</a> · <a href="/refunds" style={{ color: T.indigo }}>Refund Policy</a> · <a href="/contact" style={{ color: T.indigo }}>Contact Us</a>
        </div>
      </div>
    </div>
  )
}