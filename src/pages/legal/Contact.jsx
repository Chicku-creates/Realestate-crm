import { useState } from 'react'

const T = { bg: '#13141F', surface: '#1A1C2E', elevated: '#20223A', border: '#2A2D4A', text: '#E2E8F0', muted: '#94A3B8', indigo: '#5C6BC0' }

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    const mailto = `mailto:ckwalia01@gmail.com?subject=${encodeURIComponent(form.subject || 'PropCRM Support')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`
    window.location.href = mailto
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, color: T.text, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: T.indigo }}>PropCRM</span>
        <span style={{ color: T.muted }}>/ Contact Us</span>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Contact Us</h1>
        <p style={{ color: T.muted, marginBottom: 40 }}>We typically respond within 24 business hours.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          {[
            { icon: '📧', label: 'Email', value: 'ckwalia01@gmail.com' },
            { icon: '🌐', label: 'Website', value: 'realestate-crm-azure.vercel.app' },
            { icon: '🕐', label: 'Support Hours', value: 'Mon–Sat, 10am–6pm IST' },
            { icon: '📍', label: 'Based in', value: 'India' },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ color: T.muted, fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: T.text, fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Send us a message</h2>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: T.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p>Your email client should have opened. If not, email us directly at <strong style={{ color: T.indigo }}>ckwalia01@gmail.com</strong></p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'name', label: 'Your Name *', placeholder: 'Rahul Sharma' },
                { key: 'email', label: 'Email Address *', placeholder: 'rahul@example.com' },
                { key: 'subject', label: 'Subject', placeholder: 'e.g. Issue with subscription' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', color: T.muted, fontSize: 13, marginBottom: 6 }}>{f.label}</label>
                  <input
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: '100%', backgroundColor: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', color: T.muted, fontSize: 13, marginBottom: 6 }}>Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Describe your issue or question..."
                  rows={5}
                  style={{ width: '100%', backgroundColor: T.elevated, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', color: T.text, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
              <button
                onClick={handleSubmit}
                style={{ backgroundColor: T.indigo, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}
              >
                Send Message →
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${T.border}`, color: T.muted, fontSize: 14, textAlign: 'center' }}>
          © 2025 PropCRM · <a href="/terms" style={{ color: T.indigo }}>Terms</a> · <a href="/privacy" style={{ color: T.indigo }}>Privacy Policy</a> · <a href="/refunds" style={{ color: T.indigo }}>Refund Policy</a>
        </div>
      </div>
    </div>
  )
}