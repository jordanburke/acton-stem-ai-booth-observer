import React from "react"
import { Button, Slider, Text, Progress, Paper, Switch, Group, Stack } from "@mantine/core"
import { Settings, Pause, Play } from "lucide-react"
import type { BudgetStatus } from "@ai-booth-observer/shared"
import "./ControlPanel.css"

type Props = {
  isActive: boolean
  onToggle: (active: boolean) => void
  budgetStatus?: BudgetStatus
  captureInterval: number
  onIntervalChange: (seconds: number) => void
  autoSummaryEnabled: boolean
  onAutoSummaryToggle: (enabled: boolean) => void
}

export const ControlPanel: React.FC<Props> = ({
  isActive,
  onToggle,
  budgetStatus,
  captureInterval,
  onIntervalChange,
  autoSummaryEnabled,
  onAutoSummaryToggle,
}) => {
  const getBudgetColor = (): string => {
    if (!budgetStatus) return "var(--text-secondary)"

    const percentUsed = budgetStatus.budgetPercentUsed
    if (percentUsed >= 90) return "var(--accent-red)"
    if (percentUsed >= 70) return "var(--accent-orange)"
    return "var(--accent-green)"
  }

  return (
    <Paper className="control-panel" shadow="sm" p={0}>
      <div className="control-header">
        <div className="control-title">
          <Settings size={18} style={{ marginRight: "0.5rem" }} />
          <span>Control Panel</span>
        </div>
      </div>

      <div className="control-content">
        {/* Main Toggle */}
        <div className="control-section">
          <div className="toggle-control">
            <div className="toggle-info">
              <Text className="toggle-label" fw={600}>
                Observer System
              </Text>
              <Text className="toggle-description" size="sm" c="dimmed">
                {isActive ? "Camera and microphone active" : "System paused"}
              </Text>
            </div>
            <Button
              onClick={() => onToggle(!isActive)}
              color={isActive ? "orange" : "blue"}
              size="lg"
              leftSection={isActive ? <Pause size={16} /> : <Play size={16} />}
              styles={{
                root: {
                  fontWeight: 600,
                  fontSize: "1rem",
                },
              }}
            >
              {isActive ? "Pause" : "Start"}
            </Button>
          </div>
        </div>

        {/* Capture Interval */}
        <div className="control-section">
          <label className="control-label">
            <Text fw={600}>Capture Interval</Text>
            <Text className="control-value" fw={700}>
              {captureInterval}s
            </Text>
          </label>
          <Slider
            min={5}
            max={60}
            step={5}
            value={captureInterval}
            onChange={onIntervalChange}
            marks={[
              { value: 5, label: "5s" },
              { value: 30, label: "30s" },
              { value: 60, label: "60s" },
            ]}
            className="slider"
          />
        </div>

        {/* Auto-Summary Toggle */}
        <Group justify="space-between" align="center" mt="md" mb="xs">
          <Stack gap={2}>
            <Text fw={600}>Auto-Summary</Text>
            <Text size="sm" c="dimmed">
              Generate summary every 1 minute
            </Text>
          </Stack>
          <Switch
            checked={autoSummaryEnabled}
            onChange={(event) => onAutoSummaryToggle(event.currentTarget.checked)}
            size="md"
            color="blue"
          />
        </Group>

        {/* Budget Status */}
        {budgetStatus && (
          <Paper className="control-section budget-section" p="md">
            <div className="budget-header">
              <Text className="control-label" fw={600}>
                Budget Status
              </Text>
              <Text className="budget-percent" fw={700} style={{ color: getBudgetColor() }}>
                {budgetStatus.budgetPercentUsed.toFixed(1)}%
              </Text>
            </div>

            <Progress
              value={budgetStatus.budgetPercentUsed}
              color={
                budgetStatus.budgetPercentUsed >= 90 ? "red" : budgetStatus.budgetPercentUsed >= 70 ? "orange" : "green"
              }
              size="lg"
              className="budget-bar-container"
            />

            <div className="budget-details">
              <div className="budget-detail">
                <Text className="detail-label" size="sm">
                  Today's Cost:
                </Text>
                <Text className="detail-value" fw={600}>
                  ${budgetStatus.estimatedCostToday.toFixed(4)}
                </Text>
              </div>
              <div className="budget-detail">
                <Text className="detail-label" size="sm">
                  Tokens Used:
                </Text>
                <Text className="detail-value" fw={600}>
                  {budgetStatus.tokensUsedToday.toLocaleString()}
                </Text>
              </div>
              <div className="budget-detail">
                <Text className="detail-label" size="sm">
                  Remaining:
                </Text>
                <Text className="detail-value" fw={600}>
                  ${budgetStatus.remainingBudget.toFixed(2)}
                </Text>
              </div>
            </div>
          </Paper>
        )}
      </div>
    </Paper>
  )
}
