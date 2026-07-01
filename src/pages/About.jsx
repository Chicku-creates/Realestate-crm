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
        <Link to="/" style={{ color: '#B8BCD4', textDecoration: 'none', fontSize: 14.5, fontWeight: 500 }}>Home</Link>
<Link to="/pricing" style={{ color: '#B8BCD4', textDecoration: 'none', fontSize: 14.5, fontWeight: 500 }}>Pricing</Link>
        <Link to="/about" style={{ color: '#fff', textDecoration: 'none', fontSize: 14.5, fontWeight: 600 }}>About</Link>
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

function CitySkyline() {
  const buildings = [
    { x: 40, w: 46, h: 90, color: T.indigo },
    { x: 92, w: 34, h: 130, color: T.purple },
    { x: 132, w: 50, h: 70, color: T.sky },
    { x: 188, w: 38, h: 110, color: T.indigo },
    { x: 232, w: 44, h: 150, color: T.purple },
    { x: 282, w: 36, h: 85, color: T.amber },
    { x: 324, w: 48, h: 120, color: T.sky },
    { x: 378, w: 32, h: 65, color: T.indigo },
  ]
  return (
    <div style={{ maxWidth: 460, margin: '32px auto 0' }}>
      <svg viewBox="0 0 460 170" width="100%" style={{ display: 'block' }}>
        <defs>
          <radialGradient id="glow" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor={T.indigo} stopOpacity="0.25" />
            <stop offset="100%" stopColor={T.indigo} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="460" height="170" fill="url(#glow)" />
        {buildings.map((b, i) => (
          <g key={i}>
            <rect
              x={b.x} y={170 - b.h} width={b.w} height={b.h}
              fill={b.color} opacity="0.18" rx="3"
              className="skyline-building"
              style={{ transformOrigin: `${b.x + b.w / 2}px 170px`, animationDelay: `${i * 0.15}s` }}
            />
            <rect x={b.x} y={170 - b.h} width={b.w} height={b.h} fill="none" stroke={b.color} strokeOpacity="0.6" rx="3" />
          </g>
        ))}
        {/* a sold marker that pulses on one building */}
        <circle cx="256" cy="26" r="5" fill={T.emerald} className="sold-pulse" />
        <circle cx="256" cy="26" r="5" fill="none" stroke={T.emerald} strokeWidth="1.5" className="sold-ring" />
      </svg>
      <style>{`
        .skyline-building {
          animation: riseUp 0.8s ease backwards;
        }
        @keyframes riseUp {
          0%   { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 0.18; }
        }
        .sold-pulse { animation: pulseDot 2.2s ease-in-out infinite; }
        .sold-ring { animation: pulseRing 2.2s ease-out infinite; transform-origin: 256px 26px; }
        @keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skyline-building { animation: none; opacity: 0.18; }
          .sold-pulse, .sold-ring { animation: none; }
        }
      `}</style>
    </div>
  )
}

const PROBLEMS = [
  { icon: 'X', text: 'Leads sitting unread in WhatsApp until they go cold' },
  { icon: 'X', text: 'Two agents pitching the same "available" flat that was actually sold last week' },
  { icon: 'X', text: 'Excel sheets nobody updates, so nobody trusts them' },
  { icon: 'X', text: 'Site visits double-booked because there\u2019s no shared calendar' },
  { icon: 'X', text: 'No real idea what you\u2019ll earn this month until the deal actually closes' },
]

const USES = [
  { icon: 'LD', title: 'Lead management', desc: 'Capture every enquiry - from a call, a walk-in, or a portal - in one searchable list. Add notes, set follow-ups, never lose track of who\u2019s hot and who\u2019s gone cold.' },
  { icon: 'PL', title: 'Kanban pipeline', desc: 'Drag a lead from "New" to "Site Visit" to "Closed." Unit status updates automatically, so your inventory and your pipeline are never out of sync.' },
  { icon: 'IN', title: 'Inventory tracking', desc: 'Every project and unit in one place - availability, pricing, commission percentage - searchable and filterable instead of buried in a shared Excel file.' },
  { icon: 'SV', title: 'Site visit scheduling', desc: 'Book, reschedule, and track visits on a calendar your whole team can see, so no two agents show up for the same slot.' },
  { icon: 'CM', title: 'Commission forecasting', desc: 'Per-unit commission tracking feeds directly into your dashboard, so you know what you\u2019re actually earning - not guessing.' },
  { icon: 'MB', title: 'Works from anywhere', desc: 'Fully responsive with a mobile bottom-tab layout, built for agents who work from a car or a site visit, not a desk.' },
]

