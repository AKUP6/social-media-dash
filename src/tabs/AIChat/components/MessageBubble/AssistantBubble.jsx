import { useEffect, useRef, useState } from 'react'
import IdeaCard from './IdeaCard.jsx'

const FADE_MS = 200
const DOT_INTERVAL_MS = 400
const MESSAGE_INTERVAL_MS = 5000

const PENDING_MESSAGES = [
  'Generating ideas',
  'Coming up with viral content',
  'Studying your top reels',
  'Sketching hooks that land',
  'Weighing what your audience skips',
]

export default function AssistantBubble({ message }) {
  // Once a turn resolves, keep rendering the "Generating ideas…" box for one
  // more tick so it can fade out before the real content fades in, instead
  // of the content swapping instantly underneath the same box.
  const [showPending, setShowPending] = useState(message.pending)
  const wasPending = useRef(message.pending)
  const [dotCount, setDotCount] = useState(1)
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    if (wasPending.current && !message.pending) {
      const timeout = window.setTimeout(() => setShowPending(false), FADE_MS)
      wasPending.current = message.pending
      return () => window.clearTimeout(timeout)
    }
    wasPending.current = message.pending
  }, [message.pending])

  useEffect(() => {
    if (!message.pending) return
    const interval = window.setInterval(() => {
      setDotCount((count) => (count % 3) + 1)
    }, DOT_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [message.pending])

  useEffect(() => {
    if (!message.pending) {
      setMessageIndex(0)
      return
    }
    const interval = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % PENDING_MESSAGES.length)
    }, MESSAGE_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [message.pending])

  if (message.pending || showPending) {
    return (
      <div
        className={message.pending ? 'fade-in' : 'fade-out'}
        style={{
          alignSelf: 'flex-start',
          width: '100%',
          background: 'var(--surface)',
          boxShadow: 'var(--glow-sm)',
          padding: 'var(--space-4)',
          borderRadius: 16,
        }}
      >
        <p className="caption">
          {PENDING_MESSAGES[messageIndex]}
          {'.'.repeat(dotCount)}
        </p>
      </div>
    )
  }

  return (
    <div
      className="fade-in"
      style={{
        alignSelf: 'flex-start',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        background: 'var(--surface)',
        boxShadow: 'var(--glow-sm)',
        padding: 'var(--space-4)',
        borderRadius: 16,
      }}
    >
      <p style={{ fontSize: 14, lineHeight: 1.5 }}>{message.text}</p>

      {message.ideas && message.ideas.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {message.ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}

      {message.prompt && (
        <details>
          <summary className="label" style={{ cursor: 'pointer' }}>
            Prompt used
          </summary>
          <p
            className="caption mono"
            style={{ marginTop: 'var(--space-2)', whiteSpace: 'pre-wrap' }}
          >
            {message.prompt}
          </p>
        </details>
      )}
    </div>
  )
}
