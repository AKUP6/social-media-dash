import { useState } from 'react'
import BackButton from '../../components/BackButton.jsx'
import ReelsOverview from './components/ReelsOverview.jsx'
import ReelDetailCard from './components/ReelDetailCard.jsx'
import AddReelModal from './components/ReelForm/AddReelModal.jsx'
import EditReelModal from './components/ReelForm/EditReelModal.jsx'

export default function ReelInput({ reels, addReel, updateReel, deleteReel, onNavigate }) {
  const [selectedReelId, setSelectedReelId] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingReel, setEditingReel] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  const topRankedReel = reels.length > 0 ? [...reels].sort((a, b) => b.views - a.views)[0] : null
  const displayedReel = reels.find((r) => r.id === selectedReelId) ?? topRankedReel

  function handleDeleted(id) {
    deleteReel(id)
    if (selectedReelId === id) setSelectedReelId(null)
  }

  return (
    // Bounded to the viewport so this tab never grows past the screen and the
    // outer page never scrolls — only the reels/detail row below scrolls
    // internally, with no visible scrollbar (mirrors AIChat.jsx's approach).
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        maxWidth: 1080,
        height: '100dvh',
        marginTop: 'calc(-1 * var(--space-8))',
        marginBottom: 'calc(-1 * var(--space-8))',
        paddingTop: 'var(--space-8)',
        paddingBottom: 'var(--space-8)',
      }}
    >
      <div
        className="fade-in-up"
        style={{ opacity: 0, animationDelay: '0ms', animationFillMode: 'both', flexShrink: 0 }}
      >
        <BackButton label="Back to home" onClick={() => onNavigate('home')} />
      </div>

      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 'var(--space-6)',
          alignItems: 'flex-start',
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          // overflowY forces overflow-x to clip too, which cuts off the
          // .card glow at these edges — pad the scrollport so the glow has
          // room, then pull back in by the same amount so nothing shifts.
          padding: 'var(--space-3)',
          margin: 'calc(-1 * var(--space-3))',
        }}
      >
        <div
          className="fade-in-up"
          style={{ flex: 1, opacity: 0, animationDelay: '75ms', animationFillMode: 'both' }}
        >
          <ReelsOverview
            reels={reels}
            selectedReelId={displayedReel?.id ?? null}
            onSelectReel={(reel) => setSelectedReelId(reel.id)}
            onAddClick={() => setIsAddOpen(true)}
          />
        </div>

        <div
          className="fade-in-up"
          style={{ flex: '0 1 380px', opacity: 0, animationDelay: '150ms', animationFillMode: 'both' }}
        >
          <ReelDetailCard reel={displayedReel} onEdit={setEditingReel} />
        </div>
      </div>

      {isAddOpen && (
        <AddReelModal
          onClose={() => setIsAddOpen(false)}
          reels={reels}
          addReel={addReel}
          onLogged={setLastResult}
          result={lastResult}
        />
      )}

      {editingReel && (
        <EditReelModal
          onClose={() => setEditingReel(null)}
          reel={editingReel}
          updateReel={updateReel}
          onDelete={handleDeleted}
        />
      )}
    </div>
  )
}
