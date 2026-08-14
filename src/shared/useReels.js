import { useMemo, useState } from 'react'
import { mockReels } from './mockData.js'

function computeMetrics(reels) {
  const topReels = [...reels].sort((a, b) => b.views - a.views).slice(0, 3)
  return {
    monthViews: reels.reduce((sum, reel) => sum + reel.views, 0),
    followerIncrease: reels.reduce((sum, reel) => sum + reel.followsFromReel, 0),
    topReels,
  }
}

/**
 * Shared reel state. Home reads `reels` and `metrics`.
 * Reel Input calls `addReel(reel)` on submit.
 */
export function useReels() {
  const [reels, setReels] = useState(mockReels)

  const metrics = useMemo(() => computeMetrics(reels), [reels])

  function addReel(reel) {
    setReels((prev) => [...prev, reel])
  }

  return { reels, metrics, addReel }
}
