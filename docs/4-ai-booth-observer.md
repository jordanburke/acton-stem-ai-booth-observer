# Demo 4: AI Booth Observer - Live Multi-Modal Agent

## Overview

**What You're Building:** A live agentic AI system that observes your exhibition booth using webcam and microphone, analyzes the scene and conversations with Claude Haiku, and provides real-time insights and recommendations.

**Target Build Time:** 4-5 hours with AI assistance

**What It Normally Takes:** 1-2 weeks + requires multi-modal AI expertise, computer vision, audio processing

**Tech Stack:** HTML/JavaScript + WebRTC (camera/mic) + Claude API (Vision + Text)

**Live Demo Value:** The ultimate meta-demonstration - AI observing and coaching your AI demonstration in real-time

---

## The Wow Factor

### What Makes This Extraordinary

1. **True Agentic AI** - Not just running models, actually calling Claude to observe and reason
2. **Multi-modal Intelligence** - Combines vision + audio for richer context
3. **Self-referential** - AI helping you demonstrate AI (meta-magic!)
4. **Real-world sensing** - AI engaging with actual physical environment
5. **Practical value** - Actually useful feedback during the event

### The Perfect Pitch

**"See that display? That's AI watching us RIGHT NOW. It's:**

- Analyzing who's at the booth and their expressions
- Listening to our conversations and detecting topics
- Determining engagement levels
- Giving me real-time advice on what to do next

**This is agentic AI - sensing, analyzing, and acting autonomously."**

### Why It's Different from MediaPipe/TensorFlow Demos

**Local ML models (MediaPipe):** "Detect face landmarks"
**Agentic AI (Claude):** "There are 3 students looking curious, asking about how it works, highly engaged - recommend starting a technical deep-dive"

**The difference:** Interpretation, context, recommendations - true intelligence, not just detection.

---

## System Architecture

```
┌──────────────┐         ┌───────────────┐
│   WEBCAM     │────────▶│ Video Frame   │
│  (30 FPS)    │         │ Capture       │
└──────────────┘         │ (Every 30-60s)│
                         └───────┬───────┘
                                 │
┌──────────────┐                 │
│  MICROPHONE  │────────▶┌───────▼────────┐
│ (Continuous) │         │ Audio Capture  │
└──────────────┘         │ + Transcription│
                         └───────┬────────┘
                                 │
                         ┌───────▼────────┐
                         │ Combined Input │
                         │ • Image (base64)│
                         │ • Transcript    │
                         └───────┬────────┘
                                 │
                         ┌───────▼────────┐
                         │  Claude Haiku  │
                         │  API Call      │
                         │  (Multi-modal) │
                         └───────┬────────┘
                                 │
                         ┌───────▼────────┐
                         │  Parse & Show  │
                         │  • Vision       │
                         │  • Audio        │
                         │  • Recommendation│
                         │  • Metrics      │
                         └────────────────┘
```

---

## Build Process with Claude

### Phase 1: Webcam Capture Setup (45 minutes)

**Prompt to Claude:**

```
Create a webcam capture system for an exhibition booth:

WEBCAM SETUP:
- Request camera permissions
- Display live video feed in corner of page
- Capture still frame every 30 seconds
- Convert frame to base64 for API transmission
- Show timestamp of last capture

UI ELEMENTS:
- Small video preview (200x150px in corner)
- "Camera Status" indicator (green = active)
- "Last captured: X seconds ago" counter
- FPS indicator
- "Pause/Resume" button

ERROR HANDLING:
- Check camera permissions
- Show clear error if camera unavailable
- Graceful fallback message
- Retry button if connection fails

PRIVACY:
- Display clear notice: "Camera active - analyzing booth activity"
- "Nothing recorded - real-time analysis only" message
- Show what's being captured (the preview)

Make it clean, unobtrusive, and professional.
```

**What You'll Get:** Working webcam capture with UI

**Build Time:** 30-40 minutes

**Test:** Verify you see video feed, captures happen every 30s

---

### Phase 2: Audio Capture & Transcription (60 minutes)

**Prompt to Claude:**

