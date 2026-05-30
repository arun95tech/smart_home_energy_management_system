// Appliance category report page
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getAppliances } from '../services/api.js'

const TYPE_ICONS = { light:'ðŸ’¡', ac:'â„ï¸', fridge:'ðŸ§Š', heater:'ðŸ”¥', washing_machine:'ðŸ«§', other:'ðŸ”Œ' }
const TYPE_LABELS = { light:'Lights', ac:'Air Conditioners', fridge:'Refrigerators', heater:'Heaters', washing_machine:'Washing Machines', other:'Other' }
const TYPE_COLORS = { light:'#f59e0b', ac:'#3b82f6', fridge:'#06b6d4', heater:'#ef4444', washing_machine:'#8b5cf6', other:'#94a3b8' }

// Appliance category report section
export default function ApplianceCategoryReport() {
  const navigate = useNavigate()
  const [appliances, setAppliances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    getAppliances().then(setAppliances).catch(console.error).finally(() => setLoading(false))
  }, [])

  const categories = ['light','ac','fridge','heater','washing_machine','other']
  const counts = {}
  categories.forEach(c => { counts[c] = appliances.filter(a => a.appliance_type === c).length })

  const maxCount = Math.max(...Object.values(counts), 1)
  const total = appliances.length
  const renewable = appliances.filter(a => a.is_renewable_supported).length
  const faulty = appliances.filter(a => a.status === 'faulty').length

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>ðŸ“‹ <span>Appliance Category Report</span></h1>
            <p>Breakdown of appliances by category across all homeowners.</p>
          </div>
        </div>

        {/* Top summary cards */}
        <div className="cards-grid" style={{ marginBottom: 24 }}>
          <div className="dash-card dash-card--blue">
            <div className="dash-card-header">
              <div><p className="dash-card-title">Total Appliances</p><p className="dash-card-value">{total}</p></div>
              <div className="dash-card-icon dash-card-icon--blue">ðŸ”Œ</div>
            </div>
          </div>
          <div className="dash-card dash-card--green">
            <div className="dash-card-header">
              <div><p className="dash-card-title">Renewable Supported</p><p className="dash-card-value">{renewable}</p></div>
              <div className="dash-card-icon dash-card-icon--green">ðŸŒ¿</div>
            </div>
            <p className="dash-card-sub">{total > 0 ? Math.round(renewable/total*100) : 0}% of total</p>
          </div>
          <div className="dash-card dash-card--red">
            <div className="dash-card-header">
              <div><p className="dash-card-title">Faulty Appliances</p><p className="dash-card-value">{faulty}</p></div>
              <div className="dash-card-icon dash-card-icon--red">âš ï¸</div>
            </div>
            <p className="dash-card-sub">{total > 0 ? Math.round(faulty/total*100) : 0}% of total</p>
          </div>
          <div className="dash-card dash-card--purple">
            <div className="dash-card-header">
              <div><p className="dash-card-title">Categories</p><p className="dash-card-value">{categories.length}</p></div>
              <div className="dash-card-icon dash-card-icon--purple">ðŸ“Š</div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Bar Chart (CSS-only) */}
          <div className="card">
            <div className="card-header"><span className="card-title">ðŸ“Š Category Breakdown</span></div>
            {loading ? (
              <div className="loading"><div className="loading-spinner"/></div>
            ) : (
              <div className="bar-chart" style={{ marginTop: 8 }}>
                {categories.map(c => (
                  <div key={c} className="bar-row">
                    <span className="bar-row-label">{TYPE_ICONS[c]} {TYPE_LABELS[c]}</span>
                    <div className="bar-row-track">
                      <div
                        className="bar-row-fill"
                        style={{ width: `${(counts[c] / maxCount) * 100}%`, background: TYPE_COLORS[c] }}
                      />
                    </div>
                    <span className="bar-row-val">{counts[c]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Cards */}
          <div className="card">
            <div className="card-header"><span className="card-title">ðŸ“‹ Category Summary</span></div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {categories.map(c => (
                <div key={c} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:8, background:'#f8fafc', border:'1px solid #e8ecf3' }}>
                  <span style={{ fontSize:22 }}>{TYPE_ICONS[c]}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:13.5 }}>{TYPE_LABELS[c]}</p>
                    <p style={{ fontSize:12, color:'#64748b' }}>
                      {appliances.filter(a => a.appliance_type === c && a.is_renewable_supported).length} renewable
                      {' Â· '}
                      {appliances.filter(a => a.appliance_type === c && a.status === 'faulty').length} faulty
                    </p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontSize:22, fontWeight:800, color: TYPE_COLORS[c] }}>{counts[c]}</span>
                    <p style={{ fontSize:11, color:'#94a3b8' }}>{total > 0 ? Math.round(counts[c]/total*100) : 0}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
