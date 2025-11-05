import React, { useState, useEffect, useRef } from "react"
import { Button, Badge } from "@mantine/core"
import { CameraCapture } from "../lib/webrtc"
import "./CameraFeed.css"

type Props = {
  onCapture?: (base64: string) => void
  captureInterval?: number // seconds
  isActive: boolean
}

export const CameraFeed: React.FC<Props> = ({ onCapture, captureInterval = 30, isActive }) => {
  const videoRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef(new CameraCapture())
  const captureIntervalIdRef = useRef<number | undefined>(undefined)

  const [isActive_, setIsActive] = useState(false)
  const [error, setError] = useState<string>()
  const [lastCaptureTime, setLastCaptureTime] = useState<Date>()

  const startCamera = async () => {
    const status = await cameraRef.current.start()

    if (status.active && status.error === undefined) {
      setIsActive(true)
      setError(undefined)

      // Attach video element to DOM
      const videoElement = cameraRef.current.getVideoElement()
      if (videoElement && videoRef.current) {
        videoRef.current.appendChild(videoElement)
      }

      // Start capture interval
      if (onCapture) {
        captureIntervalIdRef.current = window.setInterval(() => {
          const base64 = cameraRef.current.captureFrame(0.7)
          if (base64 && onCapture) {
            onCapture(base64)
            setLastCaptureTime(new Date())
          }
        }, captureInterval * 1000)
      }
    } else {
      setError(status.error)
      setIsActive(false)
    }
  }

  const stopCamera = () => {
    cameraRef.current.stop()
    setIsActive(false)

    if (captureIntervalIdRef.current) {
      clearInterval(captureIntervalIdRef.current)
    }
  }

  // Sync with parent's isActive prop
  useEffect(() => {
    if (isActive && !isActive_) {
      startCamera()
    } else if (!isActive && isActive_) {
      stopCamera()
    }
  }, [isActive, isActive_])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const getTimeSinceCapture = () => {
    if (!lastCaptureTime) return null

    const seconds = Math.floor((Date.now() - lastCaptureTime.getTime()) / 1000)
    return `${seconds}s ago`
  }

  return (
    <div className="camera-feed">
      <div className="camera-header">
        <div className="camera-title">
          <span className="icon">📹</span>
          <span>Camera Feed</span>
        </div>
        <Badge color={isActive_ ? "green" : "gray"} variant="filled" className="status-indicator">
          {isActive_ ? "● Active" : "○ Inactive"}
        </Badge>
      </div>

      <div className="camera-preview" ref={videoRef}>
        {error && (
          <div className="error-message">
            <span className="icon">⚠️</span>
            <p>{error}</p>
            <Button onClick={startCamera}>Retry</Button>
          </div>
        )}
        {!isActive_ && !error && (
          <div className="inactive-message">
            <span className="icon">📷</span>
            <p>Camera inactive</p>
          </div>
        )}
      </div>

      {lastCaptureTime && (
        <div className="capture-info">
          <span>Last capture: {getTimeSinceCapture()}</span>
        </div>
      )}
    </div>
  )
}
