// Ranking algorithm — owned by Bee B. rankReel() signature is frozen per
// src/shared/types.js; getPerformanceInsights() is an internal helper this
// module exposes so the AI Chat tab can ground its prompt in real data.

const WEIGHTS = {
  views: 0.35,
  shareRate: 0.25,
  skipRate: 0.15,
  likeRate: 0.15,
  followsFromReel: 0.1,
}

const METRIC_KEYS = Object.keys(WEIGHTS)

function normalize(value, min, max) {
  return max === min ? 1 : (value - min) / (max - min)
}

function computeScore(reel, dataset) {
  let total = 0
  for (const key of METRIC_KEYS) {
    const values = dataset.map((r) => r[key])
    const norm = normalize(reel[key], Math.min(...values), Math.max(...values))
    total += norm * WEIGHTS[key]
  }
  return Math.round(total * 100)
}

function tierFromScore(score) {
  if (score >= 80) return 'top'
  if (score >= 60) return 'strong'
  if (score >= 40) return 'average'
  return 'weak'
}

/**
 * @param {import('../shared/types.js').Reel} newReel
 * @param {import('../shared/types.js').Reel[]} allReels
 * @returns {import('../shared/types.js').RankResult}
 */
export function rankReel(newReel, allReels) {
  const combined = allReels.some((r) => r.id === newReel.id)
    ? allReels.map((r) => (r.id === newReel.id ? newReel : r))
    : [...allReels, newReel]

  const scored = combined
    .map((reel) => ({ reel, score: computeScore(reel, combined) }))
    .sort((a, b) => b.score - a.score)

  const overallRank = scored.findIndex((s) => s.reel.id === newReel.id) + 1
  const nicheRank =
    scored
      .filter((s) => s.reel.niche === newReel.niche)
      .findIndex((s) => s.reel.id === newReel.id) + 1
  const score = scored.find((s) => s.reel.id === newReel.id).score

  return { overallRank, nicheRank, score, tier: tierFromScore(score) }
}

/**
 * Aggregate ranking insights across a reel set — used to ground the AI
 * prompt in what has actually performed well, rather than generic advice.
 * @param {import('../shared/types.js').Reel[]} reels
 */
export function getPerformanceInsights(reels) {
  if (reels.length === 0) {
    return { totalReels: 0, best: null, bestByNiche: {}, averages: null, tierCounts: {} }
  }

  const ranked = reels
    .map((reel) => ({ reel, rank: rankReel(reel, reels.filter((r) => r.id !== reel.id)) }))
    .sort((a, b) => a.rank.overallRank - b.rank.overallRank)

  const best = ranked[0]
  const bestByNiche = {}
  for (const entry of ranked) {
    const niche = entry.reel.niche
    if (!bestByNiche[niche] || entry.rank.score > bestByNiche[niche].score) {
      bestByNiche[niche] = {
        hook: entry.reel.hook,
        score: entry.rank.score,
        tier: entry.rank.tier,
      }
    }
  }

  const averages = {
    shareRate: reels.reduce((sum, r) => sum + r.shareRate, 0) / reels.length,
    skipRate: reels.reduce((sum, r) => sum + r.skipRate, 0) / reels.length,
    likeRate: reels.reduce((sum, r) => sum + r.likeRate, 0) / reels.length,
  }

  const tierCounts = ranked.reduce((counts, entry) => {
    counts[entry.rank.tier] = (counts[entry.rank.tier] || 0) + 1
    return counts
  }, {})

  return {
    totalReels: reels.length,
    best: { hook: best.reel.hook, niche: best.reel.niche, score: best.rank.score, tier: best.rank.tier },
    bestByNiche,
    averages,
    tierCounts,
  }
}
