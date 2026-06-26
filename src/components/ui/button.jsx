import { cn } from '../../lib/utils'

export function Button({ className, variant = 'default', size = 'default', children, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100 text-gray-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  }
  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-12 px-8 text-base',
    icon: 'h-9 w-9',
  }
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}