import UserBubble from './UserBubble.jsx'
import AssistantBubble from './AssistantBubble.jsx'

export default function MessageBubble({ message }) {
  return message.role === 'user' ? <UserBubble message={message} /> : <AssistantBubble message={message} />
}
