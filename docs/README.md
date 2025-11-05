# Pre-Built "Wow" Demos Guide

## Overview

This directory contains guides for building three impressive demonstrations that showcase what's possible with AI-assisted development. Each demo would normally take a professional developer 1-2 weeks to build, but you'll create them in 3-4 hours each with AI assistance.

**Purpose:** These pre-built demos serve as proof points at the beginning of your exhibit, demonstrating the power and speed of agentic AI before you do live builds.

---

## The Three Demos

### 1. **Financial Market Analysis Dashboard** 💰

**File:** [1-financial-dashboard-guide.md](1-financial-dashboard-guide.md)

**What It Is:** Real-time stock market dashboard with live prices, interactive charts, technical analysis indicators, and AI-generated market insights.

**Why It's Impressive:**

- Live data updating every 60 seconds
- Professional Bloomberg-terminal-like interface
- Complex financial calculations (RSI, Bollinger Bands, Moving Averages)
- Real-world business application

**Build Time:** 3-4 hours
**Normally Takes:** 1-2 weeks

**Best For:** Showing business applications, impressing parents/teachers, students interested in finance

---

### 2. **Advanced Particle Physics System** 🌊

**File:** [2-particle-physics-guide.md](2-particle-physics-guide.md)

**What It Is:** GPU-accelerated particle engine with 10,000+ particles, fluid dynamics, multiple physics modes (gravity, attraction, vortex, flow fields).

**Why It's Impressive:**

- Visually stunning - people stop and stare
- 10,000+ particles running at 60fps
- Complex physics math (SPH fluid dynamics, Perlin noise flow fields)
- Game engine quality visuals

**Build Time:** 3-4 hours
**Normally Takes:** 1-2 weeks + requires physics/math expertise

**Best For:** Visual spectacle, your personal favorite, showing technical sophistication

---

### 3. **3D Data Visualization Globe** 🌍

**File:** [3-globe-visualization-guide.md](3-globe-visualization-guide.md)

**What It Is:** Interactive 3D Earth globe visualizing real global datasets - earthquakes, flights, climate data, wildfires, or custom uploaded data.

**Why It's Impressive:**

- Professional 3D graphics
- Real scientific data from USGS, NASA, etc.
- Time-based playback showing data evolution
- News organization quality

**Build Time:** 3-4 hours
**Normally Takes:** 1-2 weeks + requires 3D graphics expertise

**Best For:** Scientific credibility, geographic education angle, professional polish

---

## Build Order Recommendation

### Week 1: Financial Dashboard

**Start here because:**

- Most straightforward technically
- Requires external API setup (get key early)
- Builds confidence with AI-assisted development
- Good introduction to working with Claude for multi-step projects

**Time Investment:** One weekend afternoon

---

### Week 2: Particle Physics System

**Build second because:**

- Most visually impressive for the exhibit
- Your personal favorite (enthusiasm shows!)
- More complex than dashboard (builds on your experience)
- Central showpiece for attracting attention

**Time Investment:** One full Saturday

---

### Week 3: 3D Globe Visualization

**Build last because:**

