const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'reel-input', label: 'Reel input' },
  { id: 'ai-chat', label: 'AI chat' },
]

export default function TabNav({ activeTab, onChange }) {
  return (
    <nav
      style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--line)',
        padding: '0 24px',
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--primary-deep)' : '2px solid transparent',
              color: isActive ? 'var(--ink)' : 'var(--muted)',
              fontFamily: 'var(--font-display)',
              fontWeight: isActive ? 600 : 500,
              fontSize: 15,
              padding: '14px 4px',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
