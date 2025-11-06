import React, { useState, useEffect, useRef } from "react"
import { Button, Badge, Text, Paper } from "@mantine/core"
import { Mic, Circle, AlertTriangle } from "lucide-react"
import { SpeechTranscription, type TranscriptSegment } from "../lib/speech"
import "./TranscriptPanel.css"

type Props = {
  onTranscript?: (text: string) => void
  isActive: boolean
}

export const TranscriptPanel: React.FC<Props> = ({ onTranscript, isActive }) => {
  const speechRef = useRef(new SpeechTranscription())

  const [isActive_, setIsActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string>()
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [currentInterim, setCurrentInterim] = useState<string>()

  const startSpeech = () => {
    const status = speechRef.current.start((segment) => {
      if (segment.isFinal) {
        // Add final segment to list
        setSegments((prev) => [...prev, segment])
        setCurrentInterim(undefined)

        // Notify parent
        if (onTranscript) {
          const recentText = speechRef.current.getRecentTranscript(60)
          onTranscript(recentText)
        }
      } else {
        // Update interim result
        setCurrentInterim(segment.text)
      }
    })

    if (status.active && status.error === undefined) {
      setIsActive(true)
      setError(undefined)
    } else {
      setError(status.error)
      setIsActive(false)
    }
  }

  const stopSpeech = () => {
    speechRef.current.stop()
    setIsActive(false)
    setIsListening(false)
  }

  // Sync with parent's isActive prop
  useEffect(() => {
    if (isActive && !isActive_) {
      startSpeech()
    } else if (!isActive && isActive_) {
      stopSpeech()
    }
  }, [isActive, isActive_])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech()
    }
  }, [])

  // Update listening state periodically
  useEffect(() => {
    const checkListeningState = () => {
      const status = speechRef.current.getStatus()
      setIsListening(status.listening)
    }

    const intervalId = setInterval(checkListeningState, 500)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <Paper className="transcript-panel" shadow="sm" h="100%" p={0}>
      <div className="transcript-header">
        <div className="transcript-title">
          <Mic size={18} style={{ marginRight: "0.5rem" }} />
          <span>Live Transcript</span>
        </div>
        <Badge color={isListening ? "red" : "gray"} variant="filled" className="listening-indicator">
          {isListening ? (
            <>
              <Circle size={8} fill="currentColor" style={{ marginRight: "0.25rem" }} /> Listening
            </>
          ) : (
            <>
              <Circle size={8} style={{ marginRight: "0.25rem" }} /> Idle
            </>
          )}
        </Badge>
      </div>

      <div className="transcript-content">
        {error && (
          <div className="error-message">
            <AlertTriangle size={48} className="icon" />
            <p>{error}</p>
            <Text className="help-text" size="sm">
              Speech recognition requires Chrome or Edge browser
            </Text>
            <Button onClick={startSpeech}>Retry</Button>
          </div>
        )}

        {!isActive_ && !error && (
          <div className="inactive-message">
            <Mic size={48} className="icon" />
            <p>Microphone inactive</p>
          </div>
        )}

        {isActive_ && !error && (
          <div className="transcript-list">
            {segments.length === 0 && !currentInterim && (
              <div className="waiting-message">
                <p>Waiting for speech...</p>
              </div>
            )}

            {segments.map((segment, index) => (
              <div key={index} className="transcript-segment">
                <Text className="timestamp" size="xs">
                  {segment.timestamp.toLocaleTimeString()}
                </Text>
                <Text className="text">{segment.text}</Text>
              </div>
            ))}

            {currentInterim && (
              <div className="transcript-segment interim">
                <Text className="timestamp" size="xs">
                  ...
                </Text>
                <Text className="text">{currentInterim}</Text>
              </div>
            )}
          </div>
        )}
      </div>
    </Paper>
  )
}
