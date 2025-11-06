import React from "react"
import { Badge, Paper, Text } from "@mantine/core"
import { Bot, Eye, Mic, BarChart3, Lightbulb, Users, HelpCircle, Zap } from "lucide-react"
import type { ObservationResponse } from "@ai-booth-observer/shared"
import "./ObservationLog.css"

type Props = {
  observations: ObservationResponse[]
  isAnalyzing?: boolean
}

export const ObservationLog: React.FC<Props> = ({ observations, isAnalyzing = false }) => {
  const getEngagementColor = (level: string): string => {
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

  const getEngagementBarWidth = (level: string): string => {
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

  const latestObservation = observations.length > 0 ? observations[observations.length - 1] : null

  return (
    <Paper className="observation-log" shadow="sm" h="100%" p={0}>
      <div className="observation-header">
        <div className="observation-title">
          <Bot size={18} style={{ marginRight: "0.5rem" }} />
          <span>AI Booth Observer</span>
        </div>
        {isAnalyzing && (
          <div className="analyzing-indicator">
            <span className="spinner"></span>
            <span>Analyzing...</span>
          </div>
        )}
      </div>

      <div className="observation-content">
        {!latestObservation && !isAnalyzing && (
          <div className="empty-state">
            <Eye size={64} className="icon" />
            <p>Waiting for first observation...</p>
            <p className="help-text">Start camera and microphone to begin analysis</p>
          </div>
        )}

        {latestObservation && (
          <div className="observation-panels">
            {/* Panel 1: Scene & Conversation */}
            <Paper className="observation-panel" shadow="sm">
              <div className="panel-header">
                <div className="panel-title">
                  <Eye size={16} style={{ marginRight: "0.5rem" }} />
                  <span>Scene & Conversation</span>
                </div>
                <div className="panel-timestamp">
                  {new Date(latestObservation.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="panel-content">
                <div className="observation-section">
                  <div className="section-title">
                    <Eye size={16} style={{ marginRight: "0.5rem" }} />
                    <span>Scene</span>
                  </div>
                  <Text className="section-content">{latestObservation.scene}</Text>
                </div>

                <div className="observation-section">
                  <div className="section-title">
                    <Mic size={16} style={{ marginRight: "0.5rem" }} />
                    <span>Conversation</span>
                  </div>
                  <Text className="section-content">{latestObservation.audio}</Text>
                </div>
              </div>
            </Paper>

            {/* Panel 2: Engagement & Insights */}
            <Paper className="observation-panel" shadow="sm">
              <div className="panel-header">
                <div className="panel-title">
                  <BarChart3 size={16} style={{ marginRight: "0.5rem" }} />
                  <span>Engagement & Insights</span>
                </div>
                <div className="panel-timestamp">
                  {new Date(latestObservation.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="panel-content">
                <div className="observation-section">
                  <div className="section-title">
                    <BarChart3 size={16} style={{ marginRight: "0.5rem" }} />
                    <span>Engagement</span>
                  </div>
                  <div className="engagement-display">
                    <div className="engagement-bar-container">
                      <div
                        className="engagement-bar"
                        style={{
                          width: getEngagementBarWidth(latestObservation.engagement.level),
                          backgroundColor: getEngagementColor(latestObservation.engagement.level),
                        }}
                      />
                    </div>
                    <Badge className="engagement-level" variant="filled">
                      {latestObservation.engagement.level.toUpperCase()}
                    </Badge>
                  </div>
                  <Text className="section-content reason">{latestObservation.engagement.reason}</Text>
                </div>

                <div className="observation-section highlight">
                  <div className="section-title">
                    <Lightbulb size={16} style={{ marginRight: "0.5rem" }} />
                    <span>Recommendation</span>
                  </div>
                  <Text className="section-content recommendation">{latestObservation.recommendation}</Text>
                </div>

                <div className="metrics-grid">
                  <Paper className="metric" p="md">
                    <Users size={24} className="metric-icon" />
                    <Text className="metric-value" size="xl" fw={700}>
                      {latestObservation.metrics.peopleCount}
                    </Text>
                    <Text className="metric-label" size="sm">
                      People
                    </Text>
                  </Paper>
                  <Paper className="metric" p="md">
                    <HelpCircle size={24} className="metric-icon" />
                    <Text className="metric-value" size="xl" fw={700}>
                      {latestObservation.metrics.questionsDetected}
                    </Text>
                    <Text className="metric-label" size="sm">
                      Questions
                    </Text>
                  </Paper>
                  <Paper className="metric" p="md">
                    <Zap size={24} className="metric-icon" />
                    <Text className="metric-value" size="xl" fw={700}>
                      {latestObservation.metrics.energy}
                    </Text>
                    <Text className="metric-label" size="sm">
                      Energy
                    </Text>
                  </Paper>
                </div>

                <div className="cost-info">
                  <span>Tokens: {latestObservation.tokensUsed}</span>
                  <span>•</span>
                  <span>Cost: ${latestObservation.costEstimate.toFixed(4)}</span>
                </div>

                {observations.length > 1 && (
                  <details className="history-section">
                    <summary>History ({observations.length - 1} previous)</summary>
                    <div className="history-list">
                      {observations
                        .slice(0, -1)
                        .reverse()
                        .map((obs) => (
                          <div key={obs.timestamp} className="history-item">
                            <div className="history-timestamp">{new Date(obs.timestamp).toLocaleTimeString()}</div>
                            <div className="history-summary">
                              <strong>Engagement:</strong> {obs.engagement.level} • <strong>People:</strong>{" "}
                              {obs.metrics.peopleCount}
                            </div>
                            <div className="history-recommendation">{obs.recommendation}</div>
                          </div>
                        ))}
                    </div>
                  </details>
                )}
              </div>
            </Paper>
          </div>
        )}
      </div>
    </Paper>
  )
}
