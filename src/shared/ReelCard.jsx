/**
 * Shared reel card. Owned by the Manager — workers import it, never edit it.
 *
 * Reads top to bottom: title, view count, niche, cover image.
 * Square corners, no border, soft black glow — see tokens.css.
 *
 * @param {{ reel: import('./types.js').Reel }} props
 */

const compactViews = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export default function ReelCard({ reel }) {
  return (
    <article
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
      }}
    >
      <h3
        style={{
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}
      >
        {reel.hook}
      </h3>

      <div>
        <span className="label">Views</span>
        <span
          className="mono"
          style={{ display: 'block', fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}
        >
          {compactViews.format(reel.views)}
        </span>
      </div>

      <span
        style={{
          alignSelf: 'flex-start',
          background: 'var(--primary-deep)',
          color: 'var(--surface-alt)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '4px var(--space-2)',
        }}
      >
        {reel.niche}
      </span>

      {reel.thumbnail ? (
        <img
          src={reel.thumbnail}
          alt=""
          style={{
            width: '100%',
            aspectRatio: '9 / 16',
            objectFit: 'cover',
            marginTop: 'auto',
            boxShadow: 'var(--glow-sm)',
          }}
        />
      ) : (
        <div
          className="caption"
          style={{
            width: '100%',
            aspectRatio: '9 / 16',
            marginTop: 'auto',
            background: 'var(--surface-deep)',
            boxShadow: 'var(--glow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          No cover yet
        </div>
      )}
    </article>
  )
}
