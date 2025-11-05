import { Component } from "solid-js"
import type { BudgetStatus } from "@ai-booth-observer/shared"
import "./ControlPanel.css"

type Props = {
  isActive: boolean
  onToggle: (active: boolean) => void
  budgetStatus?: BudgetStatus
  captureInterval: number
  onIntervalChange: (seconds: number) => void
}

export const ControlPanel: Component<Props> = (props) => {
  const getBudgetColor = () => {
    if (!props.budgetStatus) return "var(--text-secondary)"

    const percentUsed = props.budgetStatus.budgetPercentUsed
    if (percentUsed >= 90) return "var(--accent-red)"
    if (percentUsed >= 70) return "var(--accent-orange)"
    return "var(--accent-green)"
  }

  const getBudgetBarWidth = () => {
    if (!props.budgetStatus) return "0%"
    return `${Math.min(props.budgetStatus.budgetPercentUsed, 100)}%`
  }

  return (
    <div class="control-panel">
      <div class="control-header">
        <div class="control-title">
          <span class="icon">⚙️</span>
          <span>Control Panel</span>
        </div>
      </div>

      <div class="control-content">
        {/* Main Toggle */}
        <div class="control-section">
          <div class="toggle-control">
            <div class="toggle-info">
              <div class="toggle-label">Observer System</div>
              <div class="toggle-description">{props.isActive ? "Camera and microphone active" : "System paused"}</div>
            </div>
            <button
              class={`toggle-button ${props.isActive ? "active" : ""}`}
              onClick={() => props.onToggle(!props.isActive)}
            >
              {props.isActive ? "⏸ Pause" : "▶ Start"}
            </button>
          </div>
        </div>

        {/* Capture Interval */}
        <div class="control-section">
          <label class="control-label">
            <span>Capture Interval</span>
            <span class="control-value">{props.captureInterval}s</span>
          </label>
          <input
            type="range"
            min="15"
            max="120"
            step="15"
            value={props.captureInterval}
            onInput={(e) => props.onIntervalChange(parseInt(e.currentTarget.value))}
            class="slider"
          />
          <div class="slider-labels">
            <span>15s</span>
            <span>60s</span>
            <span>120s</span>
          </div>
        </div>

        {/* Budget Status */}
        {props.budgetStatus && (
          <div class="control-section budget-section">
            <div class="budget-header">
              <span class="control-label">Budget Status</span>
              <span class="budget-percent" style={{ color: getBudgetColor() }}>
                {props.budgetStatus.budgetPercentUsed.toFixed(1)}%
              </span>
            </div>

            <div class="budget-bar-container">
              <div class="budget-bar" style={{ width: getBudgetBarWidth(), "background-color": getBudgetColor() }} />
            </div>

            <div class="budget-details">
              <div class="budget-detail">
                <span class="detail-label">Today's Cost:</span>
                <span class="detail-value">${props.budgetStatus.estimatedCostToday.toFixed(4)}</span>
              </div>
              <div class="budget-detail">
                <span class="detail-label">Tokens Used:</span>
                <span class="detail-value">{props.budgetStatus.tokensUsedToday.toLocaleString()}</span>
              </div>
              <div class="budget-detail">
                <span class="detail-label">Remaining:</span>
                <span class="detail-value">${props.budgetStatus.remainingBudget.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* System Info */}
        <div class="control-section info-section">
          <div class="info-item">
            <span class="info-icon">📹</span>
            <span class="info-text">Camera: {CameraCapture.isSupported() ? "✓ Supported" : "✗ Not Supported"}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">🎤</span>
            <span class="info-text">
              Speech: {SpeechTranscription.isSupported() ? "✓ Supported" : "✗ Not Supported"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Import for browser capability checks
import { CameraCapture } from "../lib/webrtc"
import { SpeechTranscription } from "../lib/speech"
