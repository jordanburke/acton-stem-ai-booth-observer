# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Booth Observer** - A live multi-modal agentic AI system for STEM exhibition booths. Uses webcam and microphone to analyze booth interactions in real-time via Claude Haiku API.

**Architecture**: Monorepo with 3 packages:

- `packages/frontend` - Solid.js web application
- `packages/worker` - Cloudflare Worker API proxy
- `packages/shared` - TypeScript types shared between frontend and worker

**Key Documentation**: See `docs/4-ai-booth-observer.md` for build guide and `README.md` for deployment instructions.

## Development Commands

### Monorepo Commands (from root)

```bash
pnpm install              # Install all dependencies
pnpm build                # Build all packages (shared → worker → frontend)
pnpm test                 # Run all tests
pnpm format               # Format with Prettier
pnpm lint                 # Lint all packages
pnpm validate             # Format + lint + test + build (pre-commit)
```

### Frontend Development

```bash
pnpm --filter frontend dev       # Vite dev server (port 3000)
pnpm --filter frontend build     # Production build
pnpm --filter frontend preview   # Preview production build
pnpm --filter frontend lint      # ESLint
pnpm --filter frontend deploy    # Deploy to Cloudflare Pages
```

### Worker Development

```bash
pnpm --filter worker dev         # Wrangler dev server (port 8787)
pnpm --filter worker deploy      # Deploy to Cloudflare Workers
pnpm --filter worker test        # Run worker tests
pnpm --filter worker lint        # TypeScript type check
```

### Shared Package

```bash
pnpm --filter shared build       # Build types (required before frontend/worker)
pnpm --filter shared dev         # Watch mode for development
pnpm --filter shared test        # Run shared package tests
```

## Architecture Overview

### Request Flow

```
Browser → Frontend (Solid.js) → Worker (Cloudflare) → Claude API
  ↓                                    ↓
WebRTC/Speech APIs           Rate Limiting + KV Storage
```

**Key Flow**:

1. Frontend captures webcam frame every 30-120s (WebRTC API)
2. Frontend transcribes audio in real-time (Web Speech API)
3. Frontend sends {imageBase64, transcript} to Worker
4. Worker checks rate limits via KV namespace
5. Worker calls Claude Haiku with multi-modal input
6. Worker records token usage in KV
7. Worker returns analysis to Frontend
8. Frontend displays insights in dashboard

### Package Structure

**Frontend** (`packages/frontend/`):

- `src/App.tsx` - Main application orchestrator
- `src/components/` - Solid.js components (CameraFeed, TranscriptPanel, ObservationLog, ControlPanel, PrivacyBanner)
- `src/lib/` - **MISSING** browser API wrappers (webrtc.ts, speech.ts, api-client.ts)
- Built with Vite + Solid.js

**Worker** (`packages/worker/`):

- `src/index.ts` - Cloudflare Worker entry point (routing, CORS, health check)
- `src/claude-proxy.ts` - Claude API integration with multi-modal prompts
- `src/rate-limiter.ts` - KV-based token budget tracking
- Deployed to Cloudflare Workers

**Shared** (`packages/shared/`):

- `src/types.ts` - TypeScript types for API contracts
- Built with tsup (dual CJS/ESM)
- Required dependency for both frontend and worker

### Implementation Status

**✅ Completed**:

- Worker API proxy with rate limiting
- Claude API integration with structured prompts
- All UI components (Solid.js)
- Shared TypeScript types
- Budget tracking system

**❌ Missing (Critical)**:

- `packages/frontend/src/lib/webrtc.ts` - CameraCapture class
- `packages/frontend/src/lib/speech.ts` - SpeechTranscription class
- `packages/frontend/src/lib/api-client.ts` - ObserverAPIClient class

**Note**: The UI components are fully implemented but reference missing lib files. The app won't run until these browser API wrappers are created.

## Implementation Guidance

### Missing Library Files

When implementing the 3 missing lib files, follow these specifications:

**`packages/frontend/src/lib/webrtc.ts`** - CameraCapture class:

- Methods: `start()`, `stop()`, `captureFrame(quality: number)`, `getVideoElement()`, `getStatus()`
- Uses `navigator.mediaDevices.getUserMedia()` for camera access
- Creates `<video>` element for live preview
- Uses Canvas API to capture frames as base64 JPEG
- Returns status objects with `{active: boolean, error?: string}`

**`packages/frontend/src/lib/speech.ts`** - SpeechTranscription class:

- Export `TranscriptSegment` type: `{text: string, timestamp: Date, isFinal: boolean}`
- Methods: `start(callback)`, `stop()`, `getRecentTranscript(seconds)`, `getStatus()`
- Uses Web Speech API (`webkitSpeechRecognition` for Chrome/Edge)
- Maintains rolling transcript buffer (last 60-120 seconds)
- Continuous recognition with interim results

**`packages/frontend/src/lib/api-client.ts`** - ObserverAPIClient class:

- Methods: `observe(imageBase64, transcript)`, `getBudgetStatus()`, `healthCheck()`
- Reads `VITE_WORKER_ENDPOINT` from environment
- Returns typed responses matching `@ai-booth-observer/shared` types
- Error handling with meaningful messages

### Claude API Details

**Model**: `claude-3-haiku-20240307` (see `packages/worker/src/claude-proxy.ts:54`)

**Prompt Structure** (see `claude-proxy.ts:9-50`):

- System prompt: Exhibition assistant context
- User prompt: Timestamp + visual input + audio transcript
- Requested JSON format: `{scene, audio, engagement, recommendation, metrics}`

**Pricing** (see `claude-proxy.ts:118-123`):

- Input: $0.25 per million tokens
- Output: $1.25 per million tokens
- Typical cost: ~$0.0008 per observation

### Environment Configuration

**Worker** (`packages/worker/.dev.vars`):

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

**Worker** (`packages/worker/wrangler.toml`):

```toml
MAX_TOKENS_PER_DAY = "1000000"  # 1M tokens ~= $3/day
```

**Frontend** (`packages/frontend/.env`):

```bash
VITE_WORKER_ENDPOINT=http://localhost:8787  # Dev
# VITE_WORKER_ENDPOINT=https://your-worker.workers.dev  # Prod
```

### Privacy Requirements

**Critical constraints**:

- Never call `localStorage.setItem()` with frames or audio
- Never create `<audio>` or `<video>` recording elements
- Discard frames immediately after base64 conversion
- Transcript buffer limited to 60-120 seconds (see `SpeechTranscription.getRecentTranscript()`)
- Privacy banner must be visible at all times (see `PrivacyBanner.tsx`)

## Development Workflow

### Local Development Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Build shared types** (required first):

   ```bash
   pnpm --filter shared build
   ```

3. **Configure worker** (`packages/worker/.dev.vars`):

   ```bash
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

4. **Start both servers** (separate terminals):

   ```bash
   # Terminal 1 - Worker
   pnpm --filter worker dev

   # Terminal 2 - Frontend
   pnpm --filter frontend dev
   ```

5. **Open browser**: http://localhost:3000

### Testing

**Worker tests** (Vitest):

```bash
pnpm --filter worker test              # Run once
pnpm --filter worker test -- --watch   # Watch mode
```

**Frontend testing**:

- Manual browser testing required (WebRTC + Speech APIs)
- Use Chrome or Edge (Web Speech API support)
- Grant camera and microphone permissions

### Deployment

**Worker** (Cloudflare Workers):

```bash
# Setup KV namespace (one-time)
cd packages/worker
wrangler kv:namespace create "USAGE_TRACKER"
# Add ID to wrangler.toml

# Set secret (one-time)
wrangler secret put ANTHROPIC_API_KEY

# Deploy
pnpm --filter worker deploy
```

**Frontend** (Cloudflare Pages):

```bash
# Build
pnpm --filter shared build
pnpm --filter frontend build

# Deploy
cd packages/frontend
wrangler pages deploy dist

# Set environment variable in Cloudflare Dashboard:
# VITE_WORKER_ENDPOINT = https://your-worker.workers.dev
```

### Browser Requirements

**Supported**: Chrome, Edge (Web Speech API required)
**Not supported**: Firefox, Safari (no Web Speech API)
**Required**: HTTPS for camera/microphone permissions (localhost OK for dev)
