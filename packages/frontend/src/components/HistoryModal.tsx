import React from "react"
import { Modal, Text, Badge, Stack, Paper, ScrollArea } from "@mantine/core"
import { Clock, TrendingUp, Users } from "lucide-react"
import type { ObservationResponse } from "@ai-booth-observer/shared"
import "./HistoryModal.css"

type Props = {
  opened: boolean
  onClose: () => void
  observations: ObservationResponse[]
}

export const HistoryModal: React.FC<Props> = ({ opened, onClose, observations }) => {
  const getEngagementColor = (level: string): string => {
    switch (level) {
      case "high":
        return "green"
      case "medium":
        return "yellow"
      case "low":
        return "red"
      default:
        return "gray"
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Observation History" size="xl">
      <ScrollArea h={600}>
        <Stack gap="md">
          {observations.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No observations yet
            </Text>
          )}

          {observations
            .slice()
            .reverse()
            .map((obs, _index) => (
              <Paper key={obs.timestamp} className="history-observation" p="md" shadow="xs" withBorder>
                <div className="history-observation-header">
                  <div className="history-timestamp">
                    <Clock size={14} />
                    <Text size="sm" c="dimmed">
                      {new Date(obs.timestamp).toLocaleString()}
                    </Text>
                  </div>
                  <Badge color={getEngagementColor(obs.engagement.level)} size="sm">
                    {obs.engagement.level.toUpperCase()}
                  </Badge>
                </div>

                <div className="history-metrics">
                  <div className="history-metric-item">
                    <Users size={16} />
                    <Text size="sm">
                      <strong>{obs.metrics.peopleCount}</strong> people
                    </Text>
                  </div>
                  <div className="history-metric-item">
                    <TrendingUp size={16} />
                    <Text size="sm">
                      <strong>{obs.metrics.energy}</strong> energy
                    </Text>
                  </div>
                  <div className="history-metric-item">
                    <Text size="sm">
                      <strong>{obs.metrics.questionsDetected}</strong> questions
                    </Text>
                  </div>
                </div>

                <div className="history-content">
                  <Text size="sm" fw={500} mb="xs">
                    Scene:
                  </Text>
                  <Text size="sm" c="dimmed" mb="md">
                    {obs.scene}
                  </Text>

                  <Text size="sm" fw={500} mb="xs">
                    Conversation:
                  </Text>
                  <Text size="sm" c="dimmed" mb="md">
                    {obs.audio}
                  </Text>

                  <Text size="sm" fw={500} mb="xs">
                    Recommendation:
                  </Text>
                  <Text size="sm" c="blue">
                    {obs.recommendation}
                  </Text>
                </div>

                <div className="history-footer">
                  <Text size="xs" c="dimmed">
                    Tokens: {obs.tokensUsed} • Cost: ${obs.costEstimate.toFixed(4)}
                  </Text>
                </div>
              </Paper>
            ))}
        </Stack>
      </ScrollArea>
    </Modal>
  )
}
