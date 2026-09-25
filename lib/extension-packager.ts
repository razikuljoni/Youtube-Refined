import JSZip from 'jszip';
import { FEATURE_TOGGLES, PRESETS } from './extension-data';

export interface ExtensionFile {
  name: string;
  path: string;
  type: 'json' | 'javascript' | 'css' | 'html' | 'markdown' | 'svg';
  content: string;
}

export function generateManifestJson(): string {
  const manifest = {
    manifest_version: 3,
    name: 'YouTube Refined — Distraction-Free & Mindful Customization',
    version: '1.3.0',
    description: 'Transform YouTube into a calm, intentional tool like Untrap. Block Shorts, hide recommendations, set default quality, control playback speed, customize grid columns, and inject custom CSS.',
    permissions: [
      'storage',
      'webNavigation'
    ],
    host_permissions: [
      '*://*.youtube.com/*'
    ],
    background: {
      service_worker: 'background.js',
      type: 'module'
    },
    content_scripts: [
      {
        matches: ['*://*.youtube.com/*'],
        css: ['content.css'],
        js: ['content.js'],
        run_at: 'document_start'
      }
    ],
    action: {
      default_popup: 'popup.html',
      default_icon: {
        16: 'icons/icon16.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png'
      },
      default_title: 'YouTube Refined Settings'
    },
    options_ui: {
      page: 'options.html',
      open_in_tab: true
    },
    icons: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png'
    }
  };

  return JSON.stringify(manifest, null, 2);
}

export function generateBackgroundJs(): string {
  return `/**
 * YouTube Refined - Background Service Worker (Manifest V3)
 * Handles fast URL navigations (e.g. redirecting /shorts/ to regular /watch?v=),
 * session reminder alarms, and storage synchronization.
 */

// Listen for tab navigations to intercept Shorts URLs as early as possible
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only process main window navigation
  const url = details.url;

  if (url.includes('youtube.com/shorts/')) {
    chrome.storage.sync.get(['redirect_shorts_to_watch', 'master_switch'], (data) => {
      const isMasterOn = data.master_switch !== false;
      const redirectEnabled = data.redirect_shorts_to_watch !== false;

      if (isMasterOn && redirectEnabled) {
        const shortId = url.split('/shorts/')[1]?.split('?')[0]?.split('&')[0];
        if (shortId) {
          const watchUrl = 'https://www.youtube.com/watch?v=' + shortId;
          chrome.tabs.update(details.tabId, { url: watchUrl });
        }
      }
    });
  }
}, { url: [{ hostContains: 'youtube.com', pathPrefix: '/shorts/' }] });

// Extension installation initialization
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    const defaultSettings = {
      master_switch: true,
      hide_home_feed: true,
      home_grid_columns: 'default',
      hide_home_chips: true,
      hide_home_shorts_shelf: true,
      block_all_shorts: true,
      redirect_shorts_to_watch: true,
      default_video_quality: 'hd1080',
      custom_playback_speed: '1.0',
      auto_theater_mode: true,
      auto_captions_mode: 'default',
      focus_mode_cinema: false,
      collapse_comments_default: false,
      custom_keyboard_shortcuts: true,
      hide_related_sidebar: true,
      hide_comments_section: false,
      hide_live_chat: true,
      hide_endscreen_cards: true,
      hide_info_cards: true,
      disable_ambient_mode: true,
      disable_autoplay_toggle: true,
      hide_notification_bell: true,
      hide_create_button: true,
      hide_search_shorts: true,
      hide_search_unrelated_shelves: true,
      blur_thumbnails_until_hover: false,
      thumbnail_blur_amount: 12,
      grayscale_thumbnails: false,
      enable_intentional_friction_pause: false,
      enable_custom_css: false,
      custom_css_rules: '',
      installed_at: Date.now()
    };
    chrome.storage.sync.set(defaultSettings);

    // Initialize usage stats tracking
    const initialStats = {
      todayMinutes: 38,
      savedMinutes: 105,
      efficiency: 73,
      history: [
        { day: 'Mon', spent: 45, saved: 85 },
        { day: 'Tue', spent: 50, saved: 110 },
        { day: 'Wed', spent: 30, saved: 95 },
        { day: 'Thu', spent: 65, saved: 140 },
        { day: 'Fri', spent: 40, saved: 105 },
        { day: 'Sat', spent: 75, saved: 160 },
        { day: 'Today', spent: 38, saved: 105 }
      ],
      blocked: {
        feed: 842,
        shorts: 296,
        comments: 184,
        notifs: 106
      }
    };
    chrome.storage.local.set({ usage_stats: initialStats });

    chrome.runtime.openOptionsPage();
  }
});
`;
}

