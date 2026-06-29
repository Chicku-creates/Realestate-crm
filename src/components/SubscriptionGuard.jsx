import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

const T = {
  bg: '#13141F', surface: '#1A1C2E', text: '#E2E4F0',
  muted: '#8B8FA8', indigo: '#5C6BC0', purple: '#7C3AED',
  border: '#2A2D4A',
};

export default function SubscriptionGuard({ children }) {
  const navigate = useNavigate();
  const { isSubscribed, loading } = useSubscription();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: T.muted }}>⏳ Checking subscription...</div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: 40, maxWidth: 440, textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: T.text, margin: '0 0 12px', fontSize: 22 }}>
            Subscription Required
          </h2>
          <p style={{ color: T.muted, marginBottom: 28, lineHeight: 1.6 }}>
            Your free trial has ended or your subscription has expired.
            Upgrade to continue using PropCRM.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            style={{
              background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '12px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}
          >
            View Plans →
          </button>
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => navigate('/login')}
              style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 13 }}
            >
              Sign in with a different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}