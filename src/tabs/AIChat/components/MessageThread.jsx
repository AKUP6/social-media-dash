import MessageBubble from './MessageBubble/MessageBubble.jsx'
import logo from '../../../assets/logo-placeholder.svg'

export default function MessageThread({ messages }) {
  if (messages.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-5)',
          padding: 'var(--space-8) 0',
        }}
      >
        <img
          src={logo}
          alt=""
          width={120}
          height={120}
          className="fade-in-up"
          style={{ opacity: 0, animationDelay: '0ms', animationFillMode: 'both' }}
        />
        <p
          className="caption fade-in-up"
          style={{ textAlign: 'center', opacity: 0, animationDelay: '150ms', animationFillMode: 'both' }}
        >
          No ideas yet — set a reel type and goal below, then send.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', paddingBottom: 'var(--space-5)' }}>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  )
}
