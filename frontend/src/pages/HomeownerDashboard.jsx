// Homeowner dashboard page
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import DashboardCard from '../components/DashboardCard.jsx'
import EnergyChart from '../components/EnergyChart.jsx'
import { getDashboardSummary, getRecommendations, getNotifications } from '../services/api.js'

// Homeowner dashboard section
export default function HomeownerDashboard() {
  const navigate = useNavigate()
  const userId = parseInt(localStorage.getItem('user_id') || '1')
  const username = localStorage.getItem('username') || 'Homeowner'

  const [summary, setSummary] = useState(null)
  const [recs, setRecs] = useState([])
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    Promise.all([
      getDashboardSummary(userId),
      getRecommendations(userId),
      getNotifications(userId),
    ]).then(([s, r, n]) => {
      setSummary(s)
      setRecs(r.slice(0, 3))
      setNotifs(n.slice(0, 4))
    }).catch(console.error).finally(() => setLoading(false))
  }, [userId])

  // Chart data - weekly energy trend (sample)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const trendData = [132.5, 132.7, 118.4, 140.9, 125.4, 98.2, 89.1]

  const trendDatasets = [{
    label: 'kWh',
    data: trendData,
    backgroundColor: (ctx) => {
      const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 180)
      gradient.addColorStop(0, 'rgba(34,197,94,0.6)')
      gradient.addColorStop(1, 'rgba(34,197,94,0.05)')
      return gradient
    },
    borderColor: '#22c55e',
    borderWidth: 2,
    borderRadius: 6,
  }]

  const lineDatasets = [{
    label: 'Usage (kWh)',
    data: [9, 12, 22, 30, 40, 28, 18, 14, 10, 8, 9],
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34,197,94,0.08)',
    fill: true,
    tension: 0.45,
    pointRadius: 4,
    pointBackgroundColor: '#22c55e',
  }]

  const lineLabels = ['12AM','3AM','6AM','9AM','12PM','3PM','6PM','9PM','12AM']

  const notifTypeColor = { high_usage: 'orange', fault: 'red', recommendation: 'green', schedule: 'blue' }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>Welcome, <span>{username}</span></h1>
            <p>Here's what's happening with your home energy today.</p>
          </div>
          <div className="page-header-right">
            <span style={{ fontSize: 13, color: '#64748b' }}>☀️ 24°C Sunny</span>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="loading-spinner"/><p>Loading dashboard…</p></div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="cards-grid">
              <DashboardCard title="Total Appliances" value={summary?.total_appliances ?? 0} subtitle={`Active: ${summary?.appliance_status_summary?.on ?? 0}`} icon="🔌" color="green" />
              <DashboardCard title="Total Usage" value={`${summary?.total_kwh ?? 0} kWh`} subtitle="Today" icon="⚡" color="blue" />
              <DashboardCard title="Total Cost" value={`£${summary?.total_cost ?? 0}`} subtitle="Today" icon="💷" color="teal" />
              <DashboardCard title="Faulty Devices" value={summary?.faulty_appliances ?? 0} subtitle={summary?.faulty_appliances > 0 ? 'Needs attention' : 'All good'} icon="⚠️" color={summary?.faulty_appliances > 0 ? 'orange' : 'green'} />
              <DashboardCard title="Notifications" value={summary?.unread_notifications ?? 0} subtitle="Unread alerts" icon="🔔" color="purple" />
              <DashboardCard title="Recommendations" value={summary?.recommendations_count ?? 0} subtitle="Active tips" icon="🌿" color="green" />
            </div>

            {/* Appliance status summary */}
            {summary?.appliance_status_summary && (
              <div className="card mb-16" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <span className="card-title">🔌 Appliance Status Summary</span>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {[
                    { label: 'On', key: 'on', color: 'green' },
                    { label: 'Off', key: 'off', color: 'gray' },
                    { label: 'OK', key: 'ok', color: 'blue' },
                    { label: 'Faulty', key: 'faulty', color: 'red' },
                  ].map(s => (
                    <div key={s.key} className="mini-stat">
                      <span className="mini-stat-val" style={{ color: `var(--${s.color === 'gray' ? 'text-muted' : s.color})` }}>
                        {summary.appliance_status_summary[s.key]}
                      </span>
                      <span className="mini-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts row */}
            <div className="content-grid">
              <div className="card">
                <div className="card-header">
                  <span className="card-title">⚡ Energy Usage Overview</span>
                  <span className="badge badge--blue">Daily</span>
                </div>
                <EnergyChart type="line" labels={lineLabels} datasets={lineDatasets} height={180} />
                <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
                  <div><p style={{ fontSize: 12, color: '#64748b' }}>Total Usage</p><p style={{ fontWeight: 800, fontSize: 16 }}>{summary?.total_kwh ?? 0} kWh</p></div>
                  <div><p style={{ fontSize: 12, color: '#64748b' }}>Est. Cost</p><p style={{ fontWeight: 800, fontSize: 16 }}>£{summary?.total_cost ?? 0}</p></div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <Link to="/energy-usage" className="btn btn-primary btn-sm">📊 View Usage</Link>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">📈 Energy Trend (This Week)</span>
                </div>
                <EnergyChart type="bar" labels={weekDays} datasets={trendDatasets} height={180} />
                <div style={{ marginTop: 10, display: 'flex', gap: 20 }}>
                  <div><p style={{ fontSize: 12, color: '#64748b' }}>Weekly Average</p><p style={{ fontWeight: 800, fontSize: 16 }}>127.6 kWh</p></div>
                  <div><p style={{ fontSize: 12, color: '#64748b' }}>vs Last Week</p><p style={{ fontWeight: 700, fontSize: 14, color: '#22c55e' }}>↓ 6.4%</p></div>
                </div>
              </div>
            </div>

            {/* Recommendations + Notifications */}
            <div className="content-grid" style={{ marginTop: 20 }}>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">💡 Top Recommendations</span>
                  <Link to="/recommendations" className="card-link">View All →</Link>
                </div>
                {recs.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">💡</div><p>No recommendations yet.</p></div>
                ) : recs.map(r => (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 20 }}>💡</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{r.title}</p>
                      <p style={{ fontSize: 12, color: '#64748b' }}>{r.description}</p>
                    </div>
                    <span className="badge badge--green">Save £{r.estimated_saving}</span>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">🔔 Recent Notifications</span>
                  <Link to="/notifications" className="card-link">View All →</Link>
                </div>
                {notifs.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">🔔</div><p>No notifications.</p></div>
                ) : notifs.map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18 }}>{n.notification_type === 'fault' ? '⚠️' : n.notification_type === 'high_usage' ? '⚡' : '💡'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{n.message.slice(0, 60)}{n.message.length > 60 ? '…' : ''}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    {!n.is_read && <span className="badge badge--orange">New</span>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
