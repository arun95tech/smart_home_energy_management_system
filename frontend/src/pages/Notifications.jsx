import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import NotificationBox from '../components/NotificationBox.jsx'
import { getNotifications, markNotificationRead, deleteNotification } from '../services/api.js'

export default function Notifications() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role') || 'homeowner'
  const userId = parseInt(localStorage.getItem('user_id') || '1')

  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [msg, setMsg] = useState('')

  function load() {
    // Homeowners only see their own; admin/tech see all
    const recipientId = role === 'homeowner' ? userId : null
    getNotifications(recipientId).then(setNotifs).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!localStorage.getItem('role')) { navigate('/login'); return }
    load()
  }, [])

  async function handleMarkRead(id) {
    try { await markNotificationRead(id); load() }
    catch (err) { setMsg('❌ ' + err.message); setTimeout(() => setMsg(''), 3000) }
  }

  async function handleDelete(id) {
    if (role === 'admin') return // Admin cannot delete
    try { await deleteNotification(id); load() }
    catch (err) { setMsg('❌ ' + err.message); setTimeout(() => setMsg(''), 3000) }
  }

  const total = notifs.length
  const unread = notifs.filter(n => !n.is_read).length
  const highUsage = notifs.filter(n => n.notification_type === 'high_usage').length
  const faults = notifs.filter(n => n.notification_type === 'fault').length

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.is_read
    if (filter === 'high_usage') return n.notification_type === 'high_usage'
    if (filter === 'fault') return n.notification_type === 'fault'
    return true
  })

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1>🔔 <span>Notifications</span></h1>
            <p>{role === 'homeowner' ? 'Your personal notifications.' : 'All system notifications.'}</p>
          </div>
        </div>

        {msg && <div className="alert alert--danger">{msg}</div>}

        {/* Summary counts */}
        <div className="mini-stats" style={{ marginBottom: 20 }}>
          <div className="mini-stat">
            <span className="mini-stat-val">{total}</span>
            <span className="mini-stat-label">Total</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-orange">{unread}</span>
            <span className="mini-stat-label">Unread</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-orange">{highUsage}</span>
            <span className="mini-stat-label">High Usage</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-val text-red">{faults}</span>
            <span className="mini-stat-label">Fault Alerts</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-bar" style={{ marginBottom: 16 }}>
          {[
            { key:'all', label:'All' },
            { key:'unread', label:`Unread (${unread})` },
            { key:'high_usage', label:'⚡ High Usage' },
            { key:'fault', label:'⚠️ Faults' },
          ].map(tab => (
            <button key={tab.key} className={`btn btn-sm ${filter === tab.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="card">
          {loading ? (
            <div className="loading"><div className="loading-spinner"/><p>Loading notifications…</p></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🔔</div><p>No notifications found.</p></div>
          ) : filtered.map(n => (
            <NotificationBox
              key={n.id}
              notification={n}
              onMarkRead={!n.is_read ? handleMarkRead : null}
              onDelete={role !== 'admin' ? handleDelete : null}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
