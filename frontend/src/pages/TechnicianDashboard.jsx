// Technician dashboard page
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import DashboardCard from '../components/DashboardCard.jsx'
import EnergyChart from '../components/EnergyChart.jsx'
import { getFaultReports, getNotifications } from '../services/api.js'

// Technician dashboard section
export default function TechnicianDashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Technician'

  const [faults, setFaults] = useState([])
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    Promise.all([getFaultReports(), getNotifications()])
      .then(([f, n]) => { setFaults(f); setNotifs(n.slice(0, 5)) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const pending = faults.filter(f => f.status === 'pending')
  const done = faults.filter(f => f.status === 'done')

  // Repair trends bar chart
  const trendDatasets = [{
    label: 'Repairs',
    data: [12, 18, 15, 22, 19, 8, 6],
    backgroundColor: (ctx) => ctx.dataIndex === 3 ? '#22c55e' : '#3b82f6',
    borderRadius: 6,
  }]

  // Category breakdown (simulated)
  const categories = [
    { name: 'HVAC', count: 32, pct: 32, color: '#3b82f6' },
    { name: 'Water Heater', count: 24, pct: 24, color: '#22c55e' },
    { name: 'Electrical', count: 18, pct: 18, color: '#f97316' },
    { name: 'Refrigeration', count: 14, pct: 14, color: '#a855f7' },
    { name: 'Solar System', count: 8, pct: 8, color: '#14b8a6' },
    { name: 'Others', count: 4, pct: 4, color: '#94a3b8' },
  ]

  const completionPct = faults.length > 0 ? Math.round((done.length / faults.length) * 100) : 0

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>Welcome, <span>{username}</span></h1>
            <p>Here's your service overview and tasks for today.</p>
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>â˜€ï¸ 24Â°C Sunny</div>
        </div>

        {loading ? (
          <div className="loading"><div className="loading-spinner"/><p>Loading dashboardâ€¦</p></div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="cards-grid">
              <DashboardCard title="Fault Alerts" value={faults.length} subtitle={`${pending.length} Urgent`} icon="âš ï¸" color="orange" />
              <DashboardCard title="Appliances Checked" value={done.length} subtitle="Today" icon="ðŸ”Œ" color="blue" />
              <DashboardCard title="Pending Repairs" value={pending.length} subtitle="Due Today" icon="ðŸ”§" color="red" />
              <DashboardCard title="Completed Tasks" value={done.length} subtitle="â†‘ 20% This Week" icon="âœ…" color="green" />
              <DashboardCard title="Notifications" value={notifs.filter(n => !n.is_read).length} subtitle="New" icon="ðŸ””" color="purple" />
              <DashboardCard title="Urgent Cases" value={pending.filter(f => f.appliance_type === 'ac' || f.appliance_type === 'heater').length} subtitle="Needs immediate action" icon="ðŸš¨" color="red" />
            </div>

            <div className="content-grid">
              {/* Faulty Appliances Table */}
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <div className="card-header">
                  <span className="card-title">âš ï¸ Faulty Appliances</span>
                  <Link to="/fault-alerts" className="btn btn-primary btn-sm">View All Fault Alerts â†’</Link>
                </div>
                {faults.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">âœ…</div><p>No fault reports found.</p></div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Appliance</th><th>Location</th><th>Status</th><th>Homeowner</th><th>Reported</th></tr>
                      </thead>
                      <tbody>
                        {faults.slice(0, 5).map(f => (
                          <tr key={f.id} className={`fault-row--${f.status}`}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{f.appliance_name}</div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>{f.appliance_type}</div>
                            </td>
                            <td>{f.room_location || 'â€”'}</td>
                            <td>
                              <span className={`badge badge--${f.status === 'pending' ? 'orange' : 'green'}`}>
                                {f.status === 'pending' ? 'Pending Repair' : 'Completed'}
                              </span>
                            </td>
                            <td>{f.homeowner_username}</td>
                            <td style={{ fontSize: 12, color: '#64748b' }}>{new Date(f.reported_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="content-grid" style={{ marginTop: 20 }}>
              {/* Repair Trends Chart */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">ðŸ“Š Repair Trends (This Week)</span>
                </div>
                <EnergyChart type="bar" labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} datasets={trendDatasets} height={180} />
                <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
                  <div><p style={{ fontSize: 11, color: '#64748b' }}>Total Repairs</p><p style={{ fontWeight: 800 }}>100 <span style={{ color: '#22c55e', fontSize: 12 }}>â†‘ 16%</span></p></div>
                  <div><p style={{ fontSize: 11, color: '#64748b' }}>Avg. Resolution</p><p style={{ fontWeight: 800 }}>2.4 hrs <span style={{ color: '#ef4444', fontSize: 12 }}>â†“ 8%</span></p></div>
                </div>
              </div>

              {/* Maintenance Status */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">ðŸ”§ Maintenance Status</span>
                </div>
                <div className="progress-ring-wrap" style={{ marginBottom: 16 }}>
                  <div className="progress-ring">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="10"/>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#22c55e" strokeWidth="10"
                        strokeDasharray={`${completionPct * 2.01} 201`}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <div className="progress-ring-text">{completionPct}%</div>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700 }}>{completionPct}% Overall Completion</p>
                    <div className="progress-legend" style={{ marginTop: 8 }}>
                      {[
                        { label: 'Completed', val: done.length, color: '#22c55e' },
                        { label: 'Pending', val: pending.length, color: '#f97316' },
                      ].map(item => (
                        <div key={item.label} className="progress-legend-item">
                          <div className="legend-dot" style={{ background: item.color }}/>
                          <span>{item.label}</span>
                          <strong style={{ marginLeft: 'auto' }}>{item.val}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-grid" style={{ marginTop: 20 }}>
              {/* Recent Fault Notifications */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">ðŸ”” Recent Fault Notifications</span>
                  <Link to="/notifications" className="card-link">View All â†’</Link>
                </div>
                {notifs.length === 0 ? (
                  <div className="empty-state"><p>No notifications.</p></div>
                ) : notifs.map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18 }}>{n.notification_type === 'fault' ? 'âš ï¸' : 'âš¡'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{n.message.slice(0, 55)}{n.message.length > 55 ? 'â€¦' : ''}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    {!n.is_read && <span className="badge badge--red" style={{ fontSize: 10 }}>New</span>}
                  </div>
                ))}
              </div>

              {/* Fault Categories */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">ðŸ“‹ Fault Categories</span>
                </div>
                <div className="bar-chart">
                  {categories.map(c => (
                    <div key={c.name} className="bar-row">
                      <span className="bar-row-label">{c.name}</span>
                      <div className="bar-row-track">
                        <div className="bar-row-fill" style={{ width: `${c.pct}%`, background: c.color }}/>
                      </div>
                      <span className="bar-row-val">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