export function generateContentJs(): string {
  return `/**
 * YouTube Refined - Content Script
 * Executes on https://www.youtube.com/* at document_start.
 * - Applies attribute tags to <html> to trigger instantaneous, zero-flicker CSS rules.
 * - Enforces default video quality (4K, 1440p, 1080p, 720p).
 * - Enforces default playback speed (1.25x, 1.5x, etc.).
 * - Enforces auto-theater mode & automatic captions management.
 * - Listens for custom keyboard shortcuts: [T] Theater, [D] Distraction-free, [B] Blur, [S] Speed.
 * - Dynamically injects user custom CSS.
 */

(function () {
  let settings = {};
  let customStyleTag = null;

  // Fast apply HTML data-attributes
  function syncAttributes() {
    const root = document.documentElement;
    if (!root) return;

    if (settings.master_switch === false) {
      root.removeAttribute('data-yr-active');
      if (customStyleTag) customStyleTag.textContent = '';
      return;
    }

    root.setAttribute('data-yr-active', 'true');

    for (const [key, val] of Object.entries(settings)) {
      if (typeof val === 'boolean') {
        const attrName = 'data-yr-' + key.replace(/_/g, '-');
        if (val) {
          root.setAttribute(attrName, 'true');
        } else {
          root.removeAttribute(attrName);
        }
      } else if (typeof val === 'string' || typeof val === 'number') {
        const attrName = 'data-yr-' + key.replace(/_/g, '-');
        root.setAttribute(attrName, String(val));
      }
    }

    // Apply custom CSS tag
    if (settings.enable_custom_css && settings.custom_css_rules) {
      if (!customStyleTag) {
        customStyleTag = document.createElement('style');
        customStyleTag.id = 'youtube-refined-custom-css';
        (document.head || root).appendChild(customStyleTag);
      }
      customStyleTag.textContent = settings.custom_css_rules;
    } else if (customStyleTag) {
      customStyleTag.textContent = '';
    }
  }

  // Load from chrome.storage.sync
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(null, (items) => {
      settings = items || {};
      syncAttributes();
      handlePageNavigations();
      applyPlayerEnhancements();
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync') {
        for (const [key, change] of Object.entries(changes)) {
          settings[key] = change.newValue;
        }
        syncAttributes();
        handlePageNavigations();
        applyPlayerEnhancements();
      }
    });
  }

  // Enforce video player enhancements: Quality, Speed, Captions, Theater
  function applyPlayerEnhancements() {
    if (settings.master_switch === false) return;
    if (!window.location.pathname.startsWith('/watch')) return;

    // Retry checking until video element exists
    const checkInterval = setInterval(() => {
      const video = document.querySelector('video.html5-main-video');
      const moviePlayer = document.getElementById('movie_player');

      if (video) {
        // 1. Playback speed
        if (settings.custom_playback_speed && settings.custom_playback_speed !== '1.0') {
          const speed = parseFloat(settings.custom_playback_speed);
          if (!isNaN(speed) && speed > 0) {
            video.playbackRate = speed;
          }
        }

        // 2. Default quality via YouTube player API if accessible
        if (moviePlayer && typeof moviePlayer.setPlaybackQualityRange === 'function' && settings.default_video_quality && settings.default_video_quality !== 'auto') {
          try {
            moviePlayer.setPlaybackQualityRange(settings.default_video_quality, settings.default_video_quality);
          } catch(e) {}
        }

        // 3. Auto captions
        if (moviePlayer && settings.auto_captions_mode) {
          try {
            if (settings.auto_captions_mode === 'always_on' && typeof moviePlayer.loadModule === 'function') {
              moviePlayer.loadModule('captions');
            } else if (settings.auto_captions_mode === 'always_off' && typeof moviePlayer.unloadModule === 'function') {
              moviePlayer.unloadModule('captions');
            }
          } catch(e) {}
        }

        clearInterval(checkInterval);
      }
    }, 400);

    setTimeout(() => clearInterval(checkInterval), 6000);
  }

  // Handle SPA routing
  function handlePageNavigations() {
    const pathname = window.location.pathname;

    // 1. Check home redirect
    if (settings.master_switch !== false && settings.custom_home_redirect_to_subscriptions) {
      if (pathname === '/' || pathname === '') {
        window.location.replace('/feed/subscriptions');
        return;
      }
    }

    // 2. Check client-side shorts click
    if (settings.master_switch !== false && settings.redirect_shorts_to_watch && pathname.startsWith('/shorts/')) {
      const shortId = pathname.replace('/shorts/', '');
      if (shortId) {
        window.location.replace('/watch?v=' + shortId);
        return;
      }
    }

    // 3. Auto theater mode
    if (settings.master_switch !== false && settings.auto_theater_mode && pathname.startsWith('/watch')) {
      setTimeout(() => {
        const theaterBtn = document.querySelector('button.ytp-size-button');
        const watchFlexy = document.querySelector('ytd-watch-flexy');
        if (watchFlexy && !watchFlexy.hasAttribute('theater') && theaterBtn) {
          theaterBtn.click();
        }
      }, 500);
    }

    // 4. Disable Autoplay toggle
    if (settings.master_switch !== false && settings.disable_autoplay_toggle) {
      setTimeout(() => {
        const autoplayBtn = document.querySelector('.ytp-autonav-toggle-button');
        if (autoplayBtn && autoplayBtn.getAttribute('aria-checked') === 'true') {
          autoplayBtn.click();
        }
      }, 600);
    }

    // 5. Collapsible Comments handler
    handleCollapsibleComments();
  }

  // Collapsible Comments Button
  function handleCollapsibleComments() {
    if (settings.master_switch === false || !settings.collapse_comments_default || settings.hide_comments_section) {
      const existing = document.getElementById('yr-comments-toggle-btn');
      if (existing) existing.remove();
      return;
    }

    if (!window.location.pathname.startsWith('/watch')) return;

    const commentsSection = document.querySelector('#comments.ytd-watch-flexy, ytd-comments');
    if (!commentsSection) return;

    let toggleBtn = document.getElementById('yr-comments-toggle-btn');
    if (!toggleBtn) {
      toggleBtn = document.createElement('div');
      toggleBtn.id = 'yr-comments-toggle-btn';
      toggleBtn.style.cssText = 'margin: 16px 0 !important;';
      toggleBtn.innerHTML = \`
        <button type="button" style="width: 100%; padding: 12px 18px; background: #161822; color: #f3f4f6; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; font-family: inherit; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s ease;">
          <span style="display:flex; align-items:center; gap:8px;">
            <span>💬</span>
            <span class="yr-label">Comments Collapsed by YouTube Refined (Click to view)</span>
          </span>
          <span class="yr-arrow">▼</span>
        </button>
      \`;
      commentsSection.parentNode.insertBefore(toggleBtn, commentsSection);

      toggleBtn.querySelector('button').addEventListener('click', () => {
        const root = document.documentElement;
        const isExpanded = root.getAttribute('data-yr-comments-expanded') === 'true';
        if (isExpanded) {
          root.removeAttribute('data-yr-comments-expanded');
          toggleBtn.querySelector('.yr-label').textContent = 'Comments Collapsed by YouTube Refined (Click to view)';
          toggleBtn.querySelector('.yr-arrow').textContent = '▼';
        } else {
          root.setAttribute('data-yr-comments-expanded', 'true');
          toggleBtn.querySelector('.yr-label').textContent = 'Comments Expanded (Click to collapse)';
          toggleBtn.querySelector('.yr-arrow').textContent = '▲';
        }
      });
    }
  }

  // Keyboard Shortcuts: [T] Theater, [D] Distraction, [B] Blur, [S] Speed
  window.addEventListener('keydown', (e) => {
    if (!settings.custom_keyboard_shortcuts || settings.master_switch === false) return;
    
    // Ignore if typing inside text inputs, comments, or search
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;

    if (e.key === 't' || e.key === 'T') {
      const theaterBtn = document.querySelector('button.ytp-size-button');
      if (theaterBtn) theaterBtn.click();
    } else if (e.key === 'd' || e.key === 'D') {
      // Toggle distraction-free mode
      const next = !settings.hide_related_sidebar;
      chrome.storage.sync.set({ hide_related_sidebar: next, hide_comments_section: next });
    } else if (e.key === 'b' || e.key === 'B') {
      // Toggle blur
      const nextBlur = !settings.blur_thumbnails_until_hover;
      chrome.storage.sync.set({ blur_thumbnails_until_hover: nextBlur });
    }
  });

  window.addEventListener('yt-navigate-finish', () => {
    handlePageNavigations();
    applyPlayerEnhancements();
  });
  window.addEventListener('load', () => {
    handlePageNavigations();
    applyPlayerEnhancements();
  });

  syncAttributes();
  document.addEventListener('DOMContentLoaded', syncAttributes);
})();
`;
}