```
Add audio capture and transcription to the booth observer:

AUDIO CAPTURE:
- Request microphone permissions
- Continuously capture audio in 30-second windows
- Use Web Speech API for real-time transcription
- Buffer last 3 transcription segments (90 seconds total)

TRANSCRIPTION:
- Enable continuous speech recognition
- Handle multiple languages (primarily English)
- Show live transcription in UI (scrolling text)
- Detect when speech stops/starts

UI ELEMENTS:
- Audio level indicator (visual bars showing sound)
- "Listening..." indicator when speech detected
- Live transcript display (last 30 seconds visible)
- "Microphone Status" (green = active, orange = no speech)

ERROR HANDLING:
- Check microphone permissions
- Fallback to manual text input if speech API unavailable
- Show browser compatibility warning
- Silent mode toggle (disable audio if needed)

PRIVACY:
- Clear notice: "Microphone active - analyzing conversations"
- "Nothing recorded" message
- Show live transcript (transparency about what's captured)

Make transcription accurate and low-latency.
```

**What You'll Get:** Working audio capture with live transcription

**Build Time:** 45-60 minutes

**Test:** Speak near mic, verify transcript appears

---

### Phase 3: Claude API Integration (60 minutes)

**Prompt to Claude:**

```
Integrate Claude API for multi-modal booth analysis:

API SETUP:
- Accept Claude API key input (stored in localStorage)
- Use Anthropic SDK (via CDN or direct fetch)
- Call Claude Haiku model (cost-effective)
- Support multi-modal input (image + text)

API CALL STRUCTURE:
- Endpoint: https://api.anthropic.com/v1/messages
- Model: claude-3-haiku-20240307
- Max tokens: 500 (enough for analysis)
- Temperature: 0.7 (balanced creativity)

INPUT ASSEMBLY:
- Current video frame (base64 image)
- Last 60 seconds of transcript
- System prompt defining the agent's role

OUTPUT PARSING:
- Extract structured response:
  - Scene description
  - Audio analysis
  - Engagement assessment
  - Recommendation

ERROR HANDLING:
- API rate limiting (wait and retry)
- Invalid API key detection
- Network errors (show cached analysis)
- Cost tracking (token usage display)

RATE LIMITING:
- Maximum 1 call per 30 seconds
- Queue requests if triggered too fast
- Show "Analysis in progress..." while waiting

Make API calls efficient and handle errors gracefully.
```

**What You'll Get:** Working Claude API integration

**Build Time:** 45-60 minutes

**Test:** Make test API call, verify response parses correctly

---

### Phase 4: The Combined Prompt Engineering (30 minutes)

**The Core Prompt Template:**

```javascript
const systemPrompt = `You are an AI exhibition assistant observing a STEM education booth about agentic AI and software development.

Your role is to analyze the current scene and provide actionable insights to help the exhibitor engage visitors effectively.

Be concise but insightful. Update format should be scannable at a glance.`

const userPrompt = `
CURRENT TIMESTAMP: ${new Date().toLocaleTimeString()}

VISUAL INPUT (what you see in the image):
[Image will be attached]

AUDIO INPUT (last 60 seconds of conversation):
"${transcriptText}"

Please analyze and provide:

1. SCENE DESCRIPTION (2-3 sentences):
   - How many people are present?
   - What are they doing? (standing, sitting, pointing, etc.)
   - What do their expressions/body language suggest?
   - What are they looking at?

2. CONVERSATION ANALYSIS (2-3 sentences):
   - What topics are being discussed?
   - What questions are being asked?
   - What's the mood/tone? (curious, confused, excited, skeptical)
   - Any specific technical terms mentioned?

3. ENGAGEMENT LEVEL (1 sentence + score):
   - Rate engagement: Low / Medium / High
   - Justify rating briefly

4. RECOMMENDATION (2-3 sentences):
   What should the exhibitor do RIGHT NOW?
   - Start a live demo?
   - Explain a technical concept?
   - Let visitors explore independently?
   - Attract new visitors?
   - Answer a specific question?

Be specific and actionable. This analysis updates every minute.
`
```

**Prompt to give Claude to implement this:**

