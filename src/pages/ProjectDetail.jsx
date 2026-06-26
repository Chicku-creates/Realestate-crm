import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Navbar } from '../components/Navbar'

const T = {
  bg: '#13141F',
  surface: '#1A1B2E',
  border: '#1E2035',
  accent: '#5C6BC0',
  accentPurple: '#7C3AED',
  text: '#F1F5F9',
  textMuted: '#64748B',
  textSub: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0EA5E9',
}

const STATUS_CONFIG = {
  available:  { label: 'Available',  color: '#10B981', bg: '#10B98122' },
  reserved:   { label: 'Reserved',   color: '#F59E0B', bg: '#F59E0B22' },
  booked:     { label: 'Booked',     color: '#0EA5E9', bg: '#0EA5E922' },
  sold:       { label: 'Sold',       color: '#64748B', bg: '#64748B22' },
  blocked:    { label: 'Blocked',    color: '#EF4444', bg: '#EF444422' },
}

const BHK_OPTIONS = ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Villa', 'Plot']

const EMPTY_UNIT = {
  unit_number: '', bhk_type: '2BHK', floor_number: '',
  area_sqft: '', price: '', status: 'available',
}

export function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_UNIT)
  const [saving, setSaving] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingUnit, setEditingUnit] = useState(null)

  useEffect(() => { fetchData() }, [projectId])

  async function fetchData() {
    setLoading(true)
    const [{ data: proj }, { data: unitData }] = await Promise.all([
      supabase.from('projects').select('*').eq('id', projectId).single(),
      supabase.from('units').select('*').eq('project_id', projectId).order('created_at', { ascending: true }),
    ])
    setProject(proj)
    setUnits(unitData || [])
    setLoading(false)
  }

  async function handleSaveUnit() {
    setSaving(true)
    if (editingUnit) {
      await supabase.from('units').update({ ...form }).eq('id', editingUnit.id)
    } else {
      await supabase.from('units').insert({ ...form, project_id: projectId })
    }
    setSaving(false)
    setShowModal(false)
    setForm(EMPTY_UNIT)
    setEditingUnit(null)
    fetchData()
  }

  async function handleDeleteUnit(id) {
    if (!confirm('Delete this unit?')) return
    await supabase.from('units').delete().eq('id', id)
    fetchData()
  }

  function openEdit(unit) {
    setEditingUnit(unit)
    setForm({
      unit_number: unit.unit_number,
      bhk_type: unit.bhk_type,
      floor_number: unit.floor_number,
      area_sqft: unit.area_sqft,
      price: unit.price,
      status: unit.status,
    })
    setShowModal(true)
  }

  const filtered = filterStatus === 'all' ? units : units.filter(u => u.status === filterStatus)

  const stats = {
    total: units.length,
    available: units.filter(u => u.status === 'available').length,
    reserved: units.filter(u => u.status === 'reserved').length,
    booked: units.filter(u => u.status === 'booked').length,
    sold: units.filter(u => u.status === 'sold').length,
  }

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: T.bg }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: T.textMuted }}>Loading...</p>
      </main>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: T.bg }}>
      <Navbar />
      <main style={{ flex: 1, overflow: 'auto' }}>

        {/* Top bar */}
        <div style={{
          padding: '16px 28px',
          borderBottom: `1px solid ${T.border}`,
          backgroundColor: T.bg,
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/inventory')}
              style={{
                background: 'transparent', border: `1px solid ${T.border}`,
                borderRadius: '7px', padding: '6px 10px',
                color: T.textMuted, fontSize: '12px', cursor: 'pointer',
              }}
            >
              ← Back
            </button>
            <div>
              <h1 style={{ color: T.text, fontSize: '18px', fontWeight: 700, margin: 0 }}>
                {project?.project_name}
              </h1>
              <p style={{ color: T.textMuted, fontSize: '12px', margin: '2px 0 0' }}>
                {project?.builder_name} {project?.location ? `· ${project.location}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setEditingUnit(null); setForm(EMPTY_UNIT); setShowModal(true) }}
            style={{
              backgroundColor: T.accent, color: 'white', border: 'none',
              borderRadius: '8px', padding: '8px 16px', fontSize: '13px',
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            + Add Unit
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total', value: stats.total, color: T.accent },
              { label: 'Available', value: stats.available, color: T.success },
              { label: 'Reserved', value: stats.reserved, color: T.warning },
              { label: 'Booked', value: stats.booked, color: T.info },
              { label: 'Sold', value: stats.sold, color: T.textMuted },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                backgroundColor: T.surface, border: `1px solid ${T.border}`,
                borderRadius: '10px', padding: '14px 20px', minWidth: '100px',
              }}>
                <p style={{ color: T.textMuted, fontSize: '11px', margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
                <p style={{ color, fontSize: '22px', fontWeight: 700, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {['all', ...Object.keys(STATUS_CONFIG)].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                  fontWeight: 500, cursor: 'pointer', border: 'none',
                  backgroundColor: filterStatus === s ? T.accent : T.surface,
                  color: filterStatus === s ? 'white' : T.textMuted,
                  textTransform: 'capitalize',
                }}
              >
                {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          {/* Units Table */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🏠</div>
              <p style={{ color: T.textMuted, fontSize: '14px' }}>No units found. Add your first unit.</p>
            </div>
          ) : (
            <div style={{
              backgroundColor: T.surface, border: `1px solid ${T.border}`,
              borderRadius: '12px', overflow: 'hidden',
            }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 80px 100px 120px 110px 100px',
                padding: '10px 16px',
                borderBottom: `1px solid ${T.border}`,
                backgroundColor: '#14152280',
              }}>
                {['Unit', 'Type', 'Floor', 'Area (sqft)', 'Price (₹)', 'Status', 'Actions'].map(h => (
                  <span key={h} style={{ color: T.textMuted, fontSize: '11px', fontWeight: 600 }}>{h}</span>
                ))}
              </div>

              {/* Table rows */}
              {filtered.map((unit, i) => {
                const s = STATUS_CONFIG[unit.status] || STATUS_CONFIG.available
                return (
                  <div
                    key={unit.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 80px 100px 120px 110px 100px',
                      padding: '12px 16px',
                      borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: T.text, fontSize: '13px', fontWeight: 600 }}>{unit.unit_number}</span>
                    <span style={{ color: T.textSub, fontSize: '13px' }}>{unit.bhk_type}</span>
                    <span style={{ color: T.textSub, fontSize: '13px' }}>{unit.floor_number ?? '—'}</span>
                    <span style={{ color: T.textSub, fontSize: '13px' }}>{unit.area_sqft ? `${unit.area_sqft}` : '—'}</span>
                    <span style={{ color: T.text, fontSize: '13px', fontWeight: 500 }}>
                      {unit.price ? `₹${Number(unit.price).toLocaleString('en-IN')}` : '—'}
                    </span>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: 600,
                      backgroundColor: s.bg, color: s.color,
                    }}>
                      {s.label}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEdit(unit)}
                        style={{
                          background: 'transparent', border: `1px solid ${T.border}`,
                          borderRadius: '5px', padding: '4px 8px',
                          color: T.textMuted, fontSize: '11px', cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id)}
                        style={{
                          background: 'transparent', border: `1px solid #EF444433`,
                          borderRadius: '5px', padding: '4px 8px',
                          color: T.danger, fontSize: '11px', cursor: 'pointer',
                        }}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Unit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}>
          <div style={{
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
            borderRadius: '14px', padding: '28px', width: '440px', maxWidth: '90vw',
          }}>
            <h2 style={{ color: T.text, fontSize: '16px', fontWeight: 700, margin: '0 0 20px' }}>
              {editingUnit ? 'Edit Unit' : 'Add Unit'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Unit Number *</label>
                <input
                  value={form.unit_number}
                  onChange={e => setForm(f => ({ ...f, unit_number: e.target.value }))}
                  placeholder="e.g. A-1201"
                  style={{
                    width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                    borderRadius: '7px', padding: '8px 12px', color: T.text,
                    fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>BHK Type</label>
                  <select
                    value={form.bhk_type}
                    onChange={e => setForm(f => ({ ...f, bhk_type: e.target.value }))}
                    style={{
                      width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                      borderRadius: '7px', padding: '8px 12px', color: T.text, fontSize: '13px', outline: 'none',
                    }}
                  >
                    {BHK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Floor</label>
                  <input
                    type="number" value={form.floor_number}
                    onChange={e => setForm(f => ({ ...f, floor_number: e.target.value }))}
                    placeholder="e.g. 12"
                    style={{
                      width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                      borderRadius: '7px', padding: '8px 12px', color: T.text,
                      fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Area (sqft)</label>
                  <input
                    type="number" value={form.area_sqft}
                    onChange={e => setForm(f => ({ ...f, area_sqft: e.target.value }))}
                    placeholder="e.g. 1450"
                    style={{
                      width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                      borderRadius: '7px', padding: '8px 12px', color: T.text,
                      fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                  <input
                    type="number" value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="e.g. 9200000"
                    style={{
                      width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                      borderRadius: '7px', padding: '8px 12px', color: T.text,
                      fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  style={{
                    width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                    borderRadius: '7px', padding: '8px 12px', color: T.text, fontSize: '13px', outline: 'none',
                  }}
                >
                  {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowModal(false); setEditingUnit(null); setForm(EMPTY_UNIT) }}
                style={{
                  padding: '8px 16px', borderRadius: '7px', border: `1px solid ${T.border}`,
                  backgroundColor: 'transparent', color: T.textMuted, fontSize: '13px', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUnit}
                disabled={!form.unit_number || saving}
                style={{
                  padding: '8px 20px', borderRadius: '7px', border: 'none',
                  backgroundColor: T.accent, color: 'white', fontSize: '13px',
                  fontWeight: 600, cursor: 'pointer', opacity: !form.unit_number ? 0.5 : 1,
                }}
              >
                {saving ? 'Saving...' : editingUnit ? 'Save Changes' : 'Add Unit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}