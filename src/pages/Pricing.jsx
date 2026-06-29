import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  rose: '#F43F5E',
};

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
      description: `${plan.name} Plan – ${plan.duration}`,
      image: '🏠',
      prefill: {
        email: user.email,
        name: profile?.full_name || '',
      },
      theme: {
        color: T.indigo,
      },
      handler: async function (response) {
        // Payment successful — update Supabase
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
    <div style={{ minHeight: '100vh', background: T.bg, padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, position: 'relative' }}>
  <button
    onClick={() => navigate(-1)}
    style={{
      position: 'absolute', top: 0, left: 0,
      background: 'none', border: `1px solid ${T.border}`,
      color: T.muted, borderRadius: 8, padding: '6px 14px',
      fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
    }}
  >
    ← Back
  </button>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🏠</div>
        <h1 style={{ color: T.text, fontSize: 32, fontWeight: 700, margin: 0 }}>
          PropCRM Plans
        </h1>
        <p style={{ color: T.muted, marginTop: 12, fontSize: 16 }}>
          Everything you need to manage leads, pipeline & inventory
        </p>
        {profile?.subscription_status === 'active' && (
          <div style={{
            display: 'inline-block', marginTop: 16,
            background: '#10B98120', border: `1px solid ${T.emerald}`,
            color: T.emerald, borderRadius: 8, padding: '6px 16px', fontSize: 14
          }}>
            ✅ You have an active {profile.subscription_plan} plan until{' '}
            {new Date(profile.current_period_end).toLocaleDateString('en-IN')}
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        maxWidth: 1000,
        margin: '0 auto',
      }}>
        {planOrder.map((key) => {
          const plan = PLANS[key];
          const isPopular = key === 'quarterly';
          const isBest = key === 'halfyearly';
          const isActive = activePlan === key;

          return (
            <div
              key={key}
              onClick={() => setActivePlan(key)}
              style={{
                background: isActive ? '#1E2045' : T.surface,
                border: `2px solid ${isActive ? T.indigo : T.border}`,
                borderRadius: 16,
                padding: 28,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
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
                <span style={{ color: T.text, fontSize: 36, fontWeight: 800 }}>₹{plan.price}</span>
                <span style={{ color: T.muted, fontSize: 14 }}>{plan.billing}</span>
              </div>
              <div style={{ color: T.emerald, fontSize: 13, marginTop: 4 }}>
                {plan.description}
              </div>

              <hr style={{ border: 'none', borderTop: `1px solid ${T.border}`, margin: '20px 0' }} />

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  '✅ Unlimited Leads',
                  '✅ Pipeline Management',
                  '✅ Property Inventory',
                  '✅ Site Visit Tracking',
                  '✅ Email Reminders',
                  '✅ Priority Support',
                ].map((f) => (
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
                {loading && activePlan === key ? '⏳ Processing...' : `Get ${plan.name} →`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p style={{ textAlign: 'center', color: T.muted, marginTop: 40, fontSize: 13 }}>
        🔒 Secure payments via Razorpay · GST included · Cancel anytime
      </p>
    </div>
  );
}