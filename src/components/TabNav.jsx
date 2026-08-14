import { useState } from 'react'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'reel-input', label: 'Reel input' },
  { id: 'ai-chat', label: 'AI chat' },
]

/**
 * Folder tabs. The order is fixed — tabs are not draggable and cannot be
 * rearranged; clicking one switches the page underneath it.
 *
 * The active tab is filled with the page colour so it reads as the front
 * folder, continuous with the content below it. Inactive tabs are darker and
 * sit lower, like folders filed behind it. The active tab's glow is clipped at
 * the bottom (`clipPath`) so nothing draws a line between it and the page.
 */
export default function TabNav({ activeTab, onChange }) {
  const [hoveredTab, setHoveredTab] = useState(null)

  return (
    <nav style={{ background: 'var(--surface)' }}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
          maxWidth: 1080,
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-6) 0',
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
          const isHovered = hoveredTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              draggable={false}
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                background: isActive
                  ? 'var(--bg)'
                  : isHovered
                    ? 'var(--surface-alt)'
                    : 'var(--surface-deep)',
                color: isActive || isHovered ? 'var(--ink)' : 'var(--muted)',
                border: 'none',
                boxShadow: isActive ? 'var(--glow-sm)' : 'none',
                clipPath: 'inset(-8px -8px 0 -8px)',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                letterSpacing: '0.01em',
                padding: isActive ? '13px var(--space-6)' : '10px var(--space-6)',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'background 120ms ease, padding 120ms ease',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
