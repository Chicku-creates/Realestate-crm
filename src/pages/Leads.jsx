import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'
import { LeadCard } from '../components/LeadCard'
import { LeadForm } from '../components/LeadForm'
import { Dialog } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { LEAD_STATUSES, LEAD_SOURCES } from '../lib/utils'

// ─── Design tokens (same as Dashboard) ───────────────────────────────────────
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

// ─── Styled input ─────────────────────────────────────────────────────────────
function DarkInput({ placeholder, value, onChange, icon }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      {icon && (
        <span
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: T.textSec,
            pointerEvents: 'none',
            display: 'flex',
          }}
        >
          {icon}
        </span>
      )}
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: icon ? '9px 14px 9px 36px' : '9px 14px',
          backgroundColor: T.elevated,
          border: `1px solid ${focused ? T.indigo : T.borderHi}`,
          borderRadius: '7px',
          fontSize: '13px',
          color: T.textPri,
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  )
}

// ─── Styled select ────────────────────────────────────────────────────────────
function DarkSelect({ value, onChange, children }) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        padding: '9px 32px 9px 12px',
        backgroundColor: T.elevated,
        border: `1px solid ${focused ? T.indigo : T.borderHi}`,
        borderRadius: '7px',
        fontSize: '13px',
        color: value ? T.textPri : T.textSec,
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        minWidth: '150px',
        transition: 'border-color 0.15s',
      }}
    >
      {children}
    </select>
  )
}