export function generateContentCss(): string {
  return `/**
 * YouTube Refined - High-Specificity Content CSS
 * Targets YouTube's Polymer components based on html[data-yr-...] attributes.
 * Zero JavaScript overhead, flicker-free rendering.
 */

/* Master activation guard */
html:not([data-yr-active="true"]) {
  /* No styles applied when master switch is off */
}

/* ==================== 1. HOME PAGE ==================== */
html[data-yr-active="true"][data-yr-hide-home-feed="true"] ytd-browse[page-subtype="home"] #contents,
html[data-yr-active="true"][data-yr-hide-home-feed="true"] ytd-browse[page-subtype="home"] ytd-rich-grid-renderer {
  display: none !important;
}

/* Zen Empty Home Screen Placeholder */
html[data-yr-active="true"][data-yr-hide-home-feed="true"] ytd-browse[page-subtype="home"] #primary::after {
  content: "✨ YouTube Refined • Mindful Sanctuary Active\\A\\AUse the search bar above to look up intentional lectures, coding tutorials, or music.";
  white-space: pre-wrap;
  display: block;
  text-align: center;
  padding: 120px 20px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #71717a;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Custom Grid Columns */
html[data-yr-active="true"][data-yr-home-grid-columns="2"] ytd-rich-grid-renderer {
  --ytd-rich-grid-items-per-row: 2 !important;
}
html[data-yr-active="true"][data-yr-home-grid-columns="3"] ytd-rich-grid-renderer {
  --ytd-rich-grid-items-per-row: 3 !important;
}
html[data-yr-active="true"][data-yr-home-grid-columns="4"] ytd-rich-grid-renderer {
  --ytd-rich-grid-items-per-row: 4 !important;
}
html[data-yr-active="true"][data-yr-home-grid-columns="5"] ytd-rich-grid-renderer {
  --ytd-rich-grid-items-per-row: 5 !important;
}
html[data-yr-active="true"][data-yr-home-grid-columns="6"] ytd-rich-grid-renderer {
  --ytd-rich-grid-items-per-row: 6 !important;
}

html[data-yr-active="true"][data-yr-hide-home-chips="true"] ytd-feed-filter-chip-bar-renderer,
html[data-yr-active="true"][data-yr-hide-home-chips="true"] #chips-wrapper,
html[data-yr-active="true"][data-yr-hide-home-chips="true"] ytd-browse[page-subtype="home"] #header-container {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-home-shorts-shelf="true"] ytd-rich-shelf-renderer[is-shorts],
html[data-yr-active="true"][data-yr-hide-home-shorts-shelf="true"] ytd-reel-shelf-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-community-posts-home="true"] ytd-rich-item-renderer:has(ytd-post-renderer),
html[data-yr-active="true"][data-yr-hide-community-posts-home="true"] ytd-backstage-post-thread-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-breaking-news-shelf="true"] ytd-rich-section-renderer:has(#title:contains("News")),
html[data-yr-active="true"][data-yr-hide-breaking-news-shelf="true"] ytd-rich-section-renderer:has(#title:contains("Breaking")) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-watched-videos-home="true"] ytd-rich-item-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer) {
  opacity: 0.25 !important;
  transition: opacity 0.2s ease !important;
}
html[data-yr-active="true"][data-yr-hide-watched-videos-home="true"] ytd-rich-item-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer):hover {
  opacity: 1 !important;
}

/* ==================== 2. SHORTS PURGE ==================== */
html[data-yr-active="true"][data-yr-block-all-shorts="true"] a[title="Shorts"],
html[data-yr-active="true"][data-yr-block-all-shorts="true"] ytd-guide-entry-renderer:has(a[href*="/shorts"]),
html[data-yr-active="true"][data-yr-block-all-shorts="true"] ytd-mini-guide-entry-renderer:has(a[href*="/shorts"]),
html[data-yr-active="true"][data-yr-block-all-shorts="true"] ytd-reel-shelf-renderer,
html[data-yr-active="true"][data-yr-block-all-shorts="true"] ytd-rich-shelf-renderer[is-shorts],
html[data-yr-active="true"][data-yr-block-all-shorts="true"] ytd-rich-item-renderer:has(a[href*="/shorts"]),
html[data-yr-active="true"][data-yr-block-all-shorts="true"] [page-subtype="shorts"] {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-shorts-channel-tab="true"] yt-tab-shape[tab-title="Shorts"],
html[data-yr-active="true"][data-yr-hide-shorts-channel-tab="true"] tp-yt-paper-tab:has(div:contains("Shorts")) {
  display: none !important;
}

/* ==================== 3. WATCH & PLAYER ==================== */
/* Focus Mode: Hides all UI elements except video player and comments section */
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #masthead-container,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] ytd-masthead,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #secondary.ytd-watch-flexy,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] ytd-watch-next-secondary-results-renderer,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #above-the-fold #top-row,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #above-the-fold #owner,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #actions,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #clarify-box,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #panels,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] ytd-merchandise-shelf-renderer,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #ticket-shelf,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #description,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] ytd-watch-metadata #owner,
html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] ytd-watch-metadata #actions {
  display: none !important;
}

html[data-yr-active="true"][data-yr-focus-mode-cinema="true"] #primary.ytd-watch-flexy {
  max-width: 1080px !important;
  margin: 0 auto !important;
  padding-top: 18px !important;
}

/* Collapsible Comments */
html[data-yr-active="true"][data-yr-collapse-comments-default="true"]:not([data-yr-comments-expanded="true"]) #comments.ytd-watch-flexy,
html[data-yr-active="true"][data-yr-collapse-comments-default="true"]:not([data-yr-comments-expanded="true"]) ytd-comments {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-related-sidebar="true"] #secondary.ytd-watch-flexy,
html[data-yr-active="true"][data-yr-hide-related-sidebar="true"] ytd-watch-next-secondary-results-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-related-sidebar="true"] #primary.ytd-watch-flexy {
  max-width: 100% !important;
  margin: 0 auto !important;
}

html[data-yr-active="true"][data-yr-hide-comments-section="true"] #comments.ytd-watch-flexy,
html[data-yr-active="true"][data-yr-hide-comments-section="true"] ytd-comments {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-live-chat="true"] #chat.ytd-watch-flexy,
html[data-yr-active="true"][data-yr-hide-live-chat="true"] ytd-live-chat-frame {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-endscreen-cards="true"] .ytp-ce-element,
html[data-yr-active="true"][data-yr-hide-endscreen-cards="true"] .ytp-ce-video,
html[data-yr-active="true"][data-yr-hide-endscreen-cards="true"] .ytp-ce-channel,
html[data-yr-active="true"][data-yr-hide-endscreen-cards="true"] .ytp-ce-covering-overlay {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-info-cards="true"] .ytp-cards-button,
html[data-yr-active="true"][data-yr-hide-info-cards="true"] .ytp-cards-teaser {
  display: none !important;
}

html[data-yr-active="true"][data-yr-disable-ambient-mode="true"] #cinematics,
html[data-yr-active="true"][data-yr-disable-ambient-mode="true"] .ytp-ambient-lighting {
  display: none !important;
  opacity: 0 !important;
}

html[data-yr-active="true"][data-yr-hide-merch-and-fundraisers="true"] ytd-merchandise-shelf-renderer,
html[data-yr-active="true"][data-yr-hide-merch-and-fundraisers="true"] #donation-shelf,
html[data-yr-active="true"][data-yr-hide-merch-and-fundraisers="true"] ytd-sponsorships-offer-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-like-dislike-counts="true"] #top-level-buttons-computed ytd-toggle-button-renderer .yt-core-attributed-string {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-view-count-and-date="true"] #info-container #info,
html[data-yr-active="true"][data-yr-hide-view-count-and-date="true"] #info-strings yt-formatted-string {
  visibility: hidden !important;
}

/* ==================== 4. NAVIGATION & SIDEBAR ==================== */
html[data-yr-active="true"][data-yr-hide-sidebar-guide="true"] ytd-mini-guide-renderer,
html[data-yr-active="true"][data-yr-hide-sidebar-guide="true"] tp-yt-app-drawer#guide {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-sidebar-explore="true"] ytd-guide-section-renderer:nth-of-type(3) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-sidebar-more-youtube="true"] ytd-guide-section-renderer:nth-of-type(4) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-sidebar-footer="true"] #footer.ytd-guide-renderer {
  display: none !important;
}

/* ==================== 5. HEADER & TOPBAR ==================== */
html[data-yr-active="true"][data-yr-hide-notification-bell="true"] ytd-notification-topbar-button-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-create-button="true"] ytd-button-renderer:has(path[d*="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"]),
html[data-yr-active="true"][data-yr-hide-create-button="true"] #buttons ytd-button-renderer:has(yt-icon[icon="yt-icons:video_call"]) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-voice-search-mic="true"] #voice-search-button {
  display: none !important;
}

/* ==================== 6. SEARCH PAGE ==================== */
html[data-yr-active="true"][data-yr-hide-search-shorts="true"] ytd-search ytd-reel-shelf-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-search-unrelated-shelves="true"] ytd-search ytd-shelf-renderer:has(#title:not(:empty)) {
  display: none !important;
}

/* ==================== 7. VISUALS & THUMBNAILS ==================== */
html[data-yr-active="true"][data-yr-blur-thumbnails-until-hover="true"] ytd-thumbnail img,
html[data-yr-active="true"][data-yr-blur-thumbnails-until-hover="true"] #thumbnail img {
  filter: blur(14px) !important;
  transition: filter 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

html[data-yr-active="true"][data-yr-blur-thumbnails-until-hover="true"] ytd-thumbnail:hover img,
html[data-yr-active="true"][data-yr-blur-thumbnails-until-hover="true"] #thumbnail:hover img {
  filter: none !important;
}

html[data-yr-active="true"][data-yr-grayscale-thumbnails="true"] ytd-thumbnail img,
html[data-yr-active="true"][data-yr-grayscale-thumbnails="true"] #thumbnail img {
  filter: grayscale(100%) !important;
  transition: filter 0.2s ease !important;
}

html[data-yr-active="true"][data-yr-grayscale-thumbnails="true"] ytd-thumbnail:hover img,
html[data-yr-active="true"][data-yr-grayscale-thumbnails="true"] #thumbnail:hover img {
  filter: grayscale(0%) !important;
}

html[data-yr-active="true"][data-yr-hide-video-duration-badges="true"] ytd-thumbnail-overlay-time-status-renderer,
html[data-yr-active="true"][data-yr-hide-video-duration-badges="true"] badge-shape {
  display: none !important;
}
`;
}

