# Chrome Web Store Publishing Guide & Developer Console Checklist

This document provides a step-by-step procedure for submitting **YouTube Refined** to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## 1. Pre-Submission Package Checklist

- [x] **Manifest Version 3**: Validated with Service Worker background, no persistent background pages.
- [x] **Zero Remote Code**: All scripts (`content.js`, `background.js`, `popup.js`, `options.js`) are bundled locally within the extension root.
- [x] **Strict Content Security Policy (CSP)**:
  ```json
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
  ```
- [x] **Least Privilege Permissions**:
  - `storage`: Required for user settings persistence.
  - `webNavigation`: Required for fast URL rewriting (`/shorts/` to `/watch?v=`).
  - Host permissions: Limited strictly to `*://*.youtube.com/*`.
- [x] **High-Resolution Icons**:
  - `16x16`: Tab and browser UI icon.
  - `48x48`: Extensions manager page icon.
  - `128x128`: Web Store installation and promo icon.

---

## 2. Chrome Web Store Listing Assets

### Text Metadata
- **Extension Name**: `YouTube Refined — Distraction-Free & Mindful Focus`
- **Short Name**: `YouTube Refined`
- **Short Description (max 132 chars)**:
  `Transform YouTube into a calm, intentional productivity tool. Block Shorts, hide recommendations, set default quality, and add custom CSS.`
- **Primary Category**: `Productivity`
- **Secondary Category**: `Accessibility` or `Photos`

### Graphic Assets Specifications
1. **Store Icon**:
   - `128 x 128 px`, PNG format, transparent background or rounded corners (see `/public/logo.svg`).
2. **Promotional Marquee Tile (Small)**:
   - `440 x 280 px`, PNG or JPEG.
3. **Promotional Marquee Tile (Large)**:
   - `920 x 680 px`, PNG or JPEG.
4. **Screenshots**:
   - Minimum 1 screenshot, recommended 4-5 showcasing:
     1. *Untrap-style Popup with Global Search and instant toggles*
     2. *Home Feed Blackout & Zen Sanctuary Mode*
     3. *Clean Watch Player with Auto-Theater & 1080p/4K Quality Lock*
     4. *Full Options Studio with Live Custom CSS Editor*
   - Dimensions: `1280 x 800 px` or `640 x 400 px`.

---

## 3. Privacy Policy & Single-Purpose Compliance

In the **Privacy practices** tab of the Chrome Developer Dashboard, fill in the following:

### Single Purpose Description
> *"YouTube Refined modifies the visual presentation and client-side playback behavior of YouTube.com to remove distracting algorithmic recommendations, block short-form video formats, and enhance intentional productivity."*

### Permission Justification
1. **`storage`**: Used exclusively on the client's device to save the user's interface preferences (such as hidden elements, default resolution, playback speed, and custom CSS) across browser sessions via `chrome.storage.sync`.
2. **`webNavigation`**: Used to detect navigations to `youtube.com/shorts/` and immediately redirect the user to the standard `youtube.com/watch?v=` desktop player without loading the infinite Shorts feed.
3. **Host Permission (`*://*.youtube.com/*`)**: Necessary to inject stylesheet rules and content scripts onto YouTube pages to hide user-selected DOM elements.

### Data Usage Declarations
- **Personally Identifiable Information**: NO.
- **Health information**: NO.
- **Financial and payment data**: NO.
- **Authentication information**: NO.
- **Personal communications**: NO.
- **Location data**: NO.
- **Web history**: NO (no monitoring outside of `youtube.com`).
- **User activity / Analytics**: NO (0% tracking, 0% telemetry).

---

## 4. Step-by-Step Submission Process

1. **Download the Production Bundle**:
   - In the web app, click **"Download Extension Package (.zip)"**.
   - Verify the zip file contains `manifest.json`, `background.js`, `content.js`, `content.css`, `popup.html`, `options.html`, and the `icons/` directory.

2. **Open Developer Console**:
   - Navigate to [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole).
   - Sign in with your registered Chrome Web Store developer account.

3. **Upload Item**:
   - Click the **"New item"** button.
   - Drag and drop `youtube-refined-extension.zip`.

4. **Fill In Store Listing**:
   - Paste the provided Description and Summary.
   - Upload the 128x128 icon and screenshots.

5. **Complete Privacy Practice Declarations**:
   - Select the justifications documented in Section 3 above.

6. **Submit for Review**:
   - Click **"Submit for review"**. Standard review time takes between 24 and 72 hours for Manifest V3 extensions without remote code.
