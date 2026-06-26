import { STATUS_COLORS } from '../lib/utils'
import { format } from 'date-fns'

export function LeadCard({ lead, onEdit, onDelete, onScheduleVisit }) {
  const formatBudget = (min, max) => {
    const fmt = (n) => n >= 10000000 ? `${(n/10000000).toFixed(1)}Cr` : n >= 100000 ? `${(n/100000).toFixed(0)}L` : `₹${n}`
    if (min && max) return `${fmt(min)} - ${fmt(max)}`
    if (min) return `From ${fmt(min)}`
    if (max) return `Up to ${fmt(max)}`
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${STATUS_COLORS[lead.status]}`}>
            {lead.status}
          </span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(lead)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">✏️</button>
          <button onClick={() => onDelete(lead.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">🗑️</button>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">📞 <span>{lead.phone}</span></div>
        {lead.email && <div className="flex items-center gap-2">✉️ <span className="truncate">{lead.email}</span></div>}
        {lead.preferred_location && <div className="flex items-center gap-2">📍 <span>{lead.preferred_location}</span></div>}
        {lead.followup_date && <div className="flex items-center gap-2">📅 <span className="text-xs">{format(new Date(lead.followup_date), 'dd MMM, h:mm a')}</span></div>}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{lead.source}</span>
        {formatBudget(lead.budget_min, lead.budget_max) && (
          <span className="text-xs font-medium text-green-700">{formatBudget(lead.budget_min, lead.budget_max)}</span>
        )}
        {lead.bhk_preference && <span className="text-xs text-gray-500">{lead.bhk_preference}</span>}
      </div>

      {/* Schedule Visit button */}
      <button
        onClick={() => onScheduleVisit(lead)}
        className="mt-3 w-full text-xs font-medium py-1.5 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        📅 Schedule Site Visit
      </button>
    </div>
  )
}