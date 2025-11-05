# 🤖 AI Booth Observer

Live multi-modal agentic AI system for STEM exhibition booths. Uses webcam and microphone to analyze booth interactions in real-time, providing insights and recommendations via Claude Haiku API.

**Built with:** Solid.js + Cloudflare Workers + Claude AI

---

## ✨ Features

- 📹 **Real-time Camera Feed** - Captures frames every 30-120 seconds
- 🎤 **Live Audio Transcription** - Web Speech API for conversation analysis
- 🤖 **Claude AI Analysis** - Multi-modal understanding of scene + audio
- 📊 **Engagement Metrics** - People count, questions detected, energy level
- 💡 **Actionable Recommendations** - What to do next to engage visitors
- 🔒 **Privacy-First** - No recording, only real-time analysis
- 💰 **Cost Tracking** - Budget limits and token usage monitoring

---

## 🏗️ Project Structure

```
ai-booth-observer/
├── packages/
│   ├── shared/          # Shared TypeScript types
│   ├── frontend/        # Solid.js web application
│   └── worker/          # Cloudflare Worker (API proxy)
├── docs/                # Build guides and documentation
├── pnpm-workspace.yaml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** 10+
- **Anthropic API Key** (get from [console.anthropic.com](https://console.anthropic.com))
- **Cloudflare Account** (free tier works)
- **Chrome/Edge Browser** (for Web Speech API support)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

**Worker** (packages/worker/.dev.vars):

```bash
cp packages/worker/.dev.vars.example packages/worker/.dev.vars
# Edit .dev.vars and add your ANTHROPIC_API_KEY
```

**Frontend** (packages/frontend/.env):

```bash
# Already configured for local development
VITE_WORKER_ENDPOINT=http://localhost:8787
```

### 3. Build Shared Package

```bash
pnpm --filter shared build
```

### 4. Run Development Servers

**Terminal 1 - Worker:**

```bash
pnpm --filter worker dev
```

**Terminal 2 - Frontend:**

```bash
pnpm --filter frontend dev
```

**Frontend:** http://localhost:3000
**Worker:** http://localhost:8787

---

## 🧪 Local Testing

1. Open http://localhost:3000 in Chrome/Edge
2. Click "Start" to activate the observer
3. Allow camera and microphone permissions
4. Speak near the microphone and move in front of the camera
5. Wait 30 seconds for the first observation
6. View Claude's analysis in the right panel

---

## ☁️ Deployment

### Cloudflare Worker

1. **Create KV Namespace:**

```bash
cd packages/worker
wrangler kv:namespace create "USAGE_TRACKER"
```

2. **Update wrangler.toml:**
   Add the namespace ID from step 1:

```toml
[[kv_namespaces]]
binding = "USAGE_TRACKER"
id = "your-kv-namespace-id"
```

3. **Set API Key Secret:**

```bash
wrangler secret put ANTHROPIC_API_KEY
# Paste your Anthropic API key when prompted
```

4. **Deploy:**

```bash
pnpm --filter worker deploy
```

**Worker URL:** `https://ai-booth-observer-worker.your-subdomain.workers.dev`

### Cloudflare Pages (Frontend)

1. **Build Frontend:**

```bash
pnpm --filter frontend build
```

2. **Deploy to Pages:**

**Option A - Wrangler:**

```bash
cd packages/frontend
wrangler pages deploy dist
```

**Option B - Dashboard:**

- Go to Cloudflare Dashboard → Pages
- Create new project
- Connect to GitHub or upload `packages/frontend/dist/`
- Set build command: `pnpm --filter frontend build`
- Set build output: `packages/frontend/dist`

3. **Configure Environment Variable:**

- Add `VITE_WORKER_ENDPOINT` = `https://your-worker-url.workers.dev`
- Rebuild and redeploy

---

## 💰 Cost Estimates

### Cloudflare (Free Tier)

- ✅ **Pages:** 500 builds/month, unlimited requests
- ✅ **Workers:** 100,000 requests/day
- ✅ **KV:** 100,000 reads/day, 1,000 writes/day

