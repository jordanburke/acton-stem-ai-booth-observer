import { Component, createSignal } from "solid-js"
import "./PrivacyBanner.css"

export const PrivacyBanner: Component = () => {
  const [isExpanded, setIsExpanded] = createSignal(false)

  return (
    <div class="privacy-banner">
      <div class="privacy-header" onClick={() => setIsExpanded(!isExpanded())}>
        <div class="privacy-title">
          <span class="icon">🔒</span>
          <span>Privacy Notice</span>
        </div>
        <button class="expand-button">{isExpanded() ? "−" : "+"}</button>
      </div>

      {isExpanded() && (
        <div class="privacy-content">
          <div class="privacy-section">
            <h3>What We Capture</h3>
            <ul>
              <li>
                <strong>Video:</strong> Camera captures still frames every 30-120 seconds for scene analysis
              </li>
              <li>
                <strong>Audio:</strong> Microphone transcribes conversations in real-time for topic detection
              </li>
            </ul>
          </div>

          <div class="privacy-section">
            <h3>Privacy Guarantees</h3>
            <ul>
              <li>✅ Nothing is recorded or stored permanently</li>
              <li>✅ Video frames are deleted immediately after analysis</li>
              <li>✅ Only text transcripts are sent to Claude AI (no audio files)</li>
              <li>✅ All data processed via encrypted HTTPS</li>
              <li>✅ No personal identifiable information is saved</li>
            </ul>
          </div>

          <div class="privacy-section">
            <h3>How It Works</h3>
            <ol>
              <li>Browser captures camera frame (stays in your browser memory)</li>
              <li>Browser transcribes speech using Web Speech API (local processing)</li>
              <li>Text transcript + image sent to server for AI analysis</li>
              <li>AI provides booth insights and recommendations</li>
              <li>Frame and transcript discarded - nothing saved</li>
            </ol>
          </div>

          <div class="privacy-section highlight">
            <h3>Your Control</h3>
            <p>You can pause the observer system at any time using the control panel. When paused:</p>
            <ul>
              <li>Camera and microphone are immediately released</li>
              <li>No new data is captured or analyzed</li>
              <li>All in-memory data is cleared</li>
            </ul>
          </div>

          <div class="privacy-footer">
            <p class="transparency-note">
              This AI Booth Observer is designed for educational demonstration of agentic AI systems. All processing is
              transparent and privacy-first by design.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
