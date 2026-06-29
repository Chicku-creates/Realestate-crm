export const RAZORPAY_KEY_ID = 'rzp_test_T6VexndEkxymnd'; // 🔁 Replace with your actual Key ID

export const PLANS = {
  monthly: {
    id: 'plan_T6VlVPTdScTTFy',
    name: 'Monthly',
    price: 299,
    billing: '/month',
    description: 'Billed every month, cancel anytime',
    badge: null,
  },
  quarterly: {
    id: 'plan_T6Vmel0n9mmHiM',
    name: 'Quarterly',
    price: 799,
    billing: '/3 months',
    description: 'Billed every 3 months, save more',
    badge: 'Popular',
  },
  halfyearly: {
    id: 'plan_T6Vp9Q4hXf6sTo',
    name: 'Half-Yearly',
    price: 1499,
    billing: '/6 months',
    description: 'Billed every 6 months, great value',
    badge: 'Best Value',
  },
  annual: {
    id: 'plan_T6Vu5VnkkT570J',
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