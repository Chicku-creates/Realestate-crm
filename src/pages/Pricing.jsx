import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PLANS, RAZORPAY_KEY_ID, loadRazorpayScript } from '../lib/razorpayConfig';

const T = {
  bg: '#13141F',
  surface: '#1A1C2E',
  elevated: '#20223A',
  border: '#2A2D4A',
  text: '#E2E4F0',
  muted: '#8B8FA8',
  indigo: '#5C6BC0',
  purple: '#7C3AED',
  emerald: '#10B981',
  amber: '#F59E0B',
  sky: '#0EA5E9',
  rose: '#F43F5E',
};

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
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
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        <Link to="/pricing" style={{ color: '#fff', textDecoration: 'none', fontSize: 14.5, fontWeight: 600 }}>Pricing</Link>
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
  );
}

const FEATURE_LIST = [
  '[x] Unlimited Leads',
  '[x] Pipeline Management',
  '[x] Property Inventory',
  '[x] Site Visit Tracking',
  '[x] Email Reminders',
  '[x] Priority Support',
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes - there\u2019s no lock-in. Cancel whenever you want and you\u2019ll keep access until your current period ends.' },
  { q: 'Is there a free trial?', a: 'Every new account gets a 7-day free trial with full access before any payment is needed.' },
  { q: 'What payment methods are supported?', a: 'All major cards, UPI, netbanking, and wallets via Razorpay\u2019s secure checkout.' },
  { q: 'Can I switch plans later?', a: 'Yes, you can move to a longer or shorter plan anytime from your Account page.' },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState('quarterly');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchProfile(data.user.id);
    });
  }, []);

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  }

  async function handleSubscribe(planKey) {
    if (!user) {
      navigate('/login?redirect=pricing');
      return;
    }

    setLoading(true);
    const plan = PLANS[planKey];

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Failed to load Razorpay. Check your internet connection.');
      setLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      subscription_id: null, // Will use plan_id for subscription
      // For subscriptions, use Razorpay Subscriptions API
      // Since we're doing client-side only (no backend), we'll use one-time payment
      // and track it manually. For full subscriptions, you'd need a backend.
      amount: plan.price * 100, // in paise
      currency: 'INR',
      name: 'PropCRM',
      description: `${plan.name} Plan  ${plan.duration}`,
      // image field removed (was emoji, safe to omit)
      prefill: {
        email: user.email,
        name: profile?.full_name || '',
      },
      theme: {
        color: T.indigo,
      },
      handler: async function (response) {
        // Payment successful - update Supabase
        await handlePaymentSuccess(response, planKey);
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  async function handlePaymentSuccess(response, planKey) {
    const plan = PLANS[planKey];

    // Calculate expiry date
    const now = new Date();
    const durationDays = {
      monthly: 30,
      quarterly: 90,
      halfyearly: 180,
      annual: 365,
    };
    const expiryDate = new Date(now.getTime() + durationDays[planKey] * 24 * 60 * 60 * 1000);

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_plan: planKey,
        subscription_id: response.razorpay_payment_id,
        current_period_end: expiryDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Supabase update error:', error);
      alert('Payment received but profile update failed. Contact support.');
    } else {
      setLoading(false);
      navigate('/dashboard?subscribed=true');
    }
  }

  const planOrder = ['monthly', 'quarterly', 'halfyearly', 'annual'];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Nav />

      {/* HERO */}
      <section style={{ padding: '64px 20px 20px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 560, height: 340, background: `radial-gradient(ellipse, ${T.indigo}22, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <Reveal>
          <div style={{ fontSize: 28, marginBottom: 10, fontWeight: 800, color: T.indigo, letterSpacing: '0.05em' }}>PROPCRM</div>
          <h1 style={{ color: T.text, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Simple plans, serious results
          </h1>
          <p style={{ color: T.muted, marginTop: 12, fontSize: 16 }}>
            Everything you need to manage leads, pipeline & inventory - pick what fits.
          </p>
        </Reveal>
        {profile?.subscription_status === 'active' && (
          <Reveal delay={0.1}>
            <div style={{
              display: 'inline-block', marginTop: 18,
              background: '#10B98120', border: `1px solid ${T.emerald}`,
              color: T.emerald, borderRadius: 8, padding: '6px 16px', fontSize: 14
            }}>
              You have an active {profile.subscription_plan} plan until{' '}
              {new Date(profile.current_period_end).toLocaleDateString('en-IN')}
            </div>
          </Reveal>
        )}
      </section>

      {/* Plans Grid */}
      <section style={{ padding: '32px 20px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
          maxWidth: 1000,
          margin: '0 auto',
        }}>
          {planOrder.map((key, i) => {
            const plan = PLANS[key];
            const isBest = key === 'halfyearly';
            const isActive = activePlan === key;

            return (
              <Reveal key={key} delay={i * 0.08}>
                <div
                  onClick={() => setActivePlan(key)}
                  style={{
                    background: isActive ? '#1E2045' : T.surface,
                    border: `2px solid ${isActive ? T.indigo : T.border}`,
                    borderRadius: 16,
                    padding: 28,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    position: 'relative',
                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isActive ? `0 16px 32px -16px ${T.indigo}66` : 'none',
                    height: '100%',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      background: isBest ? T.emerald : T.amber,
                      color: '#fff', borderRadius: 20, padding: '3px 14px',
                      fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ color: T.muted, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {plan.name}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <span style={{ color: T.text, fontSize: 36, fontWeight: 800 }}>Rs. {plan.price}</span>
                    <span style={{ color: T.muted, fontSize: 14 }}>{plan.billing}</span>
                  </div>
                  <div style={{ color: T.emerald, fontSize: 13, marginTop: 4 }}>
                    {plan.description}
                  </div>

                  <hr style={{ border: 'none', borderTop: `1px solid ${T.border}`, margin: '20px 0' }} />

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {FEATURE_LIST.map((f) => (
                      <li key={f} style={{ color: T.text, fontSize: 13, marginBottom: 8 }}>{f}</li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleSubscribe(key); }}
                    disabled={loading}
                    style={{
                      marginTop: 24, width: '100%',
                      background: isActive
                        ? `linear-gradient(135deg, ${T.indigo}, ${T.purple})`
                        : T.elevated,
                      color: T.text, border: `1px solid ${T.border}`,
                      borderRadius: 8, padding: '12px 0',
                      fontWeight: 600, fontSize: 15, cursor: loading ? 'wait' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {loading && activePlan === key ? 'Processing...' : `Get ${plan.name} ->`}
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <p style={{ textAlign: 'center', color: T.muted, marginTop: 32, fontSize: 13 }}>
            Secure payments via Razorpay - GST included - Cancel anytime
          </p>
        </Reveal>
      </section>

      {/* FAQ */}
      <section style={{ padding: '56px 20px 90px', maxWidth: 720, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ color: T.text, fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 24, letterSpacing: '-0.02em' }}>
            Frequently asked
          </h2>
        </Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.06}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ color: T.text, fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>{f.q}</div>
                <div style={{ color: T.muted, fontSize: 13.5, lineHeight: 1.6 }}>{f.a}</div>
              </div>
            </Reveal>
          ))}
        </div>
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
  );
}