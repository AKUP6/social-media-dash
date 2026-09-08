import { getPerformanceInsights } from '../../../../lib/ranking.js'
import { buildIdeaPrompt } from './backendLogic/buildIdeaPrompt.js'
import { callClaudeModel } from './backendLogic/callClaudeModel.js'
import { parseIdeaResponse } from './backendLogic/parseIdeaResponse.js'

/**
 * Runs the AI chat's generation step for one turn: builds performance
 * context, the prompt sent to Claude, and the resulting ideas.
 *
 * @param {{ reelType: string, goal: string, reels: object[], message: string }} params
 * @returns {Promise<{ ideas: object[], prompt: string }>}
 */
export async function generateAssistantReply({ reelType, goal, reels, message }) {
  const rankContext = getPerformanceInsights(reels)
  const prompt = buildIdeaPrompt({ message, reelType, goal, rankContext })
  const rawOutput = await callClaudeModel(prompt)
  const ideas = parseIdeaResponse(rawOutput)
  return { ideas, prompt }
}
