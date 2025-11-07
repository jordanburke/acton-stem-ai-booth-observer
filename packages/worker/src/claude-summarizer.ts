/**
 * Claude API Summarizer
 * Generates meeting summaries from observation history
 */

import Anthropic from "@anthropic-ai/sdk"
import type { ObservationResponse, SummaryResponse } from "@ai-booth-observer/shared"

const SYSTEM_PROMPT = `You are an AI assistant that analyzes exhibition booth interactions and creates concise meeting summaries.

Your role is to synthesize multiple observations into objective documentation about the entire session.

Be clear, structured, and document observable patterns and behaviors without judgment. Recognize that booth activity naturally varies - quiet periods may be due to setup, breaks, or timing rather than problems.`

export async function summarizeMeeting(
  observations: ObservationResponse[],
  anthropicApiKey: string,
): Promise<SummaryResponse> {
  const anthropic = new Anthropic({
    apiKey: anthropicApiKey,
  })

  // Calculate time range
  const startTime = observations.length > 0 ? new Date(observations[0].timestamp) : new Date()
  const endTime = observations.length > 0 ? new Date(observations[observations.length - 1].timestamp) : new Date()
  const durationMs = endTime.getTime() - startTime.getTime()
  const durationMinutes = Math.floor(durationMs / 60000)

  // Prepare observation summary for Claude
  const observationSummary = observations
    .map(
      (obs, idx) =>
        `Observation #${idx + 1} (${new Date(obs.timestamp).toLocaleTimeString()}):
- Scene: ${obs.scene}
- Conversation: ${obs.audio}
- Engagement: ${obs.engagement.level} (${obs.engagement.reason})
- Recommendation: ${obs.recommendation}
- Metrics: ${obs.metrics.peopleCount} people, ${obs.metrics.questionsDetected} questions, ${obs.metrics.energy} energy`,
    )
    .join("\n\n")

  const userPrompt = `Analyze this exhibition booth session and provide a comprehensive summary.

SESSION INFO:
- Start: ${startTime.toLocaleString()}
- End: ${endTime.toLocaleString()}
- Duration: ${durationMinutes} minutes
- Total Observations: ${observations.length}

OBSERVATIONS:
${observationSummary}

Please analyze and provide a JSON response with this exact structure:

{
  "duration": "${durationMinutes} minutes",
  "totalObservations": ${observations.length},
  "engagementSummary": "2-3 sentences describing the overall engagement pattern throughout the session (trends, changes, peak moments)",
  "keyTopics": ["topic 1", "topic 2", "topic 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "attendeeInsights": "2-3 sentences about visitor behavior patterns, common questions, demographics (if observable)",
  "peakEngagement": {
    "timestamp": "ISO timestamp of highest engagement moment",
    "level": "high" | "medium" | "low",
    "reason": "Why this was the peak moment"
  },
  "averageMetrics": {
    "peopleCount": <average number of people>,
    "questionsDetected": <total questions across all observations>,
    "energyLevel": "high" | "medium" | "low" (most common)
  }
}

Focus on objective observations and patterns. Use neutral language - describe what happened without judgment. Quiet periods should be noted factually without criticism.`

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    })

    // Extract JSON from response
    const content = message.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude")
    }

    // Parse the JSON response
    let analysisData
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) || content.text.match(/```\n([\s\S]*?)\n```/)
      const jsonText = jsonMatch ? jsonMatch[1] : content.text
      analysisData = JSON.parse(jsonText)
    } catch (parseError) {
      console.error("Failed to parse Claude response:", content.text)
      throw new Error("Failed to parse summary response from Claude")
    }

    // Calculate token costs
    const inputTokens = message.usage.input_tokens
    const outputTokens = message.usage.output_tokens
    const totalTokens = inputTokens + outputTokens

    // Claude Haiku pricing: $0.25 per 1M input tokens, $1.25 per 1M output tokens
    const inputCost = (inputTokens / 1000000) * 0.25
    const outputCost = (outputTokens / 1000000) * 1.25
    const totalCost = inputCost + outputCost

    return {
      ...analysisData,
      timestamp: new Date().toISOString(),
      tokensUsed: totalTokens,
      costEstimate: totalCost,
    }
  } catch (error) {
    console.error("Claude API error:", error)
    throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
