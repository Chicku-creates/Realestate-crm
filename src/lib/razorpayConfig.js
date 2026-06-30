export const RAZORPAY_KEY_ID = 'rzp_live_T7m9B4kizl08Io'; // 🔁 Replace with your actual LIVE Key ID

export const PLANS = {
  monthly: {
    id: 'plan_T7hIJXW7DgvEOc',
    name: 'Monthly',
    price: 299,
    billing: '/month',
    description: 'Billed every month, cancel anytime',
    badge: null,
  },
  quarterly: {
    id: 'plan_T7hJ9L2MMqPO6s',
    name: 'Quarterly',
    price: 799,
    billing: '/3 months',
    description: 'Billed every 3 months, save more',
    badge: 'Popular',
  },
  halfyearly: {
    id: 'plan_T7hJs0mcVvVOA1',
    name: 'Half-Yearly',
    price: 1499,
    billing: '/6 months',
    description: 'Billed every 6 months, great value',
    badge: 'Best Value',
  },
  annual: {
    id: 'plan_T7hKRBpGnlIikw',
    name: 'Annual',
    price: 2999,
    billing: '/year',
    description: 'Billed yearly, maximum savings',
    badge: '🔥 Max Savings',
  },
};

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}