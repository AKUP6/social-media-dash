import ReelThumb from '../tabs/Home/components/topreels/ReelThumb.jsx'

const compactViews = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/**
 * One row in the top-reels list: thumbnail, hook, niche tag, views.
 *
 * @param {{ reel: import('../shared/types.js').Reel, rank: number, sidePadding?: string }} props
 */
export default function ReelsCondensedCard({ reel, rank, sidePadding = '0' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: `var(--space-3) ${sidePadding}`,
      }}
    >
      <ReelThumb reel={reel} rank={rank} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {reel.hook}
        </p>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}
        >
          {reel.niche}
        </span>
      </div>

      <span className="mono" style={{ fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
        {compactViews.format(reel.views)}
      </span>
    </div>
  )
}
