# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Booth Observer** - A live multi-modal agentic AI system for STEM exhibition booths. Uses webcam and microphone to analyze booth interactions in real-time, providing insights and recommendations via Claude Haiku API.

**Purpose**: Educational demonstration showing true agentic AI capabilities - sensing, analyzing, and acting autonomously.

**Key Documentation**: See `docs/4-ai-booth-observer.md` for complete build guide and `docs/README.md` for context on the broader demo suite.

## Development Commands

### Pre-Checkin Command

- `pnpm validate` - Format, lint, test, and build everything

### Core Development

- `pnpm dev` - Development build with watch mode
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Launch Vitest UI
- `pnpm format` - Format code with Prettier
- `pnpm lint` - Fix ESLint issues
- `pnpm build` - Production build

## Project Architecture

### Application Type

**Web Application** with TypeScript foundation but focused on browser-based multi-modal AI interaction.

**Core Components (to be built per docs/4-ai-booth-observer.md)**:

1. **Webcam Capture System** - Browser WebRTC API for video frame capture (30-60s intervals)
2. **Audio Capture & Transcription** - Web Speech API for real-time conversation analysis
3. **Claude API Integration** - Multi-modal API calls combining vision + text
4. **Real-time Display UI** - Live analysis dashboard showing scene, audio, engagement, recommendations
5. **Privacy & Cost Management** - No recording, rate limiting, budget tracking

### Build System

- **tsup**: Configured for dual output (CommonJS `.js` + ES modules `.mjs`)
- **Output Directories**:
  - `lib/` - Development builds (NODE_ENV !== "production")
  - `dist/` - Production builds (for deployment)
- **TypeScript**: `.d.ts` declaration files auto-generated

### Testing Framework

- **Vitest**: Modern test runner with hot reload and coverage
- **Coverage**: v8 provider with text/json/html reports
- **Configuration**: `vitest.config.ts` with Node.js environment

### Code Quality

- **ESLint**: Flat config with TypeScript support
- **Prettier**: Auto-formatting integrated with ESLint
- **Import Sorting**: Via `simple-import-sort` plugin

## Implementation Guidance

### Privacy-First Design

**Critical Requirements** (from docs/4-ai-booth-observer.md):

- Never store video frames or audio recordings
- Real-time analysis only - data processed and discarded
- Clear visual indicators when system is active
- Privacy signage requirements documented
- Opt-out mechanism for visitors

### API Integration

**Claude API Setup**:

- Model: `claude-3-haiku-20240307` (cost-effective)
- Multi-modal input: base64 images + text transcripts
- Rate limiting: Maximum 1 call per 30 seconds
- Cost tracking: ~$0.0008 per analysis (~$0.12 for full event)
- Error handling: graceful fallbacks, retry logic

### Prompt Engineering

System uses structured prompts requesting:

1. Scene description (visual analysis)
2. Conversation analysis (audio transcript)
3. Engagement level assessment
4. Actionable recommendations

Expected JSON response format with metrics (people_count, questions_detected, energy level).

### Browser Requirements

- **WebRTC API**: Camera/microphone access
- **Web Speech API**: Real-time transcription (fallback for unsupported browsers)
- **Fetch API**: Claude API integration
- **Canvas API**: Frame capture and base64 conversion

### UI/UX Considerations

- Dashboard-style display (600x800px recommended)
- Dark theme for readability
- Real-time updates with smooth transitions
- Visual indicators: engagement bars, status badges
- Settings panel: capture frequency, audio/video toggles
- Demo mode for offline testing

## Key Documentation Files

- `docs/4-ai-booth-observer.md` - Complete 6-phase build guide (4-5 hours)
- `docs/README.md` - Context on pre-built demos and presentation strategy
- `STANDARDIZATION_GUIDE.md` - TypeScript library template standards (infrastructure only)

## Development Workflow

### Initial Setup

The codebase is currently a TypeScript library template. Actual AI Booth Observer implementation should follow the build phases in `docs/4-ai-booth-observer.md`:

**Phase 1**: Webcam capture setup (45 min)
**Phase 2**: Audio capture & transcription (60 min)
**Phase 3**: Claude API integration (60 min)
**Phase 4**: Prompt engineering (30 min)
**Phase 5**: Real-time display UI (60 min)
**Phase 6**: Polish & optimization (45 min)

### Testing Strategy

**Pre-Event Testing**:

- Continuous operation test (30+ minutes)
- Memory leak detection
- Privacy compliance verification
- API error recovery
- Multi-browser compatibility

**Cost Monitoring**:

- Token usage tracking
- Budget alerts at thresholds
- Pause functionality to conserve budget

### Deployment

Target: Static web hosting (GitHub Pages, Vercel, Netlify)

**Requirements**:

- HTTPS required for camera/microphone permissions
- Environment variable support for API key storage
- Offline fallback mode for demos without connectivity
