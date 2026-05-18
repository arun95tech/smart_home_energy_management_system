/**
 * RecommendationCard - displays a single energy-saving recommendation.
 */
export default function RecommendationCard({ rec, onDelete }) {
  return (
    <div className="rec-card">
      <div className="rec-card-icon">💡</div>
      <div className="rec-card-body">
        <h4 className="rec-card-title">{rec.title}</h4>
        <p className="rec-card-desc">{rec.description}</p>
        <span className="rec-card-saving">
          💰 Estimated saving: <strong>£{rec.estimated_saving}/month</strong>
        </span>
      </div>
      {onDelete && (
        <button className="btn btn-sm btn-danger-ghost rec-card-delete" onClick={() => onDelete(rec.id)}>
          ✕
        </button>
      )}
    </div>
  )
}
