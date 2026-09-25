# YouTube Refined — Distraction-Free Chrome Extension & Customization Studio

[![Manifest V3](https://img.shields.io/badge/Manifest-V3%20Compliant-emerald.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Ready%20for%20Review-rose.svg)](https://chromewebstore.google.com/)
[![CI / CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions%20Automated-purple.svg)](.github/workflows/extension-ci.yml)
[![Zero Telemetry](https://img.shields.io/badge/Privacy-100%25%20Zero%20Tracking-blueviolet.svg)](#privacy--security-compliance)

**YouTube Refined** is an advanced, production-grade, privacy-first Google Chrome Extension and web companion studio inspired by *Untrap for YouTube*. It gives viewers complete sovereignty over YouTube's interface—eradicating endless algorithmic rabbit holes, purging addictive Shorts micro-formats, neutralizing sensationalist clickbait, and enforcing high-quality viewing with intentionality.

---

## 🌟 Key Features

### 1. 🚫 Complete Shorts Eradication
- **Global Shorts Blocker**: Completely purges Shorts from the left sidebar, home carousels, search results, creator channel tabs, and mobile web overlays.
- **Instant `/shorts/` to `/watch?v=` URL Redirect**: Automatically rewrites any Short link into the standard desktop video player with scrubbable seekbars, playback speed modifiers, and volume controls.
- **Disable Shorts Loop**: Prevents videos from looping continuously.

### 2. 🧘 Home Feed Blackout & Intentional Sanctuary
- **Home Feed Blackout**: Strips the infinite recommendation grid and replaces it with a clean, calm, search-first sanctuary.
- **Custom Home Grid Columns**: Choose between 2, 3, 4, 5, or 6 video cards per row to control visual density.
- **Topic Chips Suppressor**: Removes horizontal categorization pills (*"All"*, *"Gaming"*, *"Podcasts"*).
- **Dim / Hide Watched Videos**: Dim or hide videos you have already finished watching.

### 3. 🎬 Watch Page & Player Controls
- **Default Playback Quality**: Forces 4K (2160p), 1440p, or 1080p Full HD immediately upon starting any video.
- **Custom Default Playback Speed**: Automatically starts videos at 1.15x, 1.25x, 1.5x, 1.75x, or 2.0x.
- **Auto Theater (Wide Cinema) Mode**: Expands the player automatically without cramped sidebar crowding.
- **Closed Captions Management**: Keep subtitles automatically enabled or permanently suppressed.
- **Up Next Sidebar Removal**: Eliminates algorithmic sidebars during educational lectures or coding tutorials.
- **Comments & Live Chat Suppressor**: Read without distraction or hide comments entirely.
- **No Endscreen Clutter**: Blocks popups, recommendation boxes, and subscription cards during the final 20 seconds.
- **Ambient Bloom Disabler**: Turns off the distracting edge light bleeding outside the video container.

### 4. 🎨 Visual Neutralization & Clickbait Defense
- **Gaussian Blur Thumbnails**: Softens thumbnails (slider from 4px to 28px) until deliberately hovered.
- **Grayscale Thumbnails**: Desaturates hyper-saturated thumbnail art to defeat emotional manipulation.
- **Timestamp & Badge Toggle**: Hide badges to evaluate videos strictly by title and topic.

### 5. 💻 Live Custom CSS Injector & Options Studio
- **Integrated CSS Editor**: Injects user-defined CSS stylesheets directly into `youtube.com` without build steps or external plugins.
- **Refined Quick Keyboard Shortcuts**:
  - `[T]` — Toggle Theater mode
  - `[D]` — Toggle Distraction-free mode (hides sidebar & comments)
  - `[B]` — Toggle Thumbnail Gaussian blur

---

## 🚀 Quick Installation Guide (Chrome / Brave / Edge / Arc)

### Method A: Download and Load Unpacked (30 Seconds)
1. Download `youtube-refined-extension.zip` from the web studio or release assets.
2. Unzip the archive into a folder on your computer (e.g. `~/Documents/youtube-refined`).
3. Open your browser and navigate to:
   ```text
   chrome://extensions/
   ```
4. Toggle **"Developer mode"** in the top-right corner.
5. Click **"Load unpacked"** in the top-left corner and select the extracted folder.
6. Open [youtube.com](https://www.youtube.com) — YouTube Refined is now live!

---

## 🛠️ Project Structure

```text
├── manifest.json            # Manifest V3 configuration with strict least-privilege CSP
├── background.js            # Service worker handling early URL rewriting & storage sync
├── content.js               # Zero-flicker DOM interceptor & player controls manager
├── content.css              # Attribute-targeted high-specificity CSS rules
├── popup.html               # Untrap-style popup UI with global search & pill navigation
├── popup.css                # Dark minimalist popup styling
├── popup.js                 # Realtime popup storage controller & search filter
├── options.html             # Full-page settings studio with custom CSS injector
├── options.css              # Options studio layout & responsive sidebar
├── options.js               # Options backup exporter, JSON importer, & CSS manager
├── icons/                   # High-resolution vector and raster icons (16, 48, 128)
└── .github/workflows/       # Automated CI/CD build, validation, and release pipelines
```

---

## 🔒 Privacy & Security Compliance

- **Zero Remote Code**: Complies with Manifest V3 rules prohibiting external CDN scripts or `eval()`.
- **Zero Telemetry**: No tracking beacons, analytics pixels, or third-party pings.
- **Strict Least Privilege**: Permissions restricted exclusively to `storage`, `webNavigation`, and `*://*.youtube.com/*`.
- **Local Storage Only**: All settings synchronize solely via Google Chrome's built-in `chrome.storage.sync` encrypted pipeline.

---

## 📦 Developer Workflow & Testing

### Running the Web Studio Locally
```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Lint and check code health
npm run lint

# Build standalone production app
npm run build
```

### Packaging the Extension for the Chrome Web Store
```bash
# Zip the extension files into a release bundle
npm run pack:extension
```
The generated `.zip` file is immediately ready for submission at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