```
Create the prompt engineering system for the AI Booth Observer:

PROMPT STRUCTURE:
- System prompt defining agent role
- User prompt combining visual + audio context
- Clear output format specification
- Timestamp for context

OUTPUT FORMAT:
Request structured JSON response:
{
  "scene": "Description...",
  "audio": "Analysis...",
  "engagement": {
    "level": "High/Medium/Low",
    "reason": "Because..."
  },
  "recommendation": "You should...",
  "metrics": {
    "people_count": 3,
    "questions_detected": 2,
    "energy": "High"
  }
}

PROMPT OPTIMIZATION:
- Keep prompts concise (fewer tokens = lower cost)
- Request specific output format
- Include timestamp for temporal context
- Ask for actionable recommendations

EXAMPLES:
Include 2-3 example outputs in comments so I understand the format.

Make prompts clear and optimize for consistent, structured responses.
```

**What You'll Get:** Optimized prompt system

**Build Time:** 20-30 minutes

**Test:** Run with sample inputs, verify output format

---

### Phase 5: Real-Time Display UI (60 minutes)

**Prompt to Claude:**

```
Create the real-time analysis display panel for AI Booth Observer:

LAYOUT:
Main panel (600x800px) showing latest analysis:

┌──────────────────────────────────────┐
│  🤖 AI BOOTH OBSERVER                │
│  Last updated: 12:34:56 PM           │
├──────────────────────────────────────┤
│  👁️ SCENE                            │
│  "3 students gathered, pointing at   │
│  screen, curious expressions..."     │
├──────────────────────────────────────┤
│  🎤 CONVERSATION                      │
│  "Topics: How does this work, Can    │
│  we try it | Mood: Highly engaged"   │
├──────────────────────────────────────┤
│  📊 ENGAGEMENT: ████████░░ 8/10      │
│  "Very high - asking deep questions" │
├──────────────────────────────────────┤
│  💡 RECOMMENDATION                    │
│  "Perfect moment for technical demo. │
│  They're ready for code explanation."│
├──────────────────────────────────────┤
│  📈 METRICS                           │
│  • People: 3  • Questions: 2         │
│  • Avg time: 6min • Energy: High     │
└──────────────────────────────────────┘

FEATURES:
- Updates every 30-60 seconds
- Smooth fade transitions between updates
- Visual progress indicator while analyzing
- Color coding (green = high engagement, etc.)
- History log (last 5 analyses, collapsible)

STYLING:
- Dark theme (easier to read)
- Large, readable fonts
- Icons for each section
- Professional, dashboard-like appearance
- Responsive (works on different screen sizes)

ANIMATIONS:
- Pulse effect on new update
- Smooth text transitions
- Loading spinner during API call
- Engagement bar fills animatedly

Make it visually impressive but information-dense.
```

**What You'll Get:** Beautiful real-time dashboard

**Build Time:** 45-60 minutes

**Test:** Mock data to verify layout and animations

---

### Phase 6: Polish & Optimization (45 minutes)

**Prompt to Claude:**

```
Add final polish and optimization to the AI Booth Observer:

PERFORMANCE:
- Optimize frame capture (lower resolution for API)
- Compress images before sending (reduce API cost)
- Debounce API calls (prevent too-frequent requests)
- Cache last response for offline fallback

COST MANAGEMENT:
- Display token usage counter
- Estimated cost tracker
- Budget alert ($5 limit)
- Pause button to stop analysis

UX IMPROVEMENTS:
- Settings panel:
  - Adjust capture frequency (15s / 30s / 60s)
  - Toggle audio on/off
  - Toggle video on/off
  - Sensitivity adjustment
- Demo mode toggle (fake data for testing)
- Export analysis log (save insights from event)

ERROR RECOVERY:
- Auto-retry on API failure (max 3 attempts)
- Fallback to last successful analysis
- Show clear error messages
- "System health" indicator

PRIVACY ENHANCEMENTS:
- Blur faces toggle (still analyze scene)
- Audio-only mode option
- Clear "Recording indicator" style warning
- Privacy policy link

PRESENTATION MODE:
- Fullscreen toggle
- Hide technical details for public
- Enlarged text for visibility
- "Explain mode" (show how it works)

Make it production-ready and foolproof for live event.
```

**What You'll Get:** Polished, production-ready system

**Build Time:** 35-45 minutes

**Test:** Run for 15+ minutes, verify stability

---

