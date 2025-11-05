import { Text, List, Title, Stack } from "@mantine/core"
import "./PrivacyBanner.css"

type Props = {
  hideHeader?: boolean
}

export const PrivacyBanner: React.FC<Props> = ({ hideHeader = false }) => {
  return (
    <Stack gap="md">
      {!hideHeader && (
        <div className="privacy-header">
          <div className="privacy-title">
            <span className="icon">🔒</span>
            <span>Privacy Notice</span>
          </div>
        </div>
      )}

      <div className="privacy-section">
        <Title order={3}>What We Capture</Title>
        <List>
          <List.Item>
            <Text component="span" fw={700}>
              Video:
            </Text>{" "}
            Camera captures still frames every 30-120 seconds for scene analysis
          </List.Item>
          <List.Item>
            <Text component="span" fw={700}>
              Audio:
            </Text>{" "}
            Microphone transcribes conversations in real-time for topic detection
          </List.Item>
        </List>
      </div>

      <div className="privacy-section">
        <Title order={3}>Privacy Guarantees</Title>
        <List>
          <List.Item>✅ Nothing is recorded or stored permanently</List.Item>
          <List.Item>✅ Video frames are deleted immediately after analysis</List.Item>
          <List.Item>✅ Only text transcripts are sent to Claude AI (no audio files)</List.Item>
          <List.Item>✅ All data processed via encrypted HTTPS</List.Item>
          <List.Item>✅ No personal identifiable information is saved</List.Item>
        </List>
      </div>

      <div className="privacy-section">
        <Title order={3}>How It Works</Title>
        <List type="ordered">
          <List.Item>Browser captures camera frame (stays in your browser memory)</List.Item>
          <List.Item>Browser transcribes speech using Web Speech API (local processing)</List.Item>
          <List.Item>Text transcript + image sent to server for AI analysis</List.Item>
          <List.Item>AI provides booth insights and recommendations</List.Item>
          <List.Item>Frame and transcript discarded - nothing saved</List.Item>
        </List>
      </div>

      <div className="privacy-section highlight">
        <Title order={3}>Your Control</Title>
        <Text>You can pause the observer system at any time using the control panel. When paused:</Text>
        <List>
          <List.Item>Camera and microphone are immediately released</List.Item>
          <List.Item>No new data is captured or analyzed</List.Item>
          <List.Item>All in-memory data is cleared</List.Item>
        </List>
      </div>

      <div className="privacy-footer">
        <Text className="transparency-note">
          This AI Booth Observer is designed for educational demonstration of agentic AI systems. All processing is
          transparent and privacy-first by design.
        </Text>
      </div>
    </Stack>
  )
}
