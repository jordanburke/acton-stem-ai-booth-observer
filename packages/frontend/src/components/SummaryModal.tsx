import React from "react"
import { Modal, Paper, Text, Badge, Stack, Group, Divider, ScrollArea } from "@mantine/core"
import { Clock, TrendingUp, Lightbulb, Users, MessageSquare, BarChart3, Target } from "lucide-react"
import type { SummaryResponse, EngagementLevel } from "@ai-booth-observer/shared"
import "./SummaryModal.css"

type Props = {
  opened: boolean
  onClose: () => void
  summary: SummaryResponse | null
  isLoading?: boolean
}

export const SummaryModal: React.FC<Props> = ({ opened, onClose, summary, isLoading = false }) => {
  const getEngagementColor = (level: EngagementLevel): string => {
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

  return (
    <Modal opened={opened} onClose={onClose} title="Meeting Summary" size="xl">
      {isLoading && (
        <div className="summary-loading">
          <div className="spinner"></div>
          <Text>Generating meeting summary...</Text>
        </div>
      )}

      {!isLoading && !summary && (
        <div className="summary-empty">
          <MessageSquare size={48} className="icon" />
          <Text>No summary available</Text>
          <Text size="sm" c="dimmed">
            Start observing to generate a summary
          </Text>
        </div>
      )}

      {!isLoading && summary && (
        <ScrollArea h={600}>
          <Stack gap="md">
            {/* Header Info */}
            <Paper className="summary-section" p="md" withBorder>
              <Group justify="space-between" mb="sm">
                <div className="summary-section-title">
                  <Clock size={18} />
                  <Text fw={600}>Session Overview</Text>
                </div>
                <Badge color="blue" variant="filled">
                  {summary.totalObservations} observations
                </Badge>
              </Group>
              <Group gap="xl">
                <div>
                  <Text size="sm" c="dimmed">
                    Duration
                  </Text>
                  <Text size="lg" fw={500}>
                    {summary.duration}
                  </Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Generated
                  </Text>
                  <Text size="sm">{new Date(summary.timestamp).toLocaleString()}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Cost
                  </Text>
                  <Text size="sm">${summary.costEstimate.toFixed(4)}</Text>
                </div>
              </Group>
            </Paper>

            {/* Engagement Summary */}
            <Paper className="summary-section" p="md" withBorder>
              <div className="summary-section-title">
                <TrendingUp size={18} />
                <Text fw={600}>Engagement Summary</Text>
              </div>
              <Text className="summary-text">{summary.engagementSummary}</Text>
            </Paper>

            {/* Peak Engagement */}
            <Paper className="summary-section" p="md" withBorder>
              <div className="summary-section-title">
                <BarChart3 size={18} />
                <Text fw={600}>Peak Engagement</Text>
              </div>
              <Group justify="space-between" align="center" mb="xs">
                <div>
                  <Text size="sm" c="dimmed">
                    When
                  </Text>
                  <Text size="sm">{new Date(summary.peakEngagement.timestamp).toLocaleString()}</Text>
                </div>
                <Badge
                  variant="filled"
                  style={{
                    backgroundColor: getEngagementColor(summary.peakEngagement.level),
                  }}
                >
                  {summary.peakEngagement.level.toUpperCase()}
                </Badge>
              </Group>
              <Text className="summary-text">{summary.peakEngagement.reason}</Text>
            </Paper>

            {/* Key Topics */}
            <Paper className="summary-section" p="md" withBorder>
              <div className="summary-section-title">
                <Target size={18} />
                <Text fw={600}>Key Topics</Text>
              </div>
              <Stack gap="xs">
                {summary.keyTopics.map((topic, idx) => (
                  <div key={idx} className="summary-list-item">
                    <div className="summary-bullet"></div>
                    <Text className="summary-text">{topic}</Text>
                  </div>
                ))}
              </Stack>
            </Paper>

            {/* Recommendations */}
            <Paper className="summary-section" p="md" withBorder>
              <div className="summary-section-title">
                <Lightbulb size={18} />
                <Text fw={600}>Recommendations</Text>
              </div>
              <Stack gap="xs">
                {summary.recommendations.map((rec, idx) => (
                  <div key={idx} className="summary-list-item">
                    <div className="summary-bullet recommendation"></div>
                    <Text className="summary-text">{rec}</Text>
                  </div>
                ))}
              </Stack>
            </Paper>

            {/* Attendee Insights */}
            <Paper className="summary-section" p="md" withBorder>
              <div className="summary-section-title">
                <Users size={18} />
                <Text fw={600}>Attendee Insights</Text>
              </div>
              <Text className="summary-text">{summary.attendeeInsights}</Text>
            </Paper>

            {/* Average Metrics */}
            <Paper className="summary-section" p="md" withBorder>
              <div className="summary-section-title">
                <BarChart3 size={18} />
                <Text fw={600}>Average Metrics</Text>
              </div>
              <Group gap="xl">
                <div>
                  <Text size="sm" c="dimmed">
                    Avg People
                  </Text>
                  <Text size="xl" fw={600}>
                    {summary.averageMetrics.peopleCount.toFixed(1)}
                  </Text>
                </div>
                <Divider orientation="vertical" />
                <div>
                  <Text size="sm" c="dimmed">
                    Total Questions
                  </Text>
                  <Text size="xl" fw={600}>
                    {summary.averageMetrics.questionsDetected}
                  </Text>
                </div>
                <Divider orientation="vertical" />
                <div>
                  <Text size="sm" c="dimmed">
                    Typical Energy
                  </Text>
                  <Badge
                    variant="filled"
                    style={{
                      backgroundColor: getEngagementColor(summary.averageMetrics.energyLevel as EngagementLevel),
                    }}
                  >
                    {summary.averageMetrics.energyLevel.toUpperCase()}
                  </Badge>
                </div>
              </Group>
            </Paper>
          </Stack>
        </ScrollArea>
      )}
    </Modal>
  )
}
