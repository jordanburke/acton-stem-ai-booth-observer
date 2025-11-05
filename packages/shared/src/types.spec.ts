import { describe, it, expect } from "vitest"
import type { ObservationRequest, ObservationResponse, BudgetStatus } from "./types"

describe("Shared Types", () => {
  it("should define ObservationRequest type", () => {
    const request: ObservationRequest = {
      imageBase64: "data:image/jpeg;base64,test",
      transcript: "Hello world",
      timestamp: new Date().toISOString(),
    }

    expect(request.imageBase64).toBeDefined()
    expect(request.transcript).toBeDefined()
    expect(request.timestamp).toBeDefined()
  })

  it("should define ObservationResponse type", () => {
    const response: ObservationResponse = {
      scene: "Test scene",
      audio: "Test audio",
      engagement: {
        level: "high",
        reason: "Test reason",
      },
      recommendation: "Test recommendation",
      metrics: {
        peopleCount: 1,
        questionsDetected: 0,
        energy: "high",
      },
      timestamp: new Date().toISOString(),
      tokensUsed: 100,
      costEstimate: 0.001,
    }

    expect(response.scene).toBeDefined()
    expect(response.engagement.level).toBe("high")
  })

  it("should define BudgetStatus type", () => {
    const budget: BudgetStatus = {
      tokensUsedToday: 1000,
      maxTokensPerDay: 10000,
      estimatedCostToday: 0.05,
      remainingBudget: 2.5,
      budgetPercentUsed: 10,
    }

    expect(budget.tokensUsedToday).toBe(1000)
    expect(budget.budgetPercentUsed).toBe(10)
  })
})
