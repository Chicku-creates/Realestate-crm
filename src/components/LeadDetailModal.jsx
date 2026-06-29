import { format } from 'date-fns'
import { STATUS_COLORS } from '../lib/utils'

export function LeadDetailModal({ lead, onClose, onEdit }) {
  if (!lead) return null

  const formatBudget = (min, max) => {
    const fmt = (n) => n >= 10000000 ? `${(n/10000000).toFixed(1)}Cr` : n >= 100000 ? `${(n/100000).toFixed(0)}L` : `₹${n}`
    if (min && max) return `${fmt(min)} - ${fmt(max)}`
    if (min) return `From ${fmt(min)}`
    if (max) return `Up to ${fmt(max)}`
    return 'Not specified'
  }

  const T = {
    bg: '#13141F', surface: '#1A1C2E', border: '#1E2035',
    text: '#E2E4F0', muted: '#8B8FA8', indigo: '#5C6BC0', purple: '#7C3AED',
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: 28, width: '100%', maxWidth: 480,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ color: T.text, fontSize: 20, fontWeight: 700, margin: 0 }}>{lead.name}</h2>
            <span style={{
              display: 'inline-block', marginTop: 6, fontSize: 12, fontWeight: 600,
              padding: '2px 10px', borderRadius: 20,
              background: '#1E2244', color: T.indigo, border: `1px solid ${T.indigo}40`,
            }}>
              {lead.status}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          {[
            { label: '📞 Phone', value: lead.phone },
            { label: '✉️ Email', value: lead.email || '—' },
            { label: '📍 Location', value: lead.preferred_location || '—' },
            { label: '🏠 BHK', value: lead.bhk_preference || '—' },
            { label: '💰 Budget', value: formatBudget(lead.budget_min, lead.budget_max) },
            { label: '📢 Source', value: lead.source || '—' },
            { label: '📅 Follow-up', value: lead.followup_date ? format(new Date(lead.followup_date), 'dd MMM yyyy, h:mm a') : '—' },
            { label: '🗓️ Created', value: lead.created_at ? format(new Date(lead.created_at), 'dd MMM yyyy') : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#13141F', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ color: T.muted, fontSize: 11, marginBottom: 4 }}>{label}</div>
              <div style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {lead.notes && (
          <div style={{ background: '#13141F', borderRadius: 8, padding: '10px 12px', marginBottom: 20 }}>
            <div style={{ color: T.muted, fontSize: 11, marginBottom: 4 }}>📝 Notes</div>
            <div style={{ color: T.text, fontSize: 13, lineHeight: 1.5 }}>{lead.notes}</div>
          </div>
        )}

        {/* Interested Unit */}
        {lead.units && lead.units.projects && (
          <div style={{ background: '#13141F', borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}>
            <div style={{ color: '#5C6BC0', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              🏗️ Interested Unit
            </div>

            {/* Project */}
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>{lead.units.projects.project_name}</span>
              <span style={{ color: '#64748B', fontSize: 12 }}> · {lead.units.projects.builder_name}</span>
            </div>

            {/* Unit details */}
            <div style={{ color: '#94A3B8', fontSize: 12, marginBottom: 8 }}>
              {lead.units.unit_number} · {lead.units.bhk_type}
              {lead.units.floor_number ? ` · Floor ${lead.units.floor_number}` : ''}
              {lead.units.price ? ` · ${lead.units.price >= 10000000 ? `₹${(lead.units.price/10000000).toFixed(2)}Cr` : `₹${(lead.units.price/100000).toFixed(0)}L`}` : ''}
            </div>

            {/* Status badge */}
            {(() => {
              const s = lead.units.status?.toLowerCase()
              const styles = {
                available: { bg: '#10B98120', color: '#10B981' },
                reserved:  { bg: '#F59E0B20', color: '#F59E0B' },
                booked:    { bg: '#0EA5E920', color: '#0EA5E9' },
                sold:      { bg: '#64748B20', color: '#64748B' },
                blocked:   { bg: '#EF444420', color: '#EF4444' },
              }
              const st = styles[s] || { bg: '#5C6BC020', color: '#5C6BC0' }
              return (
                <span style={{
                  display: 'inline-block', fontSize: '11px', fontWeight: 600,
                  padding: '2px 10px', borderRadius: '99px',
                  backgroundColor: st.bg, color: st.color,
                }}>
                  {lead.units.status.charAt(0).toUpperCase() + lead.units.status.slice(1)}
                </span>
              )
            })()}
          </div>
        )}

        {/* Edit button */}
        <button
          onClick={() => { onClose(); onEdit(lead) }}
          style={{
            width: '100%', padding: '11px',
            background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          ✏️ Edit Lead
        </button>
      </div>
    </div>
  )
}