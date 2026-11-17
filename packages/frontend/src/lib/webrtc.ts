/**
 * WebRTC Camera Capture
 * Handles camera access, frame capture, and base64 conversion
 */

export type CameraStatus = {
  active: boolean
  error?: string
  lastCaptureTime?: Date
}

export class CameraCapture {
  private stream: MediaStream | null = null
  private videoElement: HTMLVideoElement | null = null
  private canvas: HTMLCanvasElement | null = null
  private status: CameraStatus = { active: false }

  /**
   * Initialize camera access
   */
  async start(): Promise<CameraStatus> {
    try {
      // Request camera permission
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      })

      // Create video element for preview
      if (!this.videoElement) {
        this.videoElement = document.createElement("video")
        this.videoElement.autoplay = true
        this.videoElement.playsInline = true
      }

      this.videoElement.srcObject = this.stream

      // Create canvas for frame capture
      if (!this.canvas) {
        this.canvas = document.createElement("canvas")
      }

      this.status = { active: true }
      return this.status
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to access camera"
      this.status = { active: false, error: errorMessage }
      return this.status
    }
  }

  /**
   * Stop camera and release resources
   */
  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null
    }

    this.status = { active: false }
  }

  /**
   * Capture current frame as base64 image
   * @param quality - JPEG quality (0-1), lower = smaller file size
   */
  captureFrame(quality = 0.8): string | null {
    if (!this.videoElement || !this.canvas || !this.status.active) {
      return null
    }

    const video = this.videoElement
    const canvas = this.canvas

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return null
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to base64 JPEG
    const base64 = canvas.toDataURL("image/jpeg", quality)

    this.status.lastCaptureTime = new Date()

    return base64
  }

  /**
   * Get video element for preview display
   */
  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement
  }

  /**
   * Get current status
   */
  getStatus(): CameraStatus {
    return { ...this.status }
  }

  /**
   * Check if browser supports camera access
   */
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }
}