## API Setup & Cost Management

### Getting Claude API Key

1. **Create Anthropic Account:**
   - Visit: https://console.anthropic.com/
   - Sign up (free tier available)
   - Navigate to API Keys section

2. **Generate API Key:**
   - Click "Create Key"
   - Name it "DiscoverSTEM Booth Observer"
   - Copy and save securely

3. **Add Credits:**
   - Minimum $5 recommended
   - Should be more than enough for entire event

### Cost Breakdown

**Claude Haiku Pricing:**

- Input text: $0.25 per million tokens (~$0.00025 per 1000 tokens)
- Input images: $0.40 per million tokens (~$0.0004 per image)
- Output text: $1.25 per million tokens

**Event Usage Calculation:**

- 2.5 hours = 150 minutes
- 1 analysis per minute = 150 analyses
- Average per analysis:
  - 1 image (~1000 tokens) = $0.0004
  - 200 tokens transcript = $0.00005
  - 300 tokens output = $0.000375
  - **Total per analysis: ~$0.0008**
- **150 analyses × $0.0008 = $0.12 total**

**Budget for safety: $1-2** (allows for testing + event)

**Extremely cost-effective!**

### Rate Limiting Strategy

```javascript
const rateLimiter = {
  minInterval: 30000, // 30 seconds minimum
  lastCall: 0,

  canCall() {
    const now = Date.now()
    return now - this.lastCall >= this.minInterval
  },

  recordCall() {
    this.lastCall = Date.now()
  },
}
```

---

## Privacy & Compliance

### Required Signage

**Place prominently at booth:**

```
┌─────────────────────────────────────────────────┐
│  ⚠️  AI BOOTH OBSERVER SYSTEM ACTIVE             │
│                                                  │
│  This booth uses AI to analyze:                 │
│  • Video feed (scene analysis only)             │
│  • Audio (conversation topics and mood)         │
│                                                  │
│  ✓ Nothing is recorded or stored                │
│  ✓ Analysis happens in real-time only           │
│  ✓ All data processed via Claude AI             │
│  ✓ No personal identifiable information saved   │
│                                                  │
│  You may step away at any time if you prefer    │
│  not to participate.                            │
│                                                  │
│  Questions? Ask the exhibitor!                  │
└─────────────────────────────────────────────────┘
```

### Technical Privacy Measures

```javascript
// Never store frames or audio
function captureFrame() {
  const frame = getFrameFromVideo()
  const base64 = convertToBase64(frame)

  // Send to API immediately
  analyzeWithClaude(base64)

  // IMPORTANT: Don't store frame
  // Let base64 go out of scope and be garbage collected
}

// Clear transcripts after use
function captureAudio() {
  const transcript = getLatestTranscript()

  analyzeWithClaude(transcript)

  // Clear from memory after API call
  transcript = null
}
```

### Opt-Out Mechanism

- Physical "Pause Observer" button visible to visitors
- Clear indication when paused
- Visitors can request analysis be stopped

---

## Testing Checklist

### Before Event

**Functionality Tests:**

- [ ] Webcam captures frames correctly
- [ ] Audio transcription works accurately
- [ ] Claude API calls succeed
- [ ] Responses parse and display correctly
- [ ] All UI elements render properly
- [ ] Updates happen on schedule (30-60s)

**Performance Tests:**

- [ ] System runs continuously for 30+ minutes
- [ ] No memory leaks (check browser devtools)
- [ ] API calls complete within 5 seconds
- [ ] Frame rate doesn't degrade over time
- [ ] Multiple people detected correctly

**Privacy Tests:**

- [ ] Signage is clear and visible
- [ ] Pause button works immediately
- [ ] No data persists after page reload
- [ ] Transcripts clear from memory
- [ ] Network inspector shows no unexpected calls

**Error Handling Tests:**

- [ ] Works with camera disabled (audio-only)
- [ ] Works with mic disabled (video-only)
- [ ] Handles API rate limiting gracefully
- [ ] Recovers from network interruptions
- [ ] Shows clear error messages

**Cost Monitoring:**

- [ ] Token counter displays accurately
- [ ] Cost estimate is reasonable
- [ ] Budget alert triggers at threshold
- [ ] Can pause to conserve budget

