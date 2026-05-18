/**
 * NotificationBox - displays a single notification with type-based styling.
 */
export default function NotificationBox({ notification, onMarkRead, onDelete }) {
  const typeConfig = {
    high_usage: { icon: '⚡', color: 'orange', label: 'High Usage' },
    fault: { icon: '⚠️', color: 'red', label: 'Fault Alert' },
    recommendation: { icon: '💡', color: 'green', label: 'Recommendation' },
    schedule: { icon: '📅', color: 'blue', label: 'Schedule' },
  }
  const config = typeConfig[notification.notification_type] || typeConfig.recommendation

  return (
    <div className={`notif-box notif-box--${config.color} ${notification.is_read ? 'notif-box--read' : ''}`}>
      <div className="notif-icon">{config.icon}</div>
      <div className="notif-body">
        <span className={`notif-badge notif-badge--${config.color}`}>{config.label}</span>
        <p className="notif-message">{notification.message}</p>
        <p className="notif-time">{new Date(notification.created_at).toLocaleString()}</p>
      </div>
      <div className="notif-actions">
        {!notification.is_read && onMarkRead && (
          <button className="btn btn-sm btn-ghost" onClick={() => onMarkRead(notification.id)}>
            Mark Read
          </button>
        )}
        {onDelete && (
          <button className="btn btn-sm btn-danger-ghost" onClick={() => onDelete(notification.id)}>
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
