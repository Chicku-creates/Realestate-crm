import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#13141F',
  surface: '#1A1C2E',
  elevated: '#20223A',
  border: '#2A2D4A',
  text: '#F1F5F9',
  muted: '#64748B',
  sub: '#94A3B8',
  indigo: '#5C6BC0',
  purple: '#7C3AED',
  emerald: '#10B981',
}

const stats = [
  { value: '500+', label: 'Active agents' },
  { value: '₹2.4Cr', label: 'Commissions tracked' },
  { value: '12K+', label: 'Leads managed' },
]

const features = [
  { icon: '🎯', text: 'Track every lead from inquiry to close' },
  { icon: '🏗️', text: 'Manage your full property inventory' },
  { icon: '📅', text: 'Schedule & track site visits effortlessly' },
  { icon: '💰', text: 'Forecast commissions in real time' },
]

const testimonial = {
  quote: 'PropCRM replaced my 6 Excel sheets. I close 40% more deals now.',
  name: 'Rajesh Sharma',
  role: 'Independent Agent, Pune',
  initials: 'RS',
}

export function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    const { data, error } = await signUp(email, password)
    if (error) { setError(error.message); setLoading(false) }
    else {
      if (data?.user) {
        const trialEnd = new Date()
        trialEnd.setDate(trialEnd.getDate() + 7)
        await supabase.from('profiles').upsert({
          id: data.user.id,
          trial_ends_at: trialEnd.toISOString(),
          full_name: name,
        })
      }
      setSuccess(true)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://realestate-crm-azure.vercel.app/dashboard' }
    })
  }

  if (success) return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: 20, padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: T.emerald + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✅</div>
        <h2 style={{ color: T.text, fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Check your email!</h2>
        <p style={{ color: T.sub, lineHeight: 1.7, margin: '0 0 8px' }}>We sent a confirmation link to</p>
        <p style={{ color: T.indigo, fontWeight: 600, margin: '0 0 28px' }}>{email}</p>
        <p style={{ color: T.muted, fontSize: 13, margin: '0 0 24px' }}>Click the link to activate your account and start your 7-day free trial.</p>
        <Link to="/login" style={{ color: T.indigo, fontSize: 14, fontWeight: 500 }}>Back to Sign In →</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif', backgroundColor: T.bg }}>

      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', background: `linear-gradient(160deg, #1A1C2E 0%, #13141F 60%, #1a1235 100%)`,
        borderRight: `1px solid ${T.border}`, minWidth: 0,
      }}
        className="hide-on-mobile"
      >
        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏠</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Prop<span style={{ color: T.indigo }}>CRM</span></span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, color: T.text, lineHeight: 1.2, margin: '0 0 16px' }}>
            The CRM built for<br />
            <span style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Indian real estate
            </span>
          </h1>
          <p style={{ color: T.sub, fontSize: 16, lineHeight: 1.7, margin: '0 0 48px', maxWidth: 380 }}>
            Stop managing leads on WhatsApp and Excel. PropCRM gives you a professional edge — pipeline, inventory, site visits and commissions in one place.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{f.icon}</span>
                <span style={{ color: T.sub, fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 48 }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 24, fontWeight: 800, color: T.text }}>{s.value}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ backgroundColor: T.elevated, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
          <p style={{ color: T.sub, fontSize: 14, lineHeight: 1.7, margin: '0 0 16px', fontStyle: 'italic' }}>
            "{testimonial.quote}"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {testimonial.initials}
            </div>
            <div>
              <div style={{ color: T.text, fontSize: 13, fontWeight: 600 }}>{testimonial.name}</div>
              <div style={{ color: T.muted, fontSize: 12 }}>{testimonial.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ width: '480px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 48px', overflowY: 'auto' }}>
        
        {/* Mobile logo */}
        <div style={{ display: 'none', alignItems: 'center', gap: 10, marginBottom: 32 }} className="show-on-mobile">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏠</div>
          <span style={{ fontSize: 20, fontWeight: 800, color: T.text }}>Prop<span style={{ color: T.indigo }}>CRM</span></span>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ color: T.text, fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>Create your account</h2>
          <p style={{ color: T.muted, fontSize: 14, margin: 0 }}>Start your 7-day free trial. No credit card required.</p>
        </div>

        {/* Trial badge */}
        <div style={{ backgroundColor: T.emerald + '15', border: `1px solid ${T.emerald}40`, borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span>🎁</span>
          <span style={{ color: T.emerald, fontSize: 13, fontWeight: 500 }}>7 days free — full access, no payment needed</span>
        </div>

        {error && (
          <div style={{ backgroundColor: '#EF444415', border: '1px solid #EF444440', borderRadius: 10, padding: '10px 16px', color: '#EF4444', fontSize: 13, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${T.border}`,
            backgroundColor: T.elevated, color: T.text, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            marginBottom: 20, opacity: googleLoading ? 0.7 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/></svg>
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: T.border }} />
          <span style={{ color: T.muted, fontSize: 12 }}>or sign up with email</span>
          <div style={{ flex: 1, height: 1, backgroundColor: T.border }} />
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: T.sub, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Rahul Sharma"
              style={{ width: '100%', backgroundColor: T.elevated, border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 14px', color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: T.sub, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="rahul@example.com"
              required
              style={{ width: '100%', backgroundColor: T.elevated, border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 14px', color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: T.sub, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              style={{ width: '100%', backgroundColor: T.elevated, border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 14px', color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none',
              background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: 4,
            }}
          >
            {loading ? 'Creating account...' : 'Create Free Account →'}
          </button>
        </div>

        <p style={{ color: T.muted, fontSize: 12, textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
          By signing up you agree to our{' '}
          <a href="/terms" style={{ color: T.indigo }}>Terms</a> and{' '}
          <a href="/privacy" style={{ color: T.indigo }}>Privacy Policy</a>
        </p>

        <p style={{ color: T.muted, fontSize: 14, textAlign: 'center', marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: T.indigo, fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  )
}