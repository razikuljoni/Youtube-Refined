# YouTube Refined — Technical Architecture & Engineering Deep-Dive

This document provides a comprehensive technical overview of the **YouTube Refined** Chrome Extension (Manifest V3) and companion Web Studio.

---

## 🏗️ High-Level System Architecture

YouTube Refined is built on a high-performance, zero-latency reactive architecture that operates seamlessly on top of YouTube's Polymer Web Components framework.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        User Configuration                              │
│       (Web Studio Simulator / Extension Popup / Options Page)          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                    chrome.storage.sync & local
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Background Service Worker (MV3)                        │
│   • Early URL Navigation Interception (/shorts/ → /watch?v=)           │
│   • Storage Migration & Default Settings Seeding                      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                        document_start Injection
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Content Script Pipeline                            │
│  ┌────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │    syncAttributes()    │  │          AdBlockService              │  │
│  │ (html[data-yr-...])    │  │ • Zero-Gap Layout Collapse           │  │
│  │  Instant CSS Rules     │  │ • 0ms Fast Skip & Mute Engine        │  │
│  └────────────────────────┘  │ • Overlay Suppression (No Blackness) │  │
│                              │ • Creator Exemption Allowlist        │  │
│                              │ • Optimized MutationObserver         │  │
│                              └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 Player & UI Enhancements                         │  │
│  │ • 4K/1440p/1080p Quality Lock • Custom Playback Speed (1.25x)    │  │
│  │ • Auto Theater Mode • Subtitles Mode • Collapsible Comments      │  │
│  │ • Keyboard Shortcuts: [T] Theater, [D] Distraction, [B] Blur    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Zero-Flicker Attribute Inversion Pattern

Standard extensions suffer from visual flicker ("FOUT" - Flash of Unstyled Text/Content) because JavaScript must wait for `DOMContentLoaded` to hide elements. 

YouTube Refined uses the **HTML Data-Attribute Inversion Pattern**:
1. At `document_start`, `content.js` synchronizes all active settings into data attributes on `<html>`:
   ```javascript
   root.setAttribute('data-yr-active', 'true');
   root.setAttribute('data-yr-block-all-ads', 'true');
   root.setAttribute('data-yr-hide-home-feed', 'true');
   root.setAttribute('data-yr-hide-shorts-everywhere', 'true');
   ```
2. High-specificity CSS in `content.css` targets these attributes directly:
   ```css
   html[data-yr-active="true"][data-yr-hide-home-feed="true"] ytd-browse[page-subtype="home"] #contents {
     display: none !important;
   }
   ```
3. Because CSS is injected into the render tree before HTML parsing begins, the browser's layout engine suppresses target elements before the first frame renders—yielding **0ms zero-flicker** performance.

---

## 🛡️ AdBlock & Commercial Shield: Zero-Gap Engine

### Problem in Standard Ad Blockers
In YouTube's Polymer grid (`ytd-rich-grid-renderer`), ad slots are housed inside parent custom elements:
```html
<ytd-rich-item-renderer class="style-scope ytd-rich-grid-renderer">
  <div id="content">
    <ytd-ad-slot-renderer>...</ytd-ad-slot-renderer>
  </div>
</ytd-rich-item-renderer>
```
Setting `display: none` solely on `ytd-ad-slot-renderer` leaves the outer `ytd-rich-item-renderer` taking up width, height, and margins in the CSS Grid, producing an empty blank gap in the video feed.

### Solution: Multi-Layer Zero-Gap Collapse
`AdBlockService` collapses the entire parent chain:
```javascript
const wrapper = el.closest('ytd-rich-item-renderer, ytd-rich-section-renderer, ytd-item-section-renderer, ytd-ad-slot-renderer, #masthead-ad, ytd-banner-promo-renderer, ytd-statement-banner-renderer') || el;

wrapper.style.setProperty('visibility', 'collapse', 'important');
wrapper.style.setProperty('display', 'none', 'important');
wrapper.style.setProperty('height', '0px', 'important');
wrapper.style.setProperty('min-height', '0px', 'important');
wrapper.style.setProperty('max-height', '0px', 'important');
wrapper.style.setProperty('width', '0px', 'important');
wrapper.style.setProperty('min-width', '0px', 'important');
wrapper.style.setProperty('max-width', '0px', 'important');
wrapper.style.setProperty('margin', '0px', 'important');
wrapper.style.setProperty('padding', '0px', 'important');
wrapper.style.setProperty('border', 'none', 'important');
wrapper.style.setProperty('overflow', 'hidden', 'important');
wrapper.style.setProperty('position', 'absolute', 'important');
wrapper.style.setProperty('pointer-events', 'none', 'important');
wrapper.dataset.yrBlocked = 'true';
```
In parallel, `content.css` applies the same absolute-zero dimensions to `:has([data-yr-blocked="true"])`, instantly pulling surrounding video cards together with zero blank space.

