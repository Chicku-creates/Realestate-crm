const T = { bg: '#13141F', surface: '#1A1C2E', border: '#2A2D4A', text: '#E2E8F0', muted: '#94A3B8', indigo: '#5C6BC0' }

export default function Shipping() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, color: T.text, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: T.indigo }}>PropCRM</span>
        <span style={{ color: T.muted }}>/ Shipping Policy</span>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Shipping Policy</h1>
        <p style={{ color: T.muted, marginBottom: 40 }}>Last updated: June 29, 2025</p>

        <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <p style={{ color: T.muted, lineHeight: 1.8 }}>
            PropCRM is a <strong style={{ color: T.text }}>100% digital Software-as-a-Service (SaaS) product</strong>. There are no physical goods, no packaging, and no physical delivery involved in any transaction.
          </p>
        </div>

        {[
          { title: '1. Digital Delivery', body: 'Upon successful payment, your PropCRM subscription is activated instantly. Access to the Service is granted immediately and you will receive a confirmation email at your registered email address. No physical shipment is involved.' },
          { title: '2. Service Activation', body: 'Your subscription begins on the date of payment. For new users, the free trial (if applicable) begins at account creation. Access to all features included in your plan is available immediately upon activation.' },
          { title: '3. Confirmation Email', body: 'A payment confirmation and subscription details will be sent to your registered email address within a few minutes of a successful transaction. If you do not receive this email, please check your spam folder or contact us at ckwalia01@gmail.com.' },
          { title: '4. No Physical Delivery', body: 'Since PropCRM delivers software services digitally, there are no shipping fees, delivery timelines, or courier partners involved. The concept of physical shipping does not apply to our Service.' },
          { title: '5. Service Availability', body: 'PropCRM aims for 99.9% uptime. Scheduled maintenance will be communicated in advance via email. In case of unexpected downtime, we will work to restore the Service as quickly as possible.' },
          { title: '6. Contact', body: 'For questions about your subscription or service access, contact us at: ckwalia01@gmail.com' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: T.indigo, marginBottom: 10 }}>{s.title}</h2>
            <p style={{ color: T.muted, lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${T.border}`, color: T.muted, fontSize: 14, textAlign: 'center' }}>
          © 2025 PropCRM · <a href="/terms" style={{ color: T.indigo }}>Terms</a> · <a href="/privacy" style={{ color: T.indigo }}>Privacy Policy</a> · <a href="/refunds" style={{ color: T.indigo }}>Refund Policy</a> · <a href="/contact" style={{ color: T.indigo }}>Contact Us</a>
        </div>
      </div>
    </div>
  )
}