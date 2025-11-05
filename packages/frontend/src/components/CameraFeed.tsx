import { Component, createSignal, onCleanup, onMount } from "solid-js"
import { CameraCapture } from "../lib/webrtc"
import "./CameraFeed.css"

type Props = {
  onCapture?: (base64: string) => void
  captureInterval?: number // seconds
  isActive: boolean
}

export const CameraFeed: Component<Props> = (props) => {
  let videoRef: HTMLDivElement | undefined
  const [camera] = createSignal(new CameraCapture())
  const [isActive, setIsActive] = createSignal(false)
  const [error, setError] = createSignal<string>()
  const [lastCaptureTime, setLastCaptureTime] = createSignal<Date>()

  let captureIntervalId: number | undefined

  const startCamera = async () => {
    const status = await camera().start()

    if (status.active && status.error === undefined) {
      setIsActive(true)
      setError(undefined)

      // Attach video element to DOM
      const videoElement = camera().getVideoElement()
      if (videoElement && videoRef) {
        videoRef.appendChild(videoElement)
      }

      // Start capture interval
      if (props.onCapture) {
        captureIntervalId = window.setInterval(
          () => {
            const base64 = camera().captureFrame(0.7)
            if (base64 && props.onCapture) {
              props.onCapture(base64)
              setLastCaptureTime(new Date())
            }
          },
          (props.captureInterval || 30) * 1000,
        )
      }
    } else {
      setError(status.error)
      setIsActive(false)
    }
  }

  const stopCamera = () => {
    camera().stop()
    setIsActive(false)

    if (captureIntervalId) {
      clearInterval(captureIntervalId)
    }
  }

  // Sync with parent's isActive prop
  onMount(() => {
    if (props.isActive) {
      startCamera()
    }
  })

  onCleanup(() => {
    stopCamera()
  })

  const getTimeSinceCapture = () => {
    if (!lastCaptureTime()) return null

    const seconds = Math.floor((Date.now() - lastCaptureTime()!.getTime()) / 1000)
    return `${seconds}s ago`
  }

  return (
    <div class="camera-feed">
      <div class="camera-header">
        <div class="camera-title">
          <span class="icon">📹</span>
          <span>Camera Feed</span>
        </div>
        <div class={`status-indicator ${isActive() ? "active" : "inactive"}`}>
          {isActive() ? "● Active" : "○ Inactive"}
        </div>
      </div>

      <div class="camera-preview" ref={videoRef}>
        {error() && (
          <div class="error-message">
            <span class="icon">⚠️</span>
            <p>{error()}</p>
            <button onClick={startCamera}>Retry</button>
          </div>
        )}
        {!isActive() && !error() && (
          <div class="inactive-message">
            <span class="icon">📷</span>
            <p>Camera inactive</p>
          </div>
        )}
      </div>

      {lastCaptureTime() && (
        <div class="capture-info">
          <span>Last capture: {getTimeSinceCapture()}</span>
        </div>
      )}
    </div>
  )
}