- Most complex 3D concepts
- Benefits from experience with previous two
- Can skip if time-constrained (you'd still have 2 strong demos)
- Adds professional polish to your portfolio

**Time Investment:** One Saturday + Sunday morning for polish

---

## Strategic Demo Presentation Flow

### At the Exhibit Opening (First 10 minutes)

**"Before we build anything live, let me show you what's possible with AI assistance..."**

### Demo 1: Financial Dashboard (3 min)

- Pull up live dashboard on screen
- Show real-time stock prices updating
- Click through features (charts, indicators, insights)
- **The Kicker:** "Built in 3 hours. Normally takes a week or two."

### Demo 2: Particle Physics (2 min)

- Let it run as visual eye-candy
- Invite student to interact with mouse
- Show different modes (fluid, vortex, flow field)
- **The Kicker:** "10,000 particles at 60fps. Built in 4 hours. I'm not a physics expert."

### Demo 3: Globe Visualization (2 min)

- Rotate globe, show earthquake data
- Switch datasets (flights, COVID, etc.)
- Click a data point for details
- **The Kicker:** "Real USGS data. Built in 4 hours. News orgs use tools like this."

### Transition to Live Demos (1 min)

**"Now - those were pre-built. Want to see me build something from scratch, right now, based on YOUR ideas? What should we make?"**

→ Idea wall, live vibecoding begins

---

## Build Environment Setup

### Required Tools

**Code Editor:**

- VS Code (recommended) - free, excellent for web development
- Cursor - AI-powered editor alternative
- Or use Claude Code directly

**Browser:**

- Chrome or Firefox (for developer tools)
- Test in both to ensure compatibility

**Version Control:**

- Git installed locally
- GitHub account for deployment

### Optional but Helpful

**Local Server:**

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

**Browser Extensions:**

- JSON Formatter (for API testing)
- React Developer Tools (if using React)

---

## Building with Claude: Best Practices

### Prompt Structure

**Good Prompt Example:**

```
Create a real-time stock dashboard with:

FEATURES:
- Display 5 stocks (AAPL, GOOGL, MSFT, TSLA, AMZN)
- Live price updates every 60 seconds
- Show price change with color coding (green up, red down)

TECHNICAL:
- Use Alpha Vantage API for real data
- Single HTML file with embedded CSS/JS
- Responsive design

DESIGN:
- Dark theme
- Modern, clean UI
- Mobile-friendly

Include clear code comments.
```

**Why This Works:**

- Specific features listed
- Technical requirements clear
- Design preferences stated
- Asks for comments (helps you understand)

### Iterative Building

**Don't ask for everything at once.** Build incrementally:

1. Basic structure → Test
2. Add features → Test
3. Add polish → Test
4. Optimize → Test

### When Something Doesn't Work

**Good Follow-up Prompt:**

```
The chart isn't displaying. I'm seeing this error in console:
[paste error message]

Here's the relevant code:
[paste 10-20 lines around the issue]

Can you identify and fix the bug?
```

### Asking for Explanations

**Always ask if you don't understand:**

```
Can you explain how the SPH fluid simulation works in simple terms?
I want to be able to explain it to high school students.
```

---

## Testing Strategy

### For Each Demo

**Functionality Test:**

- [ ] All core features work as intended
- [ ] No console errors
- [ ] Data loads correctly
- [ ] Interactions are responsive

**Performance Test:**

- [ ] Runs smoothly (60fps for animations)
- [ ] No memory leaks (run for 15+ minutes)
- [ ] Works on multiple devices
- [ ] Degrades gracefully on slower hardware

**Compatibility Test:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if you have Mac)
- [ ] Mobile browsers (at least test on one phone)

**UX Test:**

- [ ] Show to friend/family - can they use it without instruction?
- [ ] Are controls intuitive?
- [ ] Is important info visible?
- [ ] Does it look professional?

**Demo Test:**

- [ ] Can you present it confidently?
- [ ] Do you understand how it works well enough to explain?
- [ ] Can you handle likely questions?
- [ ] Does it work offline if internet fails? (fallback mode)

---

## Deployment Checklist

### Before You Deploy

- [ ] Remove any API keys from client-side code (use environment variables or serverless functions)
- [ ] Test with fresh browser (clear cache)
- [ ] Verify all assets load (check network tab)
- [ ] Check mobile responsiveness
- [ ] Test slow connection (throttle in dev tools)

### Deployment Options

**GitHub Pages (Recommended):**

- Free
- Easy to update
- Custom domain support
- Fast CDN

**Steps:**

1. Create repo with your demo files
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Save and wait 2-3 minutes
5. Visit `https://yourusername.github.io/repo-name`

**Alternative: Vercel/Netlify**

- More features (serverless functions, analytics)
- Auto-deploys on git push
- Free tier generous

### Post-Deployment

- [ ] Test deployed version (not just local)
- [ ] Bookmark URLs for easy access at event
- [ ] Create QR codes linking to each demo
- [ ] Test on mobile via QR code
- [ ] Take screenshots for backup (if demo fails)

---

## Emergency Backup Plans

### If Internet Fails at Event

**Preparation:**

1. **Create offline mode for each demo**
   - Hardcode sample data
   - Toggle between live/demo mode
   - Clearly label "DEMO MODE"

