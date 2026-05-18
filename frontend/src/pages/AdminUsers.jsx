import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getPricingPlans, getProfiles, patchProfile } from '../services/api.js'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [pricingPlans, setPricingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [msg, setMsg] = useState('')

  function load() {
    Promise.all([getProfiles(), getPricingPlans()])
      .then(([profileData, planData]) => {
        setUsers(profileData)
        setPricingPlans(planData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    load()
  }, [])

  async function toggleActive(user) {
    try {
      await patchProfile(user.id, { is_active_member: !user.is_active_member })
      setMsg(`✅ ${user.username} ${!user.is_active_member ? 'activated' : 'deactivated'}.`)
      load()
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handlePlanBlur(user, field, value) {
    try {
      await patchProfile(user.id, { [field]: value })
    } catch (err) {
      setMsg('❌ Failed to save: ' + err.message)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handlePricingPlanChange(user, value) {
    const planId = value ? parseInt(value) : null
    const selectedPlan = pricingPlans.find(plan => plan.id === planId)
    try {
      await patchProfile(user.id, {
        pricing_plan: planId,
        plan_name: selectedPlan ? selectedPlan.name : user.plan_name,
      })
      setMsg(`âœ… Pricing plan assigned to ${user.username}.`)
      load()
    } catch (err) {
      setMsg('âŒ Failed to assign pricing plan: ' + err.message)
    } finally {
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const today = new Date()
  function planStatus(user) {
    if (!user.plan_expiry_date) return { label: 'No Expiry', color: 'gray' }
    const exp = new Date(user.plan_expiry_date)
    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { label: 'Expired', color: 'red' }
    if (diff <= 30) return { label: `Expiring (${diff}d)`, color: 'orange' }
    return { label: 'Active', color: 'green' }
  }

  const expired = users.filter(u => u.plan_expiry_date && new Date(u.plan_expiry_date) < today)
  const expiringSoon = users.filter(u => {
    if (!u.plan_expiry_date) return false
    const diff = Math.ceil((new Date(u.plan_expiry_date) - today) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 30
  })
  const active = users.filter(u => u.is_active_member)
  const deactivated = users.filter(u => !u.is_active_member)

  const filtered = users.filter(u => {
    if (filterRole && u.role !== filterRole) return false
    if (filterStatus === 'active' && !u.is_active_member) return false
    if (filterStatus === 'inactive' && u.is_active_member) return false
    return true
  })

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>👥 <span>User Management</span></h1>
            <p>Manage users, plans, and membership status.</p>
          </div>
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert--success' : 'alert--danger'}`}>{msg}</div>}

        {/* Summary */}
        <div className="mini-stats" style={{ marginBottom: 20 }}>
          <div className="mini-stat"><span className="mini-stat-val">{users.length}</span><span className="mini-stat-label">Total Users</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-green">{active.length}</span><span className="mini-stat-label">Active</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-muted">{deactivated.length}</span><span className="mini-stat-label">Deactivated</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-red">{expired.length}</span><span className="mini-stat-label">Expired</span></div>
          <div className="mini-stat"><span className="mini-stat-val text-orange">{expiringSoon.length}</span><span className="mini-stat-label">Expiring Soon</span></div>
        </div>

        {/* Filters */}
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="homeowner">Homeowner</option>
            <option value="admin">Admin</option>
            <option value="technician">Technician</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="inactive">Deactivated</option>
          </select>
          <span style={{ fontSize:13, color:'#64748b' }}>{filtered.length} user(s)</span>
        </div>

        {/* Users Table */}
        <div className="card">
          {loading ? (
            <div className="loading"><div className="loading-spinner"/></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">👥</div><p>No users found.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>User</th><th>Role</th><th>Pricing Plan</th><th>Expiry Date</th>
                    <th>Plan Status</th><th>Member Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => {
                    const ps = planStatus(u)
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#22c55e,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0 }}>
                              {u.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight:600, fontSize:13 }}>{u.username}</div>
                              <div style={{ fontSize:11, color:'#94a3b8' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge--blue">{u.role}</span></td>
                        <td>
                          <select
                            value={u.pricing_plan || ''}
                            style={{ border:'1px solid #e2e8f0', borderRadius:6, padding:'4px 8px', fontSize:12.5, width:160 }}
                            onChange={e => handlePricingPlanChange(u, e.target.value)}
                          >
                            {pricingPlans.map(plan => (
                              <option key={plan.id} value={plan.id}>
                                {plan.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="date"
                            defaultValue={u.plan_expiry_date || ''}
                            style={{ border:'1px solid #e2e8f0', borderRadius:6, padding:'4px 8px', fontSize:12.5 }}
                            onBlur={e => handlePlanBlur(u, 'plan_expiry_date', e.target.value || null)}
                          />
                        </td>
                        <td><span className={`badge badge--${ps.color}`}>{ps.label}</span></td>
                        <td><span className={`badge badge--${u.is_active_member ? 'green' : 'gray'}`}>{u.is_active_member ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <button
                            className={`btn btn-sm ${u.is_active_member ? 'btn-danger' : 'btn-green'}`}
                            onClick={() => toggleActive(u)}
                          >
                            {u.is_active_member ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
