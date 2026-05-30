// Admin fault overview page
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getFaultReports, getAppliances } from '../services/api.js'

// Admin fault overview section
export default function AdminFaultOverview() {
  const navigate = useNavigate()
  const [faults, setFaults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    // Try fault reports first; fall back to faulty appliances
    getFaultReports()
      .then(setFaults)
      .catch(() => {
        // Fallback: fetch appliances and show faulty ones as pseudo-reports
        getAppliances().then(apps => {
          const faulty = apps.filter(a => a.status === 'faulty').map(a => ({
            id: a.id,
            appliance_name: a.name,
            appliance_type: a.appliance_type,
            room_location: a.room_location,
            power_rating: a.power_rating,
            appliance_status: a.status,
            homeowner_username: a.homeowner_username,
            message: 'Appliance marked as faulty.',
            status: 'pending',
            reported_at: a.created_at,
            completed_at: null,
          }))
          setFaults(faulty)
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const pending = faults.filter(f => f.status === 'pending')
  const done = faults.filter(f => f.status === 'done')
  const filtered = filter === 'pending' ? pending : filter === 'done' ? done : faults

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>⚠️ <span>Fault Overview</span></h1>
            <p>System-wide view of all appliance fault reports.</p>
          </div>
        </div>

        <div className="alert alert--info" style={{ marginBottom: 16 }}>
          ℹ️ Admin view is <strong>read-only</strong>. Only technicians can mark faults as done.
        </div>

        {/* Summary */}
        <div className="mini-stats" style={{ marginBottom: 20 }}>
          <div className="mini-stat"><span className="mini-stat-val">{faults.length}</span><span className="mini-stat-label">Total Faults</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-orange">{pending.length}</span><span className="mini-stat-label">Pending</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-green">{done.length}</span><span className="mini-stat-label">Resolved</span></div>
          <div className="mini-stat">
            <span className="mini-stat-val text-blue">{faults.length > 0 ? Math.round((done.length / faults.length) * 100) : 0}%</span>
            <span className="mini-stat-label">Resolution Rate</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          {[
            { key:'all', label:`All (${faults.length})` },
            { key:'pending', label:`⏳ Pending (${pending.length})` },
            { key:'done', label:`✅ Resolved (${done.length})` },
          ].map(tab => (
            <button key={tab.key} className={`btn btn-sm ${filter === tab.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card">
          {loading ? (
            <div className="loading"><div className="loading-spinner"/></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">✅</div><p>No fault reports found.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Appliance</th><th>Type</th><th>Homeowner</th><th>Location</th>
                    <th>Power (W)</th><th>App. Status</th><th>Message</th><th>Reported</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.id} className={`fault-row--${f.status}`}>
                      <td style={{ fontWeight:600 }}>{f.appliance_name}</td>
                      <td><span className="badge badge--blue">{f.appliance_type}</span></td>
                      <td>{f.homeowner_username}</td>
                      <td>{f.room_location || '—'}</td>
                      <td>{f.power_rating}W</td>
                      <td>
                        <span className={`badge badge--${f.appliance_status==='faulty'?'red':f.appliance_status==='ok'?'green':'gray'}`}>
                          {f.appliance_status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize:12.5, maxWidth:180 }}>{f.message}</td>
                      <td style={{ fontSize:12, color:'#64748b', whiteSpace:'nowrap' }}>
                        {f.reported_at ? new Date(f.reported_at).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <span className={`badge badge--${f.status==='pending'?'orange':'green'}`}>
                          {f.status==='pending' ? '⏳ Pending' : '✅ Done'}
                        </span>
                        {f.completed_at && (
                          <div style={{ fontSize:10.5, color:'#94a3b8', marginTop:2 }}>
                            {new Date(f.completed_at).toLocaleDateString()}
                          </div>
                        )}
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
