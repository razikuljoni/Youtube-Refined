# YouTube Refined — Feature Research, Competitive Landscape & Product Roadmap

This document outlines extensive research into user pain points, the current YouTube extension ecosystem, and planned production features for future releases.

---

## 🔬 Competitive Landscape Analysis

| Feature | YouTube Refined | Untrap for YouTube | Enhancer for YouTube | uBlock Origin | SponsorBlock |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Comprehensive UI Toggles (50+)** | ✅ **Yes** | ✅ Yes | 🟡 Partial | ❌ Filter syntax only | ❌ No |
| **Shorts Eradication & URL Redirect** | ✅ **Yes** | ✅ Yes | 🟡 Basic | 🟡 CSS only | ❌ No |
| **Zero-Gap Layout Collapse** | ✅ **Yes** | 🟡 Display:none only | ❌ No | 🟡 Generic cosmetic | ❌ No |
| **0ms Video Ad Skip & Flicker Elimination** | ✅ **Yes** | ❌ No adblock | 🟡 Basic skip | ✅ Network filter | ❌ In-video sponsors only |
| **Creator Exemption Allowlist** | ✅ **Yes** | ❌ No | ❌ No | 🟡 Site-wide only | 🟡 Channel allowlist |
| **Default Quality & Speed Lock** | ✅ **Yes** | 🟡 Basic | ✅ Yes | ❌ No | ❌ No |
| **Live Interactive Web Simulator** | ✅ **Yes** | ❌ No | ❌ No | ❌ No | ❌ No |
| **Zero-Telemetry / 100% Client Privacy** | ✅ **Yes** | ✅ Yes | 🟡 Basic analytics | ✅ Yes | 🟡 Community API calls |

---

## 💡 Advanced Feature Research & Feasibility

### 1. In-Video Sponsor Segment Skipping (SponsorBlock Protocol Integration)
- **Problem**: Traditional ad blockers only address YouTube platform ads, leaving 60-90 second embedded host-read sponsored segments.
- **Solution**: Implement client-side hash querying against the public SponsorBlock database (`https://sponsorblock.ragestudio.net/api/skipSegments`) to automatically fast-forward sponsor segments with user opt-in.
- **Implementation Feasibility**: High. Can be added as an optional toggle with user consent, honoring the Creator Allowlist.

### 2. Clickbait De-Sensationalization (DeArrow Pattern)
- **Problem**: YouTube creators use exaggerated thumbnails (gasping faces, red arrows) and ALL-CAPS sensationalist titles.
- **Solution**:
  1. Title Case Normalization: Auto-convert ALL CAPS titles to standard sentence casing.
  2. Thumbnail Scrub Capture: Automatically replace sensationalist custom thumbnails with a clear, representative frame taken from 30% through the video timestamp.
- **Implementation Feasibility**: Very High. Can be done completely client-side in `content.js` without any external server request.

### 3. Audio Volume Normalization & Dynamic Range Compression
- **Problem**: Different YouTube channels have wildly varying master volume levels. Whispering vlogs cut immediately to deafening outro music.
- **Solution**: Connect a Web Audio API `AudioContext` with a `DynamicsCompressorNode` and `GainNode` directly to the `video.html5-main-video` element.
  ```javascript
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(video);
  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
  compressor.knee.setValueAtTime(30, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
  compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
  compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
  source.connect(compressor);
  compressor.connect(audioCtx.destination);
  ```
- **Implementation Feasibility**: High.

### 4. Intentional Session Time Limits & Mindful Friction Breaks
- **Problem**: Users open YouTube for a single 5-minute tutorial and stay for 2 hours due to dopamine loop mechanics.
- **Solution**: 
  - Session stopwatch in the extension badge (e.g. `25m`).
  - Gentle full-screen breathing pause after every 30 minutes of continuous viewing.
  - Option to require typing a mindful phrase (*"I am opening YouTube for research"*) before accessing the home page feed.
- **Implementation Feasibility**: High. Already prototyped in the Web Studio Simulator (`enable_intentional_friction_pause`).

### 5. Channel-Level Hard Blocklist
- **Problem**: Certain channels frequently appear in search results and recommended lists despite having no educational value.
- **Solution**: Add a "Block this Channel" button on video menu cards (`ytd-menu-renderer`). Stores a list of blocked channel IDs and automatically hides all matching cards with zero DOM gaps.
- **Implementation Feasibility**: High.

### 6. Auto-Pause On Tab Switch
- **Problem**: Tab clutter leads to background video playing unintentionally when switching tabs.
- **Solution**: Listen for `document.visibilityState === 'hidden'` and trigger `video.pause()`, auto-resuming when the user returns to the tab.
- **Implementation Feasibility**: Immediate.

---

## 🗺️ Product Roadmap

### Phase 1: Core Polish & Web Store Submission (Current)
- [x] Complete Untrap-inspired 50+ toggles suite.
- [x] AdBlock Commercial Shield with zero-gap layout collapse and 0ms fast skip.
- [x] Creator Allowlist exemption support.
- [x] High-specificity CSS zero-flicker architecture.
- [x] Web Studio interactive simulator with realtime synchronization.
- [x] PNG icons (16, 32, 48, 128) and Chrome Web Store submission package.

### Phase 2: Enhanced Media Controls
- [ ] Web Audio API volume normalization & vocal dialogue enhancer.
- [ ] Auto-pause when tab loses visibility.
- [ ] Picture-in-Picture (PiP) automatic trigger when scrolling down the page.
- [ ] Customizable keyboard scrub jump intervals (e.g., 3s, 5s, 10s, 30s).

### Phase 3: Focus & Mindful Wellness
- [ ] Daily viewing time limits with customizable gentle modal prompts.
- [ ] De-Sensationalizer: title capitalization normalizer and clickbait thumbnail scrubber.
- [ ] Channel blocklist manager.
