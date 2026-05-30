// Role based sidebar component
import { NavLink, useNavigate } from 'react-router-dom'

// Menu definitions per role
// Sidebar menu by role
const MENUS = {
  homeowner: [
    { label: 'Dashboard', path: '/homeowner-dashboard', icon: 'ðŸ ' },
    { label: 'Appliances', path: '/appliances', icon: 'ðŸ”Œ' },
    { label: 'Energy Usage', path: '/energy-usage', icon: 'âš¡' },
    { label: 'Billing', path: '/billing', icon: 'ðŸ’³' },
    { label: 'Recommendations', path: '/recommendations', icon: 'ðŸ’¡' },
    { label: 'Notifications', path: '/notifications', icon: 'ðŸ””' },
    { label: 'Profile', path: '/profile', icon: 'ðŸ‘¤' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin-dashboard', icon: 'ðŸ“Š' },
    { label: 'Users', path: '/admin-users', icon: 'ðŸ‘¥' },
    { label: 'Pricing Plans', path: '/pricing-plans', icon: 'ðŸ’Ž' },
    { label: 'Appliance Monitoring', path: '/admin-appliances', icon: 'ðŸ”Œ' },
    { label: 'Category Report', path: '/appliance-category-report', icon: 'ðŸ“‹' },
    { label: 'Fault Overview', path: '/admin-fault-overview', icon: 'âš ï¸' },
    { label: 'Notifications', path: '/notifications', icon: 'ðŸ””' },
    { label: 'Profile', path: '/profile', icon: 'ðŸ‘¤' },
  ],
  technician: [
    { label: 'Dashboard', path: '/technician-dashboard', icon: 'ðŸ”§' },
    { label: 'Fault Alerts', path: '/fault-alerts', icon: 'âš ï¸' },
    { label: 'Appliances', path: '/appliances', icon: 'ðŸ”Œ' },
    { label: 'Notifications', path: '/notifications', icon: 'ðŸ””' },
    { label: 'Profile', path: '/profile', icon: 'ðŸ‘¤' },
  ],
}

// Sidebar navigation
export default function Sidebar() {
  // navigate section
  const navigate = useNavigate()
  // role section
  const role = localStorage.getItem('role') || 'homeowner'
  // username section
  const username = localStorage.getItem('username') || 'User'
  // menuItems section
  const menuItems = MENUS[role] || MENUS.homeowner

  // handleLogout section
  function handleLogout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">âš¡</div>
        <div>
          <div className="sidebar-logo-title">Smart Home</div>
          <div className="sidebar-logo-sub">Energy Management System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link--active' : '')
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user info + logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="sidebar-user-name">{username}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          ðŸšª Logout
        </button>

        {/* Decorative card */}
        <div className="sidebar-promo">
          <div className="sidebar-promo-icon">ðŸŒ¿</div>
          <p>Together, let's build a smarter and <span className="text-green">greener</span> tomorrow.</p>
        </div>
      </div>
    </aside>
  )
}
