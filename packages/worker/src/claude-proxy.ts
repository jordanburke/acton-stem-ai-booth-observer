/**
 * Claude API Proxy
 * Handles multi-modal requests to Claude Haiku for booth observation
 */

import Anthropic from "@anthropic-ai/sdk"
import type { ObservationRequest, ObservationResponse } from "@ai-booth-observer/shared"

const SYSTEM_PROMPT = `You are an AI exhibition assistant observing a STEM education booth about agentic AI and software development.

Your role is to analyze the current scene and provide actionable insights to help the exhibitor engage visitors effectively.

Be concise but insightful. Your analysis should be scannable at a glance.`

export async function analyzeBoothObservation(
  request: ObservationRequest,
  anthropicApiKey: string,
): Promise<ObservationResponse> {
  const anthropic = new Anthropic({
    apiKey: anthropicApiKey,
  })

  // Construct the user prompt
  const userPrompt = `
CURRENT TIMESTAMP: ${request.timestamp}

VISUAL INPUT (image attached):
Analyze what you see in the camera feed.

AUDIO INPUT (last 60 seconds of conversation):
"${request.transcript}"

QUESTION DETECTION GUIDANCE:
Count ONLY visitor questions (ignore exhibitor questions). A question is:
- A sentence ending with ? (e.g., "What does this do?", "How does it work?")
- Contains question words: who, what, when, where, why, how, can, could, would, should, is, are, does
- Example questions: "Can you explain that?", "What's the purpose?", "How do I start?"
- Do NOT count rhetorical questions or exhibitor clarifications

Please analyze and provide a JSON response with this exact structure:

{
  "scene": "2-3 sentences describing who is present, what they're doing, body language, what they're looking at",
  "audio": "2-3 sentences about topics being discussed, questions asked, mood/tone, any technical terms mentioned",
  "engagement": {
    "level": "high" | "medium" | "low",
    "reason": "Brief justification for the engagement level"
  },
  "recommendation": "2-3 sentences of what the exhibitor should do RIGHT NOW - specific and actionable",
  "metrics": {
    "peopleCount": <number>,
    "questionsDetected": <number of visitor questions found in audio>,
    "energy": "high" | "medium" | "low"
  }
}

Be specific and actionable. This analysis updates every minute.`

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: request.imageBase64.split(",")[1], // Remove data:image/jpeg;base64, prefix
              },
            },
            {
              type: "text",
              text: userPrompt,
            },
          ],
        },
      ],
    })

    // Extract the response text
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : JSON.stringify(message.content[0])

    // Parse JSON response from Claude
    let analysis
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/({[\s\S]*})/)

      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        analysis = JSON.parse(responseText)
      }
    } catch (parseError) {
      console.error("Failed to parse Claude response as JSON:", responseText)
      // Fallback response
      analysis = {
        scene: "Unable to parse detailed scene analysis",
        audio: request.transcript || "No audio detected",
        engagement: {
          level: "medium",
          reason: "Analysis parsing error",
        },
        recommendation: "Please check system logs for details",
        metrics: {
          peopleCount: 0,
          questionsDetected: 0,
          energy: "medium",
        },
      }
    }

    // Calculate token usage and cost
    const inputTokens = message.usage.input_tokens
    const outputTokens = message.usage.output_tokens
    const totalTokens = inputTokens + outputTokens

    // Haiku pricing (approximate):
    // Input: $0.25 per million tokens
    // Output: $1.25 per million tokens
    const inputCost = (inputTokens / 1_000_000) * 0.25
    const outputCost = (outputTokens / 1_000_000) * 1.25
    const totalCost = inputCost + outputCost

    // Build response
    const response: ObservationResponse = {
      scene: analysis.scene || "No scene description provided",
      audio: analysis.audio || "No audio analysis provided",
      engagement: {
        level: analysis.engagement?.level || "medium",
        reason: analysis.engagement?.reason || "No reason provided",
      },
      recommendation: analysis.recommendation || "No recommendation provided",
      metrics: {
        peopleCount: analysis.metrics?.peopleCount || 0,
        questionsDetected: analysis.metrics?.questionsDetected || 0,
        energy: analysis.metrics?.energy || "medium",
      },
      timestamp: new Date().toISOString(),
      tokensUsed: totalTokens,
      costEstimate: totalCost,
    }

    return response
  } catch (error) {
    console.error("Claude API error:", error)
    throw error
  }
}
