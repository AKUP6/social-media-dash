// STUB — Claude 3 replaces this file entirely. See src/tabs/AIChat/AICHAT.md.
// It exists only so the shell compiles and the tab renders before the rebuild.

import { REEL_TYPES, GOALS } from '../../../lib/promptBuilder.js'

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
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <textarea
        className="field"
        rows={2}
        value={value}
        placeholder="Type a message…"
        onChange={(e) => onChange(e.target.value)}
      />
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
        <select className="field" value={reelType} onChange={(e) => onReelTypeChange(e.target.value)}>
          {REEL_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select className="field" value={goal} onChange={(e) => onGoalChange(e.target.value)}>
          {GOALS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSend}
          disabled={isGenerating || value.trim() === ''}
        >
          {isGenerating ? 'Generating…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
