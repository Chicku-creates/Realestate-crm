import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'

const T = {
  bg: '#13141F',
  surface: '#1A1C2E',
  elevated: '#20223A',
  border: '#1E2035',
  accent: '#5C6BC0',
  purple: '#7C3AED',
  text: '#F1F5F9',
  textMuted: '#64748B',
  textSub: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
}

const PLAN_CONFIG = {
  monthly:     { label: 'Monthly',     color: T.accent,   price: '₹299/mo' },
  quarterly:   { label: 'Quarterly',   color: T.purple,   price: '₹799/3mo' },
  half_yearly: { label: 'Half-Yearly', color: T.success,  price: '₹1499/6mo' },
  annual:      { label: 'Annual',      color: T.warning,  price: '₹2999/yr' },
  free:        { label: 'Free Trial',  color: T.textMuted, price: '₹0' },
}

export function Account() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ leads: 0, projects: 0, visits: 0 })

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: prof }, { count: leadCount }, { count: projectCount }, { count: visitCount }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('site_visits').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ])
    setProfile(prof)
    setStats({ leads: leadCount || 0, projects: projectCount || 0, visits: visitCount || 0 })
    setLoading(false)
  }

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U'
  const plan = profile?.plan_type || 'free'
  const planInfo = PLAN_CONFIG[plan] || PLAN_CONFIG.free
  const isActive = profile?.subscription_status === 'active'

  const expiryDate = profile?.subscription_expiry
    ? new Date(profile.subscription_expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  if (loading) return (
    <Layout>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg, minHeight: '100vh' }}>
        <p style={{ color: T.textMuted }}>Loading...</p>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div style={{ flex: 1, backgroundColor: T.bg, minHeight: '100vh', overflow: 'auto' }}>

        {/* Top bar */}
        <div style={{
          padding: '16px 28px', borderBottom: `1px solid ${T.border}`,
          backgroundColor: T.bg, position: 'sticky', top: 0, zIndex: 10,
        }}>
          <h1 style={{ color: T.text, fontSize: '18px', fontWeight: 700, margin: 0 }}>My Account</h1>
          <p style={{ color: T.textMuted, fontSize: '12px', margin: '2px 0 0' }}>Manage your profile and subscription</p>
        </div>

        <div style={{ padding: '24px 28px', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile card */}
          <div style={{
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
            borderRadius: '14px', padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #5C6BC0, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', fontWeight: 700, color: 'white', flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <p style={{ color: T.text, fontSize: '16px', fontWeight: 700, margin: 0 }}>
                  {user?.email?.split('@')[0]}
                </p>
                <p style={{ color: T.textMuted, fontSize: '13px', margin: '3px 0 0' }}>{user?.email}</p>
                {memberSince && (
                  <p style={{ color: T.textMuted, fontSize: '11px', margin: '3px 0 0' }}>
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </div>

            {/* Usage stats */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Leads', value: stats.leads, color: T.accent },
                { label: 'Projects', value: stats.projects, color: T.success },
                { label: 'Site Visits', value: stats.visits, color: T.warning },
              ].map(({ label, value, color }) => (
                <div key={label} style={{
                  flex: 1, minWidth: '100px',
                  backgroundColor: T.elevated, border: `1px solid ${T.border}`,
                  borderRadius: '10px', padding: '12px 16px',
                }}>
                  <p style={{ color: T.textMuted, fontSize: '11px', margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
                  <p style={{ color, fontSize: '22px', fontWeight: 700, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription card */}
          <div style={{
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
            borderRadius: '14px', padding: '24px',
          }}>
            <p style={{ color: T.textMuted, fontSize: '11px', fontWeight: 600, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Subscription
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    backgroundColor: planInfo.color + '22', color: planInfo.color,
                    fontSize: '12px', fontWeight: 700, padding: '3px 12px', borderRadius: '20px',
                  }}>
                    {planInfo.label}
                  </span>
                  <span style={{
                    backgroundColor: isActive ? '#10B98122' : '#EF444422',
                    color: isActive ? T.success : T.danger,
                    fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                  }}>
                    {isActive ? '✓ Active' : '✗ Inactive'}
                  </span>
                </div>
                <p style={{ color: T.text, fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}>
                  {planInfo.price}
                </p>
                {expiryDate && (
                  <p style={{ color: T.textMuted, fontSize: '12px', margin: 0 }}>
                    {isActive ? `Renews on ${expiryDate}` : `Expired on ${expiryDate}`}
                  </p>
                )}
                {!expiryDate && (
                  <p style={{ color: T.textMuted, fontSize: '12px', margin: 0 }}>No active subscription</p>
                )}
              </div>

              <a
                href="/pricing"
                style={{
                  backgroundColor: T.accent, color: 'white', border: 'none',
                  borderRadius: '8px', padding: '10px 20px', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                {isActive ? 'Change Plan' : '⭐ Upgrade Now'}
              </a>
            </div>

            {/* Plan features */}
            <div style={{
              marginTop: '20px', paddingTop: '16px',
              borderTop: `1px solid ${T.border}`,
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              {[
                { label: 'Unlimited Leads', ok: isActive },
                { label: 'Pipeline Management', ok: isActive },
                { label: 'Inventory Tracking', ok: isActive },
                { label: 'Site Visit Scheduler', ok: isActive },
                { label: 'Commission Forecast', ok: isActive },
              ].map(({ label, ok }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: ok ? T.success : T.textMuted, fontSize: '13px' }}>{ok ? '✓' : '○'}</span>
                  <span style={{ color: ok ? T.textSub : T.textMuted, fontSize: '13px' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account info card */}
          <div style={{
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
            borderRadius: '14px', padding: '24px',
          }}>
            <p style={{ color: T.textMuted, fontSize: '11px', fontWeight: 600, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Account Info
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Email', value: user?.email },
                { label: 'User ID', value: user?.id?.slice(0, 16) + '...' },
                { label: 'Plan', value: planInfo.label },
                { label: 'Status', value: isActive ? 'Active Subscriber' : 'Free / Inactive' },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: `1px solid ${T.border}`,
                }}>
                  <span style={{ color: T.textMuted, fontSize: '13px' }}>{label}</span>
                  <span style={{ color: T.text, fontSize: '13px', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}