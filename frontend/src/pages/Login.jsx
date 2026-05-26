import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api.js'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('homeowner')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login({ username, password, role })
      localStorage.setItem('username', user.username)
      localStorage.setItem('role', user.role)
      localStorage.setItem('user_id', user.id)
      localStorage.setItem('profile_id', user.profile_id)
      localStorage.setItem('auth_token', user.auth_token)

      const routes = {
        homeowner: '/homeowner-dashboard',
        admin: '/admin-dashboard',
        technician: '/technician-dashboard',
      }
      navigate(routes[user.role])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LEFT: Hero Panel */}
        <div className="login-hero">
          <div className="login-hero-text">
            <h2>Smarter energy.<br /><span>Greener tomorrow.</span></h2>
            <p>Monitor, optimize, and manage your home energy usage in real-time.</p>
          </div>

          {/* House SVG illustration */}
          <div style={{ textAlign: 'center', margin: '16px 0', position: 'relative', zIndex: 1 }}>
            <svg viewBox="0 0 260 200" width="100%" style={{ maxWidth: 220 }}>
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e40af" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <ellipse cx="130" cy="185" rx="110" ry="18" fill="rgba(34,197,94,0.25)"/>
              <rect x="65" y="105" width="130" height="80" rx="4" fill="white" opacity="0.92"/>
              <polygon points="55,108 130,55 205,108" fill="#1e3a5f" opacity="0.9"/>
              <rect x="113" y="140" width="34" height="45" rx="3" fill="#1d4ed8" opacity="0.7"/>
              <circle cx="142" cy="165" r="2.5" fill="white"/>
              <rect x="76" y="115" width="28" height="22" rx="3" fill="#bfdbfe"/>
              <line x1="90" y1="115" x2="90" y2="137" stroke="#93c5fd" strokeWidth="1"/>
              <line x1="76" y1="126" x2="104" y2="126" stroke="#93c5fd" strokeWidth="1"/>
              <rect x="156" y="115" width="28" height="22" rx="3" fill="#bfdbfe"/>
              <line x1="170" y1="115" x2="170" y2="137" stroke="#93c5fd" strokeWidth="1"/>
              <line x1="156" y1="126" x2="184" y2="126" stroke="#93c5fd" strokeWidth="1"/>
              <rect x="105" y="68" width="20" height="12" rx="2" fill="#3b82f6" opacity="0.8"/>
              <rect x="128" y="63" width="20" height="12" rx="2" fill="#3b82f6" opacity="0.8"/>
              <line x1="105" y1="74" x2="125" y2="74" stroke="#93c5fd" strokeWidth="0.8"/>
              <line x1="128" y1="69" x2="148" y2="69" stroke="#93c5fd" strokeWidth="0.8"/>
              <line x1="210" y1="185" x2="210" y2="100" stroke="white" strokeWidth="2.5" opacity="0.8"/>
              <circle cx="210" cy="100" r="3" fill="white"/>
              <line x1="210" y1="100" x2="210" y2="75" stroke="white" strokeWidth="2" opacity="0.7"/>
              <line x1="210" y1="100" x2="228" y2="110" stroke="white" strokeWidth="2" opacity="0.7"/>
              <line x1="210" y1="100" x2="192" y2="110" stroke="white" strokeWidth="2" opacity="0.7"/>
              <ellipse cx="48" cy="155" rx="18" ry="22" fill="#22c55e" opacity="0.7"/>
              <rect x="45" y="170" width="6" height="15" fill="#92400e" opacity="0.6"/>
            </svg>
          </div>

          <div className="login-hero-features">
            <div className="hero-feature-card">
              <div className="icon">🌿</div>
              <strong>Lower Bills</strong>
              <span>Optimize usage and save more</span>
            </div>
            <div className="hero-feature-card">
              <div className="icon">⚡</div>
              <strong>Real-time Insights</strong>
              <span>Track usage and get instant alerts</span>
            </div>
            <div className="hero-feature-card">
              <div className="icon">🛡️</div>
              <strong>Secure & Reliable</strong>
              <span>Your data is safe and protected</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Login Form */}
        <div className="login-form-side">
          <div className="login-logo">
            <div className="logo-icon">🏠</div>
            <h1>Smart Home</h1>
            <p>Energy Management System</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <h3>Welcome back!</h3>
            <p className="sub">Sign in to continue to your account.</p>

            {error && (
              <div className="alert alert--danger" style={{ marginBottom: 14 }}>
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>👤</span>
                <input
                  className="form-control"
                  style={{ paddingLeft: 32 }}
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔒</span>
                <input
                  className="form-control"
                  style={{ paddingLeft: 32, paddingRight: 36 }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14 }}
                  onClick={() => setShowPass(v => !v)}
                >{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Role</label>
              <div className="role-selector">
                {['homeowner', 'admin', 'technician'].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`role-btn ${role === r ? 'role-btn--active' : ''}`}
                    onClick={() => setRole(r)}
                  >
                    {r === 'homeowner' ? '🏠' : r === 'admin' ? '🛡️' : '🔧'}
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Logging in...' : '🔐 Login'}
            </button>

            {role === 'homeowner' && (
              <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
                Homeowner? <Link to="/register" style={{ color: '#16a34a', fontWeight: 800, textDecoration: 'underline' }}>Create an account</Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
