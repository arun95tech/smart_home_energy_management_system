// Admin appliance monitoring page
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getAppliances } from '../services/api.js'

const TYPE_OPTIONS = ['light','ac','fridge','heater','washing_machine','other']
const STATUS_BADGE = { on:'green', off:'gray', ok:'blue', faulty:'red' }

// Admin appliance section
export default function AdminAppliances() {
  const navigate = useNavigate()
  const [appliances, setAppliances] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOwner, setFilterOwner] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    getAppliances().then(setAppliances).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = appliances.filter(a => {
    if (filterOwner && !a.homeowner_username?.toLowerCase().includes(filterOwner.toLowerCase())) return false
    if (filterType && a.appliance_type !== filterType) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  const faultyCount = appliances.filter(a => a.status === 'faulty').length
  const renewableCount = appliances.filter(a => a.is_renewable_supported).length

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>ðŸ”Œ <span>Appliance Monitoring</span></h1>
            <p>Read-only view of all appliances across all homeowners.</p>
          </div>
        </div>

        <div className="alert alert--info" style={{ marginBottom: 16 }}>
          â„¹ï¸ Admin view is <strong>read-only</strong>. Appliance status changes can only be made by homeowners.
        </div>

        {/* Summary */}
        <div className="mini-stats" style={{ marginBottom: 20 }}>
          <div className="mini-stat"><span className="mini-stat-val">{appliances.length}</span><span className="mini-stat-label">Total</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-green">{appliances.filter(a=>a.status==='on').length}</span><span className="mini-stat-label">On</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-red">{faultyCount}</span><span className="mini-stat-label">Faulty</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-green">{renewableCount}</span><span className="mini-stat-label">Renewable</span></div>
        </div>

        {/* Filters */}
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          <input placeholder="Filter by homeownerâ€¦" value={filterOwner} onChange={e => setFilterOwner(e.target.value)} />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {['on','off','ok','faulty'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
          <span style={{ fontSize:13, color:'#64748b' }}>{filtered.length} appliance(s)</span>
        </div>

        <div className="card">
          {loading ? (
            <div className="loading"><div className="loading-spinner"/></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">ðŸ”Œ</div><p>No appliances found.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Homeowner</th><th>Appliance</th><th>Type</th>
                    <th>Location</th><th>Power (W)</th><th>Status</th><th>Renewable</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight:600 }}>{a.homeowner_username}</td>
                      <td>{a.name}</td>
                      <td><span className="badge badge--blue">{a.appliance_type}</span></td>
                      <td>{a.room_location || 'â€”'}</td>
                      <td>{a.power_rating}W</td>
                      <td><span className={`badge badge--${STATUS_BADGE[a.status]||'gray'}`}>{a.status.toUpperCase()}</span></td>
                      <td>{a.is_renewable_supported ? 'âœ… Yes' : 'â€”'}</td>
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
