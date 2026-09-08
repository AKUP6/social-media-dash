import ReelsCondensedCard from '../../../components/ReelsCondensedCard.jsx'

/**
 * @param {{
 *   reels: import('../../../shared/types.js').Reel[],
 *   selectedReelId: string | null,
 *   onSelectReel: (reel: import('../../../shared/types.js').Reel) => void,
 *   onAddClick: () => void,
 * }} props
 */
export default function ReelsOverview({ reels, selectedReelId, onSelectReel, onAddClick }) {
  const sortedReels = [...reels].sort((a, b) => b.views - a.views)

  return (
    <div className="card" style={{ background: 'var(--surface-alt)', borderRadius: 16, paddingLeft: 0, paddingRight: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 'var(--space-5)',
          paddingRight: 'var(--space-5)',
        }}
      >
        <span className="label">All reels</span>

        <button
          type="button"
          onClick={onAddClick}
          aria-label="Add new reel"
          className="btn btn-primary"
          style={{
            borderRadius: '50%',
            width: 32,
            height: 32,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>

      {sortedReels.length === 0 ? (
        <p className="caption" style={{ marginTop: 'var(--space-3)', paddingLeft: 'var(--space-5)', paddingRight: 'var(--space-5)' }}>
          No reels logged yet — add your first.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--space-2)' }}>
          {sortedReels.map((reel, index) => (
            <div
              key={reel.id}
              onClick={() => onSelectReel(reel)}
              style={{
                cursor: 'pointer',
                transition: 'background-color 120ms ease',
                background: reel.id === selectedReelId ? 'var(--surface)' : 'transparent',
              }}
            >
              {index > 0 && <div style={{ height: 1, background: 'var(--line)' }} />}
              <ReelsCondensedCard reel={reel} rank={index + 1} sidePadding="var(--space-5)" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
