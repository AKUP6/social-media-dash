export default function ChartPlaceholder({ label = 'Chart', values }) {
  const hasBars = Array.isArray(values) && values.length > 0
  const max = hasBars ? Math.max(...values) : 0

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        background: 'var(--surface-alt)',
        borderRadius: 16,
      }}
    >
      <span className="label">{label}</span>
      {hasBars ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', height: 64 }}>
          {values.map((value, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: max > 0 ? `${(value / max) * 100}%` : 0,
                minHeight: 2,
                background: 'var(--primary-deep)',
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ height: 64 }} />
      )}
    </div>
  )
}
