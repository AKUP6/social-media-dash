const compactViews = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const compactDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function formatRate(rate) {
  return `${(rate * 100).toFixed(1)}%`
}

const iconProps = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }
const strokeProps = { stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'square', strokeLinejoin: 'miter' }

const ShareIcon = () => (
  <svg {...iconProps}>
    <path d="M12 15V3M12 3l-4 4M12 3l4 4" {...strokeProps} />
    <path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" {...strokeProps} />
  </svg>
)

const SkipIcon = () => (
  <svg {...iconProps}>
    <path d="M4 6l7 6-7 6" {...strokeProps} />
    <path d="M13 6l7 6-7 6" {...strokeProps} />
  </svg>
)

const LikeIcon = () => (
  <svg {...iconProps}>
    <path
      d="M12 20.5S3.5 15 3.5 8.75C3.5 5.7 5.7 4 8.25 4c1.6 0 3 .85 3.75 2.2C12.75 4.85 14.15 4 15.75 4 18.3 4 20.5 5.7 20.5 8.75 20.5 15 12 20.5 12 20.5z"
      {...strokeProps}
    />
  </svg>
)

const FollowIcon = () => (
  <svg {...iconProps}>
    <circle cx="9" cy="8" r="3.5" {...strokeProps} />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" {...strokeProps} />
    <path d="M18 8v6M15 11h6" {...strokeProps} />
  </svg>
)

const DateIcon = () => (
  <svg {...iconProps}>
    <rect x="3.5" y="5" width="17" height="16" {...strokeProps} />
    <path d="M3.5 10h17M8 3v4M16 3v4" {...strokeProps} />
  </svg>
)

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20l1-4.5L16 4.5a1.5 1.5 0 012 0l1.5 1.5a1.5 1.5 0 010 2L8.5 19 4 20z"
      {...strokeProps}
    />
    <path d="M14.5 6.5l3 3" {...strokeProps} />
  </svg>
)

const ANALYTICS_TILES = [
  { label: 'Share rate', icon: ShareIcon, value: (reel) => formatRate(reel.shareRate) },
  { label: 'Skip rate', icon: SkipIcon, value: (reel) => formatRate(reel.skipRate) },
  { label: 'Like rate', icon: LikeIcon, value: (reel) => formatRate(reel.likeRate) },
  { label: 'Follows from reel', icon: FollowIcon, value: (reel) => reel.followsFromReel.toLocaleString() },
  { label: 'Date posted', icon: DateIcon, value: (reel) => compactDate.format(new Date(reel.datePosted)) },
]

/**
 * @param {{ reel: import('../../../shared/types.js').Reel | null, onEdit?: (reel: import('../../../shared/types.js').Reel) => void }} props
 */
export default function ReelDetailCard({ reel, onEdit }) {
  if (!reel) {
    return (
      <div className="card" style={{ background: 'var(--surface-alt)', borderRadius: 16, textAlign: 'center' }}>
        <p className="caption">No reels logged yet.</p>
      </div>
    )
  }

  return (
    <div
      className="card"
      style={{
        background: 'var(--surface-alt)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--space-3)',
        position: 'relative',
      }}
    >
      {onEdit ? (
        <button
          type="button"
          onClick={() => onEdit(reel)}
          aria-label="Edit reel"
          className="btn"
          style={{
            position: 'absolute',
            top: 'var(--space-3)',
            right: 'var(--space-3)',
            width: 32,
            height: 32,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PencilIcon />
        </button>
      ) : null}

      <p style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>{reel.hook}</p>

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
        }}
      >
        {reel.niche}
      </span>

      <span className="mono" style={{ fontSize: 18, fontWeight: 700 }}>
        {compactViews.format(reel.views)}
      </span>

      {reel.thumbnail ? (
        <img
          src={reel.thumbnail}
          alt=""
          style={{
            width: 240,
            height: 240,
            objectFit: 'contain',
            background: 'var(--surface-deep)',
            boxShadow: 'var(--glow-sm)',
          }}
        />
      ) : (
        <div style={{ width: 240, height: 240, background: 'var(--surface-deep)', boxShadow: 'var(--glow-sm)' }} />
      )}

      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {ANALYTICS_TILES.map(({ label, icon: Icon, value }) => (
          <div key={label} className="card-inset" style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-1)',
                color: 'var(--muted)',
                marginBottom: 'var(--space-1)',
              }}
            >
              <Icon />
              <span className="label" style={{ marginBottom: 0 }}>
                {label}
              </span>
            </div>
            <span className="mono" style={{ display: 'block', textAlign: 'center', fontSize: 18, fontWeight: 700 }}>
              {value(reel)}
            </span>
          </div>
        ))}
      </div>

      {reel.description ? (
        <div className="card-inset" style={{ width: '100%', textAlign: 'left' }}>
          <span className="label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
            Description
          </span>
          <p className="caption" style={{ whiteSpace: 'pre-wrap' }}>
            {reel.description}
          </p>
        </div>
      ) : null}
    </div>
  )
}
