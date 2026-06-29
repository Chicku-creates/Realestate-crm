import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'
import { LEAD_SOURCES, LEAD_STATUSES } from '../lib/utils'
import { supabase } from '../lib/supabase'

export function LeadForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    phone: initial.phone || '',
    email: initial.email || '',
    source: initial.source || '99acres',
    status: initial.status || 'New',
    budget_min: initial.budget_min || '',
    budget_max: initial.budget_max || '',
    bhk_preference: initial.bhk_preference || '',
    preferred_location: initial.preferred_location || '',
    followup_date: initial.followup_date ? initial.followup_date.slice(0, 16) : '',
    notes: initial.notes || '',
    interested_unit_id: initial.interested_unit_id || '',
  })

  const [projects, setProjects] = useState([])
  const [units, setUnits] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [unitError, setUnitError] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (initial.interested_unit_id && units.length === 0) {
      supabase
        .from('units')
        .select('*, projects(id, project_name)')
        .eq('id', initial.interested_unit_id)
        .single()
        .then(({ data }) => {
          if (data) {
            setSelectedProject(data.projects.id)
            fetchUnits(data.projects.id)
          }
        })
    }
  }, [initial.interested_unit_id])

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('id, project_name, builder_name')
      .order('project_name')
    setProjects(data || [])
  }

  async function fetchUnits(projectId) {
    const { data } = await supabase
      .from('units')
      .select('id, unit_number, bhk_type, floor_number, price, status')
      .eq('project_id', projectId)
      .order('unit_number')
    setUnits(data || [])
  }

  function handleProjectChange(e) {
    const pid = e.target.value
    setSelectedProject(pid)
    setForm(f => ({ ...f, interested_unit_id: '' }))
    setUnitError('')
    if (pid) fetchUnits(pid)
    else setUnits([])
  }

  const handle = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'interested_unit_id') setUnitError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.interested_unit_id) {
      setUnitError('Please select a unit before saving.')
      return
    }
    onSubmit({
      ...form,
      interested_unit_id: form.interested_unit_id || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input name="name" value={form.name} onChange={handle} required placeholder="Lead name" />
        </div>
        <div>
          <Label>Phone *</Label>
          <Input name="phone" value={form.phone} onChange={handle} required placeholder="+91 XXXXX XXXXX" />
        </div>
      </div>

      <div>
        <Label>Email</Label>
        <Input name="email" type="email" value={form.email} onChange={handle} placeholder="email@example.com" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Source</Label>
          <Select name="source" value={form.source} onChange={handle}>
            {LEAD_SOURCES.map(s => <option key={s}>{s}</option>)}
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select name="status" value={form.status} onChange={handle}>
            {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Budget Min (₹)</Label>
          <Input name="budget_min" type="number" value={form.budget_min} onChange={handle} placeholder="e.g. 5000000" />
        </div>
        <div>
          <Label>Budget Max (₹)</Label>
          <Input name="budget_max" type="number" value={form.budget_max} onChange={handle} placeholder="e.g. 8000000" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>BHK Preference</Label>
          <Select name="bhk_preference" value={form.bhk_preference} onChange={handle}>
            <option value="">Any</option>
            {['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK', 'Villa', 'Plot'].map(b => (
              <option key={b}>{b}</option>
            ))}
          </Select>
        </div>
        <div>
          {/* ── CHANGE 1a: preferred_location marked Optional ── */}
          <label style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Preferred Location</span>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>(Optional)</span>
          </label>
          <Input name="preferred_location" value={form.preferred_location} onChange={handle} placeholder="e.g. Sector 62, Noida" />
        </div>
      </div>

      {/* ── CHANGE 1b: Interested Unit — now REQUIRED ── */}
      <div
        style={{
          border: `1px solid ${unitError ? '#EF4444' : '#2A2D4A'}`,
          borderRadius: '10px',
          padding: '14px',
          backgroundColor: '#14152280',
          transition: 'border-color 0.15s',
        }}
      >
        <p style={{
          margin: '0 0 12px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#5C6BC0',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          🏗️ Interested Unit
          <span style={{ color: '#EF4444', fontSize: '14px', lineHeight: 1 }}>*</span>
        </p>

        {/* Project dropdown */}
        <div style={{ marginBottom: '10px' }}>
          <Label>Project</Label>
          <select
            value={selectedProject}
            onChange={handleProjectChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#1A1C2E',
              border: '1px solid #2A2D4A',
              borderRadius: '7px',
              color: selectedProject ? '#E2E8F0' : '#64748B',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            <option value="">— Select a project —</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.project_name} · {p.builder_name}
              </option>
            ))}
          </select>
        </div>

        {/* Unit dropdown */}
        {selectedProject && (
          <div>
            <Label>Unit</Label>
            {units.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '12px', margin: '4px 0 0' }}>
                No units found for this project.
              </p>
            ) : (
              <select
                name="interested_unit_id"
                value={form.interested_unit_id}
                onChange={handle}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#1A1C2E',
                  border: '1px solid #2A2D4A',
                  borderRadius: '7px',
                  color: form.interested_unit_id ? '#E2E8F0' : '#64748B',
                  fontSize: '13px',
                  outline: 'none',
                }}
              >
                <option value="">— Select a unit —</option>
                {units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.unit_number} · {u.bhk_type}
                    {u.floor_number ? ` · Floor ${u.floor_number}` : ''}
                    {u.price ? ` · ₹${Number(u.price).toLocaleString('en-IN')}` : ''}
                    {` · ${u.status.charAt(0).toUpperCase() + u.status.slice(1)}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {form.interested_unit_id && (
          <button
            type="button"
            onClick={() => {
              setForm(f => ({ ...f, interested_unit_id: '' }))
              setSelectedProject('')
              setUnits([])
              setUnitError('')
            }}
            style={{
              marginTop: '8px',
              background: 'transparent',
              border: 'none',
              color: '#EF4444',
              fontSize: '11px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ✕ Clear unit selection
          </button>
        )}
      </div>

      {/* ── CHANGE 1c: Validation error message ── */}
      {unitError && (
        <p style={{ margin: '-8px 0 0', fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ⚠️ {unitError}
        </p>
      )}

      <div>
        <Label>Follow-up Date & Time</Label>
        <Input name="followup_date" type="datetime-local" value={form.followup_date} onChange={handle} />
      </div>

      <div>
        <Label>Notes</Label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handle}
          rows={3}
          placeholder="Any additional notes..."
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save Lead'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}