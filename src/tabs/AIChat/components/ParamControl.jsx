export default function ParamControl({ label, value, options, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span className="label" style={{ display: 'inline' }}>
        {label}:
      </span>
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            background: 'var(--surface-alt)',
            border: 'none',
            outline: 'none',
            appearance: 'none',
            font: 'inherit',
            fontWeight: 600,
            color: 'var(--ink)',
            padding: '6px 22px 6px 10px',
            borderRadius: 8,
            boxShadow: 'var(--glow-sm)',
            cursor: 'pointer',
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 8,
            fontSize: 10,
            color: 'var(--muted)',
            pointerEvents: 'none',
          }}
        >
          ▾
        </span>
      </span>
    </label>
  )
}
