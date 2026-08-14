// STUB — Claude 2 replaces this file entirely. See src/tabs/AIChat/AICHAT.md.
// It exists only so the shell compiles and the tab renders before the rebuild.

export default function MessageThread({ messages }) {
  if (messages.length === 0) {
    return (
      <p className="caption" style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
        No ideas yet — set a reel type and goal below, then send.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {messages.map((message) => (
        <div key={message.id} className="card">
          <span className="label">{message.role}</span>
          <p style={{ marginTop: 'var(--space-2)', fontSize: 14 }}>
            {message.pending ? 'Generating ideas…' : message.text}
          </p>
        </div>
      ))}
    </div>
  )
}
