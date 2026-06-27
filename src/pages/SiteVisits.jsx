import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Navbar } from '../components/Navbar'
const format = (date, fmt) => {
  const d = new Date(date)
  if (fmt === 'dd') return d.getDate().toString().padStart(2, '0')
  if (fmt === 'MMM') return d.toLocaleString('en-IN', { month: 'short' })
  if (fmt === 'h:mm a') return d.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
  if (fmt === 'dd MMM') return `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short' })}`
  return d.toLocaleDateString('en-IN')
}
const isToday = (date) => new Date(date).toDateString() === new Date().toDateString()
const isTomorrow = (date) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return new Date(date).toDateString() === tomorrow.toDateString()
}
const isPast = (date) => new Date(date) < new Date()

const T = {
  bg:       '#13141F',
  surface:  '#1A1C2E',
  elevated: '#20223A',
  border:   '#1E2035',
  borderHi: '#2A2D4A',
  text:     '#E2E8F0',
  textSub:  '#94A3B8',
  textMut:  '#64748B',
  indigo:   '#5C6BC0',
  purple:   '#7C3AED',
  emerald:  '#10B981',
  amber:    '#F59E0B',
  rose:     '#F43F5E',
  sky:      '#0EA5E9',
}

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: T.indigo,  bg: T.indigo  + '22' },
  done:      { label: 'Done',      color: T.emerald, bg: T.emerald + '22' },
  cancelled: { label: 'Cancelled', color: T.rose,    bg: T.rose    + '22' },
  rescheduled:{ label: 'Rescheduled', color: T.amber, bg: T.amber  + '22' },
}

