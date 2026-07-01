import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const T = {
  bg: '#13141F',
  surface: '#1A1C2E',
  elevated: '#20223A',
  border: '#2A2D4A',
  indigo: '#5C6BC0',
  purple: '#7C3AED',
  emerald: '#10B981',
  amber: '#F59E0B',
  sky: '#0EA5E9',
  rose: '#F43F5E',
}

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        background: scrolled ? 'rgba(19,20,31,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 20, color: '#fff', textDecoration: 'none', letterSpacing: '-0.02em' }}>
        <span style={{
          width: 30, height: 30, borderRadius: 8,
          background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15
        }}>P</span>
        PropCRM
      </Link>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 14.5, fontWeight: 600 }}>Home</Link>
        <Link to="/pricing" style={{ color: '#B8BCD4', textDecoration: 'none', fontSize: 14.5, fontWeight: 500 }}>Pricing</Link>
        <Link to="/about" style={{ color: '#B8BCD4', textDecoration: 'none', fontSize: 14.5, fontWeight: 500 }}>About</Link>
        <Link to="/contact" style={{ color: '#B8BCD4', textDecoration: 'none', fontSize: 14.5, fontWeight: 500 }}>Contact</Link>
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: 14.5, fontWeight: 600 }}>Log in</Link>
        <Link
          to="/signup"
          style={{
            background: T.indigo, color: '#fff', textDecoration: 'none',
            padding: '9px 18px', borderRadius: 8, fontSize: 14.5, fontWeight: 600,
            boxShadow: `0 0 0 1px ${T.indigo}55`,
          }}
        >
          Start free trial
        </Link>
      </div>
    </nav>
  )
}

// The signature element: a card drifting across pipeline stages
function PipelineHero() {
  const stages = [
    { label: 'New Lead', color: T.sky },
    { label: 'Contacted', color: T.indigo },
    { label: 'Site Visit', color: T.amber },
    { label: 'Closed', color: T.emerald },
  ]
  return (
    <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', padding: '8px 0 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {stages.map((s, i) => (
          <div key={s.label} style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
            padding: '14px 10px', textAlign: 'center', position: 'relative', minHeight: 90,
          }}>
            <div style={{ fontSize: 11.5, color: '#8B8FB0', fontWeight: 600, letterSpacing: '0.02em' }}>{s.label}</div>
            <div style={{ width: 6, height: 6, borderRadius: 999, background: s.color, margin: '10px auto 0', opacity: 0.7 }} />
          </div>
        ))}
      </div>
      {/* drifting card */}
      <div className="drift-card" style={{
        position: 'absolute', top: 14, left: 8,
        background: T.elevated, border: `1px solid ${T.indigo}`, borderRadius: 9,
        padding: '8px 12px', fontSize: 12.5, fontWeight: 600, color: '#fff',
        boxShadow: `0 8px 24px -8px ${T.indigo}88`, whiteSpace: 'nowrap',
      }}>
         Raj Malhotra - 2BHK Sector 82
      </div>
      <style>{`
        .drift-card {
          animation: driftAcross 8s ease-in-out infinite;
        }
        @keyframes driftAcross {
          0%   { left: 1%;  opacity: 0; }
          6%   { opacity: 1; }
          22%  { left: 1%;  opacity: 1; }
          28%  { left: 26%; opacity: 1; }
          47%  { left: 26%; opacity: 1; }
          53%  { left: 51%; opacity: 1; }
          72%  { left: 51%; opacity: 1; }
          78%  { left: 76%; opacity: 1; }
          94%  { left: 76%; opacity: 1; }
          100% { left: 76%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .drift-card { animation: none; left: 26% !important; opacity: 1 !important; }
        }
      `}</style>
    </div>
  )
}

const FEATURES = [
  { icon: 'LD', title: 'Leads that don\u2019t vanish into chat', desc: 'Every enquiry lands in one place - searchable, filterable, and never buried under 200 unread WhatsApp messages.', color: T.sky },
  { icon: 'PL', title: 'A pipeline you can actually see', desc: 'Drag leads across stages. Unit status updates itself the moment a deal moves - no more double-booked flats.', color: T.indigo },
  { icon: 'IN', title: 'Inventory that stays in sync', desc: 'Projects and units, tracked live. Know what\u2019s available, blocked, or sold without a phone call to check.', color: T.purple },
  { icon: 'SV', title: 'Site visits, actually scheduled', desc: 'No more double bookings or forgotten follow-ups - every visit lives on a calendar your whole team can see.', color: T.amber },
  { icon: 'CM', title: 'Commission you can forecast', desc: 'Per-unit commission tracking means your earnings dashboard reflects what you\u2019ll actually make - not a guess.', color: T.emerald },
  { icon: 'MB', title: 'Runs from your pocket', desc: 'Full mobile layout with a bottom tab bar - built for agents who work from a car, not a desk.', color: T.rose },
]

