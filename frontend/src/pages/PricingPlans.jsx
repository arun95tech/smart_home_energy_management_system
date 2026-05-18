import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getPricingPlans, createPricingPlan, deletePricingPlan, calculateCost } from '../services/api.js'

const EMPTY_PLAN = { name:'', plan_type:'flat', rate_per_kwh:'', discount_percentage:'0', is_active:true }

export default function PricingPlans() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'homeowner'

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_PLAN)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Cost calculator state
  const [calc, setCalc] = useState({ pricing_plan_id:'', usage_kwh:'', usage_time:'12:00' })
  const [calcResult, setCalcResult] = useState(null)
  const [calcLoading, setCalcLoading] = useState(false)

  function load() {
    getPricingPlans().then(setPlans).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    load()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await createPricingPlan({
        ...form,
        rate_per_kwh: parseFloat(form.rate_per_kwh),
        discount_percentage: parseFloat(form.discount_percentage) || 0,
      })
      setForm(EMPTY_PLAN)
      setShowForm(false)
      setMsg('✅ Pricing plan created!')
      load()
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this plan?')) return
    try {
      await deletePricingPlan(id)
      setMsg('✅ Plan deleted.')
      load()
    } catch (err) {
      setMsg('❌ ' + err.message)
    } finally {
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handleCalculate(e) {
    e.preventDefault()
    setCalcLoading(true)
    setCalcResult(null)
    try {
      const result = await calculateCost({
        pricing_plan_id: parseInt(calc.pricing_plan_id),
        usage_kwh: parseFloat(calc.usage_kwh),
        usage_time: calc.usage_time,
      })
      setCalcResult(result)
    } catch (err) {
      setMsg('❌ Calculator error: ' + err.message)
      setTimeout(() => setMsg(''), 3000)
    } finally {
      setCalcLoading(false)
    }
  }

  const TYPE_COLORS = { flat:'blue', peak:'orange', green:'green' }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>💎 <span>Pricing Plans</span></h1>
            <p>Manage energy pricing strategies and calculate costs.</p>
          </div>
          {role === 'admin' && (
            <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
              {showForm ? '✕ Cancel' : '+ Add New Plan'}
            </button>
          )}
        </div>

        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert--success' : 'alert--danger'}`}>{msg}</div>}

        {/* Add Plan Form (admin only) */}
        {role === 'admin' && showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><span className="card-title">➕ New Pricing Plan</span></div>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Plan Name</label>
                  <input className="form-control" required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Standard Flat Rate" />
                </div>
                <div className="form-group">
                  <label className="form-label">Plan Type</label>
                  <select className="form-control" value={form.plan_type} onChange={e => setForm(f=>({...f,plan_type:e.target.value}))}>
                    <option value="flat">Flat Rate</option>
                    <option value="peak">Peak Hour</option>
                    <option value="green">Green Energy</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Rate per kWh ($)</label>
                  <input className="form-control" type="number" step="0.01" min="0" required value={form.rate_per_kwh} onChange={e => setForm(f=>({...f,rate_per_kwh:e.target.value}))} placeholder="0.30" />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input className="form-control" type="number" min="0" max="100" value={form.discount_percentage} onChange={e => setForm(f=>({...f,discount_percentage:e.target.value}))} placeholder="0" />
                </div>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, cursor:'pointer', marginBottom:14 }}>
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f=>({...f,is_active:e.target.checked}))} />
                Active Plan
              </label>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : '✅ Create Plan'}</button>
            </form>
          </div>
        )}

        <div className="content-grid">
          {/* Plans Table */}
          <div className="card">
            <div className="card-header"><span className="card-title">📋 All Pricing Plans</span></div>
            {loading ? (
              <div className="loading"><div className="loading-spinner"/></div>
            ) : plans.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">💎</div><p>No pricing plans found.</p></div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Plan Name</th><th>Type</th><th>Rate/kWh</th><th>Discount</th><th>Status</th>{role==='admin' && <th>Actions</th>}</tr>
                  </thead>
                  <tbody>
                    {plans.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight:600 }}>{p.name}</td>
                        <td><span className={`badge badge--${TYPE_COLORS[p.plan_type]}`}>{p.plan_type}</span></td>
                        <td>${p.rate_per_kwh}/kWh</td>
                        <td>{p.discount_percentage}%</td>
                        <td><span className={`badge badge--${p.is_active ? 'green':'gray'}`}>{p.is_active?'Active':'Inactive'}</span></td>
                        {role==='admin' && (
                          <td>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>🗑️ Delete</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Cost Calculator (Strategy Pattern demo) */}
          <div className="card">
            <div className="card-header"><span className="card-title">🧮 Cost Calculator</span></div>
            <p style={{ fontSize:12.5, color:'#64748b', marginBottom:16 }}>
              Demonstrates the <strong>Strategy Pattern</strong> — different pricing strategies apply different cost calculation rules.
            </p>
            <form onSubmit={handleCalculate}>
              <div className="form-group">
                <label className="form-label">Select Plan</label>
                <select className="form-control" required value={calc.pricing_plan_id} onChange={e => setCalc(c=>({...c,pricing_plan_id:e.target.value}))}>
                  <option value="">Choose a plan…</option>
                  {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.plan_type})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Usage (kWh)</label>
                <input className="form-control" type="number" step="0.1" min="0" required value={calc.usage_kwh} onChange={e => setCalc(c=>({...c,usage_kwh:e.target.value}))} placeholder="e.g. 10" />
              </div>
              <div className="form-group">
                <label className="form-label">Usage Time (for Peak Hour plan)</label>
                <input className="form-control" type="time" value={calc.usage_time} onChange={e => setCalc(c=>({...c,usage_time:e.target.value}))} />
              </div>
              <button className="btn btn-primary full-width" type="submit" disabled={calcLoading}>
                {calcLoading ? 'Calculating…' : '⚡ Calculate Cost'}
              </button>
            </form>

            {calcResult && (
              <div className="alert alert--success" style={{ marginTop:16, flexDirection:'column', alignItems:'flex-start', gap:6 }}>
                <strong>📊 Calculation Result</strong>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 12px', width:'100%', marginTop:6 }}>
                  {[
                    ['Plan', calcResult.plan_name],
                    ['Type', calcResult.plan_type],
                    ['Usage', `${calcResult.usage_kwh} kWh`],
                    ['Rate', `$${calcResult.rate_per_kwh}/kWh`],
                    ['Discount', `${calcResult.discount_percentage}%`],
                    ['Time', calcResult.usage_time],
                  ].map(([k,v]) => (
                    <div key={k} style={{ fontSize:12 }}><span style={{ color:'#64748b' }}>{k}:</span> <strong>{v}</strong></div>
                  ))}
                </div>
                <div style={{ marginTop:10, fontSize:18, fontWeight:800, color:'#16a34a' }}>
                  💰 Calculated Cost: ${calcResult.calculated_cost}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
