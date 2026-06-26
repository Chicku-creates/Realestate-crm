export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const LEAD_SOURCES = [
  '99acres', 'MagicBricks', 'Housing.com', 'WhatsApp', 'Referral', 'Walk-in'
]

export const LEAD_STATUSES = [
  'New', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Won', 'Lost'
]

export const STATUS_COLORS = {
  'New': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-yellow-100 text-yellow-700',
  'Site Visit Scheduled': 'bg-purple-100 text-purple-700',
  'Negotiation': 'bg-orange-100 text-orange-700',
  'Won': 'bg-green-100 text-green-700',
  'Lost': 'bg-red-100 text-red-700',
}

export const STATUS_COLUMN_COLORS = {
  'New': 'border-t-blue-500',
  'Contacted': 'border-t-yellow-500',
  'Site Visit Scheduled': 'border-t-purple-500',
  'Negotiation': 'border-t-orange-500',
  'Won': 'border-t-green-500',
  'Lost': 'border-t-red-500',
}