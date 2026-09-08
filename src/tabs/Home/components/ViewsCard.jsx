export default function ViewsCard({ monthViews }) {
  return (
    <div className="card" style={{ background: 'var(--surface-alt)', borderRadius: 16 }}>
      <span className="label">Views this month</span>
      <span className="stat" style={{ display: 'block', marginTop: 'var(--space-2)' }}>
        {monthViews.toLocaleString()}
      </span>
    </div>
  )
}
