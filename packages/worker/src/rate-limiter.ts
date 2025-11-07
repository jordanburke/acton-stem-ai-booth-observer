/**
 * Rate Limiter & Cost Tracker
 * Uses Cloudflare KV to track token usage and enforce budget limits
 */

import type { BudgetStatus } from "@ai-booth-observer/shared"

const USAGE_KEY = "daily_token_usage"
const COST_KEY = "daily_cost"

export class RateLimiter {
  constructor(private kv: KVNamespace | undefined) {}

  /**
   * Check if request is within budget limits
   */
  async canMakeRequest(maxTokensPerDay: number): Promise<boolean> {
    if (!this.kv) {
      // If KV not available, allow request (local dev mode)
      console.warn("⚠️  KV namespace not configured - budget tracking disabled")
      return true
    }

    const usage = await this.getUsageToday()
    return usage.tokensUsedToday < maxTokensPerDay
  }

  /**
   * Record token usage after successful API call
   */
  async recordUsage(tokensUsed: number, cost: number): Promise<void> {
    if (!this.kv) {
      // Skip recording if KV not available (local dev mode)
      return
    }

    // Get current date key (resets daily)
    const dateKey = this.getDateKey()

    // Increment tokens
    const currentTokens = (await this.kv.get<number>(`${USAGE_KEY}:${dateKey}`, "json")) || 0
    await this.kv.put(`${USAGE_KEY}:${dateKey}`, JSON.stringify(currentTokens + tokensUsed), {
      expirationTtl: 60 * 60 * 48, // 48 hours
    })

    // Increment cost
    const currentCost = (await this.kv.get<number>(`${COST_KEY}:${dateKey}`, "json")) || 0
    await this.kv.put(`${COST_KEY}:${dateKey}`, JSON.stringify(currentCost + cost), {
      expirationTtl: 60 * 60 * 48, // 48 hours
    })
  }

  /**
   * Get current usage statistics
   */
  async getUsageToday(): Promise<{ tokensUsedToday: number; estimatedCostToday: number }> {
    if (!this.kv) {
      return { tokensUsedToday: 0, estimatedCostToday: 0 }
    }

    const dateKey = this.getDateKey()

    const tokensUsedToday = (await this.kv.get<number>(`${USAGE_KEY}:${dateKey}`, "json")) || 0
    const estimatedCostToday = (await this.kv.get<number>(`${COST_KEY}:${dateKey}`, "json")) || 0

    return {
      tokensUsedToday,
      estimatedCostToday,
    }
  }

  /**
   * Get budget status
   */
  async getBudgetStatus(maxTokensPerDay: number): Promise<BudgetStatus> {
    const usage = await this.getUsageToday()

    const budgetPercentUsed = (usage.tokensUsedToday / maxTokensPerDay) * 100

    // Haiku pricing: Input: $0.25/M, Output: $1.25/M (average ~$0.75/M)
    const avgCostPerToken = 0.00000075
    const maxBudget = maxTokensPerDay * avgCostPerToken
    const remainingBudgetDollars = Math.max(0, maxBudget - usage.estimatedCostToday)

    return {
      tokensUsedToday: usage.tokensUsedToday,
      maxTokensPerDay,
      estimatedCostToday: usage.estimatedCostToday,
      remainingBudget: remainingBudgetDollars,
      budgetPercentUsed,
    }
  }

  /**
   * Get date key for daily tracking (YYYY-MM-DD)
   */
  private getDateKey(): string {
    const now = new Date()
    return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`
  }
}
