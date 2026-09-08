import ReelsCondensedCard from '../../../../components/ReelsCondensedCard.jsx'
import TopReelsArrowButton from './TopReelsArrowButton.jsx'

/**
 * @param {{ metrics: import('../../../../shared/types.js').Metrics, onNavigateToReelInput?: () => void }} props
 */
export default function TopReelsBox({ metrics, onNavigateToReelInput }) {
  const topReels = metrics.topReels ?? []

  return (
    <div className="card" style={{ background: 'var(--surface-alt)', borderRadius: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="label">Top 3 reels this month</span>

        <TopReelsArrowButton onClick={onNavigateToReelInput} ariaLabel="Log a new reel" />
      </div>

      {topReels.length === 0 ? (
        <p className="caption" style={{ marginTop: 'var(--space-3)' }}>
          No reels logged yet — add your first above.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--space-2)' }}>
          {topReels.map((reel, index) => (
            <div key={reel.id}>
              {index > 0 && <div style={{ height: 1, background: 'var(--line)' }} />}
              <ReelsCondensedCard reel={reel} rank={index + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