**Total:** $0/month on free tier

### Anthropic API

- **Claude Haiku:** ~$0.0008 per observation
- **150 observations (2.5hr event):** ~$0.12
- **Budget recommended:** $1-2/month

**Total:** $3-10/month depending on usage

---

## 🔒 Privacy & Security

### What's Captured

- **Video:** Still frames every 30-120 seconds (not recorded)
- **Audio:** Text transcripts only (no audio files)

### Privacy Guarantees

- ✅ No permanent storage of frames or audio
- ✅ Data deleted immediately after analysis
- ✅ Only text transcripts sent to Claude API
- ✅ All communication via HTTPS
- ✅ No PII (personally identifiable information) saved

### Security Best Practices

- 🔐 API key stored server-side (Worker environment)
- 🔐 CORS configured (restrict to your domain in production)
- 🔐 Rate limiting via KV namespace
- 🔐 Budget enforcement to prevent runaway costs

---

## 🛠️ Development

### Available Commands

**Root:**

```bash
pnpm dev              # Run frontend dev server
pnpm dev:worker       # Run worker dev server
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm format           # Format code with Prettier
pnpm lint             # Lint all packages
pnpm validate         # Format + lint + test + build
```

**Frontend:**

```bash
pnpm --filter frontend dev       # Dev server
pnpm --filter frontend build     # Production build
pnpm --filter frontend preview   # Preview build
```

**Worker:**

```bash
pnpm --filter worker dev         # Local dev with wrangler
pnpm --filter worker deploy      # Deploy to Cloudflare
```

**Shared:**

```bash
pnpm --filter shared build       # Build types package
```

### Technology Stack

- **Frontend:** Solid.js + Vite + TypeScript
- **Worker:** Cloudflare Workers + Anthropic SDK
- **Types:** Shared TypeScript types via pnpm workspace
- **Build:** tsup (dual CJS + ESM output)
- **Deployment:** Cloudflare Pages + Workers

---

## 📖 Documentation

- **[Build Guide](docs/4-ai-booth-observer.md)** - Detailed 6-phase build instructions
- **[Pre-Built Demos](docs/README.md)** - Context on broader demo suite
- **[CLAUDE.md](CLAUDE.md)** - Claude Code development guidance

---

## 🐛 Troubleshooting

### Camera/Mic Not Working

- ✅ Use Chrome or Edge (Web Speech API required)
- ✅ Ensure HTTPS (required for camera/mic permissions)
- ✅ Check browser permissions (camera and microphone allowed)

### Worker API Errors

- ✅ Verify ANTHROPIC_API_KEY is set (`wrangler secret list`)
- ✅ Check KV namespace is bound in wrangler.toml
- ✅ Review worker logs (`wrangler tail`)

### CORS Errors

- ✅ Update Worker CORS headers to allow your frontend domain
- ✅ Ensure `VITE_WORKER_ENDPOINT` points to correct Worker URL

### Budget Exceeded

- ✅ Check budget status in control panel
- ✅ Increase `MAX_TOKENS_PER_DAY` in wrangler.toml
- ✅ Review KV usage in Cloudflare dashboard

---

## 🎯 Next Steps

### Enhancements

- [ ] Face blurring toggle for additional privacy
- [ ] Multi-language support for transcription
- [ ] Export analysis logs (CSV/JSON)
- [ ] Custom prompt templates
- [ ] Integration with other AI models

### Production Readiness

- [ ] Restrict CORS to specific domain
- [ ] Add authentication for admin features
- [ ] Implement webhook notifications
- [ ] Add analytics dashboard
- [ ] Create offline demo mode

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

This is an educational demonstration project. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🙏 Acknowledgments

- **Anthropic** - Claude AI API
- **Cloudflare** - Workers and Pages platform
- **Solid.js** - Reactive UI framework
- Inspired by the need for real-time AI booth engagement at STEM events

---

**Built for DiscoverSTEM Exhibition** • Educational Demonstration of Agentic AI
