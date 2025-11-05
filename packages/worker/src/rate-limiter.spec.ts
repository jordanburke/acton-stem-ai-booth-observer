import { describe, it, expect } from "vitest"
import { RateLimiter } from "./rate-limiter"

describe("RateLimiter", () => {
  it("should allow requests when KV is not available", async () => {
    const limiter = new RateLimiter(undefined)
    const canMake = await limiter.canMakeRequest(1000)
    expect(canMake).toBe(true)
  })

  it("should return zero usage when KV is not available", async () => {
    const limiter = new RateLimiter(undefined)
    const usage = await limiter.getUsageToday()
    expect(usage.tokensUsedToday).toBe(0)
    expect(usage.estimatedCostToday).toBe(0)
  })

  it("should calculate budget status correctly", async () => {
    const limiter = new RateLimiter(undefined)
    const budget = await limiter.getBudgetStatus(10000)

    expect(budget.maxTokensPerDay).toBe(10000)
    expect(budget.tokensUsedToday).toBe(0)
    expect(budget.budgetPercentUsed).toBe(0)
  })
})
