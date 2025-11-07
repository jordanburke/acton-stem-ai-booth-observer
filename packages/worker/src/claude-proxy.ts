/**
 * Claude API Proxy
 * Handles multi-modal requests to Claude Haiku for booth observation
 */

import Anthropic from "@anthropic-ai/sdk"
import type { ObservationRequest, ObservationResponse } from "@ai-booth-observer/shared"

const SYSTEM_PROMPT = `You are an AI exhibition assistant at the DiscoverSTEM 2025 event.

EVENT CONTEXT:
- Location: DiscoverSTEM at Acton-Boxborough Regional High School
- Website: https://www.absteam.org/discoverstem
- Format: STEM career exploration trade show for grades 7-12
- Goal: Connect students with STEM professionals and real-world applications

BOOTH CONTEXT:
- Focus: Agentic AI and Large Language Models (LLMs)
- Demonstration: Live AI system using Claude to observe and analyze visitor engagement
- Target: Middle and high school students (ages 12-18)
- Learning Goals: Understanding how AI can autonomously perceive, reason, and provide insights

Your role is to analyze the current scene and provide actionable insights to help the exhibitor engage young visitors effectively with age-appropriate explanations of AI concepts.

CRITICAL METRICS REQUIREMENT:
- Accurately count visitor questions in the transcript - this is a PRIMARY metric for engagement tracking
- Count every question mark and question phrase from visitors
- Do NOT default questionsDetected to 0 when questions are present

Be concise but insightful. Your analysis should be scannable at a glance.`

export async function analyzeBoothObservation(
  request: ObservationRequest,
  anthropicApiKey: string,
): Promise<ObservationResponse> {
  const anthropic = new Anthropic({
    apiKey: anthropicApiKey,
  })

  // Build rolling context section if previous observations are available
  let rollingContextSection = ""
  if (request.previousObservations && request.previousObservations.length > 0) {
    const contextSummaries = request.previousObservations
      .map(
        (obs, idx) =>
          `Observation ${idx + 1} (${new Date(obs.timestamp).toLocaleTimeString()}):
  - Engagement: ${obs.engagement.level} - ${obs.engagement.reason}
  - People: ${obs.metrics.peopleCount}, Questions: ${obs.metrics.questionsDetected}, Energy: ${obs.metrics.energy}
  - Scene: ${obs.scene}
  - Recommendation given: ${obs.recommendation}`,
      )
      .join("\n\n")

    rollingContextSection = `
<<<CONTEXT FROM PREVIOUS OBSERVATIONS>>>
You have access to the last ${request.previousObservations.length} observations for continuity and trend analysis:

${contextSummaries}

Use this context to:
1. Identify engagement trends (improving, declining, stable)
2. Recognize if your previous recommendations were effective
3. Detect returning visitors or ongoing conversations
4. Avoid repeating ineffective suggestions
5. Notice if questions are becoming more advanced (indicates learning)`
  }

  // Construct the user prompt
  const userPrompt = `
CURRENT TIMESTAMP: ${request.timestamp}
${rollingContextSection}

VISUAL INPUT (image attached):
Analyze what you see in the camera feed.

AUDIO TRANSCRIPT (last 120 seconds of conversation):
"${request.transcript}"

<<<SINCE LAST OBSERVATION>>>
The following text is NEW since your previous analysis (focus here for conversation continuity):
"${request.transcriptSinceLastObservation}"

⚠️ CRITICAL: QUESTION DETECTION GUIDANCE ⚠️
Your PRIMARY task is to accurately count VISITOR questions in the transcript.

WHAT TO COUNT:
1. Explicit questions ending with "?" (e.g., "What does this do?", "How does it work?")
2. Implicit questions with question words: who, what, when, where, why, how, can, could, would, should, is, are, does
   - "Can you explain that?" → COUNT
   - "What's the purpose?" → COUNT
   - "How do I start?" → COUNT
   - "Is this using machine learning?" → COUNT
   - "Does it understand images?" → COUNT

WHAT NOT TO COUNT:
- Exhibitor's questions to visitors (e.g., "Would you like to see more?")
- Rhetorical questions (e.g., "Isn't that amazing?")
- Statements (e.g., "That's interesting")

IMPORTANT: Read through the ENTIRE transcript carefully and count each distinct visitor question. If you see 3 questions, return "questionsDetected": 3, not 0.

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
    "questionsDetected": <CRITICAL: exact count of visitor questions in transcript - DO NOT default to 0>,
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
