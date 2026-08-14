import { useState } from 'react'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'reel-input', label: 'Reel input' },
  { id: 'ai-chat', label: 'AI chat' },
]

/**
 * Google-style tab bar: the active tab is underlined, inactive tabs are quiet.
 * No pill backgrounds, no radius — see the design language in CLAUDE.md.
 */
export default function TabNav({ activeTab, onChange }) {
  const [hoveredTab, setHoveredTab] = useState(null)

  return (
    <nav
      style={{
        display: 'flex',
        gap: 'var(--space-6)',
        padding: '0 var(--space-6)',
        background: 'var(--bg)',
        boxShadow: `inset 0 -1px 0 var(--line)`,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab
        const isHovered = hoveredTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: isActive || isHovered ? 'var(--ink)' : 'var(--muted)',
              fontFamily: 'var(--font-display)',
              fontWeight: isActive ? 600 : 500,
              fontSize: 14,
              letterSpacing: '0.01em',
              padding: '16px 2px',
              cursor: 'pointer',
            }}
          >
            {tab.label}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 3,
                background: isActive ? 'var(--ink)' : 'transparent',
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}
