import Anthropic from '@anthropic-ai/sdk'

// This app is a client-side Vite SPA with no backend, so there is no place to
// hold the API key except the browser bundle. dangerouslyAllowBrowser is an
// explicit opt-in to that: fine for running locally, never for a public
// deployment with a real key in it. Key comes from a gitignored .env — see
// .env.example.
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

const client = apiKey ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true }) : null

/**
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function callClaudeModel(prompt) {
  if (!client) {
    throw new Error(
      'callClaudeModel: VITE_ANTHROPIC_API_KEY is not set. Copy .env.example to .env, add your key, and restart the dev server.',
    )
  }

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('callClaudeModel: the model declined to respond to this prompt.')
  }

  if (response.stop_reason === 'max_tokens') {
    throw new Error(
      'callClaudeModel: the response was cut off before it finished (hit the max_tokens limit). Try again.',
    )
  }

  const textBlock = response.content.find((block) => block.type === 'text')
  return textBlock ? textBlock.text : ''
}