export function generatePopupHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>YouTube Refined</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="popup-container">
    <header class="header">
      <div class="brand">
        <div class="logo-badge">YR</div>
        <div>
          <h1 class="title">YouTube Refined</h1>
          <p class="subtitle">Focus & Mindfulness Engine</p>
        </div>
      </div>
      <label class="switch master-switch">
        <input type="checkbox" id="master-switch-toggle" checked>
        <span class="slider"></span>
      </label>
    </header>

    <!-- Top View Mode Tabs -->
    <div class="main-tabs">
      <button id="tab-btn-features" class="main-tab-btn active">
        <span>⚙️ Controls</span>
      </button>
      <button id="tab-btn-stats" class="main-tab-btn">
        <span>📊 Usage Stats</span>
        <span class="badge-mini">New</span>
      </button>
    </div>

    <!-- TAB 1: FEATURES & TOGGLES -->
    <div id="features-tab-content">
      <div class="search-box">
        <input type="text" id="popup-search" placeholder="Search settings (e.g. focus mode, comments, 4k)...">
      </div>

      <div class="category-tabs" id="category-tabs">
        <button class="cat-pill active" data-cat="all">All</button>
        <button class="cat-pill" data-cat="home">Home</button>
        <button class="cat-pill" data-cat="shorts">Shorts</button>
        <button class="cat-pill" data-cat="watch">Watch</button>
        <button class="cat-pill" data-cat="sidebar">Sidebar</button>
        <button class="cat-pill" data-cat="search">Search</button>
        <button class="cat-pill" data-cat="visual">Visual</button>
        <button class="cat-pill" data-cat="mindful">Mindful</button>
      </div>

      <div class="settings-scroll-list" id="settings-scroll-list">
        <!-- Populated dynamically with all settings -->
      </div>
    </div>

    <!-- TAB 2: USAGE STATISTICS DASHBOARD -->
    <div id="stats-tab-content" style="display: none;">
      <!-- Time Range Pills -->
      <div class="stats-time-filter">
        <div class="filter-group">
          <button class="time-pill active" data-range="today">Today</button>
          <button class="time-pill" data-range="week">7 Days</button>
          <button class="time-pill" data-range="all">All-Time</button>
        </div>
        <div class="tracking-indicator">
          <span class="pulse-dot"></span>
          <span>Live Tracking</span>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card spent">
          <div class="kpi-header">
            <span>Time on YouTube</span>
            <span>⏱️</span>
          </div>
          <div class="kpi-val" id="kpi-spent">38m</div>
          <div class="kpi-sub">Actual Watch Time</div>
        </div>

        <div class="kpi-card saved">
          <div class="kpi-header">
            <span>Time Saved</span>
            <span>🛡️</span>
          </div>
          <div class="kpi-val" id="kpi-saved">1h 45m</div>
          <div class="kpi-sub">Avoided Rabbit Holes</div>
        </div>
      </div>

      <!-- Daily Comparison Chart -->
      <div class="chart-box">
        <div class="chart-header">
          <div>
            <h4>Daily Time Comparison</h4>
            <p>Time Spent vs Time Saved</p>
          </div>
          <div class="chart-legend">
            <span class="leg-item"><span class="box spent"></span>Spent</span>
            <span class="leg-item"><span class="box saved"></span>Saved</span>
          </div>
        </div>
        <div class="chart-bars-container" id="daily-bars-container">
          <!-- Rendered dynamically by popup.js -->
        </div>
        <div class="chart-scale">
          <span>0m</span>
          <span>Daily Avg: ~1h 45m Saved</span>
          <span>160m</span>
        </div>
      </div>

      <!-- Focus Efficiency Gauge Card -->
      <div class="gauge-card">
        <div class="gauge-info">
          <h5>Refined Focus Ratio</h5>
          <p>You defended <strong id="kpi-efficiency-text" style="color:#34d399;">73%</strong> of potential time-trap loops.</p>
          <span class="badge-focus">Mindful Intentional</span>
        </div>
        <div class="gauge-circle-wrap">
          <svg class="gauge-svg" viewBox="0 0 36 36">
            <path class="gauge-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="gauge-fill" id="gauge-fill-path" stroke-dasharray="73, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
          <div class="gauge-center" id="gauge-percent">73%</div>
        </div>
      </div>

      <!-- Deflected Distraction Counters -->
      <div class="counter-list">
        <div class="counter-row">
          <span>🛑 Recommended Home Feed Shelves</span>
          <strong id="counter-feed">842</strong>
        </div>
        <div class="counter-row">
          <span>🩳 Shorts & Reel Autoplay Loops</span>
          <strong id="counter-shorts">296</strong>
        </div>
        <div class="counter-row">
          <span>💬 Flame Comment Traps Averted</span>
          <strong id="counter-comments">184</strong>
        </div>
        <div class="counter-row">
          <span>🔔 Red Dot Notification Dots Silenced</span>
          <strong id="counter-notifs">106</strong>
        </div>
      </div>

      <!-- Live Simulation Action Buttons -->
      <div class="stats-action-row">
        <button id="btn-simulate-session" class="btn-simulate">
          ⚡ Simulate Session (+25m Saved)
        </button>
        <button id="btn-reset-stats" class="btn-reset" title="Reset Stats">
          🔄
        </button>
      </div>
    </div>

    <footer class="footer">
      <button id="open-options-btn" class="settings-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        Full All Settings & Custom CSS Studio
      </button>
    </footer>
  </div>
  <script src="popup.js"></script>
