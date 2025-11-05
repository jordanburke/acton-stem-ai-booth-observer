/**
 * Cloudflare Worker - AI Booth Observer API Proxy
 * Handles Claude API calls with rate limiting and cost tracking
 */

import type { ObservationRequest, ErrorResponse } from "@ai-booth-observer/shared"
import { analyzeBoothObservation } from "./claude-proxy"
import { RateLimiter } from "./rate-limiter"

export type Env = {
  ANTHROPIC_API_KEY: string
  MAX_TOKENS_PER_DAY: string
  USAGE_TRACKER?: KVNamespace
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers for all responses
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // TODO: Restrict to your frontend domain in production
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)
    const rateLimiter = new RateLimiter(env.USAGE_TRACKER)

    // Health check endpoint
    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          kvAvailable: !!env.USAGE_TRACKER,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    // Observation endpoint
    if (url.pathname === "/observe" && request.method === "POST") {
      try {
        // Check API key
        if (!env.ANTHROPIC_API_KEY) {
          throw new Error("ANTHROPIC_API_KEY not configured")
        }

        // Parse request
        const observationRequest: ObservationRequest = await request.json()

        // Validate request
        if (!observationRequest.imageBase64 || !observationRequest.timestamp) {
          throw new Error("Missing required fields: imageBase64, timestamp")
        }

        // Check rate limits
        const maxTokens = parseInt(env.MAX_TOKENS_PER_DAY)
        const canProceed = await rateLimiter.canMakeRequest(maxTokens)

        if (!canProceed) {
          const errorResponse: ErrorResponse = {
            error: "Daily budget limit reached",
            code: "BUDGET_EXCEEDED",
            timestamp: new Date().toISOString(),
          }
          return new Response(JSON.stringify(errorResponse), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }

        // Call Claude API
        const response = await analyzeBoothObservation(observationRequest, env.ANTHROPIC_API_KEY)

        // Record usage
        await rateLimiter.recordUsage(response.tokensUsed, response.costEstimate)

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      } catch (error) {
        console.error("Observation error:", error)

        const errorResponse: ErrorResponse = {
          error: error instanceof Error ? error.message : "Unknown error",
          code: "OBSERVATION_ERROR",
          timestamp: new Date().toISOString(),
        }

        return new Response(JSON.stringify(errorResponse), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
    }

    // Budget status endpoint
    if (url.pathname === "/budget" && request.method === "GET") {
      try {
        const maxTokens = parseInt(env.MAX_TOKENS_PER_DAY)
        const budgetStatus = await rateLimiter.getBudgetStatus(maxTokens)

        return new Response(JSON.stringify(budgetStatus), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      } catch (error) {
        const errorResponse: ErrorResponse = {
          error: error instanceof Error ? error.message : "Unknown error",
          code: "BUDGET_ERROR",
          timestamp: new Date().toISOString(),
        }

        return new Response(JSON.stringify(errorResponse), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
    }

    // 404 for unknown routes
    return new Response("Not Found", { status: 404, headers: corsHeaders })
  },
}
