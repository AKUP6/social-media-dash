// Turns a built prompt (see src/lib/promptBuilder.js) into concrete idea
// cards. Templated rather than calling a live model — this is the local
// generation step the AI Chat tab renders from.

const HOOK_OPENERS = {
  educational: [
    "Nobody's teaching you this about",
    'The one thing top performers know about',
    '3 mistakes everyone makes with',
    "Here's the drill breakdown for",
    'The fastest way to get better at',
  ],
  broad: [
    'POV: this is what winning looks like in',
    'The moment that changes everything in',
    'Everyone needs to see this about',
    'What nobody tells you before starting',
    'This is why people fall in love with',
  ],
  niche: [
    'If you know, you know:',
    'Only the front ensemble crowd gets this about',
    'The debate that never ends about',
    "Why your section isn't locking in on",
    'The setup check most people skip for',
  ],
}

const CTAS_BY_GOAL = {
  views: [
    'Send this to someone who needs to see it.',
    'Duet this with your own take.',
    'Save this before it disappears from your feed.',
    'Tag the person who needs this drill.',
  ],
  followers: [
    'Follow for the full breakdown next week.',
    'Follow if you want more drills like this.',
    'Turn on notifications — part two drops soon.',
    'Follow to catch the next one in this series.',
  ],
}

const DEFAULT_SUBJECTS = ['front ensemble', 'broad', 'battery']

function pick(list, i) {
  return list[i % list.length]
}

function buildConcept(reelType, goal, subject) {
  const angle = reelType === 'educational' ? 'a fast, teachable breakdown' : reelType === 'niche' ? 'an insider-only angle' : 'a broad, relatable moment'
  const outcome = goal === 'followers' ? 'that makes new viewers want more' : 'that is built to get shared'
  return `${angle} on ${subject}, ${outcome}.`
}

function buildBeat(reelType, subject) {
  if (reelType === 'educational') return `show the specific fix or drill for ${subject} in under 10 seconds`
  if (reelType === 'niche') return `lean into the in-group detail about ${subject} that only regulars notice`
  return `escalate the stakes or emotion around ${subject} to pull in viewers outside the niche`
}

function payoffBeat(goal) {
  return goal === 'followers' ? 'land on a result that makes the account itself the reason to keep watching' : 'land on a punchline or reveal worth sharing immediately'
}

/**
 * @param {{ reelType: string, goal: string, rankContext: object, message?: string }} params
 * @returns {{ id: string, hook: string, concept: string, structure: string[], cta: string, angleTag: string }[]}
 */
export function generateIdeas({ reelType, goal, rankContext, message }) {
  const contextSubjects =
    rankContext && rankContext.totalReels > 0 ? Object.keys(rankContext.bestByNiche) : DEFAULT_SUBJECTS
  const typedSubject = message && message.trim() !== '' ? message.trim() : null
  const subjects = typedSubject ? [typedSubject, ...contextSubjects] : contextSubjects
  const openers = HOOK_OPENERS[reelType] ?? HOOK_OPENERS.broad
  const ctas = CTAS_BY_GOAL[goal] ?? CTAS_BY_GOAL.views
  const ideaCount = Math.min(5, Math.max(3, subjects.length + 1))

  const ideas = []
  for (let i = 0; i < ideaCount; i++) {
    const subject = pick(subjects, i)
    const opener = pick(openers, i)
    const hook = `${opener} ${subject}`

    ideas.push({
      id: `idea-${i + 1}`,
      hook,
      concept: buildConcept(reelType, goal, subject),
      structure: [
        `Hook — open with: "${hook}"`,
        `Build — ${buildBeat(reelType, subject)}`,
        `Payoff — ${payoffBeat(goal)}`,
      ],
      cta: pick(ctas, i),
      angleTag: subject,
    })
  }
  return ideas
}
