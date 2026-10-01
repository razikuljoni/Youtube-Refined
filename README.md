# YouTube Refined — Distraction-Free Chrome Extension & Customization Studio

[![Manifest V3](https://img.shields.io/badge/Manifest-V3%20Compliant-emerald.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Ready%20for%20Review-rose.svg)](https://chromewebstore.google.com/)
[![CI / CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions%20Automated-purple.svg)](.github/workflows/extension-ci.yml)
[![Zero Telemetry](https://img.shields.io/badge/Privacy-100%25%20Zero%20Tracking-blueviolet.svg)](#privacy--security-compliance)

**YouTube Refined** is an advanced, production-grade, privacy-first Google Chrome Extension and web companion studio inspired by *Untrap for YouTube*. It gives viewers complete sovereignty over YouTube's interface—eradicating endless algorithmic rabbit holes, purging addictive Shorts micro-formats, neutralizing sensationalist clickbait, eliminating ads with zero-gap layout collapse, and enforcing high-quality viewing with intentionality.

---

## 🌟 Key Features & Capabilities

### 1. 🛡️ AdBlock & Commercial Shield (Zero-Gap Layout Collapse)
- **Universal Ad Elimination**: Blocks in-stream video commercials, home masthead billboards (`<ytd-banner-promo-renderer>`), companion banners, and sponsored search results.
- **Zero-Gap Layout Collapse**: Applies CSS `visibility: collapse !important;` and parent container zeroing to eliminate empty DOM gaps and blank boxes in the video grid.
- **Instant 0ms Fast-Skip**: Automatically fast-forwards ads at 16x speed, mutes audio, jumps to the end of the ad slice, and clicks skip buttons instantaneously.
- **Black-Screen Elimination**: Suppresses overlay containers (`.ytp-ad-player-overlay`, `.video-ads.ytp-ad-module`) so the player transitions smoothly into the main video without temporary black screen pauses.
- **Creator Exemption Allowlist**: Whitelist your favorite creators (`@handle` or channel ID) so their channels stay fully monetized while all other ads remain blocked.

### 2. 🚫 Complete Shorts Eradication
- **Global Shorts Blocker**: Completely purges Shorts from the left sidebar, home carousels, search results, creator channel tabs, and mobile web overlays.
- **Instant `/shorts/` to `/watch?v=` URL Redirect**: Automatically rewrites any Short link into the standard desktop video player with scrubbable seekbars, playback speed modifiers, and volume controls.
- **Disable Shorts Loop**: Prevents videos from looping continuously.

### 3. 🧘 Home Feed Blackout & Intentional Sanctuary
- **Home Feed Blackout**: Strips the infinite recommendation grid and replaces it with a clean, calm, search-first sanctuary.
- **Custom Home Grid Columns**: Choose between 2, 3, 4, 5, or 6 video cards per row to control visual density.
- **Topic Chips Suppressor / Filter**: Clean horizontal category chips with domain icons or option to hide completely.
- **Dim / Hide Watched Videos**: Dim or hide videos you have already finished watching.

### 4. 🎬 Watch Page & Player Controls
- **Default Playback Quality**: Forces 4K (2160p), 1440p, or 1080p Full HD immediately upon starting any video.
- **Custom Default Playback Speed**: Automatically starts videos at 1.15x, 1.25x, 1.5x, 1.75x, or 2.0x.
- **Auto Theater (Wide Cinema) Mode**: Expands the player automatically without cramped sidebar crowding.
- **Closed Captions Management**: Keep subtitles automatically enabled or permanently suppressed.
- **Up Next Sidebar Removal**: Eliminates algorithmic sidebars during educational lectures or coding tutorials.
- **Comments & Live Chat Suppressor**: Read without distraction or collapse comments with a dedicated clean toggle button.
- **No Endscreen Clutter**: Blocks popups, recommendation boxes, and subscription cards during the final 20 seconds.
- **Ambient Bloom Disabler**: Turns off the distracting edge light bleeding outside the video container.

### 5. 🎨 Visual Neutralization & Clickbait Defense
- **Gaussian Blur Thumbnails**: Softens thumbnails (slider from 4px to 28px) until deliberately hovered.
- **Grayscale Thumbnails**: Desaturates hyper-saturated thumbnail art to defeat emotional manipulation.
- **Timestamp & Badge Toggle**: Hide badges to evaluate videos strictly by title and topic.

### 6. 💻 Live Custom CSS Injector & Options Studio
- **Integrated CSS Editor**: Injects user-defined CSS stylesheets directly into `youtube.com` without build steps or external plugins.
- **Refined Quick Keyboard Shortcuts**:
  - `[T]` — Toggle Theater mode
  - `[D]` — Toggle Distraction-free mode (hides sidebar & comments)
  - `[B]` — Toggle Thumbnail Gaussian blur

---

## 🚀 Quick Installation Guide (Chrome / Brave / Edge / Arc)

### Step 1: Download the Extension Package
- In the web companion studio, click **"Download Extension Package (.zip)"**.
- Alternatively, clone this repository and run `npm run pack:extension`.

### Step 2: Open Extensions Page
- In Google Chrome (or any Chromium browser: Edge, Brave, Opera, Arc), navigate to:
  ```text
  chrome://extensions/
  ```
- Toggle **"Developer mode"** in the top-right corner.

### Step 3: Load Unpacked
- Extract `youtube-refined-extension.zip` into a folder on your computer.
- Click **"Load unpacked"** in the top-left corner and select the extracted folder.
- Open [youtube.com](https://www.youtube.com) — YouTube Refined is now active!

---

## 📚 Documentation & Technical References

- **[Architecture Deep-Dive](docs/ARCHITECTURE.md)**: Zero-flicker attribute inversion, zero-gap layout collapse engine, MutationObserver batching, and service worker lifecycle.
- **[Chrome Web Store Publishing Guide](docs/CHROME_STORE_PUBLISH_GUIDE.md)**: Complete step-by-step submission checklist, metadata, privacy declarations, and asset requirements.
- **[Feature Research & Roadmap](docs/FEATURES_RESEARCH.md)**: Competitive analysis (Untrap, SponsorBlock, Enhancer), future features research, and technical feasibility studies.

---

## 🛠️ Project Structure

```text
├── manifest.json            # Manifest V3 configuration with strict least-privilege CSP
├── background.js            # Service worker handling early URL rewriting & storage sync
├── adblock-service.js       # Dedicated AdBlock & Commercial Shield engine
├── content.js               # Zero-flicker DOM interceptor & player controls manager
├── content.css              # Attribute-targeted high-specificity CSS rules
├── popup.html               # Untrap-style popup UI with search & AdBlock Shield tab
├── popup.css                # Dark minimalist popup styling
├── popup.js                 # Realtime popup storage controller & search filter
├── options.html             # Full-page settings studio with custom CSS injector
├── options.css              # Options studio layout & responsive sidebar
├── options.js               # Options backup exporter, JSON importer, & CSS manager
├── icons/                   # High-resolution binary PNG icons (16, 32, 48, 128) & SVG
├── docs/                    # Technical architecture, publishing guide, and research
└── components/              # Companion Web Studio Next.js interactive components
```

---

## 🔒 Privacy & Security Compliance

- **Zero Remote Code**: Complies with Manifest V3 rules prohibiting external CDN scripts or `eval()`.
- **Zero Telemetry**: No tracking beacons, analytics pixels, or third-party pings.
- **Strict Least Privilege**: Permissions restricted exclusively to `storage`, `webNavigation`, and `*://*.youtube.com/*`.
- **Local Storage Only**: All settings synchronize solely via Google Chrome's built-in `chrome.storage.sync` encrypted pipeline.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Pack extension zip for distribution
npm run pack:extension

# Run code linter
npm run lint

# Build production web studio
npm run build
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more details.
