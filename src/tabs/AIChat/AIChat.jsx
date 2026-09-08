import { useState } from 'react'
import { generateAssistantReply } from './components/AILogic/generateAssistantReply.js'
import BackButton from '../../components/BackButton.jsx'
import MessageThread from './components/MessageThread.jsx'
import Composer from './components/Composer.jsx'

/**
 * AI chat shell. Owned by Claude 1 — see src/tabs/AIChat/AICHAT.md.
 *
 * All conversation state lives here. MessageThread (Claude 2) and Composer
 * (Claude 3) are presentational: props in, callbacks out. Neither imports the
 * other. The prop shapes below are frozen while the workers build.
 */
export default function AIChat({ reels, onNavigate }) {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [reelType, setReelType] = useState('educational')
  const [goal, setGoal] = useState('views')
  const [isGenerating, setIsGenerating] = useState(false)

  function handleSend() {
    const text = draft.trim()
    if (!text || isGenerating) return

    const turnId = `t${Date.now()}`
    const pendingId = `${turnId}-a`

    setMessages((prev) => [
      ...prev,
      { id: `${turnId}-u`, role: 'user', text, params: { reelType, goal } },
      { id: pendingId, role: 'assistant', text: '', pending: true },
    ])
    setDraft('')
    setIsGenerating(true)

    generateAssistantReply({ reelType, goal, reels, message: text })
      .then(({ ideas, prompt }) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === pendingId
              ? {
                  id: pendingId,
                  role: 'assistant',
                  text: `Here ${ideas.length === 1 ? 'is' : 'are'} ${ideas.length} ideas built from your best performing reels.`,
                  ideas,
                  prompt,
                }
              : message,
          ),
        )
      })
      .catch((err) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === pendingId
              ? { id: pendingId, role: 'assistant', text: `Couldn't generate ideas: ${err.message}` }
              : message,
          ),
        )
      })
      .finally(() => setIsGenerating(false))
  }

  const hasMessages = messages.length > 0

  return (
    // Bounded to the viewport, so this tab never grows past the screen and
    // the outer page never scrolls (no rubber-band/tension scrolling at the
    // document level). <main>'s top and bottom padding are cancelled here so
    // the tab runs edge to edge instead of stopping short of the bottom.
    // Only the thread pane below scrolls — that is "the page contents".
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 760,
        margin: '0 auto',
        marginTop: 'calc(-1 * var(--space-8))',
        marginBottom: 'calc(-1 * var(--space-8))',
        height: '100dvh',
        justifyContent: hasMessages ? undefined : 'center',
      }}
    >
      <div style={{ position: 'fixed', top: 'var(--space-8)', left: 'var(--space-4)' }}>
        <BackButton label="Back to home" onClick={() => onNavigate('home')} />
      </div>

      <div
        className="no-scrollbar"
        style={{
          flex: hasMessages ? 1 : undefined,
          minHeight: 0,
          overflowY: hasMessages ? 'auto' : 'visible',
          overscrollBehavior: 'contain',
        }}
      >
        <MessageThread messages={messages} />
      </div>

      <Composer
        value={draft}
        onChange={setDraft}
        reelType={reelType}
        goal={goal}
        onReelTypeChange={setReelType}
        onGoalChange={setGoal}
        onSend={handleSend}
        isGenerating={isGenerating}
      />
    </div>
  )
}
