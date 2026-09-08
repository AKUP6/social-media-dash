// Builds the prompt sent to the real-model idea generation step (see
// directions.md). Mirrors the tone of src/lib/promptBuilder.js's buildPrompt,
// but is grounded in the composer's typed message and demands strict JSON
// output that parseIdeaResponse.js (Agent B) can parse.

const GOAL_COPY = {
  views: 'maximizing view count and shareability',
  followers: 'maximizing new follower conversion',
}

const TYPE_COPY = {
  educational: 'an educational, teach-a-skill style',
  broad: 'a broad-appeal style that reaches beyond the core niche audience',
  niche: 'a deep-niche style that speaks directly to the dedicated audience',
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`
}

function describeInsights(rankContext) {
  if (!rankContext || rankContext.totalReels === 0) {
    return 'No logged reels yet — rely on general short-form best practices for this niche.'
  }

  const { best, bestByNiche, averages, tierCounts } = rankContext
  const lines = [
    `- Best performing reel overall: "${best.hook}" (${best.niche}, score ${best.score}, tier ${best.tier})`,
  ]

  for (const [niche, entry] of Object.entries(bestByNiche)) {
    lines.push(`- Best in "${niche}": "${entry.hook}" (score ${entry.score}, tier ${entry.tier})`)
  }

  lines.push(
    `- Average engagement: ${formatPercent(averages.shareRate)} share rate, ${formatPercent(averages.skipRate)} skip rate, ${formatPercent(averages.likeRate)} like rate`
  )

  const tierSummary = Object.entries(tierCounts)
    .map(([tier, count]) => `${count} ${tier}`)
    .join(', ')
  lines.push(`- Tier distribution across logged reels: ${tierSummary}`)

  return lines.join('\n')
}

function describeMessage(message) {
  const trimmed = message && message.trim() !== '' ? message.trim() : null
  if (!trimmed) {
    return 'The creator did not type a specific topic — infer a strong angle from the performance context below.'
  }
  return `The creator's requested topic/angle: "${trimmed}". Build every idea around this, not a generic substitute.`
}

/**
 * @param {{ message: string, reelType: string, goal: string, rankContext: object }} params
 * @returns {string}
 */
export function buildIdeaPrompt({ message, reelType, goal, rankContext }) {
  const goalCopy = GOAL_COPY[goal] ?? goal
  const typeCopy = TYPE_COPY[reelType] ?? reelType

  return [
    'You are a short-form content strategist for an Instagram reel creator in the marching arts / front ensemble space.',
    '',
    `Generate 3 to 5 reel ideas in ${typeCopy}, optimized for ${goalCopy}.`,
    '',
    describeMessage(message),
    '',
    'Performance context from previously logged reels:',
    describeInsights(rankContext),
    '',
    'Respond with only a JSON array, no prose, no markdown code fences, containing 3 to 5 objects shaped exactly like:',
    '[',
    '  {',
    '    "hook": "string",',
    '    "concept": "string",',
    '    "structure": ["string", "string", "string"],',
    '    "cta": "string",',
    '    "angleTag": "string"',
    '  }',
    ']',
    '',
    '"structure" must contain exactly 3 beats, in order: hook, build, payoff. Keep ideas distinct from each other and from the hooks already listed above. Respond with only the JSON array, no other text.',
  ].join('\n')
}
