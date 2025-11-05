import { useState, useEffect, useRef } from "react"
import { Title, Text } from "@mantine/core"
import type { ObservationResponse, BudgetStatus } from "@ai-booth-observer/shared"
import { ObserverAPIClient } from "./lib/api-client"
import { CameraFeed } from "./components/CameraFeed"
import { TranscriptPanel } from "./components/TranscriptPanel"
import { ObservationLog } from "./components/ObservationLog"
import { ControlPanel } from "./components/ControlPanel"
import { PrivacyBanner } from "./components/PrivacyBanner"
import "./App.css"

const App: React.FC = () => {
  // System state
  const [isActive, setIsActive] = useState(false)
  const [captureInterval, setCaptureInterval] = useState(30) // seconds

  // Data state
  const [observations, setObservations] = useState<ObservationResponse[]>([])
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus>()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string>()

  // Latest captures
  const [latestImage, setLatestImage] = useState<string>()
  const [latestTranscript, setLatestTranscript] = useState<string>()

  // API client
  const apiClientRef = useRef(new ObserverAPIClient())

  // Handle camera capture
  const handleCameraCapture = (base64: string) => {
    console.log("Camera captured frame", base64.substring(0, 50) + "...")
    setLatestImage(base64)
    triggerObservation(base64)
  }

  // Handle transcript update
  const handleTranscript = (text: string) => {
    console.log("Transcript updated:", text)
    setLatestTranscript(text)
  }

  // Trigger observation when we have both image and transcript
  const triggerObservation = async (image?: string) => {
    const imageToUse = image || latestImage
    const transcript = latestTranscript || "No speech detected yet"

    if (!imageToUse || isAnalyzing) {
      return
    }

    setIsAnalyzing(true)
    setError(undefined)

    try {
      console.log("Sending observation request...")
      const response = await apiClientRef.current.observe(imageToUse, transcript)
      console.log("Observation received:", response)

      // Add to observations list
      setObservations((prev) => [...prev, response])

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
      const status = await apiClientRef.current.getBudgetStatus()
      setBudgetStatus(status)
    } catch (err) {
      console.error("Failed to get budget status:", err)
    }
  }

  // Check worker health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await apiClientRef.current.healthCheck()
      if (!healthy) {
        console.warn("Worker health check failed - is the worker running?")
      } else {
        console.log("Worker health check passed")
        await updateBudgetStatus()
      }
    }

    checkHealth()
  }, [])

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
    <div className="app">
      <header className="app-header">
        <Title order={1} className="app-title">
          <span className="icon">🤖</span>
          AI Booth Observer
        </Title>
        <Text className="app-subtitle">Live Multi-Modal Agentic AI System</Text>
      </header>

      <div className="app-container">
        {/* Privacy Banner */}
        <div className="privacy-section">
          <PrivacyBanner />
        </div>

        {/* Control Panel */}
        <div className="controls-section">
          <ControlPanel
            isActive={isActive}
            onToggle={handleToggle}
            budgetStatus={budgetStatus}
            captureInterval={captureInterval}
            onIntervalChange={setCaptureInterval}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <span className="icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="main-grid">
          {/* Left Column: Camera + Transcript */}
          <div className="left-column">
            <CameraFeed isActive={isActive} onCapture={handleCameraCapture} captureInterval={captureInterval} />
            <TranscriptPanel isActive={isActive} onTranscript={handleTranscript} />
          </div>

          {/* Right Column: Observations */}
          <div className="right-column">
            <ObservationLog observations={observations} isAnalyzing={isAnalyzing} />
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <Text>
            Built with React 19 + Cloudflare Workers + Claude AI • Privacy-First Design • Educational Demonstration
          </Text>
        </footer>
      </div>
    </div>
  )
}

export default App
