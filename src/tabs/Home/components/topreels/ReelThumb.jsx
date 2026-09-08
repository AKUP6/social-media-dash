/**
 * Fixed-size placeholder thumbnail for a reel row. Falls back to a token-colored
 * square with the reel's rank (or the niche's first letter, if no rank is given)
 * when the reel has no `thumbnail` — no network dependency.
 *
 * @param {{ reel: import('../../../../shared/types.js').Reel, rank?: number }} props
 */
export default function ReelThumb({ reel, rank }) {
  if (reel.thumbnail) {
    return (
      <img
        src={reel.thumbnail}
        alt=""
        style={{
          width: 56,
          height: 56,
          flexShrink: 0,
          objectFit: 'cover',
          boxShadow: 'var(--glow-sm)',
        }}
      />
    )
  }

  const label = rank ?? reel.niche?.[0]?.toUpperCase() ?? '?'

  return (
    <div
      className="mono"
      style={{
        width: 56,
        height: 56,
        flexShrink: 0,
        background: 'var(--surface-deep)',
        boxShadow: 'var(--glow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--muted)',
      }}
    >
      {label}
    </div>
  )
}
