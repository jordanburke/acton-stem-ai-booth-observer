/**
 * Web Speech API Wrapper
 * Handles real-time audio transcription using browser's speech recognition
 */

// Extend Window interface for webkit prefix
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onspeechstart: (() => void) | null
  onspeechend: (() => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}

export type TranscriptSegment = {
  text: string
  timestamp: Date
  isFinal: boolean
}

export type AudioStatus = {
  active: boolean
  listening: boolean
  error?: string
}

export class SpeechTranscription {
  private recognition: SpeechRecognition | null = null
  private transcriptBuffer: TranscriptSegment[] = []
  private status: AudioStatus = { active: false, listening: false }
  private onTranscriptCallback?: (segment: TranscriptSegment) => void
  private maxBufferSize = 10 // Keep last 10 segments

  /**
   * Initialize speech recognition
   */
  start(onTranscript?: (segment: TranscriptSegment) => void): AudioStatus {
    if (!SpeechTranscription.isSupported()) {
      this.status = {
        active: false,
        listening: false,
        error: "Speech recognition not supported in this browser",
      }
      return this.status
    }

    try {
      // Use webkit prefix if needed
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      this.recognition = new SpeechRecognitionAPI()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = "en-US"
      this.recognition.maxAlternatives = 1

      this.onTranscriptCallback = onTranscript

      // Handle results
      this.recognition.onresult = (event) => {
        const results = event.results
        const lastResult = results[results.length - 1]

        if (lastResult) {
          const transcript = lastResult[0].transcript
          const isFinal = lastResult.isFinal

          const segment: TranscriptSegment = {
            text: transcript,
            timestamp: new Date(),
            isFinal,
          }

          // Add to buffer (only final results)
          if (isFinal) {
            this.transcriptBuffer.push(segment)

            // Keep buffer size limited
            if (this.transcriptBuffer.length > this.maxBufferSize) {
              this.transcriptBuffer.shift()
            }
          }

          // Call callback
          if (this.onTranscriptCallback) {
            this.onTranscriptCallback(segment)
          }
        }
      }

      // Handle speech start
      this.recognition.onspeechstart = () => {
        this.status.listening = true
      }

      // Handle speech end
      this.recognition.onspeechend = () => {
        this.status.listening = false
      }

      // Handle errors
      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        this.status.error = event.error
      }

      // Auto-restart on end (continuous operation)
      this.recognition.onend = () => {
        if (this.status.active) {
          this.recognition?.start()
        }
      }

      // Start recognition
      this.recognition.start()

      this.status = { active: true, listening: false }
      return this.status
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to start speech recognition"
      this.status = { active: false, listening: false, error: errorMessage }
      return this.status
    }
  }

  /**
   * Stop speech recognition
   */
  stop(): void {
    if (this.recognition) {
      this.status.active = false
      this.recognition.stop()
      this.recognition = null
    }
  }

  /**
   * Get transcript from last N seconds
   * @param seconds - How many seconds of transcript to retrieve
   */
  getRecentTranscript(seconds: number): string {
    const cutoffTime = new Date(Date.now() - seconds * 1000)

    const recentSegments = this.transcriptBuffer.filter((segment) => segment.timestamp >= cutoffTime && segment.isFinal)

    return recentSegments.map((s) => s.text).join(" ")
  }

  /**
   * Get all transcript segments in buffer
   */
  getAllSegments(): TranscriptSegment[] {
    return [...this.transcriptBuffer]
  }

  /**
   * Clear transcript buffer
   */
  clearBuffer(): void {
    this.transcriptBuffer = []
  }

  /**
   * Get current status
   */
  getStatus(): AudioStatus {
    return { ...this.status }
  }

  /**
   * Check if browser supports speech recognition
   */
  static isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }
}
