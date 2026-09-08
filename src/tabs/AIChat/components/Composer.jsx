import { useRef, useState } from 'react'
import { REEL_TYPES, GOALS } from '../../../lib/promptBuilder.js'
import ParamControl from './ParamControl.jsx'

const MIN_ROWS = 2
const MAX_ROWS = 6

export default function Composer({
  value,
  onChange,
  reelType,
  goal,
  onReelTypeChange,
  onGoalChange,
  onSend,
  isGenerating,
}) {
  const textareaRef = useRef(null)
  const [focused, setFocused] = useState(false)

  function resize(el) {
    if (!el) return
    el.style.height = 'auto'
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
    const maxHeight = lineHeight * MAX_ROWS
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  function handleChange(e) {
    onChange(e.target.value)
    resize(e.target)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isGenerating && value.trim() !== '') onSend()
    }
  }

  return (
    <div
      className="fade-in-up"
      style={{
        background: 'var(--surface-alt)',
        boxShadow: focused ? 'var(--glow-strong)' : 'var(--glow)',
        transition: 'box-shadow 150ms ease-out',
        borderRadius: 16,
        // Pull out by exactly the corner radius so the rounded edge sits
        // flush with the column instead of reading as extra side margin.
        marginLeft: -16,
        marginRight: -16,
        marginBottom: 'var(--space-4)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        opacity: 0,
        animationDelay: '300ms',
        animationFillMode: 'both',
      }}
    >
      <textarea
        ref={textareaRef}
        rows={MIN_ROWS}
        value={value}
        placeholder="Type a message…"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          font: 'inherit',
          fontSize: 14,
          color: 'var(--ink)',
          padding: 'var(--space-4)',
        }}
      />

      <div style={{ height: 1, background: 'var(--line)' }} />

      <div
        style={{
          background: 'var(--surface)',
          padding: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        <ParamControl label="Reel type" value={reelType} options={REEL_TYPES} onChange={onReelTypeChange} />
        <ParamControl label="Goal" value={goal} options={GOALS} onChange={onGoalChange} />
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginLeft: 'auto', borderRadius: 8 }}
          onClick={onSend}
          disabled={isGenerating || value.trim() === ''}
        >
          {isGenerating ? 'Generating…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
