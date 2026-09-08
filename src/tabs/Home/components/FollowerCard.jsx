export default function FollowerCard({ followerIncrease }) {
  return (
    <div className="card" style={{ background: 'var(--surface-alt)', borderRadius: 16 }}>
      <span className="label">Follower increase</span>
      <span
        className="stat"
        style={{ display: 'block', marginTop: 'var(--space-2)', color: 'var(--primary-deep)' }}
      >
        +{followerIncrease.toLocaleString()}
      </span>
    </div>
  )
}