**Compatibility Tests:**

- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Handles different lighting conditions
- [ ] Handles background noise
- [ ] Multiple people in frame

---

## Demo Presentation Script

### Initial Setup (Before Visitors Arrive)

1. Open browser to booth observer app
2. Enter API key
3. Start camera and microphone
4. Verify analysis running
5. Position display so visitors can see it
6. Place privacy signage prominently

### When First Visitor Approaches

**Opening (30 seconds):**
"Before I show you anything else, look at this display. This is an AI agent watching us RIGHT NOW."

[Point to display]

**The Reveal (60 seconds):**
"See? It just analyzed:"

- [Point to scene] "What it sees through the camera"
- [Point to audio] "What it hears in our conversation"
- [Point to recommendation] "And it's giving me advice on what to do next"

"This is agentic AI - not just answering questions, but autonomously sensing, analyzing, and making decisions."

**The Technical Explanation (90 seconds):**
"Here's how it works:"

1. **Sensing:**
   - "Camera captures a frame every 30 seconds"
   - "Microphone transcribes our conversation"

2. **Analyzing:**
   - "Both inputs go to Claude Haiku - an AI model"
   - "Claude interprets the scene, not just detects objects"
   - "It understands context, mood, engagement"

3. **Recommending:**
   - "Based on analysis, it suggests what I should do"
   - "Like a coach helping me run this booth better"

**The Meta Moment (30 seconds):**
"So AI is literally helping me demonstrate AI right now. That's the power of agentic systems - they can observe, reason about, and improve real-world situations autonomously."

### Handling Questions

**Q: "Is it recording us?"**
A: "No! Look at the code - [show if technical audience] - it captures a frame, sends it to Claude's API, gets analysis, then the frame is gone. Nothing stored. The privacy notice explains this."

**Q: "How accurate is it?"**
A: "Pretty good! Claude Vision is trained on billions of images. Want to test it? Try doing something and let's see if it notices." [Wait 30s for next update]

**Q: "Could this be used for surveillance?"**
A: "This demo doesn't record anything, but you're asking the right ethical question. This technology CAN be used for surveillance, which is why we need to think carefully about privacy, consent, and transparency when building AI systems."

**Q: "How much does it cost to run?"**
A: [Point to cost counter] "See that? About $0.0008 per analysis. For this whole 2.5-hour event, maybe 15-20 cents total. AI is incredibly affordable now."

**Q: "Can I build something like this?"**
A: "YES! That's the whole point. I built this in about 5 hours with AI assistance. You need: a webcam, microphone, Claude API ($5 credit), and basic web dev skills. Want to see how? Let me show you the code..."

---

## Day-of-Event Operation Guide

### Setup Procedure (15 minutes before event)

**Physical Setup:**

1. Position laptop where screen is visible to visitors
2. Ensure good lighting on your face/booth area
3. Clear line of sight for camera (no obstructions)
4. Test audio levels (background noise acceptable?)
5. Place privacy signage in clear view

**Software Setup:**

1. Open booth observer app
2. Enter API key (should be saved from testing)
3. Click "Start Observer"
4. Verify camera preview shows booth area
5. Verify audio transcription picking up speech
6. Wait for first analysis (30-60 seconds)
7. Confirm display updates correctly

**Final Checks:**

- [ ] Display is readable from visitor distance
- [ ] Privacy notice is visible
- [ ] System shows "Active" status
- [ ] No error messages
- [ ] Cost tracker shows reasonable starting point

### During Event

**Monitoring:**

- Glance at recommendations every few minutes
- If engagement drops, take AI's advice
- If system seems off, check accuracy (is analysis making sense?)

**Engagement:**

- Use analysis as conversation starter: "AI just noticed you're asking about X..."
- Show visitors the live updates happening
- Explain what AI is "seeing" and "hearing"

**Adjustments:**

- Too noisy? Increase audio threshold
- Too many false positives? Reduce capture frequency
- Booth too dark? Improve lighting or pause video

**If System Acts Up:**

- Pause analysis
- Show last good analysis (still impressive)
- Pivot to: "This is real AI - sometimes it needs adjustment"
- Use as teaching moment about real-world AI challenges

### Shutdown Procedure

