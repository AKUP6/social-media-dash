import { useState } from 'react'
import ReelForm from './ReelForm.jsx'
import RankResult from '../RankResult.jsx'

const CLOSE_ANIMATION_MS = 200

/**
 * @param {{
 *   onClose: () => void,
 *   reels: import('../../../../shared/types.js').Reel[],
 *   addReel: (reel: import('../../../../shared/types.js').Reel) => void,
 *   onLogged: (result: import('../../../../shared/types.js').RankResult) => void,
 *   result: import('../../../../shared/types.js').RankResult | null,
 * }} props
 */
export default function AddReelModal({ onClose, reels, addReel, onLogged, result }) {
  const [isClosing, setIsClosing] = useState(false)

  function handleClose() {
    setIsClosing(true)
    setTimeout(onClose, CLOSE_ANIMATION_MS)
  }

  return (
    <>
      <div
        className={isClosing ? 'fade-out-backdrop' : 'fade-in-backdrop'}
        onClick={handleClose}
        style={{ position: 'fixed', inset: 0, background: 'var(--ink)', opacity: 0.6, zIndex: 100 }}
      />
      <div
        className={`no-scrollbar ${isClosing ? 'fade-out card' : 'fade-in card'}`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          width: 520,
          maxWidth: '90vw',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--ink)' }}>Add a reel</span>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              lineHeight: 1,
              padding: 0,
            }}
          >
            &times;
          </button>
        </div>
        <ReelForm reels={reels} addReel={addReel} onLogged={onLogged} />
        <RankResult result={result} />
      </div>
    </>
  )
}
