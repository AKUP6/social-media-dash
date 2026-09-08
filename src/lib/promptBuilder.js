// Turns ranking insights + AI Chat controls into the prompt sent for idea
// generation. buildPrompt() signature is frozen per src/shared/types.js.

export const REEL_TYPES = [
  { value: 'educational', label: 'Educational' },
  { value: 'broad', label: 'Broad' },
  { value: 'niche', label: 'Niche' },
]

export const GOALS = [
  { value: 'views', label: 'High view count' },
  { value: 'followers', label: 'High follower count' },
]

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

const GOAL_COPY = {
  views: 'maximizing view count and shareability',
  followers: 'maximizing new follower conversion',
}

const TYPE_COPY = {
  educational: 'an educational, teach-a-skill style',
  broad: 'a broad-appeal style that reaches beyond the core niche audience',
  niche: 'a deep-niche style that speaks directly to the dedicated audience',
}

/**
 * @param {{ reelType: string, goal: string, rankContext: object }} params
 * @returns {string}
 */
export function buildPrompt({ reelType, goal, rankContext }) {
  const goalCopy = GOAL_COPY[goal] ?? goal
  const typeCopy = TYPE_COPY[reelType] ?? reelType

  return [
    'You are a short-form content strategist for an Instagram reel creator in the marching arts / front ensemble space.',
    '',
    `Generate 3 to 5 reel ideas in ${typeCopy}, optimized for ${goalCopy}.`,
    '',
    'Performance context from previously logged reels:',
    describeInsights(rankContext),
    '',
    'For each idea, provide: a hook line, a one-sentence concept, a 3-beat structure (hook / build / payoff), and a call-to-action. Keep ideas distinct from each other and from the hooks already listed above.',
  ].join('\n')
}
