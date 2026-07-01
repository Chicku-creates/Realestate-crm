import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.35"/>
      </svg>
    ),
    accent: '#5C6BC0',
  },
  {
    to: '/leads',
    label: 'Leads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="3" fill="currentColor" opacity="0.9"/>
        <path d="M1 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
        <circle cx="12.5" cy="5.5" r="2" fill="currentColor" opacity="0.55"/>
        <path d="M12.5 9.5c1.381 0 2.5 1.12 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
      </svg>
    ),
    accent: '#7C3AED',
  },
  {
    to: '/pipeline',
    label: 'Pipeline',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="3" height="10" rx="1" fill="currentColor" opacity="0.9"/>
        <rect x="6" y="5" width="3" height="8" rx="1" fill="currentColor" opacity="0.7"/>
        <rect x="11" y="1" width="3" height="12" rx="1" fill="currentColor" opacity="0.45"/>
      </svg>
    ),
    accent: '#0EA5E9',
  },
  {
    to: '/inventory',
    label: 'Inventory',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="7" rx="1" fill="currentColor" opacity="0.9"/>
        <rect x="9" y="1" width="6" height="4" rx="1" fill="currentColor" opacity="0.6"/>
        <rect x="9" y="7" width="6" height="8" rx="1" fill="currentColor" opacity="0.45"/>
        <rect x="1" y="10" width="6" height="5" rx="1" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
    accent: '#10B981',
  },
  {
    to: '/visits',
    label: 'Visits',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.9"/>
        <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
        <rect x="4" y="9" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.8"/>
        <rect x="7" y="9" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
        <rect x="10" y="9" width="2" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    accent: '#F59E0B',
  },
]

// Bottom tab links (5 core pages, no Upgrade)
const BOTTOM_TAB_LINKS = NAV_LINKS

export function Navbar() {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U'

  // --- MOBILE BOTTOM TAB BAR ---
  const BottomTabBar = () => (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#13141F',
        borderTop: '1px solid #1E2035',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {BOTTOM_TAB_LINKS.map(({ to, label, icon, accent }) => {
        const isActive = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              textDecoration: 'none',
              color: isActive ? accent : '#475569',
              flex: 1,
              height: '100%',
              position: 'relative',
            }}
          >
            {/* Active top indicator */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  borderRadius: '0 0 2px 2px',
                  backgroundColor: accent,
                }}
              />
            )}
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
            <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )

  // --- DESKTOP SIDEBAR ---
  const Sidebar = () => (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        backgroundColor: '#13141F',
        borderRight: '1px solid #1E2035',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid #1E2035' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #5C6BC0 0%, #7C3AED 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 11L5 5L8 8L11 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px', color: '#F1F5F9' }}>
            Prop
            <span style={{ background: 'linear-gradient(90deg, #5C6BC0, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CRM
            </span>
          </span>
        </div>
        <p style={{ fontSize: '11px', color: '#475569', marginTop: '8px', marginLeft: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </p>
      </div>

      {/* Workspace label */}
      <div style={{ padding: '14px 16px 6px' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3D4166' }}>
          Workspace
        </span>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0 8px' }}>
        {[...NAV_LINKS, {
          to: '/pricing',
          label: 'Upgrade ⭐',
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="currentColor" opacity="0.9"/>
            </svg>
          ),
          accent: '#F59E0B',
        }].map(({ to, label, icon, accent }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '7px', marginBottom: '2px',
                textDecoration: 'none', fontSize: '13.5px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#E2E8F0' : '#64748B',
                backgroundColor: isActive ? '#1E2244' : 'transparent',
                transition: 'all 0.15s ease',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#191B2E'
                  e.currentTarget.style.color = '#CBD5E1'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#64748B'
                }
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute', left: 0, top: '20%', height: '60%',
                  width: '3px', borderRadius: '0 2px 2px 0', backgroundColor: accent,
                }} />
              )}
              <span style={{ color: isActive ? accent : 'currentColor', display: 'flex', alignItems: 'center' }}>
                {icon}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom user section */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #1E2035' }}>
        <Link
  to="/account"
  style={{
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px 10px', borderRadius: '7px', marginBottom: '4px',
    textDecoration: 'none',
    backgroundColor: location.pathname === '/account' ? '#1E2244' : 'transparent',
  }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#191B2E'}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = location.pathname === '/account' ? '#1E2244' : 'transparent'}
>
  <div style={{
    width: '28px', height: '28px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #5C6BC0, #7C3AED)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0,
  }}>
    {initials}
  </div>
  <span style={{ fontSize: '12.5px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
    My account
  </span>
</Link>

        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderRadius: '7px', width: '100%',
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: '13.5px', color: '#475569', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2D1219'; e.currentTarget.style.color = '#F87171' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569' }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-3-3-3M13 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  )

  // Detect mobile using window width
  const isMobile = window.innerWidth < 768

  if (isMobile) return <BottomTabBar />
  return <Sidebar />
}