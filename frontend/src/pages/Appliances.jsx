// Homeowner appliance management page
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getAppliances, createAppliance, patchAppliance, deleteAppliance } from '../services/api.js'

const TYPE_OPTIONS = ['light','ac','fridge','heater','washing_machine','other']
const STATUS_BADGE = { on:'green', off:'gray', ok:'blue', faulty:'red' }

const EMPTY_FORM = { name:'', appliance_type:'light', power_rating:'', room_location:'', status:'off', is_renewable_supported:false }

// Homeowner appliance section
export default function Appliances() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'homeowner'
  const userId = parseInt(localStorage.getItem('user_id') || '1')

  const [appliances, setAppliances] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filterOwner, setFilterOwner] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [msg, setMsg] = useState('')

  function load() {
    // Homeowners only see their own; technicians/admin see all
    const ownerId = role === 'homeowner' ? userId : null
    getAppliances(ownerId)
      .then(setAppliances)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    load()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createAppliance({ ...form, homeowner: userId, power_rating: parseFloat(form.power_rating) || 0 })
      setForm(EMPTY_FORM)
      setShowForm(false)
      setMsg('âœ… Appliance added!')
      load()
    } catch (err) {
      setMsg('âŒ ' + err.message)
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await patchAppliance(id, { status: newStatus })
      setMsg(`âœ… Status updated to "${newStatus}"`)
      load()
    } catch (err) {
      setMsg('âŒ ' + err.message)
    } finally {
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this appliance?')) return
    try {
      await deleteAppliance(id)
      setMsg('âœ… Appliance deleted.')
      load()
    } catch (err) {
      setMsg('âŒ ' + err.message)
    } finally {
      setTimeout(() => setMsg(''), 3000)
    }
  }

  // Filter appliances
  const filtered = appliances.filter(a => {
    if (filterOwner && !a.homeowner_username?.toLowerCase().includes(filterOwner.toLowerCase())) return false
    if (filterType && a.appliance_type !== filterType) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>ðŸ”Œ <span>Appliances</span></h1>
            <p>{role === 'homeowner' ? 'Manage your home appliances.' : 'View all appliances (read-only).'}</p>
          </div>
          {role === 'homeowner' && (
            <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
              {showForm ? 'âœ• Cancel' : '+ Add Appliance'}
            </button>
          )}
        </div>

        {msg && <div className={`alert ${msg.startsWith('âœ…') ? 'alert--success' : 'alert--danger'}`}>{msg}</div>}

        {/* Add Appliance Form (homeowner only) */}
        {role === 'homeowner' && showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">âž• Add New Appliance</span></div>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-control" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Living Room AC" />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-control" value={form.appliance_type} onChange={e => setForm(f => ({...f, appliance_type: e.target.value}))}>
                    {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Power Rating (W)</label>
                  <input className="form-control" type="number" min="0" required value={form.power_rating} onChange={e => setForm(f => ({...f, power_rating: e.target.value}))} placeholder="e.g. 1500" />
                </div>
                <div className="form-group">
                  <label className="form-label">Room / Location</label>
                  <input className="form-control" value={form.room_location} onChange={e => setForm(f => ({...f, room_location: e.target.value}))} placeholder="e.g. Bedroom" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-control" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                    {['on','off','ok','faulty'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ justifyContent: 'center', paddingTop: 20 }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13 }}>
                    <input type="checkbox" checked={form.is_renewable_supported} onChange={e => setForm(f => ({...f, is_renewable_supported: e.target.checked}))} />
                    Renewable Supported
                  </label>
                </div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Savingâ€¦' : 'âœ… Add Appliance'}</button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="filter-bar">
          {role !== 'homeowner' && (
            <input placeholder="Filter by ownerâ€¦" value={filterOwner} onChange={e => setFilterOwner(e.target.value)} />
          )}
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {['on','off','ok','faulty'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
          <span style={{ fontSize: 13, color: '#64748b' }}>{filtered.length} appliance(s)</span>
        </div>

        {/* Table */}
        <div className="card">
          {loading ? (
            <div className="loading"><div className="loading-spinner"/><p>Loading appliancesâ€¦</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">ðŸ”Œ</div><p>No appliances found.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Type</th><th>Power (W)</th><th>Location</th>
                    <th>Status</th><th>Owner</th><th>Renewable</th>
                    {role === 'homeowner' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600 }}>{a.name}</td>
                      <td><span className="badge badge--blue">{a.appliance_type}</span></td>
                      <td>{a.power_rating}W</td>
                      <td>{a.room_location || 'â€”'}</td>
                      <td><span className={`badge badge--${STATUS_BADGE[a.status] || 'gray'}`}>{a.status.toUpperCase()}</span></td>
                      <td>{a.homeowner_username}</td>
                      <td>{a.is_renewable_supported ? 'âœ…' : 'â€”'}</td>
                      {role === 'homeowner' && (
                        <td>
                          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                            <button className="btn btn-sm btn-green" onClick={() => handleStatusChange(a.id,'on')}>On</button>
                            <button className="btn btn-sm btn-ghost" onClick={() => handleStatusChange(a.id,'off')}>Off</button>
                            <button className="btn btn-sm btn-orange" onClick={() => handleStatusChange(a.id,'faulty')}>âš ï¸ Faulty</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>ðŸ—‘ï¸</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
