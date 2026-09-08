export default function IdeaCard({ idea }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        background: 'var(--surface-alt)',
        boxShadow: 'var(--glow-sm)',
        padding: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{idea.hook}</h3>
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
            whiteSpace: 'nowrap',
          }}
        >
          {idea.angleTag}
        </span>
      </div>

      <p className="caption">{idea.concept}</p>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', paddingLeft: 18, fontSize: 14 }}>
        {idea.structure.map((beat) => (
          <li key={beat}>{beat}</li>
        ))}
      </ul>

      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-deep)' }}>{idea.cta}</p>
    </div>
  )
}
