import { Component, createSignal, For, onCleanup, onMount } from "solid-js"
import { SpeechTranscription, type TranscriptSegment } from "../lib/speech"
import "./TranscriptPanel.css"

type Props = {
  onTranscript?: (text: string) => void
  isActive: boolean
}

export const TranscriptPanel: Component<Props> = (props) => {
  const [speech] = createSignal(new SpeechTranscription())
  const [isActive, setIsActive] = createSignal(false)
  const [isListening, setIsListening] = createSignal(false)
  const [error, setError] = createSignal<string>()
  const [segments, setSegments] = createSignal<TranscriptSegment[]>([])
  const [currentInterim, setCurrentInterim] = createSignal<string>()

  const startSpeech = () => {
    const status = speech().start((segment) => {
      if (segment.isFinal) {
        // Add final segment to list
        setSegments([...segments(), segment])
        setCurrentInterim(undefined)

        // Notify parent
        if (props.onTranscript) {
          const recentText = speech().getRecentTranscript(60)
          props.onTranscript(recentText)
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
    speech().stop()
    setIsActive(false)
    setIsListening(false)
  }

  // Sync with parent's isActive prop
  onMount(() => {
    if (props.isActive) {
      startSpeech()
    }
  })

  onCleanup(() => {
    stopSpeech()
  })

  // Update listening state periodically
  const checkListeningState = () => {
    const status = speech().getStatus()
    setIsListening(status.listening)
  }

  onMount(() => {
    const intervalId = setInterval(checkListeningState, 500)
    onCleanup(() => clearInterval(intervalId))
  })

  return (
    <div class="transcript-panel">
      <div class="transcript-header">
        <div class="transcript-title">
          <span class="icon">🎤</span>
          <span>Live Transcript</span>
        </div>
        <div class={`listening-indicator ${isListening() ? "listening" : "idle"}`}>
          {isListening() ? "🔴 Listening" : "⚪ Idle"}
        </div>
      </div>

      <div class="transcript-content">
        {error() && (
          <div class="error-message">
            <span class="icon">⚠️</span>
            <p>{error()}</p>
            <p class="help-text">Speech recognition requires Chrome or Edge browser</p>
            <button onClick={startSpeech}>Retry</button>
          </div>
        )}

        {!isActive() && !error() && (
          <div class="inactive-message">
            <span class="icon">🎙️</span>
            <p>Microphone inactive</p>
          </div>
        )}

        {isActive() && !error() && (
          <div class="transcript-list">
            {segments().length === 0 && !currentInterim() && (
              <div class="waiting-message">
                <p>Waiting for speech...</p>
              </div>
            )}

            <For each={segments()}>
              {(segment) => (
                <div class="transcript-segment">
                  <span class="timestamp">{segment.timestamp.toLocaleTimeString()}</span>
                  <span class="text">{segment.text}</span>
                </div>
              )}
            </For>

            {currentInterim() && (
              <div class="transcript-segment interim">
                <span class="timestamp">...</span>
                <span class="text">{currentInterim()}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
