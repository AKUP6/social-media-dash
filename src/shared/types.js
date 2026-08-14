// Data contracts — frozen. Only the Manager edits this file.
// If you need a new field, file a REQUEST(Manager) rather than editing here.

/** @typedef {Object} Reel
 *  @property {string} id
 *  @property {string} hook              // the opening line/hook text
 *  @property {number} views
 *  @property {number} shareRate         // 0..1
 *  @property {number} saveRate          // 0..1
 *  @property {number} likeRate          // 0..1
 *  @property {number} followsFromReel
 *  @property {string} niche             // e.g. "front ensemble", "broad"
 *  @property {string} datePosted        // ISO string
 */

/** @typedef {Object} Metrics
 *  @property {number} monthViews
 *  @property {number} followerIncrease
 *  @property {Reel[]} topReels          // length 3, pre-sorted desc
 */

/** Ranking contract — Bee B implements, Bee A calls.
 *  @typedef {Object} RankResult
 *  @property {number} overallRank       // 1 = best among all reels
 *  @property {number} nicheRank         // 1 = best within its niche
 *  @property {number} score             // 0..100 composite
 *  @property {string} tier              // "top" | "strong" | "average" | "weak"
 */

// Bee B exports EXACTLY this signature from src/lib/ranking.js:
// export function rankReel(newReel /* Reel */, allReels /* Reel[] */) => RankResult

// Bee B exports EXACTLY this from src/lib/promptBuilder.js:
// export function buildPrompt({ reelType, goal, rankContext }) => string

export {}
