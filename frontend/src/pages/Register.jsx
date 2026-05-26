import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerHomeowner } from '../services/api.js'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', email: '', phone_number: '', address: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await registerHomeowner(form)
      localStorage.setItem('username', user.username)
      localStorage.setItem('role', user.role)
      localStorage.setItem('user_id', user.id)
      localStorage.setItem('profile_id', user.profile_id)
      localStorage.setItem('auth_token', user.auth_token)
      navigate('/homeowner-dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-hero">
          <div className="login-hero-text">
            <h2>Start smart.<br /><span>Save energy.</span></h2>
            <p>Create a homeowner account to manage appliances, track usage, view bills, and receive alerts.</p>
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0', position: 'relative', zIndex: 1 }}>
            <svg viewBox="0 0 260 200" width="100%" style={{ maxWidth: 220 }}>
              <ellipse cx="130" cy="185" rx="110" ry="18" fill="rgba(34,197,94,0.25)"/>
              <rect x="65" y="105" width="130" height="80" rx="4" fill="white" opacity="0.92"/>
              <polygon points="55,108 130,55 205,108" fill="#1e3a5f" opacity="0.9"/>
              <rect x="113" y="140" width="34" height="45" rx="3" fill="#1d4ed8" opacity="0.7"/>
              <rect x="76" y="115" width="28" height="22" rx="3" fill="#bfdbfe"/>
              <rect x="156" y="115" width="28" height="22" rx="3" fill="#bfdbfe"/>
              <rect x="105" y="68" width="20" height="12" rx="2" fill="#3b82f6" opacity="0.8"/>
              <rect x="128" y="63" width="20" height="12" rx="2" fill="#3b82f6" opacity="0.8"/>
              <line x1="210" y1="185" x2="210" y2="100" stroke="white" strokeWidth="2.5" opacity="0.8"/>
              <circle cx="210" cy="100" r="3" fill="white"/>
              <line x1="210" y1="100" x2="210" y2="75" stroke="white" strokeWidth="2" opacity="0.7"/>
              <line x1="210" y1="100" x2="228" y2="110" stroke="white" strokeWidth="2" opacity="0.7"/>
              <line x1="210" y1="100" x2="192" y2="110" stroke="white" strokeWidth="2" opacity="0.7"/>
            </svg>
          </div>

          <div className="login-hero-features">
            <div className="hero-feature-card">
              <div className="icon">🏠</div>
              <strong>Your Home</strong>
              <span>Add and control appliances</span>
            </div>
            <div className="hero-feature-card">
              <div className="icon">⚡</div>
              <strong>Usage</strong>
              <span>Track energy records</span>
            </div>
            <div className="hero-feature-card">
              <div className="icon">🔔</div>
              <strong>Alerts</strong>
              <span>Get important notifications</span>
            </div>
          </div>
        </div>

        <div className="login-form-side">
          <div className="login-logo">
            <div className="logo-icon">🏠</div>
            <h1>Create Account</h1>
            <p>Homeowner registration</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h3>Homeowner details</h3>
            <p className="sub">Enter your account and contact information.</p>

            {error && <div className="alert alert--danger" style={{ marginBottom: 14 }}>⚠️ {error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-control" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-control" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" value={form.phone_number} onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-control" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
              Already registered? <Link to="/login" style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'underline' }}>Back to login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
