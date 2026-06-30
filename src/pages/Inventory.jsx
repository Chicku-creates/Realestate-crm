import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
}

const PROJECT_TYPES = ['apartment', 'villa', 'plot', 'commercial']

const TYPE_COLORS = {
  apartment: '#5C6BC0',
  villa: '#10B981',
  plot: '#F59E0B',
  commercial: '#0EA5E9',
}

export function Inventory() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
const [editingId, setEditingId] = useState(null)
const [form, setForm] = useState({
  builder_name: '', project_name: '', location: '',
  type: 'apartment', rera_number: '', possession_date: '',
  commission_percent: 2,
})
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  useEffect(() => { fetchProjects() }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data } = await supabase
      .from('projects')
      .select(`*, units(count)`)
      .order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  async function handleDeleteProject(e, id) {
    e.stopPropagation()
    if (!confirm('Delete this project and all its units? This cannot be undone.')) return
    await supabase.from('units').delete().eq('project_id', id)
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  function handleEditProject(e, project) {
  e.stopPropagation()
  setEditingId(project.id)
  setForm({
    builder_name: project.builder_name || '',
    project_name: project.project_name || '',
    location: project.location || '',
    type: project.type || 'apartment',
    rera_number: project.rera_number || '',
    possession_date: project.possession_date || '',
    commission_percent: project.commission_percent ?? 2,
  })
  setShowModal(true)
}

async function handleSaveProject() {
  setSaving(true)
  if (editingId) {
    await supabase.from('projects').update(form).eq('id', editingId)
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('projects').insert({ ...form, user_id: user.id })
  }
  setSaving(false)
  setShowModal(false)
  setEditingId(null)
  setForm({ builder_name: '', project_name: '', location: '', type: 'apartment', rera_number: '', possession_date: '', commission_percent: 2 })
  fetchProjects()
}

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: T.bg }}>
      <Navbar />
      <main style={{ flex: 1, padding: '0', overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{
          padding: window.innerWidth < 768 ? '14px 16px' : '16px 28px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: T.bg, position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ color: T.text, fontSize: '18px', fontWeight: 700, margin: 0 }}>Inventory</h1>
            <p style={{ color: T.textMuted, fontSize: '12px', margin: '2px 0 0' }}>{projects.length} projects</p>
          </div>
          onClick={() => { setEditingId(null); setShowModal(true) }}
        </div>

        {/* Projects Grid */}
        <div style={{ padding: window.innerWidth < 768 ? '16px 14px' : '24px 28px' }}>

          {/* Search box */}
          <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '360px' }}>
            <span style={{
              position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)',
              fontSize: '14px', pointerEvents: 'none',
            }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by project name, builder or location..."
              style={{
                width: '100%', backgroundColor: T.surface, border: `1px solid ${T.border}`,
                borderRadius: '8px', padding: '8px 12px 8px 32px', color: T.text,
                fontSize: '13px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: T.textMuted,
                  fontSize: '14px', cursor: 'pointer', padding: 0,
                }}
              >✕</button>
            )}
          </div>

          {loading ? (
            <p style={{ color: T.textMuted }}>Loading...</p>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏗️</div>
              <p style={{ color: T.textMuted, fontSize: '14px' }}>No projects yet. Add your first project.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {projects.filter(p =>
                `${p.project_name} ${p.builder_name} ${p.location}`.toLowerCase().includes(search.toLowerCase())
              ).map(project => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/inventory/${project.id}`)}
                  style={{
                    backgroundColor: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                >
                  {/* Type badge */}
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      backgroundColor: TYPE_COLORS[project.type] + '22',
                      color: TYPE_COLORS[project.type],
                      fontSize: '11px', fontWeight: 600,
                      padding: '3px 8px', borderRadius: '20px',
                      textTransform: 'capitalize',
                    }}>
                      {project.type}
                    </span>
                    <span style={{ color: T.success, fontSize: '12px', fontWeight: 600 }}>
                      {project.commission_percent}% comm.
                    </span>
                  </div>

                  <h3 style={{ color: T.text, fontSize: '15px', fontWeight: 700, margin: '0 0 4px' }}>
                    {project.project_name}
                  </h3>
                  <p style={{ color: T.textMuted, fontSize: '12px', margin: '0 0 12px' }}>
                    {project.builder_name}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {project.location && (
                      <p style={{ color: T.textSub, fontSize: '12px', margin: 0 }}>
                        📍 {project.location}
                      </p>
                    )}
                    {project.possession_date && (
                      <p style={{ color: T.textSub, fontSize: '12px', margin: 0 }}>
                        🗓️ Possession: {new Date(project.possession_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    {project.rera_number && (
                      <p style={{ color: T.textSub, fontSize: '12px', margin: 0 }}>
                        🏛️ RERA: {project.rera_number}
                      </p>
                    )}
                  </div>

                  <div style={{
                    marginTop: '16px', paddingTop: '12px',
                    borderTop: `1px solid ${T.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ color: T.textMuted, fontSize: '12px' }}>
  {project.units?.[0]?.count || 0} units
</span>
<div style={{ display: 'flex', gap: '8px' }}>
  <button
    onClick={e => handleEditProject(e, project)}
    style={{
      background: 'transparent', border: `1px solid ${T.accent}33`,
      borderRadius: '5px', padding: '3px 10px',
      color: T.accent, fontSize: '11px', cursor: 'pointer',
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = T.accent + '11'}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    ✏️ Edit
  </button>
  <button
    onClick={e => handleDeleteProject(e, project.id)}
    style={{
      background: 'transparent', border: `1px solid #EF444433`,
      borderRadius: '5px', padding: '3px 10px',
      color: T.danger, fontSize: '11px', cursor: 'pointer',
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EF444411'}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    🗑 Delete
  </button>
</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Project Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}>
          <div style={{
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
            borderRadius: '14px', padding: '28px', width: '480px', maxWidth: '90vw',
          }}>
            <h2 style={{ color: T.text, fontSize: '16px', fontWeight: 700, margin: '0 0 20px' }}>
  {editingId ? 'Edit Project' : 'Add New Project'}
</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Project Name *', key: 'project_name', placeholder: 'e.g. Godrej Horizon' },
                { label: 'Builder Name *', key: 'builder_name', placeholder: 'e.g. Godrej Properties' },
                { label: 'Location', key: 'location', placeholder: 'e.g. Sector 88, Mohali' },
                { label: 'RERA Number', key: 'rera_number', placeholder: 'e.g. PBRERA-SAS80-...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{
                      width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                      borderRadius: '7px', padding: '8px 12px', color: T.text,
                      fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    style={{
                      width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                      borderRadius: '7px', padding: '8px 12px', color: T.text, fontSize: '13px', outline: 'none',
                    }}
                  >
                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Commission %</label>
                  <input
                    type="number" value={form.commission_percent}
                    onChange={e => setForm(f => ({ ...f, commission_percent: e.target.value }))}
                    style={{
                      width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                      borderRadius: '7px', padding: '8px 12px', color: T.text, fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: T.textSub, fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Possession Date</label>
                <input
                  type="date" value={form.possession_date}
                  onChange={e => setForm(f => ({ ...f, possession_date: e.target.value }))}
                  style={{
                    width: '100%', backgroundColor: T.bg, border: `1px solid ${T.border}`,
                    borderRadius: '7px', padding: '8px 12px', color: T.text, fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
  onClick={() => { setShowModal(false); setEditingId(null) }}
  style={{
    padding: '8px 16px', borderRadius: '7px', border: `1px solid ${T.border}`,
    backgroundColor: 'transparent', color: T.textMuted, fontSize: '13px', cursor: 'pointer',
  }}
>
  Cancel
</button>
<button
  onClick={handleSaveProject}
  disabled={!form.project_name || !form.builder_name || saving}
  style={{
    padding: '8px 20px', borderRadius: '7px', border: 'none',
    backgroundColor: T.accent, color: 'white', fontSize: '13px',
    fontWeight: 600, cursor: 'pointer', opacity: (!form.project_name || !form.builder_name) ? 0.5 : 1,
  }}
>
  {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Project')}
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}