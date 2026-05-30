// Billing page
import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import DashboardCard from '../components/DashboardCard.jsx'
import { getDailyBills, getDashboardSummary, getEnergyUsage, getEnergyUsageSessions } from '../services/api.js'

// Billing section
export default function Billing() {
  const userId = parseInt(localStorage.getItem('user_id') || '0')
  const [summary, setSummary] = useState(null)
  const [usage, setUsage] = useState([])
  const [sessions, setSessions] = useState([])
  const [bills, setBills] = useState([])

  function load() {
    Promise.all([
      getDashboardSummary(userId),
      getEnergyUsage(userId),
      getEnergyUsageSessions(userId),
      getDailyBills(userId),
    ]).then(([s, u, sess, b]) => {
      setSummary(s)
      setUsage(u)
      setSessions(sess)
      setBills(b)
    }).catch(console.error)
  }

  useEffect(() => {
    load()
    const timer = setInterval(load, 30000)
    return () => clearInterval(timer)
  }, [userId])

  const savedKwh = usage.reduce((sum, item) => sum + Number(item.usage_kwh || 0), 0).toFixed(2)

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><span>Billing</span></h1>
            <p>Live usage, saved usage, today's bill, and daily billing history.</p>
          </div>
        </div>

        <div className="cards-grid">
          <DashboardCard title="Live Usage" value={`${summary?.live_kwh ?? 0} kWh`} subtitle="Running appliances" icon="Live" color="blue" />
          <DashboardCard title="Saved Usage" value={`${savedKwh} kWh`} subtitle="Recorded usage" icon="kWh" color="green" />
          <DashboardCard title="Estimated Bill" value={`Â£${summary?.total_cost ?? 0}`} subtitle={summary?.plan_name || 'Standard Plan'} icon="Â£" color="teal" />
          <DashboardCard title="Today's Bill" value={`Â£${summary?.today_bill_cost ?? 0}`} subtitle={`${summary?.today_bill_kwh ?? 0} kWh`} icon="Day" color="orange" />
        </div>

        <div className="content-grid" style={{ marginTop: 20 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Appliance Usage Sessions</span></div>
            {sessions.length === 0 ? <div className="empty-state"><p>No usage sessions yet.</p></div> : (
              <div className="table-wrap"><table><thead><tr><th>Appliance</th><th>Minutes</th><th>kWh</th><th>Cost</th><th>Ended</th></tr></thead><tbody>
                {sessions.map(s => <tr key={s.id}><td>{s.appliance_name}</td><td>{s.duration_minutes}</td><td>{s.usage_kwh}</td><td>Â£{s.estimated_cost}</td><td>{new Date(s.ended_at).toLocaleString()}</td></tr>)}
              </tbody></table></div>
            )}
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Daily Bill History</span></div>
            {bills.length === 0 ? <div className="empty-state"><p>No daily bills yet.</p></div> : (
              <div className="table-wrap"><table><thead><tr><th>Date</th><th>kWh</th><th>Cost</th></tr></thead><tbody>
                {bills.map(b => <tr key={b.id}><td>{b.bill_date}</td><td>{b.total_kwh}</td><td>Â£{b.total_cost}</td></tr>)}
              </tbody></table></div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
