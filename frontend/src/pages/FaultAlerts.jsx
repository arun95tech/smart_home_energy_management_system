// Technician fault alerts page
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getFaultReports, markFaultDone } from '../services/api.js'

// Technician fault alerts section
export default function FaultAlerts() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'technician'

  const [faults, setFaults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [msg, setMsg] = useState('')
  const [marking, setMarking] = useState(null) // id being updated

  function load() {
    getFaultReports().then(setFaults).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    load()
  }, [])

  async function handleMarkDone(id) {
    setMarking(id)
    try {
      await markFaultDone(id)
      setMsg('âœ… Fault marked as done. Appliance status set to OK.')
      load()
    } catch (err) {
      setMsg('âŒ ' + err.message)
    } finally {
      setMarking(null)
      setTimeout(() => setMsg(''), 4000)
    }
  }

  const total = faults.length
  const pending = faults.filter(f => f.status === 'pending')
  const done = faults.filter(f => f.status === 'done')

  const filtered = filter === 'pending' ? pending : filter === 'done' ? done : faults

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>âš ï¸ <span>Fault Alerts</span></h1>
            <p>View and manage appliance fault reports.</p>
          </div>
        </div>

        {msg && <div className={`alert ${msg.startsWith('âœ…') ? 'alert--success' : 'alert--danger'}`}>{msg}</div>}

        {/* Summary */}
        <div className="mini-stats" style={{ marginBottom: 20 }}>
          <div className="mini-stat">
            <span className="mini-stat-val">{total}</span>
            <span className="mini-stat-label">Total</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-orange">{pending.length}</span>
            <span className="mini-stat-label">Pending</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-green">{done.length}</span>
            <span className="mini-stat-label">Done</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          {[
            { key:'all', label:`All (${total})` },
            { key:'pending', label:`â³ Pending (${pending.length})` },
            { key:'done', label:`âœ… Done (${done.length})` },
          ].map(tab => (
            <button key={tab.key} className={`btn btn-sm ${filter === tab.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fault Reports Table */}
        <div className="card">
          {loading ? (
            <div className="loading"><div className="loading-spinner"/><p>Loading fault reportsâ€¦</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">âœ…</div><p>No fault reports found.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Appliance</th><th>Type</th><th>Homeowner</th><th>Location</th>
                    <th>Power (W)</th><th>App. Status</th><th>Fault Message</th>
                    <th>Reported</th><th>Status</th>
                    {role === 'technician' && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.id} className={`fault-row--${f.status}`}>
                      <td style={{ fontWeight:600 }}>{f.appliance_name}</td>
                      <td><span className="badge badge--blue">{f.appliance_type}</span></td>
                      <td>{f.homeowner_username}</td>
                      <td>{f.room_location || 'â€”'}</td>
                      <td>{f.power_rating}W</td>
                      <td>
                        <span className={`badge badge--${f.appliance_status === 'faulty' ? 'red' : f.appliance_status === 'ok' ? 'green' : 'gray'}`}>
                          {f.appliance_status?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize:12.5, maxWidth:200 }}>{f.message}</td>
                      <td style={{ fontSize:12, color:'#64748b', whiteSpace:'nowrap' }}>
                        {new Date(f.reported_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`badge badge--${f.status === 'pending' ? 'orange' : 'green'}`}>
                          {f.status === 'pending' ? 'â³ Pending' : 'âœ… Done'}
                        </span>
                        {f.completed_at && (
                          <div style={{ fontSize:10.5, color:'#94a3b8', marginTop:2 }}>
                            {new Date(f.completed_at).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      {role === 'technician' && (
                        <td>
                          {f.status === 'pending' ? (
                            <button
                              className="btn btn-sm btn-green"
                              onClick={() => handleMarkDone(f.id)}
                              disabled={marking === f.id}
                            >
                              {marking === f.id ? 'â€¦' : 'ðŸ”§ Mark Done'}
                            </button>
                          ) : (
                            <span style={{ fontSize:12, color:'#94a3b8' }}>Completed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {role === 'technician' && pending.length > 0 && (
          <div className="alert alert--warning" style={{ marginTop: 16 }}>
            ðŸ”§ You have <strong>{pending.length}</strong> pending fault report(s). Click "Mark Done" after completing the maintenance to update the appliance status to OK.
          </div>
        )}
      </main>
    </div>
  )
}