const WHO = [
  { icon: 'IA', title: 'Independent agents', desc: 'Running solo and tired of managing leads across five different chat threads.' },
  { icon: 'SB', title: 'Small brokerages', desc: 'A handful of agents who need one shared source of truth instead of individual spreadsheets.' },
  { icon: 'T2', title: 'Tier 1 & Tier 2 city teams', desc: 'Built with Indian real estate workflows in mind - not a generic global CRM bolted on.' },
]

export default function About() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Nav />

      {/* HERO */}
      <section style={{ padding: '72px 24px 48px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 560, height: 360, background: `radial-gradient(ellipse, ${T.purple}22, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <Reveal>
          <div style={{
            display: 'inline-block', background: T.elevated, border: `1px solid ${T.border}`,
            borderRadius: 999, padding: '6px 14px', fontSize: 12.5, color: '#B8BCD4', marginBottom: 22, fontWeight: 500,
          }}>
            About PropCRM
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 18px', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.15 }}>
            A CRM built specifically for how Indian real estate actually works
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p style={{ fontSize: 16.5, color: '#9497B8', maxWidth: 620, margin: '0 auto', lineHeight: 1.65 }}>
            Not a generic global CRM with real estate bolted on. PropCRM is built ground-up for independent agents and small brokerages in Tier 1 and Tier 2 Indian cities - where the real workflow still runs on WhatsApp and Excel.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <CitySkyline />
        </Reveal>
      </section>

      {/* THE PROBLEM */}
      <section style={{ padding: '40px 24px', maxWidth: 720, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Why this exists</h2>
          <p style={{ color: '#9497B8', fontSize: 14.5, marginBottom: 24 }}>Most agents aren\u2019t short on leads. They\u2019re short on a system to manage them.</p>
        </Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.text} delay={i * 0.05}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, background: T.surface,
                border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px',
              }}>
                <span style={{ fontSize: 15 }}>{p.icon}</span>
                <span style={{ color: '#B8BCD4', fontSize: 14.5 }}>{p.text}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ padding: '56px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, letterSpacing: '-0.02em', textAlign: 'center' }}>Who it\u2019s for</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {WHO.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.08}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 22, textAlign: 'center', height: '100%' }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{w.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 8 }}>{w.title}</div>
                <div style={{ color: '#9497B8', fontSize: 13.5, lineHeight: 1.55 }}>{w.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHAT IT DOES / USES */}
      <section style={{ padding: '32px 24px 72px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em', textAlign: 'center' }}>What it does</h2>
          <p style={{ color: '#9497B8', fontSize: 14.5, textAlign: 'center', marginBottom: 32 }}>Everything you need to run leads-to-close in one place.</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {USES.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.07}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 24, height: '100%' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: T.indigo + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, marginBottom: 14,
                }}>{u.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15.5, marginBottom: 8 }}>{u.title}</div>
                <div style={{ color: '#9497B8', fontSize: 13.5, lineHeight: 1.6 }}>{u.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY NECESSARY */}
      <section style={{ padding: '20px 24px 80px' }}>
        <Reveal>
          <div style={{
            maxWidth: 760, margin: '0 auto', background: `linear-gradient(135deg, ${T.surface}, ${T.elevated})`,
            border: `1px solid ${T.border}`, borderRadius: 18, padding: '40px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="beat-icon" style={{
                width: 34, height: 34, borderRadius: 9, background: T.rose + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: T.rose,
              }}>!</div>
              <h2 style={{ fontSize: 21, fontWeight: 800, margin: 0 }}>Why a CRM is necessary, not optional</h2>
            </div>
            <style>{`
              .beat-icon { animation: heartbeat 1.8s ease-in-out infinite; }
              @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                15% { transform: scale(1.15); }
                30% { transform: scale(1); }
                45% { transform: scale(1.1); }
                60% { transform: scale(1); }
              }
              @media (prefers-reduced-motion: reduce) {
                .beat-icon { animation: none; }
              }
            `}</style>
            <p style={{ color: '#9497B8', fontSize: 14.5, lineHeight: 1.7, marginBottom: 0 }}>
              Real estate deals move slowly, involve multiple follow-ups, and depend on getting the right unit in front of the right buyer at the right time. Once you\u2019re juggling more than a handful of leads and units, memory and chat threads stop being reliable. A CRM isn\u2019t about looking professional - it\u2019s the difference between a lead that converts and one that quietly goes cold because nobody followed up on time.
            </p>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 100px', textAlign: 'center' }}>
        <Reveal>
          <Link to="/signup" style={{
            display: 'inline-block', background: T.indigo, color: '#fff', textDecoration: 'none',
            padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15.5,
          }}>
            Start your 7-day free trial
          </Link>
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
