import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns'

// ─── Design tokens ────────────────────────────────────────────────────────────
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
}

const SOURCE_COLORS = [T.indigo, T.purple, T.amber, T.emerald, T.rose, T.sky]

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, loading, accent, icon }) {
  return (
    <div style={{
      backgroundColor: T.surface, border: `1px solid ${T.border}`,
      borderRadius: '10px', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ height: '3px', backgroundColor: accent, borderRadius: '10px 10px 0 0' }} />
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: T.textSec, letterSpacing: '0.01em' }}>{label}</span>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px',
            backgroundColor: accent + '22', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '14px',
          }}>{icon}</div>
        </div>
        <div style={{
          fontSize: '32px', fontWeight: 700,
          color: loading ? T.textMut : T.textPri,
          letterSpacing: '-1px', lineHeight: 1,
        }}>
          {loading ? '—' : value}
        </div>
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <h2 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: T.textPri, letterSpacing: '0.01em' }}>
        {title}
      </h2>
      {badge != null && (
        <span style={{
          backgroundColor: T.indigo + '33', color: T.indigo,
          fontSize: '11px', fontWeight: 600, padding: '1px 7px', borderRadius: '99px',
        }}>{badge}</span>
      )}
    </div>
  )
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      backgroundColor: T.elevated, border: `1px solid ${T.borderHi}`,
      borderRadius: '7px', padding: '8px 12px', fontSize: '12px', color: T.textPri,
    }}>
      <span style={{ fontWeight: 600 }}>{payload[0].name}</span>
      <span style={{ color: T.textSec, marginLeft: '6px' }}>{payload[0].value} leads</span>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div style={{
      height: '180px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '8px',
    }}>
      <div style={{ fontSize: '28px', opacity: 0.3 }}>⬜</div>
      <p style={{ margin: 0, fontSize: '12.5px', color: T.textMut }}>{text}</p>
    </div>
  )
}

