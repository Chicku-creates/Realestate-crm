import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const T = {
  bg: '#13141F', surface: '#1A1C2E', elevated: '#20223A',
  border: '#2A2D4A', text: '#F1F5F9', muted: '#64748B',
  sub: '#94A3B8', indigo: '#5C6BC0', purple: '#7C3AED', emerald: '#10B981',
}

const benefits = [
  { icon: '⚡', text: 'Set up in under 2 minutes' },
  { icon: '🔒', text: 'Your data is secure and private' },
  { icon: '📱', text: 'Works on mobile and desktop' },
  { icon: '🇮🇳', text: 'Built for Indian real estate market' },
]

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/dashboard')
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://realestate-crm-azure.vercel.app/dashboard' }
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif', backgroundColor: T.bg }}>

      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', background: `linear-gradient(160deg, #1A1C2E 0%, #13141F 60%, #1a1235 100%)`,
        borderRight: `1px solid ${T.border}`, minWidth: 0,
      }}>
        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏠</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Prop<span style={{ color: T.indigo }}>CRM</span></span>
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 800, color: T.text, lineHeight: 1.2, margin: '0 0 16px' }}>
            Welcome back to<br />
            <span style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              your workspace
            </span>
          </h1>
          <p style={{ color: T.sub, fontSize: 16, lineHeight: 1.7, margin: '0 0 48px', maxWidth: 380 }}>
            Your leads, pipeline, inventory and site visits are waiting for you. Sign in to pick up where you left off.
          </p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <span style={{ color: T.sub, fontSize: 14 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ backgroundColor: T.elevated, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
          <p style={{ color: T.sub, fontSize: 14, margin: '0 0 12px' }}>New to PropCRM?</p>
          <p style={{ color: T.text, fontSize: 15, fontWeight: 600, margin: '0 0 16px', lineHeight: 1.5 }}>
            Start your 7-day free trial — no credit card required.
          </p>
          <Link to="/signup" style={{
            display: 'inline-block', backgroundColor: T.indigo, color: '#fff',
            borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600,
            textDecoration: 'none',
          }}>
            Create free account →
          </Link>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '480px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', overflowY: 'auto' }}>

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ color: T.text, fontSize: 26, fontWeight: 700, margin: '0 0 8px' }}>Sign in</h2>
          <p style={{ color: T.muted, fontSize: 14, margin: 0 }}>Enter your credentials to access your account</p>
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
          <span style={{ color: T.muted, fontSize: 12 }}>or sign in with email</span>
          <div style={{ flex: 1, height: 1, backgroundColor: T.border }} />
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: T.sub, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ width: '100%', backgroundColor: T.elevated, border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 14px', color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ color: T.sub, fontSize: 13, fontWeight: 500 }}>Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </div>

        <p style={{ color: T.muted, fontSize: 14, textAlign: 'center', marginTop: 24 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: T.indigo, fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}