export function SiteVisits() {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchVisits() }, [])

  async function fetchVisits() {
    setLoading(true)
    const { data } = await supabase
      .from('site_visits')
      .select('*, leads(name, phone, preferred_location, bhk_preference)')
      .order('visit_date', { ascending: true })
    setVisits(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('site_visits').update({ status }).eq('id', id)
    fetchVisits()
  }

  async function deleteVisit(id) {
    if (!confirm('Delete this site visit?')) return
    await supabase.from('site_visits').delete().eq('id', id)
    fetchVisits()
  }

  const filtered = visits.filter(v => {
    if (filter === 'all') return true
    if (filter === 'today') return isToday(new Date(v.visit_date))
    if (filter === 'upcoming') return !isPast(new Date(v.visit_date)) && !isToday(new Date(v.visit_date))
    if (filter === 'done') return v.status === 'done'
    if (filter === 'cancelled') return v.status === 'cancelled'
    return true
  })

  const stats = {
    total:     visits.length,
    today:     visits.filter(v => isToday(new Date(v.visit_date))).length,
    upcoming:  visits.filter(v => !isPast(new Date(v.visit_date)) && v.status === 'scheduled').length,
    done:      visits.filter(v => v.status === 'done').length,
  }

  function getDateLabel(dateStr) {
    const d = new Date(dateStr)
    if (isToday(d))    return { label: 'Today',    color: T.amber }
    if (isTomorrow(d)) return { label: 'Tomorrow', color: T.sky   }
    if (isPast(d))     return { label: 'Past',     color: T.rose  }
    return { label: format(d, 'dd MMM'), color: T.textMut }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: T.bg }}>
      <Navbar />
      <main style={{ flex: 1, overflow: 'auto' }}>

        {/* Top bar */}
        <div style={{
          padding: '16px 28px', borderBottom: `1px solid ${T.border}`,
          backgroundColor: T.bg, position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h1 style={{ color: T.text, fontSize: '18px', fontWeight: 700, margin: 0 }}>
              Site Visits
            </h1>
            <p style={{ color: T.textMut, fontSize: '12px', margin: '2px 0 0' }}>
              {visits.length} total visits
            </p>
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total',    value: stats.total,    color: T.indigo,  icon: '🗓️' },
              { label: 'Today',    value: stats.today,    color: T.amber,   icon: '⚡' },
              { label: 'Upcoming', value: stats.upcoming, color: T.sky,     icon: '📆' },
              { label: 'Done',     value: stats.done,     color: T.emerald, icon: '✅' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} style={{
                backgroundColor: T.surface, border: `1px solid ${T.border}`,
                borderRadius: '10px', padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: T.textMut, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: '16px' }}>{icon}</span>
                </div>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
            {[
              { key: 'all',       label: 'All' },
              { key: 'today',     label: 'Today' },
              { key: 'upcoming',  label: 'Upcoming' },
              { key: 'done',      label: 'Done' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
                  fontWeight: 500, cursor: 'pointer', border: 'none',
                  backgroundColor: filter === key ? T.indigo : T.surface,
                  color: filter === key ? 'white' : T.textMut,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Visits list */}
          {loading ? (
            <p style={{ color: T.textMut }}>Loading...</p>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</div>
              <p style={{ color: T.textMut, fontSize: '14px' }}>No site visits found.</p>
              <p style={{ color: T.textMut, fontSize: '12px' }}>Schedule one from any lead card.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(visit => {
                const s = STATUS_CONFIG[visit.status] || STATUS_CONFIG.scheduled
                const dateInfo = getDateLabel(visit.visit_date)
                return (
                  <div key={visit.id} style={{
                    backgroundColor: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: '12px', padding: '18px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '16px',
                  }}>

                    {/* Date block */}
                    <div style={{
                      minWidth: '64px', textAlign: 'center',
                      padding: '10px 12px', borderRadius: '10px',
                      backgroundColor: dateInfo.color + '18',
                      border: `1px solid ${dateInfo.color}33`,
                    }}>
                      <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: dateInfo.color, textTransform: 'uppercase' }}>
                        {dateInfo.label}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 700, color: T.text }}>
                        {format(new Date(visit.visit_date), 'dd')}
                      </p>
                      <p style={{ margin: 0, fontSize: '10px', color: T.textMut }}>
                        {format(new Date(visit.visit_date), 'MMM')}
                      </p>
                    </div>

                    {/* Lead info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0,
                        }}>
                          {visit.leads?.name?.slice(0, 1)?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: T.text }}>
                            {visit.leads?.name ?? 'Unknown'}
                          </p>
                          <p style={{ margin: 0, fontSize: '11px', color: T.textMut }}>
                            {visit.leads?.phone}
                            {visit.leads?.bhk_preference ? ` · ${visit.leads.bhk_preference}` : ''}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: T.textSub }}>
                          🕐 {format(new Date(visit.visit_date), 'h:mm a')}
                        </span>
                        {visit.location && (
                          <span style={{ fontSize: '12px', color: T.textSub }}>
                            📍 {visit.location}
                          </span>
                        )}
                        {visit.notes && (
                          <span style={{ fontSize: '12px', color: T.textMut }}>
                            📝 {visit.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status + actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 600, padding: '3px 10px',
                        borderRadius: '20px', backgroundColor: s.bg, color: s.color,
                      }}>
                        {s.label}
                      </span>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {visit.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => updateStatus(visit.id, 'done')}
                              style={{
                                padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                                fontWeight: 600, cursor: 'pointer', border: 'none',
                                backgroundColor: T.emerald + '22', color: T.emerald,
                              }}
                            >
                              ✓ Done
                            </button>
                            <button
                              onClick={() => updateStatus(visit.id, 'cancelled')}
                              style={{
                                padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
                                fontWeight: 600, cursor: 'pointer', border: 'none',
                                backgroundColor: T.rose + '22', color: T.rose,
                              }}
                            >
                              ✕ Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteVisit(visit.id)}
                          style={{
                            padding: '4px 8px', borderRadius: '6px', fontSize: '11px',
                            cursor: 'pointer', border: `1px solid ${T.borderHi}`,
                            backgroundColor: 'transparent', color: T.textMut,
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}