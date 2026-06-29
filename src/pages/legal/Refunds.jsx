const T = { bg: '#13141F', surface: '#1A1C2E', border: '#2A2D4A', text: '#E2E8F0', muted: '#94A3B8', indigo: '#5C6BC0', emerald: '#10B981', rose: '#F43F5E', amber: '#F59E0B' }

export default function Refunds() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, color: T.text, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: T.indigo }}>PropCRM</span>
        <span style={{ color: T.muted }}>/ Cancellation & Refunds</span>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Cancellation & Refunds Policy</h1>
        <p style={{ color: T.muted, marginBottom: 40 }}>Last updated: June 29, 2025</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 40 }}>
          {[
            { icon: '✅', color: T.emerald, label: 'Cancel Anytime', desc: 'No lock-in contracts' },
            { icon: '🔄', color: T.amber, label: '7-Day Refund', desc: 'For first-time subscribers' },
            { icon: '📧', color: T.indigo, label: 'Easy Process', desc: 'Email us to request' },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontWeight: 600, color: item.color, marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: T.muted, fontSize: 13 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {[
          { title: '1. Cancellation Policy', body: 'You may cancel your PropCRM subscription at any time. Upon cancellation, you will retain access to the Service until the end of your current billing period. No further charges will be made after cancellation. To cancel, contact us at ckwalia01@gmail.com with your registered email address.' },
          { title: '2. Refund Eligibility', body: 'First-time subscribers are eligible for a full refund if requested within 7 days of the initial payment, provided the account has not been used extensively. Renewals and subsequent billing cycles are non-refundable. Free trial users are not eligible for refunds as no payment is made during the trial period.' },
          { title: '3. How to Request a Refund', body: 'To request a refund, email ckwalia01@gmail.com within 7 days of payment with: (1) your registered email address, (2) the transaction/payment ID from Razorpay, and (3) reason for the refund request. We will process eligible refunds within 5–7 business days to your original payment method.' },
          { title: '4. Non-Refundable Situations', body: 'Refunds will not be provided for: subscription renewals, partially used billing periods (beyond the 7-day window), accounts found to have violated our Terms and Conditions, and requests made after 7 days from the payment date.' },
          { title: '5. Plan Upgrades / Downgrades', body: 'If you upgrade your plan, the price difference will be charged immediately for the remaining period. Downgrading takes effect at the start of the next billing cycle. No partial refunds are issued for downgrades.' },
          { title: '6. Exceptional Circumstances', body: 'In cases of extended service outages caused by PropCRM (beyond 24 hours), we may offer pro-rated credits at our discretion. Such credits will be applied to your next billing cycle.' },
          { title: '7. Contact for Refunds', body: 'Email: ckwalia01@gmail.com — Please use the subject line "Refund Request - [Your Email]" for faster processing. We aim to respond to all refund requests within 2 business days.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: T.indigo, marginBottom: 10 }}>{s.title}</h2>
            <p style={{ color: T.muted, lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${T.border}`, color: T.muted, fontSize: 14, textAlign: 'center' }}>
          © 2025 PropCRM · <a href="/terms" style={{ color: T.indigo }}>Terms</a> · <a href="/privacy" style={{ color: T.indigo }}>Privacy Policy</a> · <a href="/shipping" style={{ color: T.indigo }}>Shipping Policy</a> · <a href="/contact" style={{ color: T.indigo }}>Contact Us</a>
        </div>
      </div>
    </div>
  )
}