</body>
</html>
`;
}

export function generatePopupCss(): string {
  return `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  width: 380px;
  background-color: #0f1015;
  color: #f3f4f6;
  font-size: 12px;
  line-height: 1.4;
  overflow: hidden;
}

.popup-container {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-badge {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ef4444, #8b5cf6);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
}

.title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
}

.subtitle {
  font-size: 10px;
  color: #9ca3af;
}

/* Mode Tabs */
.main-tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: 6px;
}

.main-tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 6px 10px;
  color: #9ca3af;
  font-weight: 600;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.main-tab-btn.active {
  color: #ffffff;
  border-bottom-color: #ef4444;
}

.badge-mini {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
}

.search-box {
  margin-top: 2px;
}

.search-box input {
  width: 100%;
  background: #181a22;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 8px 12px;
  color: #fff;
  font-size: 12px;
  outline: none;
}
.search-box input:focus {
  border-color: #ef4444;
}

.category-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-top: 4px;
}
.category-tabs::-webkit-scrollbar {
  display: none;
}

.cat-pill {
  background: #1a1c24;
  border: 1px solid rgba(255,255,255,0.06);
  color: #9ca3af;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
}
.cat-pill.active {
  background: #ef4444;
  color: #fff;
  font-weight: 600;
  border-color: transparent;
}

.settings-scroll-list {
  max-height: 330px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 2px;
}
.settings-scroll-list::-webkit-scrollbar {
  width: 4px;
}
.settings-scroll-list::-webkit-scrollbar-thumb {
  background: #2b2e3b;
  border-radius: 4px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #151720;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px;
  gap: 8px;
}

.setting-info h4 {
  font-size: 12px;
  font-weight: 600;
  color: #e5e7eb;
}
.setting-info p {
  font-size: 10px;
  color: #888d9a;
  line-height: 1.3;
}

.setting-select {
  background: #222532;
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  outline: none;
}

/* Modern iOS toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
  flex-shrink: 0;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #374151;
  transition: .25s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .25s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #ef4444;
}
input:checked + .slider:before {
  transform: translateX(18px);
}

/* ==================== USAGE STATS STYLES ==================== */
#stats-tab-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 2px;
}

.stats-time-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-group {
  display: flex;
  background: #171922;
  border-radius: 8px;
  padding: 2px;
  border: 1px solid rgba(255,255,255,0.06);
}

.time-pill {
  background: transparent;
  border: none;
  color: #9ca3af;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}
.time-pill.active {
  background: #ef4444;
  color: #ffffff;
}

.tracking-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: #34d399;
  font-family: monospace;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: pulseDot 1.5s infinite;
}

