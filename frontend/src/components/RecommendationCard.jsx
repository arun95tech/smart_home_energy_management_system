// Recommendation item component
/**
 * RecommendationCard - displays a single energy-saving recommendation.
 */
// Recommendation display section
export default function RecommendationCard({ rec, onDelete }) {
  return (
    <div className="rec-card">
      <div className="rec-card-icon">ðŸ’¡</div>
      <div className="rec-card-body">
        <h4 className="rec-card-title">{rec.title}</h4>
        <p className="rec-card-desc">{rec.description}</p>
        <span className="rec-card-saving">
          ðŸ’° Estimated saving: <strong>Â£{rec.estimated_saving}/month</strong>
        </span>
      </div>
      {onDelete && (
        <button className="btn btn-sm btn-danger-ghost rec-card-delete" onClick={() => onDelete(rec.id)}>
          âœ•
        </button>
      )}
    </div>
  )
}
