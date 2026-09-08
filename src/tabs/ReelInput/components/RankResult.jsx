const TIER_LABEL = {
  top: 'Top',
  strong: 'Strong',
  average: 'Average',
  weak: 'Weak',
}

export default function RankResult({ result }) {
  if (!result) return null

  const { overallRank, nicheRank, score, tier } = result

  return (
    <div className="card-inset">
      <span className="label" style={{ marginBottom: 'var(--space-4)', display: 'block' }}>
        Ranking result
      </span>
      <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div>
          <span className="label">Overall rank</span>
          <span className="stat" style={{ fontSize: 28 }}>#{overallRank}</span>
        </div>
        <div>
          <span className="label">Niche rank</span>
          <span className="stat" style={{ fontSize: 28 }}>#{nicheRank}</span>
        </div>
        <div>
          <span className="label">Score</span>
          <span className="stat" style={{ fontSize: 28 }}>{score}/100</span>
        </div>
        <div>
          <span className="label">Tier</span>
          <span className="stat" style={{ fontSize: 28, color: 'var(--primary-deep)' }}>
            {TIER_LABEL[tier] ?? tier}
          </span>
        </div>
      </div>
    </div>
  )
}
