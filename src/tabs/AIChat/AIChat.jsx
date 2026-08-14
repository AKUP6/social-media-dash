import { useState } from 'react'
import { getPerformanceInsights } from '../../lib/ranking.js'
import { buildPrompt } from '../../lib/promptBuilder.js'
import { generateIdeas } from './ideaGenerator.js'
import MessageThread from './components/MessageThread.jsx'
import Composer from './components/Composer.jsx'

/**
 * AI chat shell. Owned by Claude 1 — see src/tabs/AIChat/AICHAT.md.
 *
 * All conversation state lives here. MessageThread (Claude 2) and Composer
 * (Claude 3) are presentational: props in, callbacks out. Neither imports the
 * other. The prop shapes below are frozen while the workers build.
 */
export default function AIChat({ reels }) {
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

    const rankContext = getPerformanceInsights(reels)
    const builtPrompt = buildPrompt({ reelType, goal, rankContext })

    window.setTimeout(() => {
      const ideas = generateIdeas({ reelType, goal, rankContext })
      setMessages((prev) =>
        prev.map((message) =>
          message.id === pendingId
            ? {
                id: pendingId,
                role: 'assistant',
                text: `Here ${ideas.length === 1 ? 'is' : 'are'} ${ideas.length} ideas built from your best performing reels.`,
                ideas,
                prompt: builtPrompt,
              }
            : message,
        ),
      )
      setIsGenerating(false)
    }, 350)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 720 }}>
      <MessageThread messages={messages} />

      {/* Sticky rather than fixed: the thread grows with the page, and the
          composer stays parked at the bottom of the viewport like a chat app. */}
      <div style={{ position: 'sticky', bottom: 'var(--space-6)' }}>
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
    </div>
  )
}
