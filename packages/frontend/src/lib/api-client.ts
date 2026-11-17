/**
 * API Client for Cloudflare Worker Communication
 * Handles observation requests and budget tracking
 */

import type { ObservationRequest, ObservationResponse, ErrorResponse, BudgetStatus } from "@ai-booth-observer/shared"

export class ObserverAPIClient {
  private workerEndpoint: string

  constructor(workerEndpoint?: string) {
    this.workerEndpoint = workerEndpoint || import.meta.env.VITE_WORKER_ENDPOINT || "http://localhost:8787"
  }

  /**
   * Send observation request to worker
   */
  async observe(imageBase64: string, transcript: string): Promise<ObservationResponse> {
    const request: ObservationRequest = {
      imageBase64,
      transcript,
      timestamp: new Date().toISOString(),
    }

    try {
      const response = await fetch(`${this.workerEndpoint}/observe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const error: ErrorResponse = await response.json()
        throw new Error(error.error || "Observation request failed")
      }

      const result: ObservationResponse = await response.json()
      return result
    } catch (error) {
      console.error("Observation API error:", error)
      throw error instanceof Error ? error : new Error("Unknown API error")
    }
  }

  /**
   * Get budget status from worker
   */
  async getBudgetStatus(): Promise<BudgetStatus> {
    try {
      const response = await fetch(`${this.workerEndpoint}/budget`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error: ErrorResponse = await response.json()
        throw new Error(error.error || "Budget status request failed")
      }

      const result: BudgetStatus = await response.json()
      return result
    } catch (error) {
      console.error("Budget API error:", error)
      throw error instanceof Error ? error : new Error("Unknown API error")
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.workerEndpoint}/health`, {
        method: "GET",
      })

      return response.ok
    } catch (error) {
      console.error("Health check failed:", error)
      return false
    }
  }

  /**
   * Update worker endpoint
   */
  setWorkerEndpoint(endpoint: string): void {
    this.workerEndpoint = endpoint
  }

  /**
   * Get current worker endpoint
   */
  getWorkerEndpoint(): string {
    return this.workerEndpoint
  }
}