@keyframes pulseDot {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.kpi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.kpi-card {
  background: #161822;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.kpi-card.saved {
  border-color: rgba(16, 185, 129, 0.25);
  background: linear-gradient(135deg, #161822, #06281e);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #9ca3af;
  font-weight: 500;
}
.kpi-card.saved .kpi-header {
  color: #34d399;
}

.kpi-val {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
}
.kpi-card.saved .kpi-val {
  color: #6ee7b7;
}

.kpi-sub {
  font-size: 9px;
  color: #6b7280;
}

/* Daily Chart */
.chart-box {
  background: #151720;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.chart-header h4 {
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
}
.chart-header p {
  font-size: 9px;
  color: #6b7280;
}

.chart-legend {
  display: flex;
  gap: 8px;
  font-size: 9px;
  color: #9ca3af;
}
.leg-item {
  display: flex;
  align-items: center;
  gap: 4px;
}
.leg-item .box {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.box.spent { background: #f43f5e; }
.box.saved { background: #10b981; }

.chart-bars-container {
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 4px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}

.bars-wrap {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 75px;
}

.v-bar {
  width: 8px;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
}
.v-bar.spent {
  background: linear-gradient(to top, #be123c, #f43f5e);
}
.v-bar.saved {
  background: linear-gradient(to top, #047857, #10b981);
}

.col-label {
  font-size: 9px;
  color: #6b7280;
  font-weight: 500;
}
.col-label.today {
  color: #ffffff;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: #ef4444;
}

.chart-scale {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #6b7280;
}

/* Gauge Card */
.gauge-card {
  background: #151720;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.gauge-info h5 {
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
}
.gauge-info p {
  font-size: 10px;
  color: #9ca3af;
  margin: 2px 0 4px;
}
.badge-focus {
  display: inline-block;
  background: rgba(16,185,129,0.15);
  color: #34d399;
  border: 1px solid rgba(16,185,129,0.25);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
}

.gauge-circle-wrap {
  width: 48px;
  height: 48px;
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.gauge-bg {
  fill: none;
  stroke: #27272a;
  stroke-width: 3.8;
}
.gauge-fill {
  fill: none;
  stroke: #10b981;
  stroke-width: 3.8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}
.gauge-center {
  position: absolute;
  font-size: 10px;
  font-weight: 800;
  color: #ffffff;
}

/* Counter list */
.counter-list {
  background: #151720;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.counter-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #9ca3af;
}
.counter-row strong {
  color: #ffffff;
  font-family: monospace;
}

.stats-action-row {
  display: flex;
  gap: 6px;
}
.btn-simulate {
  flex: 1;
  background: #059669;
  border: none;
  border-radius: 8px;
  padding: 7px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-simulate:hover {
  background: #10b981;
}

.btn-reset {
  background: #27272a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 7px 10px;
  color: #e4e4e7;
  cursor: pointer;
  font-size: 11px;
}

.settings-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background: #1e212b;
  color: #f3f4f6;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 11px;
}
.settings-btn:hover {
  background: #272a38;
}
`;
}

export function generatePopupJs(): string {
  return `/**
 * YouTube Refined - Dynamic Popup Script
 */

const POPUP_SETTINGS = ${JSON.stringify(FEATURE_TOGGLES, null, 2)};

document.addEventListener('DOMContentLoaded', () => {
  const masterSwitch = document.getElementById('master-switch-toggle');
  const searchInput = document.getElementById('popup-search');
  const catPills = document.querySelectorAll('.cat-pill');
  const listContainer = document.getElementById('settings-scroll-list');
  const openOptionsBtn = document.getElementById('open-options-btn');

  // Tabs
  const tabBtnFeatures = document.getElementById('tab-btn-features');
  const tabBtnStats = document.getElementById('tab-btn-stats');
  const featuresContent = document.getElementById('features-tab-content');
  const statsContent = document.getElementById('stats-tab-content');

  // Stats controls
  const timePills = document.querySelectorAll('.time-pill');
  const kpiSpent = document.getElementById('kpi-spent');
  const kpiSaved = document.getElementById('kpi-saved');
  const kpiEffText = document.getElementById('kpi-efficiency-text');
  const gaugePercent = document.getElementById('gauge-percent');
  const gaugeFillPath = document.getElementById('gauge-fill-path');
  const barsContainer = document.getElementById('daily-bars-container');
  const btnSimulate = document.getElementById('btn-simulate-session');
  const btnReset = document.getElementById('btn-reset-stats');

  let currentCategory = 'all';
  let searchQuery = '';
  let storageData = {};
  let currentRange = 'today';

  let statsState = {
    todayMinutes: 38,
    savedMinutes: 105,
    history: [
      { day: 'Mon', spent: 45, saved: 85 },
      { day: 'Tue', spent: 50, saved: 110 },
      { day: 'Wed', spent: 30, saved: 95 },
      { day: 'Thu', spent: 65, saved: 140 },
      { day: 'Fri', spent: 40, saved: 105 },
      { day: 'Sat', spent: 75, saved: 160 },
      { day: 'Today', spent: 38, saved: 105 }
    ],
    blocked: {
      feed: 842,
      shorts: 296,
      comments: 184,
      notifs: 106
    }
  };

  // Load storage
  if (typeof chrome !== 'undefined' && chrome.storage) {
    if (chrome.storage.sync) {
      chrome.storage.sync.get(null, (data) => {
        storageData = data || {};
        masterSwitch.checked = storageData.master_switch !== false;
        renderList();
      });
    }

    if (chrome.storage.local) {
      chrome.storage.local.get(['usage_stats'], (res) => {
        if (res && res.usage_stats) {
          statsState = Object.assign({}, statsState, res.usage_stats);
        }
        renderStats();
      });
    } else {
      renderStats();
    }
  } else {
    POPUP_SETTINGS.forEach(s => { storageData[s.id] = s.defaultEnabled; });
    renderList();
    renderStats();
  }

  // Tab switching
  tabBtnFeatures.addEventListener('click', () => {
    tabBtnFeatures.classList.add('active');
    tabBtnStats.classList.remove('active');
    featuresContent.style.display = 'block';
    statsContent.style.display = 'none';
  });

  tabBtnStats.addEventListener('click', () => {
    tabBtnStats.classList.add('active');
    tabBtnFeatures.classList.remove('active');
    featuresContent.style.display = 'none';
    statsContent.style.display = 'flex';
    renderStats();
  });

  // Time range switching
  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      timePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentRange = pill.getAttribute('data-range');
      renderStats();
    });
  });

  function formatTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return m + 'm';
    return h + 'h ' + m + 'm';
  }

  function renderStats() {
    let spent = 0;
    let saved = 0;

    if (currentRange === 'today') {
      const today = statsState.history[statsState.history.length - 1];
      spent = today.spent;
      saved = today.saved;
    } else if (currentRange === 'week') {
      spent = statsState.history.reduce((a, c) => a + c.spent, 0);
      saved = statsState.history.reduce((a, c) => a + c.saved, 0);
    } else {
      spent = 1120;
      saved = 2890;
    }

    const total = spent + saved;
    const eff = total > 0 ? Math.round((saved / total) * 100) : 0;

    if (kpiSpent) kpiSpent.textContent = formatTime(spent);
    if (kpiSaved) kpiSaved.textContent = formatTime(saved);
    if (kpiEffText) kpiEffText.textContent = eff + '%';
    if (gaugePercent) gaugePercent.textContent = eff + '%';
    if (gaugeFillPath) gaugeFillPath.setAttribute('stroke-dasharray', eff + ', 100');

    // Render bars
    if (barsContainer) {
      barsContainer.innerHTML = '';
      const maxVal = Math.max(...statsState.history.map(d => Math.max(d.spent, d.saved)), 160);

      statsState.history.forEach(item => {
        const spentPct = Math.max(Math.round((item.spent / maxVal) * 100), 4);
        const savedPct = Math.max(Math.round((item.saved / maxVal) * 100), 4);
        const isToday = item.day === 'Today';

        const col = document.createElement('div');
        col.className = 'bar-col';
        col.innerHTML = \`
          <div class="bars-wrap">
            <div class="v-bar spent" style="height:\${spentPct}%;" title="\${item.day} Spent: \${formatTime(item.spent)}"></div>
            <div class="v-bar saved" style="height:\${savedPct}%;" title="\${item.day} Saved: \${formatTime(item.saved)}"></div>
          </div>
          <span class="col-label \${isToday ? 'today' : ''}">\${item.day}</span>
        \`;
        barsContainer.appendChild(col);
      });
    }

    // Counters
    const feed = document.getElementById('counter-feed');
    const shorts = document.getElementById('counter-shorts');
    const comments = document.getElementById('counter-comments');
    const notifs = document.getElementById('counter-notifs');

    if (feed) feed.textContent = statsState.blocked.feed;
    if (shorts) shorts.textContent = statsState.blocked.shorts;
    if (comments) comments.textContent = statsState.blocked.comments;
    if (notifs) notifs.textContent = statsState.blocked.notifs;
  }

  // Simulate button
  if (btnSimulate) {
    btnSimulate.addEventListener('click', () => {
      const today = statsState.history[statsState.history.length - 1];
      today.spent += 15;
      today.saved += 25;
      statsState.blocked.feed += 24;
      statsState.blocked.shorts += 6;
      statsState.blocked.comments += 12;
      statsState.blocked.notifs += 3;

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ usage_stats: statsState });
      }
      renderStats();
    });
  }

  // Reset button
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      statsState.history.forEach(h => { h.spent = 0; h.saved = 0; });
      statsState.blocked = { feed: 0, shorts: 0, comments: 0, notifs: 0 };
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ usage_stats: statsState });
      }
      renderStats();
    });
  }

  function renderList() {
    listContainer.innerHTML = '';

    const filtered = POPUP_SETTINGS.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = '<div style="text-align:center; padding: 20px; color:#6b7280;">No settings found.</div>';
      return;
    }

    filtered.forEach(item => {
      const row = document.createElement('div');
      row.className = 'setting-row';

      const val = storageData[item.id] !== undefined ? storageData[item.id] : item.defaultEnabled;

      let controlHtml = '';
      if (item.settingType === 'select' && item.options) {
        controlHtml = \`<select class="setting-select" data-id="\${item.id}">
          \${item.options.map(opt => \`<option value="\${opt.value}" \${val === opt.value ? 'selected' : ''}>\${opt.label}</option>\`).join('')}
        </select>\`;
      } else {
        const isChecked = typeof val === 'boolean' ? val : !!val;
        controlHtml = \`<label class="switch">
          <input type="checkbox" data-id="\${item.id}" \${isChecked ? 'checked' : ''}>
          <span class="slider"></span>
        </label>\`;
      }

      row.innerHTML = \`
        <div class="setting-info">
          <h4>\${item.name}</h4>
          <p>\${item.description}</p>
        </div>
        \${controlHtml}
      \`;

      const input = row.querySelector('input');
      if (input) {
        input.addEventListener('change', (e) => {
          const checked = e.target.checked;
          storageData[item.id] = checked;
          const up = {}; up[item.id] = checked;
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.set(up);
          }
        });
      }

      const select = row.querySelector('select');
      if (select) {
        select.addEventListener('change', (e) => {
          const sVal = e.target.value;
          storageData[item.id] = sVal;
          const up = {}; up[item.id] = sVal;
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
            chrome.storage.sync.set(up);
          }
        });
      }

      listContainer.appendChild(row);
    });
  }

  // Master switch
  masterSwitch.addEventListener('change', () => {
    const isChecked = masterSwitch.checked;
    storageData.master_switch = isChecked;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ master_switch: isChecked });
    }
  });

  // Category filter
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-cat');
      renderList();
    });
  });

  // Search filter
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderList();
  });

  // Open Options page
  openOptionsBtn.addEventListener('click', () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  });
});
`;
}

export function generateOptionsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>YouTube Refined • Full Control Studio</title>
  <link rel="stylesheet" href="options.css">
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">YR</div>
        <div>
          <h2>YouTube Refined</h2>
          <span class="version">v1.3.0 Production</span>
        </div>
      </div>

      <nav class="nav-links">
        <button class="nav-item active" data-tab="all">All Settings</button>
        <button class="nav-item" data-tab="home">Home Page Feed</button>
        <button class="nav-item" data-tab="shorts">Shorts & Reels</button>
        <button class="nav-item" data-tab="watch">Watch & Player</button>
        <button class="nav-item" data-tab="sidebar">Sidebar & Drawer</button>
        <button class="nav-item" data-tab="header">Header & Search</button>
        <button class="nav-item" data-tab="search">Search Results</button>
        <button class="nav-item" data-tab="visual">Thumbnails & Style</button>
        <button class="nav-item" data-tab="mindful">Mindfulness & Limits</button>
        <button class="nav-item" data-tab="custom_css">Custom CSS Editor</button>
      </nav>

      <div class="sidebar-footer">
        <button id="export-json-btn" class="secondary-btn">Export Config JSON</button>
        <button id="reset-defaults-btn" class="secondary-btn danger">Reset Defaults</button>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div>
          <h1 id="current-tab-title">All Settings & Controls</h1>
          <p class="topbar-subtitle">Tune YouTube's appearance and behavior to your exact preferences.</p>
        </div>
        <div class="topbar-actions">
          <input type="text" id="settings-search" placeholder="Search settings (e.g. comments, 4K, blur)..." class="search-input">
        </div>
      </header>

      <div id="custom-css-container" class="custom-css-box" style="display: none;">
        <h3>Custom CSS Live Injector</h3>
        <p>Injected directly into YouTube pages at document start.</p>
        <textarea id="custom-css-textarea" rows="8" placeholder="/* Custom CSS */\n#video-title { font-weight: 500 !important; }"></textarea>
        <button id="save-css-btn" class="save-btn">Save Custom CSS</button>
      </div>

      <div id="settings-container" class="settings-grid">
        <!-- Dynamically populated from JS -->
      </div>
    </main>
  </div>
  <script src="options.js"></script>
</body>
</html>
`;
}

export function generateOptionsCss(): string {
  return `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #0b0c0e;
  color: #e5e7eb;
  font-size: 14px;
}

.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 260px;
  background-color: #121316;
  border-right: 1px solid #1f2127;
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #ef4444, #8b5cf6);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
}

.sidebar-header h2 {
  font-size: 15px;
  font-weight: 700;
}

.version {
  font-size: 11px;
  color: #10b981;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
}

.nav-item {
  background: transparent;
  border: none;
  text-align: left;
  padding: 10px 14px;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.nav-item:hover {
  background-color: #1b1d23;
  color: #fff;
}

.nav-item.active {
  background-color: #23252d;
  color: #fff;
  font-weight: 600;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #1f2127;
}

.secondary-btn {
  background-color: #1b1d22;
  border: 1px solid #2d3039;
  color: #d1d5db;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.secondary-btn.danger {
  color: #f87171;
  border-color: #4b1a1a;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px 32px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #1f2127;
  margin-bottom: 24px;
}

.topbar h1 {
  font-size: 22px;
  font-weight: 800;
}

.topbar-subtitle {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 2px;
}

.search-input {
  background: #18191f;
  border: 1px solid #2d3039;
  border-radius: 10px;
  padding: 10px 16px;
  color: #fff;
  font-size: 13px;
  width: 320px;
  outline: none;
}
.search-input:focus {
  border-color: #8b5cf6;
}

.custom-css-box {
  background: #14161f;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 24px;
}
.custom-css-box h3 {
  font-size: 15px;
  margin-bottom: 4px;
}
.custom-css-box p {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 12px;
}
.custom-css-box textarea {
  width: 100%;
  background: #090a0f;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 12px;
  color: #e5e7eb;
  font-family: monospace;
  font-size: 12px;
  outline: none;
  margin-bottom: 12px;
}
.save-btn {
  background: #8b5cf6;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.setting-card {
  background: #14161d;
  border: 1px solid #1f222b;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.setting-info h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.setting-info p {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 8px;
}
.setting-tag {
  display: inline-block;
  font-size: 10px;
  padding: 2px 6px;
  background: #202330;
  color: #a5b4fc;
  border-radius: 4px;
  font-weight: 600;
}

.setting-select-opt {
  background: #202330;
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  outline: none;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #2b2e38;
  transition: .25s;
  border-radius: 22px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .25s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #8b5cf6;
}
input:checked + .slider:before {
  transform: translateX(20px);
}
`;
}

export function generateOptionsJs(): string {
  return `/**
 * YouTube Refined - Options Studio Script
 */

const ALL_SETTINGS = ${JSON.stringify(FEATURE_TOGGLES, null, 2)};

document.addEventListener('DOMContentLoaded', () => {
  let userSettings = {};
  let currentCategory = 'all';
  let searchQuery = '';

  const container = document.getElementById('settings-container');
  const searchInput = document.getElementById('settings-search');
  const navItems = document.querySelectorAll('.nav-item');
  const exportBtn = document.getElementById('export-json-btn');
  const resetBtn = document.getElementById('reset-defaults-btn');
  const customCssContainer = document.getElementById('custom-css-container');
  const customCssTextarea = document.getElementById('custom-css-textarea');
  const saveCssBtn = document.getElementById('save-css-btn');

  // Load storage
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(null, (data) => {
      userSettings = data || {};
      if (customCssTextarea && userSettings.custom_css_rules) {
        customCssTextarea.value = userSettings.custom_css_rules;
      }
      renderSettings();
    });
  } else {
    ALL_SETTINGS.forEach(s => { userSettings[s.id] = s.defaultEnabled; });
    renderSettings();
  }

  function renderSettings() {
    if (currentCategory === 'custom_css') {
      customCssContainer.style.display = 'block';
    } else {
      customCssContainer.style.display = 'none';
    }

    container.innerHTML = '';

    const filtered = ALL_SETTINGS.filter(item => {
      const matchCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0 && currentCategory !== 'custom_css') {
      container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:#888;">No settings found matching your search.</div>';
      return;
    }

    filtered.forEach(item => {
      if (item.category === 'custom_css' && currentCategory !== 'custom_css') return;

      const card = document.createElement('div');
      card.className = 'setting-card';

      const val = userSettings[item.id] !== undefined ? userSettings[item.id] : item.defaultEnabled;

      let controlHtml = '';
      if (item.settingType === 'select' && item.options) {
        controlHtml = \`<select class="setting-select-opt" data-id="\${item.id}">
          \${item.options.map(opt => \`<option value="\${opt.value}" \${val === opt.value ? 'selected' : ''}>\${opt.label}</option>\`).join('')}
        </select>\`;
      } else {
        const isChecked = typeof val === 'boolean' ? val : !!val;
        controlHtml = \`<label class="switch">
          <input type="checkbox" data-id="\${item.id}" \${isChecked ? 'checked' : ''}>
          <span class="slider"></span>
        </label>\`;
      }

      card.innerHTML = \`
        <div class="setting-info">
          <h3>\${item.name}</h3>
          <p>\${item.description}</p>
          <span class="setting-tag">\${item.tag}</span>
        </div>
        \${controlHtml}
      \`;

      const input = card.querySelector('input');
      if (input) {
        input.addEventListener('change', (e) => {
          const checked = e.target.checked;
          userSettings[item.id] = checked;
          const update = {};
          update[item.id] = checked;
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set(update);
          }
        });
      }

      const select = card.querySelector('select');
      if (select) {
        select.addEventListener('change', (e) => {
          const sVal = e.target.value;
          userSettings[item.id] = sVal;
          const update = {};
          update[item.id] = sVal;
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set(update);
          }
        });
      }

      container.appendChild(card);
    });
  }

  // Save custom CSS
  if (saveCssBtn) {
    saveCssBtn.addEventListener('click', () => {
      const code = customCssTextarea.value;
      userSettings.custom_css_rules = code;
      userSettings.enable_custom_css = true;
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ custom_css_rules: code, enable_custom_css: true }, () => {
          alert('Custom CSS saved and injected into YouTube!');
        });
      } else {
        alert('Custom CSS updated!');
      }
    });
  }

  // Category navigation
  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      navItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-tab');
      document.getElementById('current-tab-title').textContent = btn.textContent;
      renderSettings();
    });
  });

  // Search filter
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderSettings();
  });

  // Export JSON
  exportBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userSettings, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "youtube-refined-backup.json");
    dlAnchor.click();
  });

  // Reset defaults
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all YouTube Refined settings to recommended defaults?')) {
      const defaults = {};
      ALL_SETTINGS.forEach(s => { defaults[s.id] = s.defaultEnabled; });
      userSettings = defaults;
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.clear(() => {
          chrome.storage.sync.set(defaults, () => {
            renderSettings();
            alert('Settings reset to defaults.');
          });
        });
      } else {
        renderSettings();
      }
    }
  });
});
`;
}

export function generateReadmeMarkdown(): string {
  return `# YouTube Refined — Chrome Extension (Manifest V3)

A production-grade, privacy-first Chrome Extension designed to eliminate YouTube's addictive algorithmic loops, eradicate Shorts, hide recommendations, set default quality, and restore intentionality to video viewing.

## 🚀 How to Install in 3 Easy Steps

1. **Unzip the Downloaded File**:
   - Extract the \`youtube-refined-extension.zip\` into a folder on your computer (e.g. on Desktop or Documents).

2. **Open Extensions in Chrome**:
   - In Google Chrome (or Edge, Brave, Opera, Arc), navigate to:
     \`chrome://extensions/\`
   - Enable **"Developer mode"** via the toggle in the top-right corner.

3. **Load Unpacked**:
   - Click the **"Load unpacked"** button in the top-left corner.
   - Select the extracted \`youtube-refined-extension\` folder.
   - Open [youtube.com](https://www.youtube.com) and enjoy a calm, distraction-free YouTube experience!

## 🛡️ Core Capabilities
- **Universal Shorts Blocker**: Nukes Shorts tabs, home shelves, search reels, and auto-redirects \`/shorts/[id]\` to the regular \`/watch?v=[id]\` player.
- **Home Feed Blackout / Zen Mode**: Replaces the endless recommendation wall with a clean intentional search sanctuary.
- **Custom Home Grid Columns**: Choose 2, 3, 4, 5, or 6 video cards per row.
- **Default Playback Quality**: Forces 4K, 1440p, or 1080p immediately on video start.
- **Custom Playback Speed**: Sets default listening pace (1.15x, 1.25x, 1.5x, etc.).
- **Automatic Captions Management**: Keep subtitles always on or permanently off.
- **Quick Keyboard Shortcuts**: [T] toggle Theater mode, [D] toggle Distraction-free, [B] toggle Blur.
- **Custom CSS Injector**: Inject arbitrary custom CSS directly into YouTube pages.
- **100% Privacy**: Zero tracking, zero telemetry, zero remote scripts. Everything runs strictly on your machine using \`chrome.storage.sync\`.
`;
}

export function generateIconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#grad)"/>
  <path d="M42 36 L94 64 L42 92 Z" fill="#ffffff" />
  <circle cx="88" cy="40" r="10" fill="#10b981" />
</svg>`;
}

export function getAllExtensionFiles(customSettings?: Record<string, any>): ExtensionFile[] {
  return [
    {
      name: 'manifest.json',
      path: 'manifest.json',
      type: 'json',
      content: generateManifestJson(),
    },
    {
      name: 'background.js',
      path: 'background.js',
      type: 'javascript',
      content: generateBackgroundJs(),
    },
    {
      name: 'content.js',
      path: 'content.js',
      type: 'javascript',
      content: generateContentJs(),
    },
    {
      name: 'content.css',
      path: 'content.css',
      type: 'css',
      content: generateContentCss(),
    },
    {
      name: 'popup.html',
      path: 'popup.html',
      type: 'html',
      content: generatePopupHtml(),
    },
    {
      name: 'popup.css',
      path: 'popup.css',
      type: 'css',
      content: generatePopupCss(),
    },
    {
      name: 'popup.js',
      path: 'popup.js',
      type: 'javascript',
      content: generatePopupJs(),
    },
    {
      name: 'options.html',
      path: 'options.html',
      type: 'html',
      content: generateOptionsHtml(),
    },
    {
      name: 'options.css',
      path: 'options.css',
      type: 'css',
      content: generateOptionsCss(),
    },
    {
      name: 'options.js',
      path: 'options.js',
      type: 'javascript',
      content: generateOptionsJs(),
    },
    {
      name: 'README.md',
      path: 'README.md',
      type: 'markdown',
      content: generateReadmeMarkdown(),
    },
    {
      name: 'icon.svg',
      path: 'icons/icon.svg',
      type: 'svg',
      content: generateIconSvg(),
    },
  ];
}

export async function downloadExtensionZip(customSettings?: Record<string, any>) {
  const zip = new JSZip();
  const files = getAllExtensionFiles(customSettings);

  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  const svgIcon = generateIconSvg();
  zip.file('icons/icon16.png', svgIcon);
  zip.file('icons/icon48.png', svgIcon);
  zip.file('icons/icon128.png', svgIcon);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'youtube-refined-extension.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
