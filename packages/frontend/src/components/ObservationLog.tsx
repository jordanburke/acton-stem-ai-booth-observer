import { Component, For } from "solid-js"
import type { ObservationResponse } from "@ai-booth-observer/shared"
import "./ObservationLog.css"

type Props = {
  observations: ObservationResponse[]
  isAnalyzing?: boolean
}

export const ObservationLog: Component<Props> = (props) => {
  const getEngagementColor = (level: string) => {
    switch (level) {
      case "high":
        return "var(--accent-green)"
      case "medium":
        return "var(--accent-orange)"
      case "low":
        return "var(--accent-red)"
      default:
        return "var(--text-secondary)"
    }
  }

  const getEngagementBarWidth = (level: string) => {
    switch (level) {
      case "high":
        return "90%"
      case "medium":
        return "60%"
      case "low":
        return "30%"
      default:
        return "0%"
    }
  }

  const latestObservation = () => {
    const obs = props.observations
    return obs.length > 0 ? obs[obs.length - 1] : null
  }

  return (
    <div class="observation-log">
      <div class="observation-header">
        <div class="observation-title">
          <span class="icon">🤖</span>
          <span>AI Booth Observer</span>
        </div>
        {props.isAnalyzing && (
          <div class="analyzing-indicator">
            <span class="spinner"></span>
            <span>Analyzing...</span>
          </div>
        )}
      </div>

      <div class="observation-content">
        {!latestObservation() && !props.isAnalyzing && (
          <div class="empty-state">
            <span class="icon">👁️</span>
            <p>Waiting for first observation...</p>
            <p class="help-text">Start camera and microphone to begin analysis</p>
          </div>
        )}

        {latestObservation() && (
          <div class="latest-observation">
            <div class="observation-timestamp">
              Last updated: {new Date(latestObservation()!.timestamp).toLocaleTimeString()}
            </div>

            <div class="observation-section">
              <div class="section-title">
                <span class="icon">👁️</span>
                <span>Scene</span>
              </div>
              <p class="section-content">{latestObservation()!.scene}</p>
            </div>

            <div class="observation-section">
              <div class="section-title">
                <span class="icon">🎤</span>
                <span>Conversation</span>
              </div>
              <p class="section-content">{latestObservation()!.audio}</p>
            </div>

            <div class="observation-section">
              <div class="section-title">
                <span class="icon">📊</span>
                <span>Engagement</span>
              </div>
              <div class="engagement-display">
                <div class="engagement-bar-container">
                  <div
                    class="engagement-bar"
                    style={{
                      width: getEngagementBarWidth(latestObservation()!.engagement.level),
                      "background-color": getEngagementColor(latestObservation()!.engagement.level),
                    }}
                  />
                </div>
                <div class="engagement-level">{latestObservation()!.engagement.level.toUpperCase()}</div>
              </div>
              <p class="section-content reason">{latestObservation()!.engagement.reason}</p>
            </div>

            <div class="observation-section highlight">
              <div class="section-title">
                <span class="icon">💡</span>
                <span>Recommendation</span>
              </div>
              <p class="section-content recommendation">{latestObservation()!.recommendation}</p>
            </div>

            <div class="metrics-grid">
              <div class="metric">
                <span class="metric-icon">👥</span>
                <span class="metric-value">{latestObservation()!.metrics.peopleCount}</span>
                <span class="metric-label">People</span>
              </div>
              <div class="metric">
                <span class="metric-icon">❓</span>
                <span class="metric-value">{latestObservation()!.metrics.questionsDetected}</span>
                <span class="metric-label">Questions</span>
              </div>
              <div class="metric">
                <span class="metric-icon">⚡</span>
                <span class="metric-value">{latestObservation()!.metrics.energy}</span>
                <span class="metric-label">Energy</span>
              </div>
            </div>

            <div class="cost-info">
              <span>Tokens: {latestObservation()!.tokensUsed}</span>
              <span>•</span>
              <span>Cost: ${latestObservation()!.costEstimate.toFixed(4)}</span>
            </div>
          </div>
        )}
      </div>

      {props.observations.length > 1 && (
        <details class="history-section">
          <summary>History ({props.observations.length - 1} previous)</summary>
          <div class="history-list">
            <For each={props.observations.slice(0, -1).reverse()}>
              {(obs) => (
                <div class="history-item">
                  <div class="history-timestamp">{new Date(obs.timestamp).toLocaleTimeString()}</div>
                  <div class="history-summary">
                    <strong>Engagement:</strong> {obs.engagement.level} • <strong>People:</strong>{" "}
                    {obs.metrics.peopleCount}
                  </div>
                  <div class="history-recommendation">{obs.recommendation}</div>
                </div>
              )}
            </For>
          </div>
        </details>
      )}
    </div>
  )
}
