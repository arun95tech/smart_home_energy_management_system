import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import RecommendationCard from '../components/RecommendationCard.jsx'
import { getRecommendations, createRecommendation, deleteRecommendation } from '../services/api.js'

const EMPTY_FORM = { title:'', description:'', estimated_saving:'' }

export default function Recommendations() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'homeowner'
  const userId = parseInt(localStorage.getItem('user_id') || '1')

  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  function load() {
    getRecommendations(role === 'homeowner' ? userId : null)
      .then(setRecs).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    load()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createRecommendation({ ...form, homeowner: userId, estimated_saving: parseFloat(form.estimated_saving) || 0 })
      setForm(EMPTY_FORM)
      setShowForm(false)
      setMsg('✅ Recommendation added!')
      load()
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this recommendation?')) return
    try {
      await deleteRecommendation(id)
      setMsg('✅ Deleted.')
      load()
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const totalSaving = recs.reduce((s, r) => s + r.estimated_saving, 0).toFixed(2)

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>💡 <span>Recommendations</span></h1>
            <p>Energy-saving tips personalised for your home.</p>
          </div>
          {role === 'homeowner' && (
            <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
              {showForm ? '✕ Cancel' : '+ Add Tip'}
            </button>
          )}
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert--success' : 'alert--danger'}`}>{msg}</div>}

        {/* Summary */}
        <div className="mini-stats" style={{ marginBottom: 20 }}>
          <div className="mini-stat">
            <span className="mini-stat-val">{recs.length}</span>
            <span className="mini-stat-label">Total Tips</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-green">£{totalSaving}</span>
            <span className="mini-stat-label">Est. Savings/mo</span>
          </div>
        </div>

        {/* Add form */}
        {role === 'homeowner' && showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">➕ Add Recommendation</span></div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-control" required value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Use LED Bulbs" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} required value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Describe the energy-saving tip…" style={{ resize:'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Saving (£/month)</label>
                <input className="form-control" type="number" step="0.01" min="0" value={form.estimated_saving} onChange={e => setForm(f=>({...f,estimated_saving:e.target.value}))} placeholder="e.g. 12.50" />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : '✅ Save'}</button>
            </form>
          </div>
        )}

        {/* Recommendations list */}
        <div className="card">
          <div className="card-header"><span className="card-title">💡 Your Recommendations</span></div>
          {loading ? (
            <div className="loading"><div className="loading-spinner"/></div>
          ) : recs.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">💡</div><p>No recommendations yet.</p></div>
          ) : recs.map(r => (
            <RecommendationCard key={r.id} rec={r} onDelete={role === 'homeowner' ? handleDelete : null} />
          ))}
        </div>
      </main>
    </div>
  )
}
