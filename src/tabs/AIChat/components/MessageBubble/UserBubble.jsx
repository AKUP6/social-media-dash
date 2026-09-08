import { REEL_TYPES, GOALS } from '../../../../lib/promptBuilder.js'

const reelTypeLabel = (value) => REEL_TYPES.find((option) => option.value === value)?.label ?? value
const goalLabel = (value) => GOALS.find((option) => option.value === value)?.label ?? value

export default function UserBubble({ message }) {
  return (
    <div
      className="fade-in"
      style={{
        alignSelf: 'flex-end',
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        background: 'var(--primary-deep)',
        color: 'var(--surface-alt)',
        padding: 'var(--space-4)',
        borderRadius: 16,
        marginTop: 24,
        scrollMarginTop: 'var(--space-6)',
      }}
    >
      <p style={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{message.text}</p>

      {message.params && (
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: '0.04em',
            color: 'var(--surface-alt)',
            opacity: 0.75,
          }}
        >
          {reelTypeLabel(message.params.reelType)} · {goalLabel(message.params.goal)}
        </span>
      )}
    </div>
  )
}
