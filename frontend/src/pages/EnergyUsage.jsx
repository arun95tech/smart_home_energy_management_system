import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getEnergyUsage, getAppliances, createEnergyUsage } from '../services/api.js'

export default function EnergyUsage() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'homeowner'
  const userId = parseInt(localStorage.getItem('user_id') || '1')

  const [usage, setUsage] = useState([])
  const [appliances, setAppliances] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ appliance: '', usage_kwh: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  function load() {
    const ownerId = role === 'homeowner' ? userId : null
    Promise.all([
      getEnergyUsage(ownerId),
      getAppliances(role === 'homeowner' ? userId : null),
    ]).then(([u, a]) => {
      setUsage(u)
      setAppliances(a)
    }).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    load()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const kwh = parseFloat(form.usage_kwh)
      await createEnergyUsage({ appliance: parseInt(form.appliance), usage_kwh: kwh })
      setForm({ appliance: '', usage_kwh: '' })
      setMsg(kwh > 10 ? '⚡ Usage recorded! High usage detected — notification sent.' : '✅ Usage recorded!')
      load()
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  const totalKwh = usage.reduce((s, u) => s + u.usage_kwh, 0).toFixed(2)
  const highUsage = usage.filter(u => u.usage_kwh > 10)

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>⚡ <span>Energy Usage</span></h1>
            <p>Track energy consumption for your appliances.</p>
          </div>
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') || msg.startsWith('⚡') ? 'alert--success' : 'alert--danger'}`}>{msg}</div>}

        {highUsage.length > 0 && (
          <div className="alert alert--warning">
            ⚡ {highUsage.length} record(s) with usage above 10 kWh detected. High usage notifications have been triggered.
          </div>
        )}

        {/* Summary */}
        <div className="mini-stats" style={{ marginBottom: 20 }}>
          <div className="mini-stat">
            <span className="mini-stat-val">{usage.length}</span>
            <span className="mini-stat-label">Records</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-blue">{totalKwh}</span>
            <span className="mini-stat-label">Total kWh</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-green">£{(parseFloat(totalKwh) * 0.30).toFixed(2)}</span>
            <span className="mini-stat-label">Est. Cost</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-orange">{highUsage.length}</span>
            <span className="mini-stat-label">High Usage</span>
          </div>
        </div>

        {/* Add usage form (homeowner only) */}
        {role === 'homeowner' && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">➕ Log Energy Usage</span></div>
            <form onSubmit={handleAdd}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Appliance</label>
                  <select className="form-control" required value={form.appliance} onChange={e => setForm(f => ({...f, appliance: e.target.value}))}>
                    <option value="">Select appliance…</option>
                    {appliances.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Usage (kWh)</label>
                  <input className="form-control" type="number" step="0.01" min="0" required value={form.usage_kwh} onChange={e => setForm(f => ({...f, usage_kwh: e.target.value}))} placeholder="e.g. 4.5" />
                </div>
              </div>
              {parseFloat(form.usage_kwh) > 10 && (
                <div className="alert alert--warning">⚠️ Usage above 10 kWh will trigger a high-usage notification.</div>
              )}
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : '✅ Log Usage'}</button>
            </form>
          </div>
        )}

        {/* Usage Table */}
        <div className="card">
          <div className="card-header"><span className="card-title">📋 Usage Records</span></div>
          {loading ? (
            <div className="loading"><div className="loading-spinner"/></div>
          ) : usage.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">⚡</div><p>No energy usage records found.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Appliance</th><th>Owner</th><th>Usage (kWh)</th><th>Date</th><th>Time</th><th>Flag</th></tr>
                </thead>
                <tbody>
                  {usage.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.appliance_name}</td>
                      <td>{u.homeowner_username}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: u.usage_kwh > 10 ? '#f97316' : '#22c55e' }}>
                          {u.usage_kwh} kWh
                        </span>
                      </td>
                      <td>{u.usage_date}</td>
                      <td>{u.usage_time}</td>
                      <td>
                        {u.usage_kwh > 10
                          ? <span className="badge badge--orange">⚡ High</span>
                          : <span className="badge badge--green">Normal</span>}
                      </td>
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