2. **Have screenshots/videos**
   - Record screen capture of each demo
   - Take high-quality screenshots
   - Have them ready in a folder

3. **Local copies**
   - Full working copies on your laptop
   - Run via local server if needed
   - Don't depend on CDNs (download libraries locally)

### If Demo Breaks

**Stay calm and pivot:**

- "This is real development - things break sometimes!"
- Show the code, explain what should happen
- Use it as teaching moment about debugging
- Switch to different demo
- Fall back to live building instead

---

## Time Management

### If You're Running Short on Time

**Priority Order:**

1. **Particle Physics** (your favorite + most visually impressive)
2. **Financial Dashboard** (business application + parent appeal)
3. **3D Globe** (nice to have, but two strong demos is enough)

**Minimum Viable Demos:**

- Each demo can be simplified if needed
- Basic version in 2 hours is better than nothing
- Polish can happen day-before-event
- Focus on ONE working feature per demo rather than half-broken complex features

### Realistic Schedule (3 Weekends)

**Weekend 1:**

- Saturday morning: Set up development environment
- Saturday afternoon: Build financial dashboard
- Sunday: Test, deploy, practice presentation

**Weekend 2:**

- Saturday: Build particle physics system (full day)
- Sunday: Test, optimize, deploy, practice

**Weekend 3:**

- Saturday: Build globe visualization
- Sunday: Final testing, backup plans, polish all three

**Week Before Event:**

- Test on actual presentation laptop
- Create QR codes
- Print demo URLs
- Prepare talking points
- Run through full presentation

---

## Success Metrics

### You'll Know Your Demos Are Ready When:

**Technical Readiness:**

- [ ] All three demos deploy successfully
- [ ] QR codes work on mobile
- [ ] Demos run for 30+ minutes without issues
- [ ] Offline fallbacks function

**Presentation Readiness:**

- [ ] You can explain each demo in under 3 minutes
- [ ] You can answer "how did you build this?"
- [ ] You can handle technical questions confidently
- [ ] You know the "normally takes X weeks" stats

**Impact Readiness:**

- [ ] Someone who saw them said "Wow, that's impressive"
- [ ] A non-technical person understood what they do
- [ ] You're genuinely excited to show them off
- [ ] They demonstrate agentic AI capabilities clearly

---

## The Big Picture

### Why These Three Demos?

**Financial Dashboard** → Business/practical application
**Particle Physics** → Visual spectacle + technical depth
**3D Globe** → Scientific credibility + real-world data

**Together they show:**

1. AI helps build professional business tools
2. AI handles complex math/physics you don't fully understand
3. AI makes sophisticated 3D graphics accessible
4. Real-world applications across multiple domains
5. What normally takes weeks, AI helps build in hours

### Your Narrative Arc

**Opening:** "These are impossible without expertise..."
**Demo 1:** "Unless you have AI help you with business logic"
**Demo 2:** "And complex physics calculations"
**Demo 3:** "And professional 3D graphics"
**Transition:** "Now let's build something NEW together, live, right now."

---

## Resources & Support

### If You Get Stuck

**While Building:**

1. Re-read the specific guide for that demo
2. Ask Claude to explain the confusing part
3. Search for the specific error message
4. Check browser console for errors
5. Compare to working examples online

**Community Help:**

- Stack Overflow (search first, then ask)
- Three.js Discord (for 3D questions)
- Reddit r/webdev (friendly community)
- GitHub discussions for specific libraries

### Learning More

**After the event, if you want to go deeper:**

- Three.js Journey (best Three.js course)
- WebGL Fundamentals (understand the graphics)
- Financial modeling courses (understand the indicators)
- Physics simulations in code (deepen physics knowledge)

---

## Final Thoughts

**You're building impressive, real-world applications in hours that would normally take professionals weeks.**

That's not because you're cutting corners - it's because AI is a force multiplier for your creativity and problem-solving.

You still need to:

- Understand what you want to build
- Guide the implementation
- Test and verify
- Explain and present

But AI handles:

- Complex mathematics
- Boilerplate code
- API integration details
- Graphics programming minutiae

**That's the story. That's why this exhibit matters.**

Now go build something amazing. 🚀
