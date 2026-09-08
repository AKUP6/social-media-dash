/**
 * A left-chevron "back" link, used at the top of a tab to return to another tab.
 *
 * @param {{ label: string, onClick: () => void }} props
 */
export default function BackButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        alignSelf: 'flex-start',
        background: 'var(--surface-alt)',
        border: 'none',
        borderRadius: 999,
        boxShadow: 'var(--glow-sm)',
        padding: '8px var(--space-4)',
        cursor: 'pointer',
        color: 'var(--muted)',
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        fontWeight: 600,
        transition: 'box-shadow 120ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--glow-strong)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--glow-sm)')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      {label}
    </button>
  )
}
