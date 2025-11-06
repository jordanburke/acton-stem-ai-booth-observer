import React from "react"
import { Paper, Text } from "@mantine/core"
import { Users, HelpCircle, Zap, BarChart3 } from "lucide-react"
import type { ObservationResponse } from "@ai-booth-observer/shared"
import "./MetricsPanel.css"

type Props = {
  metrics?: ObservationResponse["metrics"]
}

export const MetricsPanel: React.FC<Props> = ({ metrics }) => {
  return (
    <Paper className="metrics-panel" shadow="sm" h="100%" p={0}>
      <div className="metrics-panel-header">
        <div className="metrics-panel-title">
          <BarChart3 size={16} style={{ marginRight: "0.5rem" }} />
          <span>Metrics</span>
        </div>
      </div>

      <div className="metrics-panel-content">
        {!metrics && (
          <div className="metrics-empty">
            <Text size="sm" c="dimmed">
              Waiting for data...
            </Text>
          </div>
        )}

        {metrics && (
          <div className="metrics-cards">
            <Paper className="metric-card" p="sm">
              <Users size={20} className="metric-icon" />
              <Text className="metric-value" size="lg" fw={700}>
                {metrics.peopleCount}
              </Text>
              <Text className="metric-label" size="xs">
                People
              </Text>
            </Paper>
            <Paper className="metric-card" p="sm">
              <HelpCircle size={20} className="metric-icon" />
              <Text className="metric-value" size="lg" fw={700}>
                {metrics.questionsDetected}
              </Text>
              <Text className="metric-label" size="xs">
                Questions
              </Text>
            </Paper>
            <Paper className="metric-card" p="sm">
              <Zap size={20} className="metric-icon" />
              <Text className="metric-value" size="lg" fw={700}>
                {metrics.energy}
              </Text>
              <Text className="metric-label" size="xs">
                Energy
              </Text>
            </Paper>
          </div>
        )}
      </div>
    </Paper>
  )
}
