import { Component, createSignal, createEffect } from "solid-js"
import type { ObservationResponse, BudgetStatus } from "@ai-booth-observer/shared"
import { ObserverAPIClient } from "./lib/api-client"
import { CameraFeed } from "./components/CameraFeed"
import { TranscriptPanel } from "./components/TranscriptPanel"
import { ObservationLog } from "./components/ObservationLog"
import { ControlPanel } from "./components/ControlPanel"
import { PrivacyBanner } from "./components/PrivacyBanner"
import "./App.css"

const App: Component = () => {
  // System state
  const [isActive, setIsActive] = createSignal(false)
  const [captureInterval, setCaptureInterval] = createSignal(30) // seconds

  // Data state
  const [observations, setObservations] = createSignal<ObservationResponse[]>([])
  const [budgetStatus, setBudgetStatus] = createSignal<BudgetStatus>()
  const [isAnalyzing, setIsAnalyzing] = createSignal(false)
  const [error, setError] = createSignal<string>()

  // Latest captures
  const [latestImage, setLatestImage] = createSignal<string>()
  const [latestTranscript, setLatestTranscript] = createSignal<string>()

  // API client
  const apiClient = new ObserverAPIClient()

  // Handle camera capture
  const handleCameraCapture = (base64: string) => {
    console.log("Camera captured frame", base64.substring(0, 50) + "...")
    setLatestImage(base64)
    triggerObservation()
  }

  // Handle transcript update
  const handleTranscript = (text: string) => {
    console.log("Transcript updated:", text)
    setLatestTranscript(text)
  }

  // Trigger observation when we have both image and transcript
  const triggerObservation = async () => {
    const image = latestImage()
    const transcript = latestTranscript() || "No speech detected yet"

    if (!image || isAnalyzing()) {
      return
    }

    setIsAnalyzing(true)
    setError(undefined)

    try {
      console.log("Sending observation request...")
      const response = await apiClient.observe(image, transcript)
      console.log("Observation received:", response)

      // Add to observations list
      setObservations([...observations(), response])

      // Update budget status
      await updateBudgetStatus()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get observation"
      console.error("Observation error:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Update budget status
  const updateBudgetStatus = async () => {
    try {
      const status = await apiClient.getBudgetStatus()
      setBudgetStatus(status)
    } catch (err) {
      console.error("Failed to get budget status:", err)
    }
  }

  // Check worker health on mount
  createEffect(async () => {
    const healthy = await apiClient.healthCheck()
    if (!healthy) {
      console.warn("Worker health check failed - is the worker running?")
    } else {
      console.log("Worker health check passed")
      await updateBudgetStatus()
    }
  })

  // Handle system toggle
  const handleToggle = (active: boolean) => {
    setIsActive(active)

    if (!active) {
      // Clear state when pausing
      setLatestImage(undefined)
      setLatestTranscript(undefined)
    }
  }

  return (
    <div class="app">
      <header class="app-header">
        <h1 class="app-title">
          <span class="icon">🤖</span>
          AI Booth Observer
        </h1>
        <p class="app-subtitle">Live Multi-Modal Agentic AI System</p>
      </header>

      <div class="app-container">
        {/* Privacy Banner */}
        <div class="privacy-section">
          <PrivacyBanner />
        </div>

        {/* Control Panel */}
        <div class="controls-section">
          <ControlPanel
            isActive={isActive()}
            onToggle={handleToggle}
            budgetStatus={budgetStatus()}
            captureInterval={captureInterval()}
            onIntervalChange={setCaptureInterval}
          />
        </div>

        {/* Error Display */}
        {error() && (
          <div class="error-banner">
            <span class="icon">⚠️</span>
            <span>{error()}</span>
          </div>
        )}

        {/* Main Grid */}
        <div class="main-grid">
          {/* Left Column: Camera + Transcript */}
          <div class="left-column">
            <CameraFeed isActive={isActive()} onCapture={handleCameraCapture} captureInterval={captureInterval()} />
            <TranscriptPanel isActive={isActive()} onTranscript={handleTranscript} />
          </div>

          {/* Right Column: Observations */}
          <div class="right-column">
            <ObservationLog observations={observations()} isAnalyzing={isAnalyzing()} />
          </div>
        </div>

        {/* Footer */}
        <footer class="app-footer">
          <p>Built with Solid.js + Cloudflare Workers + Claude AI • Privacy-First Design • Educational Demonstration</p>
        </footer>
      </div>
    </div>
  )
}

export default App
