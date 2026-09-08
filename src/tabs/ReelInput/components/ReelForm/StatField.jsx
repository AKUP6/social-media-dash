export default function StatField({ label, type = 'text', value, onChange, suffix, min, max, step, placeholder, rows }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <span className="label">{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {type === 'textarea' ? (
          <textarea
            className="field"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={rows ?? 3}
            style={{ resize: 'vertical', fontFamily: 'var(--font-display)' }}
          />
        ) : (
          <input
            className="field mono"
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
          />
        )}
        {suffix ? <span className="mono caption">{suffix}</span> : null}
      </div>
    </label>
  )
}