function FeatureCard({ f, i }) {
  const [hover, setHover] = useState(false)
  return (
    <Reveal delay={i * 0.08}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: T.surface, border: `1px solid ${hover ? f.color + '88' : T.border}`,
          borderRadius: 14, padding: 24, height: '100%',
          transform: hover ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hover ? `0 16px 32px -16px ${f.color}55` : 'none',
          transition: 'all 0.25s ease',
        }}
      >
        <div style={{
          width: 42, height: 42, borderRadius: 10, background: f.color + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16,
        }}>{f.icon}</div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16.5, marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</div>
        <div style={{ color: '#9497B8', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
      </div>
    </Reveal>
  )
}

export default function Home() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Nav />

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, background: `radial-gradient(ellipse, ${T.indigo}33, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <Reveal>
          <div style={{
            display: 'inline-block', background: T.elevated, border: `1px solid ${T.border}`,
            borderRadius: 999, padding: '6px 14px', fontSize: 12.5, color: '#B8BCD4', marginBottom: 24, fontWeight: 500,
          }}>
            Built for independent agents & small brokerages in India
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.12,
            letterSpacing: '-0.03em', margin: '0 0 20px', maxWidth: 780, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Your leads are dying in{' '}
            <span style={{ color: T.rose }}>WhatsApp chats.</span>
            <br />Let&apos;s fix that.
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p style={{ fontSize: 17, color: '#9497B8', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}>
            PropCRM replaces the WhatsApp-and-Excel mess with one dashboard for leads, pipeline, inventory, and site visits - built for how Indian real estate actually works.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 56, flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`, color: '#fff',
              textDecoration: 'none', padding: '13px 26px', borderRadius: 10, fontWeight: 700, fontSize: 15.5,
              boxShadow: `0 8px 24px -8px ${T.indigo}88`,
            }}>
              Start your 7-day free trial
            </Link>
            <Link to="/pricing" style={{
              background: 'transparent', color: '#fff', border: `1px solid ${T.border}`,
              textDecoration: 'none', padding: '13px 26px', borderRadius: 10, fontWeight: 600, fontSize: 15.5,
            }}>
              See pricing
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <PipelineHero />
        </Reveal>
      </section>

      {/* FEATURED MODULES SHOWCASE (Zoho-style card) */}
      <section style={{ padding: '0 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 20,
            overflow: 'hidden',
          }}>
            {/* Preview panel */}
            <div style={{
              background: `linear-gradient(135deg, ${T.elevated}, ${T.bg})`,
              padding: '48px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderBottom: `1px solid ${T.border}`,
            }}>
              <div style={{
                width: '100%', maxWidth: 420, borderRadius: 14, background: T.elevated,
                border: `1px solid ${T.indigo}55`, padding: 20, boxShadow: `0 20px 60px -20px ${T.indigo}55`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: T.rose }} />
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: T.amber }} />
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: T.emerald }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['New Lead - Raj Malhotra', 'Site Visit - Sector 82', 'Deal Closed - 2BHK'].map((row, i) => (
                    <div key={row} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                      background: T.surface, borderRadius: 8, fontSize: 12.5, color: '#B8BCD4',
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: 999,
                        background: [T.sky, T.amber, T.emerald][i],
                      }} />
                      {row}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module tile row */}
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7B7F9E' }}>
                  Core modules
                </span>
                <Link to="/about" style={{ fontSize: 13.5, color: T.indigo, textDecoration: 'none', fontWeight: 600 }}>
                  Explore all features -&gt;
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                {[
                  { label: 'Leads', code: 'LD', color: T.sky },
                  { label: 'Pipeline', code: 'PL', color: T.indigo },
                  { label: 'Inventory', code: 'IN', color: T.purple },
                  { label: 'Site Visits', code: 'SV', color: T.amber },
                  { label: 'Commission', code: 'CM', color: T.emerald },
                ].map((m) => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, background: m.color + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: m.color,
                    }}>{m.code}</div>
                    <span style={{ fontSize: 13.5, color: '#B8BCD4', fontWeight: 500 }}>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
              Everything the spreadsheet couldn&apos;t do
            </h2>
            <p style={{ color: '#9497B8', fontSize: 15.5 }}>No more juggling five tools to run one business.</p>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '20px 24px 100px' }}>
        <Reveal>
          <div style={{
            maxWidth: 800, margin: '0 auto', textAlign: 'center',
            background: `linear-gradient(135deg, ${T.surface}, ${T.elevated})`,
            border: `1px solid ${T.border}`, borderRadius: 20, padding: '56px 32px',
          }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em' }}>
              Stop losing deals to a messy inbox
            </h2>
            <p style={{ color: '#9497B8', fontSize: 15.5, marginBottom: 28 }}>
              Free for 7 days. No card needed to start.
            </p>
            <Link to="/signup" style={{
              display: 'inline-block', background: T.indigo, color: '#fff', textDecoration: 'none',
              padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15.5,
            }}>
              Create your account
            </Link>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid ${T.border}`, padding: '32px 24px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        maxWidth: 1100, margin: '0 auto',
      }}>
        <div style={{ color: '#7B7F9E', fontSize: 13.5 }}>(c) {new Date().getFullYear()} PropCRM. Built in India.</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Refunds', '/refunds'], ['Shipping', '/shipping'], ['Contact', '/contact']].map(([label, href]) => (
            <Link key={href} to={href} style={{ color: '#7B7F9E', fontSize: 13.5, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}