---

## ⚡ Video Player 0ms Fast-Skip & Black-Screen Elimination

### The Black-Screen Problem
When YouTube detects an ad-blocker or initiates an ad transition:
1. YouTube displays a black overlay container (`.ytp-ad-player-overlay`, `.video-ads.ytp-ad-module`).
2. YouTube pauses playback waiting for the ad to complete.
3. The user sees a black screen pause for 1 to 5 seconds before the actual video loads.

### The YouTube Refined Solution
1. **Instant Overlay Suppression**:
   In both JS and CSS, all overlay elements are hidden with `visibility: hidden !important; opacity: 0 !important; display: none !important; pointer-events: none !important;`. The black canvas is never drawn to the screen.
2. **Immediate 0ms Fast-Forward & Audio Muting**:
   ```javascript
   video.muted = true;
   video.playbackRate = 16.0;
   if (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime < video.duration) {
     video.currentTime = video.duration - 0.001;
   }
   ```
3. **Internal Player API Skip**:
   Invokes `moviePlayer.skipAd()` if accessible.
4. **Synthetic Click Dispatch**:
   Dispatches both `MouseEvent('click')` and native `.click()` to all skip button variations.
5. **Playback Resume**:
   Calls `video.play()` immediately to prevent the player from pausing on a black frame.
6. **State Restoration**:
   As soon as `ad-showing` disappears, audio is unmuted and `playbackRate` is restored to the user's preferred speed.

---

## ❤️ Creator Exemption Allowlist Engine

Creators rely on ad revenue to sustain high-quality content. YouTube Refined includes a creator allowlist:
- Users add creator handles (`@mkbhd`, `@veritasium`, `@coretechengineering`) or Channel IDs.
- On each watch page, the extension extracts:
  1. URL path (`/@handle` or `/channel/id`)
  2. Channel meta tags (`<meta itemprop="channelId">`)
  3. Video owner link (`ytd-video-owner-renderer a[href]`)
- If the creator is allowlisted:
  - Ad blocking is completely bypassed for that video.
  - Ads play normally to support the creator.
  - The watch player UI displays an intentional "Creator Exempt" badge.

---

## 🔄 Bidirectional Realtime Storage Sync (No Refresh Needed)

When a user toggles any switch in the Extension Popup or Options Studio:
1. `chrome.storage.sync.set(...)` saves the update.
2. `chrome.runtime.sendMessage({ type: 'YOUTUBE_REFINED_SYNC_SETTINGS', settings })` broadcasts to active tabs.
3. In `content.js`, `chrome.storage.onChanged` and `chrome.runtime.onMessage` immediately invoke `evaluateAllUIRulesNow()`:
   - `syncAttributes()` updates HTML attributes without re-rendering the page.
   - `AdBlockService.reEvaluateAll()` executes:
     - If toggled OFF: calls `unhideAll()` to restore hidden elements to the DOM.
     - If toggled ON: dynamically generates `getActiveAdQuery()` and collapses targeted ads.
   - Dispatches `yr-rules-evaluated` custom event for complete live synchronization.

---

## 🔒 Security & Privacy Architecture

- **Manifest V3 Pure**: Uses background service worker, strict CSP without `'unsafe-eval'`.
- **Zero Third-Party Dependencies**: No remote scripts, analytics trackers, or external CDNs.
- **Least-Privilege Host Permissions**: Restricted exclusively to `*://*.youtube.com/*`.
- **Offline Capable**: All extension assets (HTML, CSS, JS, binary PNG icons) are 100% self-contained.
