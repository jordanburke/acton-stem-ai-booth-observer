/**
 * Observation request sent from frontend to worker
 */
export type ObservationRequest = {
  imageBase64: string
  transcript: string
  timestamp: string
}

/**
 * Engagement level assessment
 */
export type EngagementLevel = "low" | "medium" | "high"

/**
 * Metrics about the current scene
 */
export type ObservationMetrics = {
  peopleCount: number
  questionsDetected: number
  energy: "low" | "medium" | "high"
}

/**
 * Observation response from Claude via worker
 */
export type ObservationResponse = {
  scene: string
  audio: string
  engagement: {
    level: EngagementLevel
    reason: string
  }
  recommendation: string
  metrics: ObservationMetrics
  timestamp: string
  tokensUsed: number
  costEstimate: number
}

/**
 * Error response from worker
 */
export type ErrorResponse = {
  error: string
  code: string
  timestamp: string
}

/**
 * Budget status from worker
 */
export type BudgetStatus = {
  tokensUsedToday: number
  maxTokensPerDay: number
  estimatedCostToday: number
  remainingBudget: number
  budgetPercentUsed: number
}

/**
 * Camera/Microphone status
 */
export type MediaStatus = {
  cameraActive: boolean
  microphoneActive: boolean
  lastCaptureTime?: string
  error?: string
}

/**
 * System configuration
 */
export type SystemConfig = {
  captureIntervalSeconds: number
  transcriptWindowSeconds: number
  workerEndpoint: string
}
