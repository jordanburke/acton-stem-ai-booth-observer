import { useState, useEffect, useRef } from "react"
import { AppShell, Title, Text, Button, Modal, Flex, Stack, Box } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Bot, Lock, AlertTriangle, History } from "lucide-react"
import type { ObservationResponse, BudgetStatus } from "@ai-booth-observer/shared"
import { ObserverAPIClient } from "./lib/api-client"
import { CameraFeed } from "./components/CameraFeed"
import { TranscriptPanel } from "./components/TranscriptPanel"
import { ObservationLog } from "./components/ObservationLog"
import { ControlPanel } from "./components/ControlPanel"
import { PrivacyBanner } from "./components/PrivacyBanner"
import { MetricsPanel } from "./components/MetricsPanel"
import { HistoryModal } from "./components/HistoryModal"
import "./App.css"

const App: React.FC = () => {
  // Modal states
  const [privacyOpened, { open: openPrivacy, close: closePrivacy }] = useDisclosure(false)
  const [historyOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false)

  // System state
  const [isActive, setIsActive] = useState(false)
  const [captureInterval, setCaptureInterval] = useState(10) // seconds

  // Data state
  const [observations, setObservations] = useState<ObservationResponse[]>([])
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus>()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string>()

  // Latest captures
  const [latestImage, setLatestImage] = useState<string>()
  const latestTranscriptRef = useRef<string | undefined>(undefined)

  // Race condition prevention - track latest observation timestamp
  const latestResponseTimestampRef = useRef<string>()

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
    latestTranscriptRef.current = text
  }

  // Trigger observation when we have both image and transcript
  const triggerObservation = async (image?: string) => {
    const imageToUse = image || latestImage
    const transcript = latestTranscriptRef.current || "(No recent speech detected in last 60 seconds)"

    if (!imageToUse || isAnalyzing) {
      return
    }

    setIsAnalyzing(true)
    setError(undefined)

    try {
      console.log("Latest transcript ref:", latestTranscriptRef.current)
      console.log("Sending observation request with transcript:", transcript)
      const response = await apiClientRef.current.observe(imageToUse, transcript)
      console.log("Observation received:", response)

      // Race condition prevention: only update if this response is newer than what we have
      const responseTime = new Date(response.timestamp).getTime()
      const latestTime = latestResponseTimestampRef.current
        ? new Date(latestResponseTimestampRef.current).getTime()
        : 0

      if (responseTime > latestTime) {
        // Add to observations list
        setObservations((prev) => [...prev, response])
        latestResponseTimestampRef.current = response.timestamp

        // Update budget status
        await updateBudgetStatus()
      } else {
        console.warn(
          `⚠️ Discarded out-of-order observation response:`,
          `Response timestamp: ${response.timestamp},`,
          `Latest timestamp: ${latestResponseTimestampRef.current}`,
        )
      }
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
      latestTranscriptRef.current = undefined
    }
  }

  return (
    <>
      <AppShell header={{ height: 60 }} padding={0}>
        <AppShell.Header className="app-header" bg="var(--bg-tertiary)">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              padding: "0 1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Title order={1} className="app-title">
                <Bot size={28} style={{ marginRight: "0.5rem" }} />
                AI Booth Observer
              </Title>
              <Text className="app-subtitle">Live Multi-Modal Agentic AI System</Text>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button variant="subtle" leftSection={<History size={16} />} onClick={openHistory}>
                History ({observations.length})
              </Button>
              <Button variant="subtle" leftSection={<Lock size={16} />} onClick={openPrivacy}>
                Privacy
              </Button>
            </div>
          </div>
        </AppShell.Header>

        <AppShell.Main>
          {/* Error Display */}
          {error && (
            <div className="error-banner">
              <AlertTriangle size={20} style={{ marginRight: "0.5rem" }} />
              <span>{error}</span>
            </div>
          )}

          <Flex h="calc(100vh - 60px)" gap={0}>
            {/* Left Column: Camera + Controls (33%) */}
            <Box style={{ flex: "0 0 33.333%", minWidth: 0 }}>
              <Stack h="100%" gap={0}>
                <Box style={{ flex: 2, minHeight: 0, overflow: "hidden" }}>
                  <CameraFeed isActive={isActive} onCapture={handleCameraCapture} captureInterval={captureInterval} />
                </Box>
                <Box style={{ flex: 3, minHeight: 0, overflow: "hidden" }}>
                  <ControlPanel
                    isActive={isActive}
                    onToggle={handleToggle}
                    budgetStatus={budgetStatus}
                    captureInterval={captureInterval}
                    onIntervalChange={setCaptureInterval}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Right Column: AI Observations + (Transcript | Metrics) */}
            <Box style={{ flex: "1 1 66.667%", minWidth: 0 }}>
              <Stack h="100%" gap={0}>
                <Box style={{ flex: 3, minHeight: 0, overflow: "hidden" }}>
                  <ObservationLog observations={observations} isAnalyzing={isAnalyzing} />
                </Box>
                <Box style={{ flex: 2, minHeight: 0, overflow: "hidden" }}>
                  <Flex h="100%" gap={0}>
                    <Box style={{ flex: 2, minHeight: 0, overflow: "hidden" }}>
                      <TranscriptPanel isActive={isActive} onTranscript={handleTranscript} />
                    </Box>
                    <Box style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                      <MetricsPanel metrics={observations.length > 0 ? observations[observations.length - 1].metrics : undefined} />
                    </Box>
                  </Flex>
                </Box>
              </Stack>
            </Box>
          </Flex>
        </AppShell.Main>
      </AppShell>

      {/* Modals */}
      <Modal opened={privacyOpened} onClose={closePrivacy} title="Privacy Notice" size="lg">
        <PrivacyBanner hideHeader />
      </Modal>

      <HistoryModal opened={historyOpened} onClose={closeHistory} observations={observations} />
    </>
  )
}

export default App