// ─── Work Queue Item ──────────────────────────────────────────────────────────
function WorkQueueItem({ lead, urgency }) {
  const URGENCY = {
    overdue:  { label: 'Overdue',     color: T.rose,    bg: T.rose    + '22' },
    today:    { label: 'Due Today',   color: T.amber,   bg: T.amber   + '22' },
    cold:     { label: 'Gone Cold',   color: T.sky,     bg: T.sky     + '22' },
    new:      { label: 'New Lead',    color: T.emerald, bg: T.emerald + '22' },
  }
  const u = URGENCY[urgency]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 14px', borderRadius: '8px',
      backgroundColor: T.elevated, border: `1px solid ${T.borderHi}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0,
        }}>
          {lead.name?.slice(0, 1)?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: T.textPri }}>{lead.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.textSec }}>
            {lead.phone} {lead.preferred_location ? `· ${lead.preferred_location}` : ''}
          </p>
        </div>
      </div>
      <span style={{
        fontSize: '11px', fontWeight: 600, padding: '3px 9px',
        borderRadius: '99px', backgroundColor: u.bg, color: u.color,
        whiteSpace: 'nowrap',
      }}>
        {u.label}
      </span>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function Dashboard() {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: leadsData }, { data: unitsData }] = await Promise.all([
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('units')
          .select('*, projects!inner(user_id, commission_percent)')
          .eq('projects.user_id', user.id)
          .in('status', ['booked', 'reserved']),
      ])
      setLeads(leadsData || [])
      setUnits(unitsData || [])
      setLoading(false)
    }
    fetchData()
  }, [user.id])

  const today = new Date()

  // ── Stats ──
  const totalLeads        = leads.length
  const followupsDue      = leads.filter(l => l.followup_date && isToday(new Date(l.followup_date))).length
  const followupsTomorrow = leads.filter(l => l.followup_date && isTomorrow(new Date(l.followup_date))).length
  const wonThisMonth      = leads.filter(l => {
    if (l.status !== 'Won') return false
    const d = new Date(l.created_at)
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  }).length

  // ── Source chart ──
  const sourceData = Object.entries(
    leads.reduce((acc, l) => { acc[l.source] = (acc[l.source] || 0) + 1; return acc }, {})
  ).map(([name, value]) => ({ name, value }))

  // ── Follow-ups today ──
  const dueTodayLeads = leads.filter(l => l.followup_date && isToday(new Date(l.followup_date)))

  // ── Work Queue ──
  const workQueue = []

  // Overdue follow-ups
  leads.forEach(l => {
    if (l.followup_date) {
      const days = differenceInDays(today, new Date(l.followup_date))
      if (days > 0) workQueue.push({ lead: l, urgency: 'overdue', priority: 0 })
    }
  })

  // Due today
  leads.forEach(l => {
    if (l.followup_date && isToday(new Date(l.followup_date))) {
      workQueue.push({ lead: l, urgency: 'today', priority: 1 })
    }
  })

  // Gone cold — no followup_date set and created 7+ days ago
  leads.forEach(l => {
    if (!l.followup_date && l.status !== 'Won' && l.status !== 'Lost') {
      const days = differenceInDays(today, new Date(l.created_at))
      if (days >= 7) workQueue.push({ lead: l, urgency: 'cold', priority: 2 })
    }
  })

  // New leads (created today, no followup set)
  leads.forEach(l => {
    if (!l.followup_date && isToday(new Date(l.created_at))) {
      workQueue.push({ lead: l, urgency: 'new', priority: 3 })
    }
  })

  // Deduplicate by lead id, keep highest priority
  const seen = new Set()
  const dedupedQueue = workQueue
    .sort((a, b) => a.priority - b.priority)
    .filter(({ lead }) => {
      if (seen.has(lead.id)) return false
      seen.add(lead.id)
      return true
    })
    .slice(0, 8)

  // ── Commission Forecast ──
  const bookedUnits   = units.filter(u => u.status === 'booked')
  const reservedUnits = units.filter(u => u.status === 'reserved')

  const calcCommission = (unitsList) =>
    unitsList.reduce((sum, u) => {
      const commPct = u.projects?.commission_percent || 2
      return sum + (u.price || 0) * (commPct / 100)
    }, 0)

  const bookedCommission   = calcCommission(bookedUnits)
  const reservedCommission = calcCommission(reservedUnits)
  const totalForecast      = bookedCommission + reservedCommission

  const formatINR = (n) => {
    if (n >= 10_00_000) return `₹${(n / 10_00_000).toFixed(1)}L`
    if (n >= 1_00_000)  return `₹${(n / 1_00_000).toFixed(1)}L`
    if (n >= 1_000)     return `₹${(n / 1_000).toFixed(0)}K`
    return `₹${n}`
  }

  const statusColor = s => ({
    'Won':         { bg: T.emerald + '22', fg: T.emerald },
    'Lost':        { bg: T.rose    + '22', fg: T.rose    },
    'In Progress': { bg: T.indigo  + '22', fg: T.indigo  },
    'New':         { bg: T.sky     + '22', fg: T.sky     },
  }[s] || { bg: T.textMut + '22', fg: T.textSec })

  const stats = [
    { label: 'Total Leads',          value: totalLeads,        icon: '👥', accent: T.indigo  },
    { label: 'Follow-ups Today',     value: followupsDue,      icon: '📅', accent: T.amber   },
    { label: 'Follow-ups Tomorrow',  value: followupsTomorrow, icon: '📈', accent: T.purple  },
    { label: 'Deals Won This Month', value: wonThisMonth,      icon: '🏆', accent: T.emerald },
  ]

  return (
    <Layout>
      <div style={{
        flex: 1, backgroundColor: T.bg, minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        {/* Top bar */}
        <div style={{
          borderBottom: `1px solid ${T.border}`, padding: '18px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: T.surface, position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: T.textPri, letterSpacing: '-0.3px' }}>
              Dashboard
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: T.textSec }}>
              {format(today, 'EEEE, MMMM do yyyy')}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              padding: '6px 14px', borderRadius: '7px',
              border: `1px solid ${T.borderHi}`, backgroundColor: T.elevated,
              fontSize: '12.5px', color: T.textSec, cursor: 'pointer',
            }}>
              + New Lead
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '28px 32px', maxWidth: '1200px' }}>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px', marginBottom: '24px',
          }}>
            {stats.map(s => <StatCard key={s.label} loading={loading} {...s} />)}
          </div>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>

            {/* Pie chart */}
            <div style={{
              backgroundColor: T.surface, border: `1px solid ${T.border}`,
              borderRadius: '10px', padding: '22px',
            }}>
              <SectionHeader title="Leads by Source" badge={sourceData.length || undefined} />
              {sourceData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={sourceData} cx="50%" cy="50%" innerRadius={55} outerRadius={88}
                        paddingAngle={3} dataKey="value">
                        {sourceData.map((_, i) => (
                          <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                    {sourceData.map(({ name }, i) => (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                        <span style={{ fontSize: '11.5px', color: T.textSec }}>{name}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState text="Add leads to see source breakdown" />
              )}
            </div>

            {/* Follow-ups today */}
            <div style={{
              backgroundColor: T.surface, border: `1px solid ${T.border}`,
              borderRadius: '10px', padding: '22px',
            }}>
              <SectionHeader title="Follow-ups Due Today" badge={dueTodayLeads.length || undefined} />
              {dueTodayLeads.length === 0 ? (
                <EmptyState text="You're all caught up for today 🎉" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dueTodayLeads.map(lead => {
                    const sc = statusColor(lead.status)
                    return (
                      <div key={lead.id} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '11px 14px', borderRadius: '8px',
                        backgroundColor: T.elevated, border: `1px solid ${T.borderHi}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0,
                          }}>
                            {lead.name?.slice(0, 1)?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: T.textPri }}>{lead.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.textSec }}>{lead.phone}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                            borderRadius: '99px', backgroundColor: sc.bg, color: sc.fg,
                          }}>{lead.status}</span>
                          <span style={{ fontSize: '11px', color: T.textSec }}>
                            {format(new Date(lead.followup_date), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── NEW: Work Queue + Commission Forecast row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

            {/* Work Queue */}
            <div style={{
              backgroundColor: T.surface, border: `1px solid ${T.border}`,
              borderRadius: '10px', padding: '22px',
            }}>
              <SectionHeader title="🎯 Today's Work Queue" badge={dedupedQueue.length || undefined} />
              {dedupedQueue.length === 0 ? (
                <EmptyState text="No urgent actions right now 👏" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dedupedQueue.map(({ lead, urgency }) => (
                    <WorkQueueItem key={lead.id} lead={lead} urgency={urgency} />
                  ))}
                </div>
              )}
            </div>

            {/* Commission Forecast */}
            <div style={{
              backgroundColor: T.surface, border: `1px solid ${T.border}`,
              borderRadius: '10px', padding: '22px',
            }}>
              <SectionHeader title="💰 Commission Forecast" />

              {loading ? (
                <EmptyState text="Loading..." />
              ) : totalForecast === 0 ? (
                <EmptyState text="Book or reserve units to see your forecast" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* Total */}
                  <div style={{
                    padding: '18px', borderRadius: '10px',
                    background: `linear-gradient(135deg, ${T.indigo}22, ${T.purple}22)`,
                    border: `1px solid ${T.indigo}44`,
                  }}>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: T.textSec, fontWeight: 600 }}>
                      TOTAL EXPECTED COMMISSION
                    </p>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: T.textPri, letterSpacing: '-1px' }}>
                      {formatINR(totalForecast)}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: T.textSec }}>
                      from {units.length} unit{units.length !== 1 ? 's' : ''} in pipeline
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                      flex: 1, padding: '14px', borderRadius: '8px',
                      backgroundColor: T.elevated, border: `1px solid ${T.borderHi}`,
                    }}>
                      <p style={{ margin: '0 0 6px', fontSize: '11px', color: T.emerald, fontWeight: 600 }}>
                        🔵 BOOKED
                      </p>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: T.textPri }}>
                        {formatINR(bookedCommission)}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.textSec }}>
                        {bookedUnits.length} unit{bookedUnits.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div style={{
                      flex: 1, padding: '14px', borderRadius: '8px',
                      backgroundColor: T.elevated, border: `1px solid ${T.borderHi}`,
                    }}>
                      <p style={{ margin: '0 0 6px', fontSize: '11px', color: T.amber, fontWeight: 600 }}>
                        🟡 RESERVED
                      </p>
                      <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: T.textPri }}>
                        {formatINR(reservedCommission)}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.textSec }}>
                        {reservedUnits.length} unit{reservedUnits.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Per unit breakdown */}
                  {units.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '11px', color: T.textMut, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Unit Breakdown
                      </p>
                      {units.slice(0, 4).map(u => (
                        <div key={u.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 12px', borderRadius: '7px',
                          backgroundColor: T.elevated, border: `1px solid ${T.borderHi}`,
                        }}>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: T.textPri }}>
                              {u.unit_number}
                            </span>
                            <span style={{ fontSize: '11px', color: T.textSec, marginLeft: '6px' }}>
                              {u.bhk_type}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: T.emerald }}>
                            {formatINR((u.price || 0) * ((u.projects?.commission_percent || 2) / 100))}
                          </span>
                        </div>
                      ))}
                      {units.length > 4 && (
                        <p style={{ margin: 0, fontSize: '11px', color: T.textSec, textAlign: 'center' }}>
                          +{units.length - 4} more units
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}