// ─── Primary button ───────────────────────────────────────────────────────────
function PrimaryBtn({ onClick, children, style = {} }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '9px 18px',
        borderRadius: '7px',
        border: 'none',
        background: hovered
          ? 'linear-gradient(135deg, #6B7BD0, #8B4AED)'
          : 'linear-gradient(135deg, #5C6BC0, #7C3AED)',
        color: 'white',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'background 0.15s',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── Count badge ──────────────────────────────────────────────────────────────
function Badge({ count }) {
  return (
    <span
      style={{
        backgroundColor: T.indigo + '33',
        color: T.indigo,
        fontSize: '11px',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: '99px',
        marginLeft: '8px',
      }}
    >
      {count}
    </span>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ hasLeads, onAdd }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 0',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          backgroundColor: T.elevated,
          border: `1px solid ${T.borderHi}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginBottom: '4px',
        }}
      >
        📋
      </div>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: T.textPri }}>
        {hasLeads ? 'No leads match your filters' : 'No leads yet'}
      </p>
      <p style={{ margin: 0, fontSize: '12.5px', color: T.textSec }}>
        {hasLeads ? 'Try adjusting your search or filters.' : 'Add your first lead to get started.'}
      </p>
      {!hasLeads && (
        <PrimaryBtn onClick={onAdd} style={{ marginTop: '8px' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add First Lead
        </PrimaryBtn>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function Leads() {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [saving, setSaving] = useState(false)
  const [visitLead, setVisitLead] = useState(null)
const [visitForm, setVisitForm] = useState({ visit_date: '', location: '', notes: '' })
const [visitSaving, setVisitSaving] = useState(false)

const handleScheduleVisit = async (form) => {
  setVisitSaving(true)
  const { data: { user: u } } = await supabase.auth.getUser()
  await supabase.from('site_visits').insert({
    ...form,
    lead_id: visitLead.id,
    user_id: u.id,
    status: 'scheduled',
  })
  setVisitSaving(false)
  setVisitLead(null)
}
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [])

  const openAdd    = () => { setEditingLead(null); setDialogOpen(true) }
  const openEdit   = (lead) => { setEditingLead(lead); setDialogOpen(true) }
  const closeDialog = () => { setDialogOpen(false); setEditingLead(null) }

  const handleSubmit = async (form) => {
    setSaving(true)
    const payload = {
      ...form,
      user_id: user.id,
      budget_min:    form.budget_min    || null,
      budget_max:    form.budget_max    || null,
      followup_date: form.followup_date || null,
    }
    if (editingLead) {
      await supabase.from('leads').update(payload).eq('id', editingLead.id)
    } else {
      await supabase.from('leads').insert(payload)
    }
    await fetchLeads()
    setSaving(false)
    closeDialog()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    setLeads(l => l.filter(x => x.id !== id))
  }

  const filtered = leads.filter(l => {
    const matchSearch = !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search)
    const matchStatus = !filterStatus || l.status === filterStatus
    const matchSource = !filterSource || l.source === filterSource
    return matchSearch && matchStatus && matchSource
  })

  const activeFilters = [search, filterStatus, filterSource].filter(Boolean).length

  return (
    <Layout>
      <div
        style={{
          flex: 1,
          backgroundColor: T.bg,
          minHeight: '100vh',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* ── Top bar ── */}
        <div
          style={{
            borderBottom: `1px solid ${T.border}`,
            padding: '18px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: T.surface,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: T.textPri, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center' }}>
              Leads
              {!loading && <Badge count={leads.length} />}
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: T.textSec }}>
              {loading ? 'Loading…' : `${filtered.length} of ${leads.length} leads`}
            </p>
          </div>
          <PrimaryBtn onClick={openAdd}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Lead
          </PrimaryBtn>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '24px 32px' }}>

          {/* Filter bar */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '22px',
              alignItems: 'center',
            }}
          >
            <DarkInput
              placeholder="Search by name or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="#64748B" strokeWidth="1.5"/>
                  <path d="M10 10l2.5 2.5" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
            />
            <DarkSelect value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </DarkSelect>
            <DarkSelect value={filterSource} onChange={e => setFilterSource(e.target.value)}>
              <option value="">All Sources</option>
              {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </DarkSelect>
            {activeFilters > 0 && (
              <button
                onClick={() => { setSearch(''); setFilterStatus(''); setFilterSource('') }}
                style={{
                  padding: '8px 13px',
                  borderRadius: '7px',
                  border: `1px solid ${T.borderHi}`,
                  backgroundColor: 'transparent',
                  color: T.textSec,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = T.rose}
                onMouseLeave={e => e.currentTarget.style.color = T.textSec}
              >
                ✕ Clear filters
              </button>
            )}
          </div>

          {/* Lead grid / states */}
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
              }}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '160px',
                    borderRadius: '10px',
                    backgroundColor: T.surface,
                    border: `1px solid ${T.border}`,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    opacity: 1 - i * 0.1,
                  }}
                />
              ))}
              <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState hasLeads={leads.length > 0} onAdd={openAdd} />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
              }}
            >
              {filtered.map(lead => (
                <LeadCard
  key={lead.id}
  lead={lead}
  onEdit={openEdit}
  onDelete={handleDelete}
  onScheduleVisit={(lead) => { setVisitLead(lead); setVisitForm({ visit_date: '', location: '', notes: '' }) }}
/>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
      >
        <LeadForm
          initial={editingLead || {}}
          onSubmit={handleSubmit}
          onCancel={closeDialog}
          loading={saving}
        />
      </Dialog>

    {/* Site Visit Modal */}
    {visitLead && (
      <div style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      }}>
        <div style={{
          backgroundColor: '#1A1C2E', border: '1px solid #1E2035',
          borderRadius: '14px', padding: '28px', width: '440px', maxWidth: '90vw',
        }}>
          <h2 style={{ color: '#E2E8F0', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>
            📅 Schedule Site Visit
          </h2>
          <p style={{ color: '#64748B', fontSize: '12px', margin: '0 0 20px' }}>
            For: <strong style={{ color: '#94A3B8' }}>{visitLead.name}</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Visit Date & Time *
              </label>
              <input
                type="datetime-local"
                value={visitForm.visit_date}
                onChange={e => setVisitForm(f => ({ ...f, visit_date: e.target.value }))}
                style={{
                  width: '100%', backgroundColor: '#13141F', border: '1px solid #2A2D4A',
                  borderRadius: '7px', padding: '8px 12px', color: '#E2E8F0',
                  fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Location / Project Site
              </label>
              <input
                value={visitForm.location}
                onChange={e => setVisitForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Godrej Horizon, Sector 88"
                style={{
                  width: '100%', backgroundColor: '#13141F', border: '1px solid #2A2D4A',
                  borderRadius: '7px', padding: '8px 12px', color: '#E2E8F0',
                  fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Notes
              </label>
              <textarea
                value={visitForm.notes}
                onChange={e => setVisitForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any special instructions..."
                rows={3}
                style={{
                  width: '100%', backgroundColor: '#13141F', border: '1px solid #2A2D4A',
                  borderRadius: '7px', padding: '8px 12px', color: '#E2E8F0',
                  fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setVisitLead(null)}
              style={{
                padding: '8px 16px', borderRadius: '7px', border: '1px solid #1E2035',
                backgroundColor: 'transparent', color: '#64748B', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => handleScheduleVisit(visitForm)}
              disabled={!visitForm.visit_date || visitSaving}
              style={{
                padding: '8px 20px', borderRadius: '7px', border: 'none',
                backgroundColor: '#5C6BC0', color: 'white', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer',
                opacity: !visitForm.visit_date ? 0.5 : 1,
              }}
            >
              {visitSaving ? 'Saving...' : 'Schedule Visit'}
            </button>
          </div>
        </div>
      </div>
    )}

  </Layout>
)
}