// Dashboard card component
/**
 * DashboardCard - reusable stat card for all dashboards.
 * Props: title, value, subtitle, icon, color ('green'|'blue'|'orange'|'red'|'purple')
 */
// Dashboard statistic card
export default function DashboardCard({ title, value, subtitle, icon, color = 'blue', children }) {
  return (
    <div className={`dash-card dash-card--${color}`}>
      <div className="dash-card-header">
        <div>
          <p className="dash-card-title">{title}</p>
          <p className="dash-card-value">{value ?? 'â€”'}</p>
        </div>
        <div className={`dash-card-icon dash-card-icon--${color}`}>
          {icon}
        </div>
      </div>
      {subtitle && <p className="dash-card-sub">{subtitle}</p>}
      {children}
    </div>
  )
}