1. Click "Stop Observer"
2. Verify camera/mic access released
3. Export analysis log (optional - for post-event review)
4. Note total cost (for future reference)
5. Take screenshot of final stats

---

## Fallback Plans

### Scenario: API Fails Mid-Event

**Response:**

1. System automatically switches to "Demo Mode"
2. Shows realistic fake analyses based on general patterns
3. Display shows: "⚠️ DEMO MODE - Using simulated analysis"
4. Continue explaining concept, show code instead

**Talking Point:**
"The API connection dropped, but that's real-world development! Let me show you the code that was running..." [pivot to educational discussion]

### Scenario: Camera/Mic Permissions Denied

**Response:**

1. Audio-only mode (if mic works)
2. Video-only mode (if camera works)
3. Manual input mode (type observations)

**Still demonstrate:** The prompt engineering and Claude's analysis abilities

### Scenario: Cost Budget Exceeded

**Response:**

1. System auto-pauses at $5 threshold
2. Show analysis history (still impressive)
3. Explain: "We hit our budget cap - that's responsible AI development"

**Teaching moment:** Real-world AI costs and resource management

### Scenario: Analysis is Nonsensical

**Response:**

1. Pause system
2. Check inputs (is camera seeing right thing? is audio clear?)
3. Adjust prompts if needed (have backup prompts ready)
4. Restart

**Debugging live:** Actually educational for students to see

---

## Post-Event Analysis

### What to Review

**Collect during event:**

- Total API calls made
- Total cost
- Average engagement levels detected
- Common questions detected
- Peak traffic times
- System errors encountered

**Post-event insights:**

- Did AI recommendations help?
- Was multi-modal (vision+audio) better than single mode?
- What engagement patterns emerged?
- Were there false positives/negatives?

**For future improvements:**

- Prompt refinements
- UI adjustments
- Frequency optimization
- Cost reduction strategies

---

## Extensions & Variations

### Advanced Features to Consider

**Multi-Agent Conversations:**

- Two Claude instances: one analyzes booth, one engages visitors via chat
- Show "agents collaborating"

**Predictive Analysis:**

- Track patterns over time
- Predict: "Based on last hour, expect higher traffic soon"

**Sentiment Tracking:**

- Graph engagement over time
- Show: "Most exciting moment was 7:23pm when we built the game"

**Educational Meta-Commentary:**

- AI explains its own reasoning
- "Here's WHY I thought they were engaged..."

**Voice Output:**

- Text-to-speech of recommendations
- AI "speaks" to you with advice

---

## Success Criteria

### You'll Know This Demo is Ready When:

**Technical:**

- [ ] Runs continuously for 30+ minutes without issues
- [ ] API calls succeed reliably
- [ ] Display updates smoothly every 30-60s
- [ ] Cost stays under $1 for full event
- [ ] Privacy measures clearly visible

**Engagement:**

- [ ] Visitors stop to watch the display updating
- [ ] Someone says "Wait, it's analyzing us right now?"
- [ ] Questions about how it works
- [ ] Students want to see the code
- [ ] Photos/videos being taken of the display

**Educational:**

- [ ] You can explain multi-modal AI clearly
- [ ] You can discuss agentic behavior confidently
- [ ] You can show the prompts and code
- [ ] You can discuss privacy implications thoughtfully
- [ ] You can answer "how did you build this?"

**Meta-Impact:**

- [ ] Someone says "This is the coolest thing at the event"
- [ ] Teachers ask about using it in class
- [ ] Other exhibitors come to see it
- [ ] Students understand "agent" vs "chatbot" distinction

---

## The Ultimate Pitch

**"Everything else I'm showing you - particle physics, financial dashboards, data analysis - those are impressive demos.**

**But THIS system? It's watching us have this conversation RIGHT NOW. It's making decisions about what I should say next. It's actually HELPING me be a better exhibitor in real-time.**

**THAT is agentic AI. That's the future. Not just tools that do what we tell them, but systems that sense, analyze, and act autonomously to achieve goals.**

**And I built it in 5 hours with AI assistance. That's the power we're talking about."**

---

**This is your mic-drop demo. The one that makes people say "I've never seen anything like that before."**

**Go build it. 🚀**
