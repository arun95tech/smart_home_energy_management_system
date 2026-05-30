// Admin dashboard page
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import DashboardCard from '../components/DashboardCard.jsx'
import EnergyChart from '../components/EnergyChart.jsx'
import { getAdminDashboardSummary, getProfiles, getPricingPlans, getNotifications } from '../services/api.js'

// Admin dashboard section
export default function AdminDashboard() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Admin'

  const [summary, setSummary] = useState(null)
  const [users, setUsers] = useState([])
  const [plans, setPlans] = useState([])
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    Promise.all([
      getAdminDashboardSummary(),
      getProfiles(),
      getPricingPlans(),
      getNotifications(),
    ]).then(([s, u, p, n]) => {
      setSummary(s)
      setUsers(u.slice(0, 5))
      setPlans(p.slice(0, 5))
      setNotifs(n.slice(0, 5))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const months = ['Apr 18','Apr 23','Apr 28','May 3','May 8','May 13','May 18']
  const usageData = [1800, 2200, 3000, 2600, 2400, 2800, 2200]
  const revenueData = [520, 640, 880, 740, 700, 820, 650]

  const chartDatasets = [
    {
      label: 'Energy Usage (kWh)',
      data: usageData,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.1)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y',
    },
    {
      label: 'Revenue (GBP)',
      data: revenueData,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y1',
    },
  ]

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>Welcome, <span>{username}</span></h1>
            <p>Here's what's happening in your energy management system.</p>
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>â˜€ï¸ 24Â°C Sunny</div>
        </div>

        {loading ? (
          <div className="loading"><div className="loading-spinner"/><p>Loading dashboardâ€¦</p></div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="cards-grid">
              <DashboardCard title="Total Users" value={summary?.total_users ?? 0} subtitle="â†‘ 12% vs last month" icon="ðŸ‘¥" color="blue" />
              <DashboardCard title="Total Appliances" value={summary?.total_appliances ?? 0} subtitle="â†‘ 8% vs last month" icon="ðŸ”Œ" color="green" />
              <DashboardCard title="Active Pricing Plans" value={summary?.active_pricing_plans ?? 0} subtitle="No changes" icon="ðŸ’Ž" color="purple" />
              <DashboardCard title="System Notifications" value={summary?.total_notifications ?? 0} subtitle={`${summary?.unread_notifications ?? 0} unread`} icon="ðŸ””" color="orange" />
              <DashboardCard title="Monthly Usage" value={`${summary?.total_kwh ?? 0} kWh`} subtitle="â†‘ 9.3% vs last month" icon="âš¡" color="teal" />
              <DashboardCard title="Revenue / Cost" value={`Â£${summary?.total_cost ?? 0}`} subtitle="â†‘ 14.6% vs last month" icon="ðŸ’·" color="green" />
            </div>

            <div className="content-grid">
              {/* System Overview Chart */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">ðŸ“ˆ System Overview</span>
                  <span className="badge badge--blue">This Month</span>
                </div>
                <EnergyChart type="line" labels={months} datasets={chartDatasets} height={200} />
                <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
                  <div><p style={{ fontSize: 11, color: '#64748b' }}>Total Usage</p><p style={{ fontWeight: 800 }}>{summary?.total_kwh} kWh</p></div>
                  <div><p style={{ fontSize: 11, color: '#64748b' }}>Total Cost</p><p style={{ fontWeight: 800 }}>Â£{summary?.total_cost}</p></div>
                  <div><p style={{ fontSize: 11, color: '#64748b' }}>Pending Faults</p><p style={{ fontWeight: 800, color: '#f97316' }}>{summary?.pending_faults}</p></div>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">ðŸ’Ž Pricing Plans</span>
                  <Link to="/pricing-plans" className="btn btn-primary btn-sm">+ Add New Plan</Link>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Plan Name</th><th>Type</th><th>Rate</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {plans.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No plans found.</td></tr>
                      ) : plans.map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 600 }}>{p.name}</td>
                          <td><span className={`badge badge--${p.plan_type === 'green' ? 'green' : p.plan_type === 'peak' ? 'orange' : 'blue'}`}>{p.plan_type}</span></td>
                          <td>Â£{p.rate_per_kwh}/kWh</td>
                          <td><span className={`badge badge--${p.is_active ? 'green' : 'gray'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link to="/pricing-plans" className="card-link" style={{ display: 'block', marginTop: 12 }}>View all plans â†’</Link>
              </div>
            </div>

            {/* User Management + Recent Activity */}
            <div className="content-grid" style={{ marginTop: 20 }}>
              <div className="card">
                <div className="card-header">
                  <span className="card-title">ðŸ‘¥ User Management</span>
                  <Link to="/admin-users" className="card-link">View All Users â†’</Link>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>User</th><th>Role</th><th>Plan</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No users found.</td></tr>
                      ) : users.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                                {u.username?.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{u.username}</span>
                            </div>
                          </td>
                          <td><span className="badge badge--blue">{u.role}</span></td>
                          <td style={{ fontSize: 12 }}>{u.plan_name}</td>
                          <td><span className={`badge badge--${u.is_active_member ? 'green' : 'gray'}`}>{u.is_active_member ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">ðŸ”” Recent Activity</span>
                  <Link to="/notifications" className="card-link">View All â†’</Link>
                </div>
                {notifs.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">ðŸ””</div><p>No recent activity.</p></div>
                ) : notifs.map(n => (
                  <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18 }}>
                      {n.notification_type === 'fault' ? 'âš ï¸' : n.notification_type === 'high_usage' ? 'âš¡' : 'ðŸ’¡'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, lineHeight: 1.4 }}>{n.message.slice(0, 70)}{n.message.length > 70 ? 'â€¦' : ''}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    {!n.is_read && <span className="badge badge--orange" style={{ fontSize: 10 }}>New</span>}
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
