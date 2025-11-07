/**
 * Observation request sent from frontend to worker
 */
export type ObservationRequest = {
  imageBase64: string
  transcript: string
  transcriptSinceLastObservation: string
  timestamp: string
  previousObservations?: ObservationResponse[] // Rolling context (last 3-5 observations)
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

/**
 * Meeting summary request sent from frontend to worker
 */
export type SummarizeRequest = {
  observations: ObservationResponse[]
  startTime?: string
  endTime?: string
}

/**
 * Meeting summary response from Claude via worker
 */
export type SummaryResponse = {
  duration: string
  totalObservations: number
  engagementSummary: string
  keyTopics: string[]
  recommendations: string[]
  attendeeInsights: string
  peakEngagement: {
    timestamp: string
    level: EngagementLevel
    reason: string
  }
  averageMetrics: {
    peopleCount: number
    questionsDetected: number
    energyLevel: string
  }
  timestamp: string
  tokensUsed: number
  costEstimate: number
}
