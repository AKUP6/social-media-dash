// Turns callClaudeModel.js's raw string output into the frozen Idea[] shape
// IdeaCard.jsx renders. Models sometimes wrap JSON in a ```json fence even
// when told not to, so that's stripped before parsing.

const FENCE_PATTERN = /^```(?:json)?\s*([\s\S]*?)\s*```$/

function stripCodeFence(text) {
  const match = text.trim().match(FENCE_PATTERN)
  return match ? match[1] : text
}

/**
 * @param {string} rawOutput
 * @returns {import('../../../../../shared/types.js').Idea[] | never}    // throws on unparseable input
 */
export function parseIdeaResponse(rawOutput) {
  const stripped = stripCodeFence(rawOutput)

  let parsed
  try {
    parsed = JSON.parse(stripped)
  } catch (err) {
    throw new Error(`parseIdeaResponse: expected a JSON array, could not parse model output: ${err.message}`)
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`parseIdeaResponse: expected a JSON array of ideas, got ${typeof parsed}`)
  }

  return parsed.map((item, i) => ({
    id: `idea-${i + 1}`,
    hook: item.hook,
    concept: item.concept,
    structure: item.structure,
    cta: item.cta,
    angleTag: item.angleTag,
  }))
}
