import { STATUS_COLORS } from '../lib/utils'
import { format } from 'date-fns'

const UNIT_STATUS_STYLES = {
  available: { bg: '#10B98120', color: '#10B981' },
  reserved:  { bg: '#F59E0B20', color: '#F59E0B' },
  booked:    { bg: '#0EA5E920', color: '#0EA5E9' },
  sold:      { bg: '#64748B20', color: '#64748B' },
  blocked:   { bg: '#EF444420', color: '#EF4444' },
}

function formatPrice(n) {
  if (!n) return null
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)}L`
  return `₹${Number(n).toLocaleString('en-IN')}`
}

export function LeadCard({ lead, onEdit, onDelete, onScheduleVisit, onViewDetail }) {
  const formatBudget = (min, max) => {
    const fmt = (n) => n >= 10000000 ? `${(n/10000000).toFixed(1)}Cr` : n >= 100000 ? `${(n/100000).toFixed(0)}L` : `₹${n}`
    if (min && max) return `${fmt(min)} - ${fmt(max)}`
    if (min) return `From ${fmt(min)}`
    if (max) return `Up to ${fmt(max)}`
    return null
  }

  const unit = lead.units || null
  const project = unit?.projects || null
  const unitStatus = unit?.status?.toLowerCase()
  const unitStyle = UNIT_STATUS_STYLES[unitStatus] || { bg: '#5C6BC020', color: '#5C6BC0' }

  return (
    <div
      style={{
        backgroundColor: '#1A1C2E',
        border: '1px solid #1E2035',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2A2D4A'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1E2035'}
      onClick={() => onViewDetail(lead)}
    >
      {/* ── Header: name + status + actions ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#E2E8F0' }}>{lead.name}</h3>
          <span style={{
            display: 'inline-block',
            marginTop: '4px',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '99px',
            backgroundColor: '#5C6BC020',
            color: '#5C6BC0',
          }}>
            {lead.status}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={e => { e.stopPropagation(); onEdit(lead) }}
            style={{ padding: '5px', borderRadius: '7px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5C6BC020'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >✏️</button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(lead.id) }}
            style={{ padding: '5px', borderRadius: '7px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '13px' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EF444420'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >🗑️</button>
        </div>
      </div>

      {/* ── Contact + meta ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12.5px', color: '#94A3B8', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span>📞</span><span>{lead.phone}</span>
        </div>
        {lead.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span>✉️</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</span>
          </div>
        )}
        {lead.preferred_location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span>📍</span><span>{lead.preferred_location}</span>
          </div>
        )}
        {lead.followup_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span>📅</span>
            <span style={{ fontSize: '11.5px' }}>{format(new Date(lead.followup_date), 'dd MMM, h:mm a')}</span>
          </div>
        )}
      </div>

      {/* ── Source / budget / BHK pills ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #1E2035', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', backgroundColor: '#20223A', color: '#64748B', padding: '2px 8px', borderRadius: '99px' }}>
          {lead.source}
        </span>
        {formatBudget(lead.budget_min, lead.budget_max) && (
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981' }}>
            {formatBudget(lead.budget_min, lead.budget_max)}
          </span>
        )}
        {lead.bhk_preference && (
          <span style={{ fontSize: '11px', color: '#64748B' }}>{lead.bhk_preference}</span>
        )}
      </div>

      {/* ── Interested Unit section ── */}
      {unit && project && (
        <div style={{
          borderTop: '1px solid #1E2035',
          paddingTop: '10px',
          marginBottom: '10px',
        }}>
          <p style={{
            margin: '0 0 7px',
            fontSize: '10px',
            fontWeight: 600,
            color: '#5C6BC0',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            🏗️ Interested Unit
          </p>

          {/* Project name + builder */}
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#E2E8F0' }}>
            {project.project_name}
            <span style={{ color: '#64748B', fontWeight: 400 }}> · {project.builder_name}</span>
          </p>

          {/* Unit details row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              {unit.unit_number} · {unit.bhk_type}
              {unit.floor_number ? ` · Floor ${unit.floor_number}` : ''}
            </span>
            {unit.price && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>
                {formatPrice(unit.price)}
              </span>
            )}
          </div>

          {/* Unit status badge */}
          <span style={{
            display: 'inline-block',
            fontSize: '10.5px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '99px',
            backgroundColor: unitStyle.bg,
            color: unitStyle.color,
          }}>
            {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
          </span>
        </div>
      )}

      {/* ── Schedule visit button ── */}
      <button
        onClick={e => { e.stopPropagation(); onScheduleVisit(lead) }}
        style={{
          width: '100%',
          fontSize: '12px',
          fontWeight: 600,
          padding: '7px',
          borderRadius: '8px',
          border: '1px solid #2A2D4A',
          backgroundColor: 'transparent',
          color: '#5C6BC0',
          cursor: 'pointer',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5C6BC015'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        📅 Schedule Site Visit
      </button>
    </div>
  )
}