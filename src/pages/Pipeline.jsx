import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'
import { LEAD_STATUSES } from '../lib/utils'
import { LeadDetailModal } from '../components/LeadDetailModal'

const T = {
  bg:       '#13141F',
  surface:  '#1A1C2E',
  elevated: '#20223A',
  border:   '#1E2035',
  borderHi: '#2A2D4A',
  textPri:  '#E2E8F0',
  textSec:  '#64748B',
  textMut:  '#3D4166',
  indigo:   '#5C6BC0',
  purple:   '#7C3AED',
  sky:      '#0EA5E9',
  emerald:  '#10B981',
  amber:    '#F59E0B',
  rose:     '#F43F5E',
  teal:     '#14B8A6',
}

const STATUS_ACCENT = {
  'New':         T.sky,
  'Contacted':   T.indigo,
  'In Progress': T.amber,
  'Site Visit':  T.purple,
  'Negotiation': T.teal,
  'Won':         T.emerald,
  'Lost':        T.rose,
}

const accent = (status) => STATUS_ACCENT[status] || T.indigo

function DragCard({ lead, col, isDragging, onDragStart, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, lead)}
      onClick={() => onClick(lead)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? '#1E2140' : '#181929',
        border: `1px solid ${hovered ? T.borderHi : T.border}`,
        borderRadius: '8px',
        padding: '12px',
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        transition: 'all 0.12s ease',
        boxShadow: hovered ? '0 2px 12px rgba(0,0,0,0.35)' : 'none',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '8px' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: T.textPri, lineHeight: 1.3 }}>
          {lead.name}
        </p>
        <span style={{
          flexShrink: 0, fontSize: '10px', fontWeight: 500,
          padding: '2px 7px', borderRadius: '99px',
          backgroundColor: col + '22', color: col, marginTop: '1px',
        }}>
          {lead.source}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: lead.preferred_location ? '5px' : 0 }}>
        <span style={{ fontSize: '11px' }}>📞</span>
        <span style={{ fontSize: '11.5px', color: T.textSec }}>{lead.phone}</span>
      </div>

      {lead.preferred_location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px' }}>📍</span>
          <span style={{ fontSize: '11px', color: T.textMut }}>{lead.preferred_location}</span>
        </div>
      )}
    </div>
  )
}

export function Pipeline() {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    supabase
      .from('leads')
      .select('*, units(*, projects(*))')
      .eq('user_id', user.id)
      .then(({ data }) => { setLeads(data || []); setLoading(false) })
  }, [])

  const columns = LEAD_STATUSES.map(status => ({
    status,
    leads: leads.filter(l => l.status === status),
  }))

  const handleDragStart = (e, lead) => {
    setDragging(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault()
    if (!dragging || dragging.status === targetStatus) { setDragging(null); setDragOver(null); return }
    setLeads(prev => prev.map(l => l.id === dragging.id ? { ...l, status: targetStatus } : l))
    await supabase.from('leads').update({ status: targetStatus }).eq('id', dragging.id)

    // Sync unit status based on lead stage
    if (dragging.interested_unit_id) {
      const unitStatus =
        targetStatus === 'Won'                                        ? 'sold'
        : targetStatus === 'Lost' || targetStatus === 'New'          ? 'available'
        : targetStatus === 'Negotiation'                             ? 'booked'
        : ['Contacted', 'In Progress', 'Site Visit'].includes(targetStatus) ? 'reserved'
        : null

      if (unitStatus) {
        await supabase.from('units').update({ status: unitStatus }).eq('id', dragging.interested_unit_id)
      }
    }
    setDragging(null)
    setDragOver(null)
  }

  return (
    <Layout>
      <div style={{
        flex: 1,
        backgroundColor: T.bg,
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Top bar */}
        <div style={{
          borderBottom: `1px solid ${T.border}`,
          padding: window.innerWidth < 768 ? '14px 16px' : '18px 32px',
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
backgroundColor: T.surface,
position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: T.textPri, letterSpacing: '-0.3px' }}>
              Pipeline
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: T.textSec }}>
              {loading ? 'Loading…' : `${leads.length} leads across ${LEAD_STATUSES.length} stages`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {LEAD_STATUSES.map(s => (
              <div key={s} title={s} style={{
                width: '8px', height: '8px', borderRadius: '50%',
                backgroundColor: accent(s), opacity: 0.8,
              }} />
            ))}
          </div>
        </div>

        {/* Board */}
        <div style={{ flex: 1, overflowX: 'auto', padding: window.innerWidth < 768 ? '14px 12px' : '24px 28px' }}>
          {loading ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  flexShrink: 0,
width: window.innerWidth < 768 ? '200px' : '224px',
borderRadius: '10px',
backgroundColor: T.surface,
border: `1px solid ${T.border}`,
                  opacity: 1 - i * 0.1,
                }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', minWidth: 'max-content' }}>
              {columns.map(({ status, leads: colLeads }) => {
                const col = accent(status)
                const isOver = dragOver === status
                return (
                  <div
                    key={status}
                    onDragOver={e => { e.preventDefault(); setDragOver(status) }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={e => handleDrop(e, status)}
                    style={{
                      flexShrink: 0,
                      width: '224px',
                      borderRadius: '10px',
                      backgroundColor: T.surface,
                      border: `1px solid ${T.border}`,
                      overflow: 'hidden',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      boxShadow: isOver ? `0 0 0 1px ${col}44, 0 0 16px ${col}18` : 'none',
                    }}
                  >
                    <div style={{ height: '3px', backgroundColor: col }} />

                    <div style={{
                      padding: '12px 14px 10px',
                      borderBottom: `1px solid ${T.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: col }} />
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: T.textPri }}>{status}</span>
                      </div>
                      <span style={{
                        fontSize: '11px', fontWeight: 600,
                        padding: '1px 7px', borderRadius: '99px',
                        backgroundColor: col + '22', color: col,
                      }}>
                        {colLeads.length}
                      </span>
                    </div>

                    <div style={{
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      minHeight: '120px',
                    }}>
                      {colLeads.map(lead => (
                        <DragCard
                          key={lead.id}
                          lead={lead}
                          col={col}
                          isDragging={dragging?.id === lead.id}
                          onDragStart={handleDragStart}
                          onClick={setSelectedLead}
                        />
                      ))}
                      {colLeads.length === 0 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '80px',
                          borderRadius: '7px',
                          border: `1px dashed ${isOver ? col : T.borderHi}`,
                          transition: 'border-color 0.15s',
                        }}>
                          <span style={{ fontSize: '11.5px', color: isOver ? col : T.textMut }}>
                            {isOver ? '↓ Drop here' : 'No leads'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={() => setSelectedLead(null)}
        />
      )}
    </Layout>
  )
}