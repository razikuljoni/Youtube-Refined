import JSZip from 'jszip';
import { FEATURE_TOGGLES, PRESETS } from './extension-data';

export interface ExtensionFile {
  name: string;
  path: string;
  type: 'json' | 'javascript' | 'css' | 'html' | 'markdown' | 'svg';
  content: string;
}

export const BASE64_ICON16 = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3ElEQVR4nGNgQAOP3aP+3/dI+H/HM/X/Tc/s/9e8Cv9f9i77f8Gn5v9Zn8b/6Orh4Jlb6H9Cmk/5tv8/5tfz/7D/pP8UaT7gP/3/3oC5CEPI0bwrcPF/kjUL7GwEY5Dm7UEr/m8JWvefgVjNIAAzAKZ5Y/Dm/wzEagYBZJtBmteG7PzPgE8zOkDXvCp0338GYjWDALrm5aFH/jPgC210gK55Sdip/wyEogrkbBhA17ww/Px/BkKaYc4GAXTN8yKuQtICIc3YbIZrBgFyNM+OuIWaHyjSjAyIdjYUAACrlmjgTfiJoQAAAABJRU5ErkJggg==";
export const BASE64_ICON32 = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABnklEQVR4nMXX90rDUBiH4e8SvKruZXcFQRBBEAQRBEGEgiCIIAjuvfeedW+l7r0Xil7GT4LEaD1tjzbpeSH/5vmSnCyiOL3o0/CsT8ejIQMPhkzcGbNwa8zGtTEHV6ZcXJjycGbKx6m5AMfmQhxZinBgKca+JYhdawni7f9X7zon3nQevOp9SBQPW0uxYy3Dlq0cm7YKrNsrYw+kNb5mr8KKvYY9RLLwZUc9Fh1NEIrPO1oxl9qhDCECn03tUgYQgc84e5UBtMBTQsGvjYVPOQeQFFzeIvFJ5zDGXaMgLU47awAWPuaaAKmNS7EGYOEjrmmQWnhkPPiQOwTSApeKds2/44PuBVAieKx48H7PEkgLXIoH7/Osgv6K88aD93g2QFrgUjx4t3cbpMaCY8WDd3rDoP8+2+PFg7d790CJvFhixYO3+Q5BarzVWPHgLb4TUKK4vNoj48Gb/ecgNfDvC06OB2/0X4LUxOXTLsWDN/hvPr8J1MR5j/wLlxKB1wXulQFE4LWBJ2UAEXh14OXnv4FQXE4oLicUZ6XarRalD1QsJMJuJtGXAAAAAElFTkSuQmCC";
export const BASE64_ICON48 = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACd0lEQVR4nNXZe0sUURjH8ecl9Kr2fpudnZ3ZJSKiiIiIIiKiCImIIiLCLDMzL5mZWWZmm2lmZqKZmWlmZpZZvYufHGKYtca5HHdn5nzh/P954MzZPTNELvoZ1rAaLuJ7eDtWIjvwLbITy5Fd+BrZjaXoHnyJ7sVidB8+R/djIXYAn2IHMR87hLnYYXyMH8Fs/Cg+xI9hJn4c7xMnMJ04iXeJU5hK1OBt8jQmk2cwkTwLNybLfodk/AopWAur8Ao/njyHN6nzGEtdwOvURYymLrkf6E9IQlDwr9KXMZKuxct0nbNBgoofTl/Fi0y99RBBxw9lGjCYaTQfQhT880wTBqTm/4cQCf9MaoXQ+JLUhqdSuzGEiPj+bIcxgIj4J9lOYwC/8dtKNRuWE3xftguBxOvLDv84241e+SHI722z2QBs2eEfyT2goOLZssP3yL0gPx9YuwHs8A/kPpAf+PKsBrDDd+f6QX7irQZwgr+fK4G8wlvFThs320bHd+UGQH7jWU5OGzP8vdwgqJp4p/HiO5UhkN94Fi/+rjIMqjSeJ158hzIC8hvP4sXfUUZBlcBvNV58e34M5DeexYu/nR8Hef3AmsWLb8tPgCr534Y3XnxrfhJU6ZsUT7z4FnUKVK1roJt48c3qNKiad1in8eJvqTMgLy7gdvHim9RZkBdvD9g5bxUv/qY2B/ICX37Om8WLb9TmQV7i9dPm33jxN7QFkNf48gdWjxffoC2C/MJvZdvo+OuFJZDI+PrC8t+3c0LjWSLirxVWjAFExNcVfhgDiIi/Ulzd+JVGaDxLJHxtcc38S6XQeD2h8XpC48sLCt41fLM8/4V10DpALUGiHFi9fQAAAABJRU5ErkJggg==";
export const BASE64_ICON128 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAGqElEQVR4nO3c51YUWRSG4bqEuSqa3DlOzjnnPE6OzoyAEgQJkkTFgAIGFBBUMOecRecq9qxzqmt1CS0NTZ3qXXW+b619Bc/7Q5vTbRgl2L1Aiu4G0nQ3kJF3J/Ak3Qk8RbflPU23A8/QrXJxz9LN8ufoZvnz8m6Uv0A3yl+k6/JeouvlL9O1CnGv0NWKV7P3Gl2peJ2uVLwh73LFm3S54i26JK7ybbpU+Q5dlPcuXah8jy5Uvi/vfOUHdL7yQzon7yM6V/UxnZX3CZ2p+jR7n9Hpqs/pdNUX8k5VfUmnqr+ik/K+ppPV39AJed/S8ervsreKjlV/T8eqf6DZGnE/0mzNTzQj72eaqfmFjsr7lUphoWRzZVGaK4vRXFmc7stL0L1AMnvAz4d/pOY3OlLzu7zDtX/Q4do/aVreXzRdu5qmalfzDuRBWYQeSHjgq8Cfqv2bDtX+k71/+cTwsCxMwHcXfzK4hiaDdTQRrCtdCAIe+KXFnwjW00SwgcaDDe6GAHxe+OPBtTQeXKc+godlIQI+T/yD8hrpQLBJTQjA9wb+gVCzPOBrjD8WaqGx0HpnIgC+N/H3y2tdWQTA9zb+/lAb7Qu1FRcB8P2Bvy+0gfaG2pcfAfD9g7/sAIDvL/y94Q7aE+5cWgTA9yf+nnAXjYa7CkcAfP/ij4Y3Lh4A8P2NPxruppFw9+MjAL7/8UfCPfkDAL4e+CPhXhoO9y6MAPj64A9H+hYGAHx98HdH+gn4GuPvjmySZwsA+Lrh74oM2AMAvm74uyKbcwEAXz/8oUcDAL5u+EORLbkAgK8e/4nRVQuulPhDka3zAwC+0/j50B93buPvfDQA4JcS3zo38XdGBgn4jPBzEbiDvyO6TZ4BfD741rmFvyO6XQQAfCf/wedEAOLcwN8e3WEGAHxe+DIAF/C3R3eSAXy1/9Ur9tzAzwYAfKc+5HEyAHGq8bdFh8gAPk98MwC1+Nuiu0QAwHfi4101AajFHzQDAL4Tn+2rCEA1/mB0NxnAXzm+NecDUIs/GB0WAQC/WPz58xr+1tgwGcB3Bt/5ANTjb42NiACAvxz8QnMqADfwt8RGzQCA7wy+UwG4hb8ltocM4BfGX+68gp8NAPhO4q8kArfxN8f2kgH8/PhOjdM/+Objb47tEwEAXxW+mP2veo+iq/+QpxD+gBkA8C18FXPrr3rF4A/E9pMBfHX4ZgB88QdiYyIAvfFVjzP+pvgYGcBXHQBf/E3xA1YAeuG7Oc74/fGDIgDgqxxnfBmALvilGmf8/vi4CAD4agPgi98XnzAD8Cs+h3HG74tPkgF8teOMnw3AX/jcxhm/N36IDOCrHWf83vgUGX7A5zzO+D1mAMBXOc74PYlpMryK75Vxxu9JHBYBeAvfa+OM3y0CAL7accbvThwRAfDH9/I4429MHDUD4IzvpX/w5Rtn/I2JGTK8gs/tE76ljjN+NgDv4Lv9mMOJccbvSsyS4UV8J97tuzXO+F2JYyIA7+Iv9kVNLuOM3ykD8Di+/YeXOY4zfmfiOBl+wbd+eJnbOON3Jk+IAPyDb//VbS7jjN8hAvAjvvWr2xzGGb8jedIKwH/49l/dLm0AfPHbk6dEAP7Gt354uVTjjC8D0AHf/sPL7gfAF789eVoEoA++9UVNdwPgi78hecYMQCd8+3f13Bhn/A3Js2Toim99Y0d9AHzxzQA0xrd/aUPVOOO3Jc+RAfzcu301AfDFb0udFwEAf/7TbacD4IrfagYA/HxPt50aZ/zW1AUygL/4u/2VB8AXvzV1UQQA/EJPt1cyzvjrRQDAX/q7/eIC4Iu/PnXJCgD4S329u/wA+OK3pC6LAIBfzNPtpY4zvgwA+MW/219aAHzxW1JXRADAX+nT7cXGGb85dZUM4Dvzbn/xAHjiN6euiQCA7+TT7YUB8MVvSssAgO/00237OOM3pa+TAXx17/bNAPjiN6VviACAz/3ptir8RjMA4OuK35i+SQbw9cVvTN8SAQBfV/x1IgAx4GuMbwUAfL3w16Vv5wIAvn74a9N37AEAXzf8tem7uQCArx/+vACArxt+Q+aePQDg64bfkLmfCwD4+uHX2wMQA77G+LkAgK8Dfn1mLl8AwNcFvz7zYGEAYsDXGF8M+P7Hr1ssADMC4GuLLwZ8/+LXZR4WDsCMAPja4lsDvsb4YsD3D/6azH/LD0BGAHx98a0BX2N8a8DXGN8a8DXGtwZ8jfHtAz5PfOXw9gFfY3z7gM/8s323Bnwmf9LlMOC79IzLqwN+ge/qubj/ASZjdi6FYTkoAAAAAElFTkSuQmCC";

export function decodeBase64ToUint8Array(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(b64, 'base64');
  }
  const binaryString = atob(b64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
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
        js: ['adblock-service.js', 'content.js'],
        run_at: 'document_start'
      }
    ],
    action: {
      default_popup: 'popup.html',
      default_icon: {
        16: 'icons/icon16.png',
        32: 'icons/icon32.png',
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
      32: 'icons/icon32.png',
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
      home_grid_columns: 'default',
      default_video_quality: 'auto',
      custom_playback_speed: '1.0',
      auto_theater_mode: false,
      auto_captions_mode: 'default',
      focus_mode_cinema: false,
      collapse_comments_default: false,
      custom_keyboard_shortcuts: false,
      thumbnail_blur_amount: 12,
      watched_video_blur_level: 8,
      watched_video_opacity_level: 40,
      enable_custom_css: false,
      custom_css_rules: '',
      installed_at: Date.now()
    };
    chrome.storage.sync.set(defaultSettings);

    // Initialize usage stats tracking (starting with 0, tracking real data)
    const initialStats = {
      todayMinutes: 0,
      savedMinutes: 0,
      efficiency: 0,
      history: [
        { day: 'Mon', spent: 0, saved: 0 },
        { day: 'Tue', spent: 0, saved: 0 },
        { day: 'Wed', spent: 0, saved: 0 },
        { day: 'Thu', spent: 0, saved: 0 },
        { day: 'Fri', spent: 0, saved: 0 },
        { day: 'Sat', spent: 0, saved: 0 },
        { day: 'Today', spent: 0, saved: 0 }
      ],
      blocked: {
        feed: 0,
        shorts: 0,
        comments: 0,
        notifs: 0
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

    // Set custom CSS variables for watched videos
    if (settings.watched_video_blur_level) {
      root.style.setProperty('--yr-watched-blur', settings.watched_video_blur_level + 'px');
    }
    if (settings.watched_video_opacity_level) {
      root.style.setProperty('--yr-watched-opacity', (settings.watched_video_opacity_level / 100).toString());
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

  // ==========================================
  // Dedicated AdBlockService Module (DOM & Polymer Filter)
  // Specifically targets: ytd-ad-slot-renderer, ytd-promoted-video-renderer,
  // ytd-banner-promo-renderer, in-stream commercials, and bumpers.
  // ==========================================
  const AdBlockService = (function() {
    const MASTHEAD_SELECTORS = [
      '#masthead-ad',
      'ytd-banner-promo-renderer',
      'ytd-masthead-ad-v3-renderer',
      'ytd-video-masthead-ad-v3-renderer',
      'ytd-primetime-promo-renderer',
      '#billboard-ad'
    ];

    const BANNER_AND_FEED_SELECTORS = [
      'ytd-ad-slot-renderer',
      'ytd-statement-banner-renderer',
      '.ytd-in-feed-ad-layout-renderer',
      'ytd-action-companion-ad-renderer',
      '#player-ads',
      'ytd-companion-ad-renderer',
      '#companion',
      'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
      'ytd-display-ad-renderer',
      'ytd-merch-shelf-renderer',
      'ytd-product-carousel-renderer'
    ];

    const VIDEO_AND_OVERLAY_SELECTORS = [
      '.video-ads.ytp-ad-module',
      '.ytp-ad-module',
      '.ytp-ad-player-overlay',
      '.ytp-ad-player-overlay-layout',
      '.ytp-ad-player-overlay-skip-or-preview',
      '.ytp-ad-preview-container',
      '.ytp-ad-overlay-container',
      '.ytp-ad-image-overlay',
      '.ytp-ad-text-overlay',
      '.ytp-ad-action-interstitial',
      '.ytp-ad-bumper',
      '.ytp-ad-preview-text',
      '.ytp-paid-content-overlay'
    ];

    const SEARCH_AD_SELECTORS = [
      'ytd-search ytd-promoted-video-renderer',
      'ytd-search ytd-promoted-sparkles-web-renderer',
      'ytd-search ytd-ad-slot-renderer'
    ];

    const ALL_AD_SELECTORS = [
      ...MASTHEAD_SELECTORS,
      ...BANNER_AND_FEED_SELECTORS,
      ...VIDEO_AND_OVERLAY_SELECTORS,
      ...SEARCH_AD_SELECTORS
    ];

    const SKIP_BUTTON_SELECTORS = [
      '.ytp-ad-skip-button',
      '.ytp-ad-skip-button-modern',
      '.ytp-ad-skip-button-slot',
      '.ytp-skip-ad-button',
      'button.ytp-ad-skip-button-text',
      '.ytp-ad-skip-button-container button',
      '.ytp-ad-overlay-close-button',
      'button[id^="skip-button"]'
    ];

    let observer = null;
    let videoInterval = null;
    let stats = { totalBlocked: 0, lastBlockedAt: null };
    let allowedChannels = new Set();
    let adPlaying = false;
    let pendingRaf = null;

    function normalizeChannelId(str) {
      if (!str) return '';
      str = str.trim().toLowerCase();
      if (str.startsWith('@')) str = str.substring(1);
      return str;
    }

    function isCurrentChannelAllowlisted() {
      if (settings.adblock_enable_allowlist === false || allowedChannels.size === 0) return false;
      const path = window.location.pathname;
      let handle = null;
      let channelId = null;
      if (path.startsWith('/@')) handle = path.substring(2).split('/')[0];
      if (path.startsWith('/channel/')) channelId = path.split('/')[2];
      const metaId = document.querySelector('meta[itemprop="channelId"]')?.getAttribute('content');
      if (metaId) channelId = metaId;
      const ownerLink = document.querySelector('ytd-video-owner-renderer a[href*="/@"], ytd-video-owner-renderer a[href*="/channel/"], #owner #channel-name a, #channel-name a');
      if (ownerLink) {
        const href = ownerLink.getAttribute('href') || '';
        if (href.includes('/@')) handle = href.split('/@')[1]?.split('/')[0];
        if (href.includes('/channel/')) channelId = href.split('/channel/')[1]?.split('/')[0];
      }
      if (handle && allowedChannels.has(normalizeChannelId(handle))) return true;
      if (channelId && allowedChannels.has(normalizeChannelId(channelId))) return true;
      return false;
    }

    function getActiveAdQuery() {
      if (settings.master_switch === false || isCurrentChannelAllowlisted()) return '';

      if (settings.block_all_ads) {
        return ALL_AD_SELECTORS.join(',');
      }

      const active = [];
      if (settings.hide_masthead_ads) active.push(...MASTHEAD_SELECTORS);
      if (settings.hide_banner_ads) active.push(...BANNER_AND_FEED_SELECTORS);
      if (settings.block_video_instream_ads) active.push(...VIDEO_AND_OVERLAY_SELECTORS);
      if (settings.hide_search_sponsored_ads) active.push(...SEARCH_AD_SELECTORS);

      return active.join(',');
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['adblock_realtime_stats'], (res) => {
        if (res && res.adblock_realtime_stats) {
          stats = res.adblock_realtime_stats;
        }
      });
    }

    function notifyStats() {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        try {
          chrome.storage.local.set({ adblock_realtime_stats: stats });
        } catch(e) {}
      }
      try {
        window.dispatchEvent(new CustomEvent('yr-adblock-stats-updated', { detail: stats }));
      } catch(e) {}
    }

    function unhideAll() {
      try {
        const blocked = document.querySelectorAll('[data-yr-blocked="true"]');
        for (let i = 0; i < blocked.length; i++) {
          const el = blocked[i];
          el.style.removeProperty('visibility');
          el.style.removeProperty('display');
          el.style.removeProperty('height');
          el.style.removeProperty('min-height');
          el.style.removeProperty('max-height');
          el.style.removeProperty('width');
          el.style.removeProperty('min-width');
          el.style.removeProperty('max-width');
          el.style.removeProperty('margin');
          el.style.removeProperty('padding');
          el.style.removeProperty('border');
          el.style.removeProperty('overflow');
          el.style.removeProperty('position');
          el.style.removeProperty('pointer-events');
          delete el.dataset.yrBlocked;
        }
      } catch(e) {}
    }

    function hideElement(el) {
      if (isCurrentChannelAllowlisted()) return;
      if (!el || el.id === 'movie_player' || (el.tagName && el.tagName.toLowerCase() === 'video') || (el.classList && el.classList.contains('html5-video-player'))) return;
      if (el.dataset && el.dataset.yrBlocked === 'true') return;

      // Collapse parent grid/card containers completely using visibility: collapse, position: absolute, and zero-dimensions to eliminate empty DOM gaps
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

      // Also ensure parent rich grid item collapses completely to prevent blank space in Polymer rich grid
      const parentGridItem = wrapper.closest('ytd-rich-item-renderer, ytd-rich-section-renderer, ytd-item-section-renderer');
      if (parentGridItem && parentGridItem !== wrapper) {
        parentGridItem.style.setProperty('visibility', 'collapse', 'important');
        parentGridItem.style.setProperty('display', 'none', 'important');
        parentGridItem.style.setProperty('height', '0px', 'important');
        parentGridItem.style.setProperty('max-height', '0px', 'important');
        parentGridItem.style.setProperty('margin', '0px', 'important');
        parentGridItem.style.setProperty('padding', '0px', 'important');
        parentGridItem.style.setProperty('overflow', 'hidden', 'important');
        parentGridItem.style.setProperty('position', 'absolute', 'important');
        parentGridItem.dataset.yrBlocked = 'true';
      }

      stats.totalBlocked += 1;
      stats.lastBlockedAt = Date.now();
      notifyStats();
    }

    function scheduleDebouncedFilter() {
      if (pendingRaf) return;
      pendingRaf = window.requestAnimationFrame(function () {
        pendingRaf = null;
        filterNow();
      });
    }

    function filterNow() {
      if (typeof document === 'undefined') return;
      if (isCurrentChannelAllowlisted()) {
        unhideAll();
        return;
      }
      const query = getActiveAdQuery();
      if (!query) return;

      try {
        const els = document.querySelectorAll(query);
        for (let i = 0; i < els.length; i++) {
          hideElement(els[i]);
        }
      } catch (e) {}
      handleVideoAds();
    }

    function handleVideoAds() {
      if (isCurrentChannelAllowlisted()) return;
      if (settings.master_switch === false) return;
      if (settings.block_all_ads === false && settings.block_video_instream_ads === false) return;

      const moviePlayer = document.getElementById('movie_player');
      const video = document.querySelector('video.html5-main-video') || document.querySelector('video');
      if (!moviePlayer || !video) return;

      const isAdActive = moviePlayer.classList.contains('ad-showing') ||
                         moviePlayer.classList.contains('ad-interrupting') ||
                         document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay, .ytp-ad-player-overlay-layout') !== null;

      if (isAdActive) {
        adPlaying = true;

        // Immediately hide player overlay container to eliminate the temporary black screen flickering before video load
        const overlays = document.querySelectorAll(
          '.ytp-ad-player-overlay, .ytp-ad-player-overlay-layout, .ytp-ad-player-overlay-skip-or-preview, .ytp-ad-overlay-container, .ytp-ad-image-overlay, .ytp-ad-text-overlay, .ytp-ad-preview-container, .video-ads.ytp-ad-module, .ytp-ad-module, .ytp-ad-action-interstitial, .ytp-ad-persistent-progress-bar-container'
        );
        for (let o = 0; o < overlays.length; o++) {
          const ov = overlays[o];
          ov.style.setProperty('visibility', 'hidden', 'important');
          ov.style.setProperty('opacity', '0', 'important');
          ov.style.setProperty('pointer-events', 'none', 'important');
          ov.style.setProperty('display', 'none', 'important');
        }

        // Faster skip: invoke YouTube internal player skip method if available
        try {
          if (typeof moviePlayer.skipAd === 'function') {
            moviePlayer.skipAd();
          }
        } catch (e) {}

        // Immediate fast-forward and mute to eliminate ad playback duration
        try {
          video.muted = true;
          video.playbackRate = 16.0;
          if (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime < video.duration) {
            video.currentTime = video.duration - 0.001;
          }
        } catch (e) {}

        // Click all skip button variants immediately with synthetic mouse event
        for (let s = 0; s < SKIP_BUTTON_SELECTORS.length; s++) {
          const btn = document.querySelector(SKIP_BUTTON_SELECTORS[s]);
          if (btn && typeof btn.click === 'function') {
            try {
              btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            } catch(e) {}
            btn.click();
            stats.totalBlocked += 1;
            stats.lastBlockedAt = Date.now();
            notifyStats();
            break;
          }
        }

        // Prevent temporary black screen freeze: ensure video continues playback immediately without stall
        if (video.paused) {
          video.play().catch(function() {});
        }
      } else if (adPlaying) {
        adPlaying = false;
        try {
          video.muted = false;
          const targetSpeed = settings.custom_playback_speed ? parseFloat(settings.custom_playback_speed) : 1.0;
          video.playbackRate = !isNaN(targetSpeed) && targetSpeed > 0 ? targetSpeed : 1.0;
          if (video.paused) {
            video.play().catch(function() {});
          }
        } catch (e) {}
      }
    }

    function attachObserver() {
      if (observer) return;
      const root = document.documentElement || document.body;
      if (!root) return;

      observer = new MutationObserver((mutations) => {
        const query = getActiveAdQuery();
        if (!query) return;

        let requiresBatchScan = false;
        for (let i = 0; i < mutations.length; i++) {
          const mut = mutations[i];
          if (mut.type === 'childList') {
            const added = mut.addedNodes;
            for (let j = 0; j < added.length; j++) {
              const node = added[j];
              if (node.nodeType === 1) {
                // Direct match on added node for zero-delay hiding & collapse
                if (node.matches && node.matches(query)) {
                  hideElement(node);
                } else if (node.firstElementChild) {
                  // Direct match on immediate subtree
                  const subMatches = node.querySelectorAll(query);
                  if (subMatches.length > 0) {
                    for (let m = 0; m < subMatches.length; m++) {
                      hideElement(subMatches[m]);
                    }
                  } else {
                    requiresBatchScan = true;
                  }
                }
              }
            }
          } else if (mut.type === 'attributes') {
            const target = mut.target;
            if (target && target.classList && (target.classList.contains('ad-showing') || target.classList.contains('ad-interrupting'))) {
              handleVideoAds();
            }
          }
        }
        if (requiresBatchScan) {
          scheduleDebouncedFilter();
        }
      });

      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }

    function reEvaluateAll() {
      // 1. Unhide any previously hidden elements to allow settings toggles off to take effect instantly
      unhideAll();

      // 2. If ad blocking is enabled and channel not allowlisted, re-scan and collapse matching elements
      const query = getActiveAdQuery();
      if (query) {
        attachObserver();
        if (!videoInterval) {
          videoInterval = setInterval(handleVideoAds, 100);
        }
        try {
          const els = document.querySelectorAll(query);
          for (let i = 0; i < els.length; i++) {
            hideElement(els[i]);
          }
        } catch (e) {}
        handleVideoAds();
      } else {
        if (videoInterval) {
          clearInterval(videoInterval);
          videoInterval = null;
        }
      }
    }

    return {
      init: function() {
        attachObserver();
        if (!videoInterval) {
          videoInterval = setInterval(handleVideoAds, 100);
        }
        filterNow();
      },
      filterNow: filterNow,
      unhideAll: unhideAll,
      reEvaluateAll: reEvaluateAll,
      stop: function() {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        if (videoInterval) {
          clearInterval(videoInterval);
          videoInterval = null;
        }
        unhideAll();
      },
      updateSettings: function(newSettings) {
        if (newSettings.adblock_channel_allowlist) {
          const raw = Array.isArray(newSettings.adblock_channel_allowlist)
            ? newSettings.adblock_channel_allowlist
            : String(newSettings.adblock_channel_allowlist).split(',').flatMap(function(x) { return x.split(' '); });
          allowedChannels = new Set(raw.map(normalizeChannelId).filter(Boolean));
        }

        if (isCurrentChannelAllowlisted() || newSettings.master_switch === false) {
          this.stop();
          return;
        }

        const isAdBlockOn = newSettings.block_all_ads ||
                            newSettings.block_video_instream_ads ||
                            newSettings.hide_banner_ads ||
                            newSettings.hide_masthead_ads ||
                            newSettings.block_bumper_ads ||
                            newSettings.hide_search_sponsored_ads ||
                            newSettings.hide_instream_overlay_ads;
        if (isAdBlockOn) {
          this.init();
        } else {
          this.stop();
        }
      }
    };
  })();

  // Unified immediate re-evaluation of all UI rules upon settings change (no refresh needed)
  function evaluateAllUIRulesNow() {
    syncAttributes();
    AdBlockService.updateSettings(settings);
    AdBlockService.reEvaluateAll();
    handlePageNavigations();
    applyPlayerEnhancements();
    try {
      window.dispatchEvent(new CustomEvent('yr-rules-evaluated', { detail: { settings } }));
    } catch(e) {}
  }

  // Load from chrome.storage and listen to onChanged on both sync & local
  if (typeof chrome !== 'undefined' && chrome.storage) {
    if (chrome.storage.sync) {
      chrome.storage.sync.get(null, (items) => {
        settings = Object.assign({}, settings, items || {});
        evaluateAllUIRulesNow();
      });
    }

    if (chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' || area === 'local') {
          let hasChange = false;
          for (const [key, change] of Object.entries(changes)) {
            if (key === 'adblock_realtime_stats' || key === 'usage_stats') continue;
            settings[key] = change.newValue;
            hasChange = true;
          }
          if (hasChange) {
            // Immediate re-evaluation of all UI rules upon chrome.storage.onChanged events
            evaluateAllUIRulesNow();
          }
        }
      });
    }
  }

  // Instant cross-extension message listener for immediate UI reflections
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
      if (msg && msg.type === 'YOUTUBE_REFINED_SYNC_SETTINGS' && msg.settings) {
        settings = Object.assign({}, settings, msg.settings);
        evaluateAllUIRulesNow();
        sendResponse({ ok: true });
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

/* ==================== 0. AD BLOCKER & AD SHIELD ==================== */
/* Master Ad Shield - Universal Ad Hiding */
html[data-yr-active="true"][data-yr-block-all-ads="true"] #masthead-ad,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-masthead-ad-v3-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-video-masthead-ad-v3-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-primetime-promo-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] #billboard-ad,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-banner-promo-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-statement-banner-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytd-in-feed-ad-layout-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-ad-slot-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] #player-ads,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-companion-ad-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .video-ads.ytp-ad-module,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-player-overlay,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-player-overlay-layout,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-overlay-container,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-image-overlay,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-text-overlay,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-progress-list,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-search ytd-promoted-video-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-search ytd-promoted-sparkles-web-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-search ytd-ad-slot-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-paid-content-overlay,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-merch-shelf-renderer,
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-product-carousel-renderer {
  display: none !important;
}

/* Zero-gap container collapsing to eradicate blank white/black space in video grid */
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-rich-item-renderer:has(.ytd-in-feed-ad-layout-renderer),
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-rich-item-renderer:has(ytd-statement-banner-renderer),
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-rich-item-renderer:has(ytd-banner-promo-renderer),
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-rich-section-renderer:has(#masthead-ad),
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-rich-section-renderer:has(ytd-banner-promo-renderer),
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-rich-section-renderer:has(ytd-statement-banner-renderer),
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-rich-section-renderer:has(ytd-ad-slot-renderer),
html[data-yr-active="true"][data-yr-block-all-ads="true"] ytd-item-section-renderer:has(ytd-ad-slot-renderer),
html[data-yr-active="true"][data-yr-hide-banner-ads="true"] ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
html[data-yr-active="true"][data-yr-hide-banner-ads="true"] ytd-rich-item-renderer:has(.ytd-in-feed-ad-layout-renderer),
html[data-yr-active="true"][data-yr-hide-banner-ads="true"] ytd-rich-section-renderer:has(ytd-ad-slot-renderer),
html[data-yr-active="true"][data-yr-hide-masthead-ads="true"] ytd-rich-section-renderer:has(#masthead-ad),
html[data-yr-active="true"][data-yr-hide-masthead-ads="true"] ytd-rich-section-renderer:has(ytd-banner-promo-renderer),
[data-yr-blocked="true"],
ytd-rich-item-renderer:has([data-yr-blocked="true"]),
ytd-rich-section-renderer:has([data-yr-blocked="true"]),
ytd-item-section-renderer:has([data-yr-blocked="true"]) {
  visibility: collapse !important;
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  overflow: hidden !important;
  position: absolute !important;
  pointer-events: none !important;
}

/* Eliminates temporary black screen flickering before video load */
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-player-overlay,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-player-overlay-layout,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-player-overlay-skip-or-preview,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-overlay-container,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-image-overlay,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-text-overlay,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-preview-container,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .video-ads.ytp-ad-module,
html[data-yr-active="true"][data-yr-block-all-ads="true"] .ytp-ad-module,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .ytp-ad-player-overlay,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .ytp-ad-player-overlay-layout,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .ytp-ad-player-overlay-skip-or-preview,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .ytp-ad-overlay-container,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .video-ads.ytp-ad-module,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .ytp-ad-module {
  visibility: hidden !important;
  opacity: 0 !important;
  display: none !important;
  pointer-events: none !important;
}

/* Individual Ad Type Toggles */
html[data-yr-active="true"][data-yr-hide-masthead-ads="true"] #masthead-ad,
html[data-yr-active="true"][data-yr-hide-masthead-ads="true"] ytd-masthead-ad-v3-renderer,
html[data-yr-active="true"][data-yr-hide-masthead-ads="true"] ytd-video-masthead-ad-v3-renderer,
html[data-yr-active="true"][data-yr-hide-masthead-ads="true"] ytd-primetime-promo-renderer,
html[data-yr-active="true"][data-yr-hide-masthead-ads="true"] #billboard-ad,
html[data-yr-active="true"][data-yr-hide-masthead-ads="true"] ytd-banner-promo-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-banner-ads="true"] ytd-statement-banner-renderer,
html[data-yr-active="true"][data-yr-hide-banner-ads="true"] .ytd-in-feed-ad-layout-renderer,
html[data-yr-active="true"][data-yr-hide-banner-ads="true"] ytd-ad-slot-renderer,
html[data-yr-active="true"][data-yr-hide-banner-ads="true"] ytd-action-companion-ad-renderer,
html[data-yr-active="true"][data-yr-hide-banner-ads="true"] #player-ads {
  display: none !important;
}

html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .video-ads.ytp-ad-module,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .ytp-ad-player-overlay,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .ytp-ad-player-overlay-layout,
html[data-yr-active="true"][data-yr-block-video-instream-ads="true"] .ytp-ad-preview-container {
  display: none !important;
}

html[data-yr-active="true"][data-yr-block-bumper-ads="true"] .ytp-ad-bumper,
html[data-yr-active="true"][data-yr-block-bumper-ads="true"] .ytp-ad-preview-text {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-instream-overlay-ads="true"] .ytp-ad-overlay-container,
html[data-yr-active="true"][data-yr-hide-instream-overlay-ads="true"] .ytp-ad-image-overlay,
html[data-yr-active="true"][data-yr-hide-instream-overlay-ads="true"] .ytp-ad-text-overlay,
html[data-yr-active="true"][data-yr-hide-instream-overlay-ads="true"] .ytp-ad-action-interstitial {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-sidebar-companion-ads="true"] #player-ads,
html[data-yr-active="true"][data-yr-hide-sidebar-companion-ads="true"] ytd-companion-ad-renderer,
html[data-yr-active="true"][data-yr-hide-sidebar-companion-ads="true"] #companion,
html[data-yr-active="true"][data-yr-hide-sidebar-companion-ads="true"] ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"] {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-search-sponsored-ads="true"] ytd-search ytd-promoted-video-renderer,
html[data-yr-active="true"][data-yr-hide-search-sponsored-ads="true"] ytd-search ytd-promoted-sparkles-web-renderer,
html[data-yr-active="true"][data-yr-hide-search-sponsored-ads="true"] ytd-search ytd-ad-slot-renderer,
html[data-yr-active="true"][data-yr-hide-search-sponsored-ads="true"] ytd-search [layout*="promoted"] {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-paid-promotion-badge="true"] .ytp-paid-content-overlay,
html[data-yr-active="true"][data-yr-hide-paid-promotion-badge="true"] .ytp-paid-content-overlay-text {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-merch-product-shelves="true"] ytd-merch-shelf-renderer,
html[data-yr-active="true"][data-yr-hide-merch-product-shelves="true"] ytd-product-carousel-renderer,
html[data-yr-active="true"][data-yr-hide-merch-product-shelves="true"] ytd-shopping-drawer-renderer,
html[data-yr-active="true"][data-yr-hide-merch-product-shelves="true"] #offer-module {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-endscreen-promo-cards="true"] .ytp-ce-element.ytp-ce-website,
html[data-yr-active="true"][data-yr-hide-endscreen-promo-cards="true"] .ytp-ce-element.ytp-ce-merchandise {
  display: none !important;
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

html[data-yr-active="true"][data-yr-hide-home-explore-more-topics="true"] ytd-rich-section-renderer:has(#title:contains("Explore more topics")),
html[data-yr-active="true"][data-yr-hide-home-explore-more-topics="true"] ytd-reel-shelf-renderer:has(#title-text:contains("Explore more topics")),
html[data-yr-active="true"][data-yr-hide-home-explore-more-topics="true"] ytd-rich-section-renderer:has(yt-formatted-string:contains("Explore more topics")) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-home-most-relevant="true"] ytd-rich-section-renderer:has(#title:contains("Most relevant")),
html[data-yr-active="true"][data-yr-hide-home-most-relevant="true"] ytd-reel-shelf-renderer:has(#title-text:contains("Most relevant")),
html[data-yr-active="true"][data-yr-hide-home-most-relevant="true"] ytd-rich-section-renderer:has(yt-formatted-string:contains("Most relevant")) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-blur-dim-watched-videos="true"] ytd-rich-item-renderer:has(#progress),
html[data-yr-active="true"][data-yr-blur-dim-watched-videos="true"] ytd-video-renderer:has(#progress),
html[data-yr-active="true"][data-yr-blur-dim-watched-videos="true"] ytd-grid-video-renderer:has(#progress),
html[data-yr-active="true"][data-yr-blur-dim-watched-videos="true"] ytd-compact-video-renderer:has(#progress) {
  filter: blur(var(--yr-watched-blur, 8px)) opacity(var(--yr-watched-opacity, 0.4)) !important;
  transition: filter 0.25s ease, opacity 0.25s ease !important;
}
html[data-yr-active="true"][data-yr-blur-dim-watched-videos="true"] ytd-rich-item-renderer:has(#progress):hover,
html[data-yr-active="true"][data-yr-blur-dim-watched-videos="true"] ytd-video-renderer:has(#progress):hover,
html[data-yr-active="true"][data-yr-blur-dim-watched-videos="true"] ytd-grid-video-renderer:has(#progress):hover,
html[data-yr-active="true"][data-yr-blur-dim-watched-videos="true"] ytd-compact-video-renderer:has(#progress):hover {
  filter: none !important;
  opacity: 1 !important;
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

html[data-yr-active="true"][data-yr-hide-channel-join-button="true"] #sponsor-button,
html[data-yr-active="true"][data-yr-hide-channel-join-button="true"] ytd-button-renderer:has(#button[aria-label*="Join this channel"]),
html[data-yr-active="true"][data-yr-hide-channel-join-button="true"] ytd-button-renderer:has(#button[aria-label*="Join"]) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-share-clip-download-bar="true"] #top-level-buttons-computed > ytd-button-renderer:not(:first-child):not(:nth-child(2)),
html[data-yr-active="true"][data-yr-hide-share-clip-download-bar="true"] ytd-menu-renderer[menu-style="MULTI_PAGE_MENU_STYLE_TYPE_SYSTEM"] {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-video-transcript="true"] ytd-engagement-panel-section-list-renderer[target-id*="transcript"] {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-trending-explore-home="true"] ytd-rich-section-renderer:has(#title:contains("Trending")),
html[data-yr-active="true"][data-yr-hide-trending-explore-home="true"] ytd-rich-shelf-renderer:has(#title:contains("Trending")),
html[data-yr-active="true"][data-yr-hide-trending-explore-home="true"] ytd-browse[page-subtype="home"] ytd-shelf-renderer:has(#title:contains("Trending")) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-fundraisers-home="true"] ytd-rich-section-renderer:has(#donation-shelf),
html[data-yr-active="true"][data-yr-hide-fundraisers-home="true"] ytd-donation-shelf-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-shorts-sound-remix="true"] ytd-reel-player-overlay-renderer #sound-metadata,
html[data-yr-active="true"][data-yr-hide-shorts-sound-remix="true"] ytd-reel-player-overlay-renderer #remix-button {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-shorts-comments-panel="true"] ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"] {
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

html[data-yr-active="true"][data-yr-hide-sidebar-library-history="true"] ytd-guide-section-renderer:has(a[href*="/feed/history"]),
html[data-yr-active="true"][data-yr-hide-sidebar-library-history="true"] ytd-guide-section-renderer:has(a[href*="/playlist?list=WL"]) {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-sidebar-you-section="true"] ytd-guide-section-renderer:has(a[href*="/feed/you"]) {
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

html[data-yr-active="true"][data-yr-center-search-bar="true"] ytd-masthead #center.ytd-masthead {
  margin: 0 auto !important;
  max-width: 720px !important;
  flex: 1 !important;
}

html[data-yr-active="true"][data-yr-hide-user-avatar-menu="true"] ytd-masthead #end #avatar-btn,
html[data-yr-active="true"][data-yr-hide-user-avatar-menu="true"] ytd-topbar-menu-button-renderer:has(yt-img-shadow#avatar) {
  opacity: 0.15 !important;
  filter: grayscale(1) !important;
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

html[data-yr-active="true"][data-yr-hide-channel-search-results="true"] ytd-search ytd-channel-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-hide-search-playlists="true"] ytd-search ytd-playlist-renderer,
html[data-yr-active="true"][data-yr-hide-search-playlists="true"] ytd-search ytd-radio-renderer {
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

html[data-yr-active="true"][data-yr-hide-video-titles-until-hover="true"] #video-title,
html[data-yr-active="true"][data-yr-hide-video-titles-until-hover="true"] .ytd-rich-grid-media #video-title {
  filter: blur(4px) !important;
  transition: filter 0.2s ease !important;
}
html[data-yr-active="true"][data-yr-hide-video-titles-until-hover="true"]:hover #video-title,
html[data-yr-active="true"][data-yr-hide-video-titles-until-hover="true"]:hover .ytd-rich-grid-media #video-title {
  filter: none !important;
}

html[data-yr-active="true"][data-yr-hide-channel-avatars-feed="true"] #avatar_container,
html[data-yr-active="true"][data-yr-hide-channel-avatars-feed="true"] ytd-rich-grid-media #avatar-link {
  display: none !important;
}

html[data-yr-active="true"][data-yr-disable-animated-preview-on-hover="true"] #video-preview,
html[data-yr-active="true"][data-yr-disable-animated-preview-on-hover="true"] ytd-moving-thumbnail-renderer {
  display: none !important;
}

html[data-yr-active="true"][data-yr-greyscale-site-after-limit="true"] body,
html[data-yr-active="true"][data-yr-greyscale-site-after-limit="true"] ytd-app {
  filter: grayscale(100%) !important;
}

html[data-yr-active="true"][data-yr-hide-video-duration-badges="true"] ytd-thumbnail-overlay-time-status-renderer,
html[data-yr-active="true"][data-yr-hide-video-duration-badges="true"] badge-shape {
  display: none !important;
}
`;
}

export function generateAdBlockServiceJs(): string {
  return `/**
 * AdBlockService - YouTube Refined High-Performance Ad-Blocking Module (adblock-service.js)
 * Targets YouTube DOM elements like:
 * - 'ytd-ad-slot-renderer'
 * - 'ytd-promoted-video-renderer'
 * - 'ytd-banner-promo-renderer'
 * - 'ytd-statement-banner-renderer'
 * - 'ytd-in-feed-ad-layout-renderer'
 * - 'ytd-promoted-sparkles-web-renderer'
 * - '#masthead-ad', 'ytd-masthead-ad-v3-renderer', 'ytd-video-masthead-ad-v3-renderer'
 * - '#player-ads', 'ytd-companion-ad-renderer'
 * - In-stream video player commercial elements (.ad-showing, .ad-interrupting)
 */

(function (window) {
  'use strict';

  var TARGET_AD_SELECTORS = [
    'ytd-ad-slot-renderer',
    'ytd-promoted-video-renderer',
    'ytd-banner-promo-renderer',
    '#masthead-ad',
    'ytd-masthead-ad-v3-renderer',
    'ytd-video-masthead-ad-v3-renderer',
    'ytd-primetime-promo-renderer',
    '#billboard-ad',
    'ytd-statement-banner-renderer',
    '.ytd-in-feed-ad-layout-renderer',
    'ytd-action-companion-ad-renderer',
    'ytd-search ytd-promoted-video-renderer',
    'ytd-search ytd-promoted-sparkles-web-renderer',
    'ytd-search ytd-ad-slot-renderer',
    '#player-ads',
    'ytd-companion-ad-renderer',
    '#companion',
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
    '.ytp-ad-overlay-container',
    '.ytp-ad-image-overlay',
    '.ytp-ad-text-overlay',
    '.ytp-ad-action-interstitial',
    '.ytp-ad-bumper',
    '.ytp-paid-content-overlay',
    'ytd-merch-shelf-renderer',
    'ytd-product-carousel-renderer'
  ];

  var SKIP_BUTTON_SELECTORS = [
    '.ytp-ad-skip-button',
    '.ytp-ad-skip-button-modern',
    '.ytp-ad-skip-button-slot',
    '.ytp-skip-ad-button',
    'button.ytp-ad-skip-button-text',
    '.ytp-ad-overlay-close-button'
  ];

  var styleTag = null;
  var observer = null;
  var videoMonitorInterval = null;
  var isRunning = false;
  var pendingRaf = null;

  var stats = {
    totalBlocked: 0,
    bannersBlocked: 0,
    videoAdsSkipped: 0,
    searchAdsBlocked: 0,
    lastBlockedAt: null
  };

  var config = {
    enabled: false,
    blockAllAds: false,
    blockVideoAds: false,
    hideBannerAds: false,
    hideMastheadAds: false,
    hideSearchAds: false,
    hideOverlays: false
  };

  function injectDeclarativeStyles() {
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'yr-adblock-service-styles';
      var selectors = TARGET_AD_SELECTORS.join(',\\n');
      styleTag.textContent = selectors + ' { display: none !important; visibility: hidden !important; height: 0 !important; min-height: 0 !important; pointer-events: none !important; } .video-ads.ytp-ad-module { visibility: hidden !important; }';
      (document.head || document.documentElement).appendChild(styleTag);
    }
  }

  function removeDeclarativeStyles() {
    if (styleTag && styleTag.parentNode) {
      styleTag.parentNode.removeChild(styleTag);
      styleTag = null;
    }
  }

  function hideElement(element, selector) {
    if (!element || (element.dataset && element.dataset.yrBlocked === 'true')) {
      return;
    }
    element.style.setProperty('display', 'none', 'important');
    element.style.setProperty('visibility', 'hidden', 'important');
    element.style.setProperty('height', '0px', 'important');
    if (element.dataset) {
      element.dataset.yrBlocked = 'true';
    }

    stats.totalBlocked++;
    stats.lastBlockedAt = Date.now();

    if (selector.indexOf('banner') !== -1 || selector.indexOf('masthead') !== -1 || selector.indexOf('slot') !== -1) {
      stats.bannersBlocked++;
    } else if (selector.indexOf('promoted') !== -1) {
      stats.searchAdsBlocked++;
    }
  }

  function filterNow() {
    for (var i = 0; i < TARGET_AD_SELECTORS.length; i++) {
      var sel = TARGET_AD_SELECTORS[i];
      try {
        var elements = document.querySelectorAll(sel);
        for (var j = 0; j < elements.length; j++) {
          hideElement(elements[j], sel);
        }
      } catch (err) {}
    }
    handleVideoAds();
  }

  function handleVideoAds() {
    var moviePlayer = document.getElementById('movie_player');
    var video = document.querySelector('video.html5-main-video');
    if (!moviePlayer || !video) return;

    var isAdActive = moviePlayer.classList.contains('ad-showing') ||
                     moviePlayer.classList.contains('ad-interrupting') ||
                     document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay') !== null;

    if (isAdActive) {
      try {
        video.muted = true;
        video.playbackRate = 16.0;
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = video.duration;
        }
      } catch (e) {}

      for (var s = 0; s < SKIP_BUTTON_SELECTORS.length; s++) {
        var btn = document.querySelector(SKIP_BUTTON_SELECTORS[s]);
        if (btn && typeof btn.click === 'function') {
          btn.click();
          stats.videoAdsSkipped++;
          stats.totalBlocked++;
          break;
        }
      }
    }
  }

  function scheduleDebouncedFilter() {
    if (pendingRaf) return;
    pendingRaf = window.requestAnimationFrame(function () {
      pendingRaf = null;
      filterNow();
    });
  }

  function attachObserver() {
    if (observer) return;
    observer = new MutationObserver(function (mutations) {
      var requiresFilter = false;
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.type === 'childList') {
          for (var n = 0; n < mutation.addedNodes.length; n++) {
            var node = mutation.addedNodes[n];
            if (node.nodeType === 1) {
              for (var s = 0; s < TARGET_AD_SELECTORS.length; s++) {
                var sel = TARGET_AD_SELECTORS[s];
                if (node.matches && node.matches(sel)) {
                  hideElement(node, sel);
                } else if (node.firstElementChild) {
                  requiresFilter = true;
                }
              }
            }
          }
        } else if (mutation.type === 'attributes') {
          var target = mutation.target;
          if (target && target.classList && (target.classList.contains('ad-showing') || target.classList.contains('ad-interrupting'))) {
            handleVideoAds();
          }
        }
      }

      if (requiresFilter) {
        scheduleDebouncedFilter();
      }
    });

    var root = document.documentElement || document.body;
    if (root) {
      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  function start() {
    if (isRunning) {
      filterNow();
      return;
    }
    isRunning = true;
    injectDeclarativeStyles();
    filterNow();
    attachObserver();

    if (!videoMonitorInterval) {
      videoMonitorInterval = window.setInterval(handleVideoAds, 200);
    }
  }

  function stop() {
    isRunning = false;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (videoMonitorInterval) {
      window.clearInterval(videoMonitorInterval);
      videoMonitorInterval = null;
    }
    if (pendingRaf) {
      window.cancelAnimationFrame(pendingRaf);
      pendingRaf = null;
    }
    removeDeclarativeStyles();
  }

  function updateSettings(settings) {
    if (!settings) return;
    var isMasterOn = settings.master_switch !== false;
    var isAdBlockActive = isMasterOn && (
      settings.block_all_ads ||
      settings.block_video_instream_ads ||
      settings.hide_banner_ads ||
      settings.hide_masthead_ads ||
      settings.hide_search_sponsored_ads ||
      settings.hide_instream_overlay_ads ||
      settings.block_bumper_ads
    );

    config.enabled = isAdBlockActive;
    config.blockAllAds = !!settings.block_all_ads;
    config.blockVideoAds = !!settings.block_video_instream_ads;
    config.hideBannerAds = !!settings.hide_banner_ads;
    config.hideMastheadAds = !!settings.hide_masthead_ads;
    config.hideSearchAds = !!settings.hide_search_sponsored_ads;
    config.hideOverlays = !!settings.hide_instream_overlay_ads;

    if (config.enabled) {
      start();
    } else {
      stop();
    }
  }

  function init(settings) {
    updateSettings(settings);
  }

  window.AdBlockService = {
    init: init,
    start: start,
    stop: stop,
    updateSettings: updateSettings,
    filterNow: filterNow,
    handleVideoAds: handleVideoAds,
    getStats: function () {
      return Object.assign({}, stats);
    },
    resetStats: function () {
      stats.totalBlocked = 0;
      stats.bannersBlocked = 0;
      stats.videoAdsSkipped = 0;
      stats.searchAdsBlocked = 0;
      stats.lastBlockedAt = null;
    }
  };

  // Immediate first-pass style injection if early document state
  if (document.head || document.documentElement) {
    injectDeclarativeStyles();
  }
})(window);
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
          <div class="brand-title-wrap">
            <h1 class="title">YouTube Refined</h1>
            <!-- Small, non-intrusive stats badge in extension popup displaying blocked ads in real-time -->
            <div id="popup-adblock-badge" class="adblock-stats-badge" title="Live ads blocked by AdBlockService observer">
              <span class="adblock-badge-icon">🛡️</span>
              <span id="popup-adblock-count">0</span>
              <span class="adblock-badge-label">ads</span>
            </div>
          </div>
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
      <button id="tab-btn-adblock" class="main-tab-btn">
        <span>🛡️ AdBlock & Allowlist</span>
        <span class="badge-mini">Shield</span>
      </button>
    </div>

    <!-- TAB 1: FEATURES & TOGGLES -->
    <div id="features-tab-content">
      <div class="search-box">
        <input type="text" id="popup-search" placeholder="Search settings (e.g. focus mode, comments, 4k)...">
      </div>

      <div class="category-tabs" id="category-tabs">
        <button class="cat-pill active" data-cat="all">All</button>
        <button class="cat-pill" data-cat="ads">🛡️ Ads</button>
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

    <!-- TAB 2: DEDICATED ADBLOCK SHIELD & CREATOR ALLOWLIST -->
    <div id="adblock-tab-content" style="display: none;">
      <!-- Master Shield Status Card -->
      <div class="adblock-hero-card">
        <div class="adblock-hero-top">
          <div class="adblock-hero-icon">🛡️</div>
          <div class="adblock-hero-text">
            <h3>YouTube AdBlock Shield</h3>
            <p id="adblock-status-desc">Active • Zero-Latency Ad Stripping</p>
          </div>
          <label class="switch mini">
            <input type="checkbox" id="adblock-hero-master-toggle" checked>
            <span class="slider"></span>
          </label>
        </div>
        <div class="adblock-kpis">
          <div class="adblock-kpi">
            <span class="kpi-num" id="stat-total-blocked">0</span>
            <span class="kpi-lbl">Total Blocked</span>
          </div>
          <div class="adblock-kpi">
            <span class="kpi-num" id="stat-video-skipped">0</span>
            <span class="kpi-lbl">Video Ads (0ms)</span>
          </div>
          <div class="adblock-kpi">
            <span class="kpi-num" id="stat-banners-hidden">0</span>
            <span class="kpi-lbl">Banners Hidden</span>
          </div>
        </div>
      </div>

      <!-- Granular Commercial Filters -->
      <div class="adblock-section-heading">Granular Shield Filters</div>
      <div class="adblock-toggle-list">
        <div class="adblock-row">
          <div class="adblock-row-info">
            <strong>In-Stream Video Ads (0ms Fast-Skip)</strong>
            <span>Instantly skips pre-roll & mid-roll commercials</span>
          </div>
          <label class="switch mini">
            <input type="checkbox" id="adblock-toggle-video">
            <span class="slider"></span>
          </label>
        </div>
        <div class="adblock-row">
          <div class="adblock-row-info">
            <strong>Home Masthead Billboard Ads</strong>
            <span>Eliminates massive top hero promos and billboards</span>
          </div>
          <label class="switch mini">
            <input type="checkbox" id="adblock-toggle-masthead">
            <span class="slider"></span>
          </label>
        </div>
        <div class="adblock-row">
          <div class="adblock-row-info">
            <strong>In-Feed Commercial Cards</strong>
            <span>Hides sponsored video slots and banner promos</span>
          </div>
          <label class="switch mini">
            <input type="checkbox" id="adblock-toggle-banners">
            <span class="slider"></span>
          </label>
        </div>
        <div class="adblock-row">
          <div class="adblock-row-info">
            <strong>6-Second Bumper Ads</strong>
            <span>Bypasses unskippable bumper ad segments</span>
          </div>
          <label class="switch mini">
            <input type="checkbox" id="adblock-toggle-bumpers">
            <span class="slider"></span>
          </label>
        </div>
        <div class="adblock-row">
          <div class="adblock-row-info">
            <strong>Search Sponsored Results</strong>
            <span>Cleans promoted video ads from search queries</span>
          </div>
          <label class="switch mini">
            <input type="checkbox" id="adblock-toggle-search">
            <span class="slider"></span>
          </label>
        </div>
        <div class="adblock-row">
          <div class="adblock-row-info">
            <strong>Video Overlay Banners & Merch</strong>
            <span>Removes bottom-third popups and merch shelves</span>
          </div>
          <label class="switch mini">
            <input type="checkbox" id="adblock-toggle-overlays">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Creator Exemption Allowlist Section -->
      <div class="adblock-allowlist-card">
        <div class="allowlist-header">
          <div class="allowlist-title-wrap">
            <span class="allowlist-icon">❤️</span>
            <div>
              <strong>Creator Support Allowlist</strong>
              <p>Exempt favorite creators so ads play to support them</p>
            </div>
          </div>
          <label class="switch mini">
            <input type="checkbox" id="toggle-enable-allowlist" checked>
            <span class="slider"></span>
          </label>
        </div>

        <div class="allowlist-input-row">
          <input type="text" id="allowlist-input" placeholder="Channel ID or @handle (e.g. @mkbhd)">
          <button id="allowlist-add-btn">Add</button>
        </div>

        <div id="allowlist-chips-container" class="allowlist-chips">
          <!-- Dynamically populated with allowlisted creator tags -->
        </div>
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

.brand-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.adblock-stats-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
  line-height: 1.3;
}

.adblock-badge-icon {
  font-size: 10px;
}

.adblock-badge-label {
  font-size: 8.5px;
  font-weight: 500;
  color: rgba(52, 211, 153, 0.85);
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

/* ==================== DEDICATED ADBLOCK TAB STYLES ==================== */
#adblock-tab-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 2px;
}

.adblock-hero-card {
  background: linear-gradient(135deg, #131d1a, #0c1512);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.adblock-hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.adblock-hero-icon {
  font-size: 20px;
}

.adblock-hero-text h3 {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
}

.adblock-hero-text p {
  font-size: 10px;
  color: #34d399;
}

.adblock-kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: rgba(0,0,0,0.35);
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}

.adblock-kpi {
  text-align: center;
}

.kpi-num {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: #34d399;
  letter-spacing: -0.5px;
}

.kpi-lbl {
  display: block;
  font-size: 8.5px;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
}

.adblock-section-heading {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-left: 2px;
}

.adblock-toggle-list {
  background: #151720;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  overflow: hidden;
}

.adblock-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.adblock-row:last-child {
  border-bottom: none;
}

.adblock-row-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.adblock-row-info strong {
  font-size: 11px;
  color: #ffffff;
}

.adblock-row-info span {
  font-size: 9.5px;
  color: #9ca3af;
}

.adblock-allowlist-card {
  background: #151720;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.allowlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.allowlist-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.allowlist-icon {
  font-size: 16px;
}

.allowlist-title-wrap strong {
  font-size: 11.5px;
  color: #ffffff;
  display: block;
}

.allowlist-title-wrap p {
  font-size: 9.5px;
  color: #9ca3af;
}

.allowlist-input-row {
  display: flex;
  gap: 6px;
}

.allowlist-input-row input {
  flex: 1;
  background: #1a1d26;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 6px 10px;
  color: #ffffff;
  font-size: 11px;
  outline: none;
}
.allowlist-input-row input:focus {
  border-color: #34d399;
}

.allowlist-input-row button {
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.allowlist-input-row button:hover {
  background: #059669;
}

.allowlist-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  min-height: 24px;
}

.allowlist-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 6px;
}

.allowlist-chip-remove {
  cursor: pointer;
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  border: none;
  background: transparent;
  padding: 0 1px;
  line-height: 1;
}
.allowlist-chip-remove:hover {
  color: #ef4444;
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
  const tabBtnAdblock = document.getElementById('tab-btn-adblock');
  const featuresContent = document.getElementById('features-tab-content');
  const adblockContent = document.getElementById('adblock-tab-content');

  // AdBlock Tab Controls
  const heroMasterToggle = document.getElementById('adblock-hero-master-toggle');
  const toggleVideo = document.getElementById('adblock-toggle-video');
  const toggleMasthead = document.getElementById('adblock-toggle-masthead');
  const toggleBanners = document.getElementById('adblock-toggle-banners');
  const toggleBumpers = document.getElementById('adblock-toggle-bumpers');
  const toggleSearch = document.getElementById('adblock-toggle-search');
  const toggleOverlays = document.getElementById('adblock-toggle-overlays');
  const toggleEnableAllowlist = document.getElementById('toggle-enable-allowlist');
  const allowlistInput = document.getElementById('allowlist-input');
  const allowlistAddBtn = document.getElementById('allowlist-add-btn');
  const allowlistChipsContainer = document.getElementById('allowlist-chips-container');

  // Metrics
  const statTotalBlocked = document.getElementById('stat-total-blocked');
  const statVideoSkipped = document.getElementById('stat-video-skipped');
  const statBannersHidden = document.getElementById('stat-banners-hidden');
  const popupAdblockCount = document.getElementById('popup-adblock-count');

  let currentCategory = 'all';
  let searchQuery = '';
  let storageData = {};
  let allowlist = ['@mkbhd', '@veritasium'];

  function normalizeChannel(str) {
    if (!str) return '';
    str = str.trim().toLowerCase();
    if (str.startsWith('@')) str = str.substring(1);
    return str;
  }

  // Instantaneous setting save + active tab broadcast
  function saveAndBroadcast(key, val) {
    storageData[key] = val;
    const up = {};
    up[key] = val;
    if (typeof chrome !== 'undefined') {
      if (chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set(up);
      }
      if (chrome.tabs && chrome.tabs.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'YOUTUBE_REFINED_SYNC_SETTINGS',
              settings: storageData
            }).catch(() => {});
          }
        });
      }
    }
  }

  function updateAdblockControls() {
    if (heroMasterToggle) heroMasterToggle.checked = storageData.block_all_ads !== false;
    if (toggleVideo) toggleVideo.checked = !!storageData.block_video_instream_ads;
    if (toggleMasthead) toggleMasthead.checked = !!storageData.hide_masthead_ads;
    if (toggleBanners) toggleBanners.checked = !!storageData.hide_banner_ads;
    if (toggleBumpers) toggleBumpers.checked = !!storageData.block_bumper_ads;
    if (toggleSearch) toggleSearch.checked = !!storageData.hide_search_sponsored_ads;
    if (toggleOverlays) toggleOverlays.checked = !!storageData.hide_instream_overlay_ads;
    if (toggleEnableAllowlist) toggleEnableAllowlist.checked = storageData.adblock_enable_allowlist !== false;
  }

  function renderAllowlistChips() {
    if (!allowlistChipsContainer) return;
    allowlistChipsContainer.innerHTML = '';
    if (allowlist.length === 0) {
      allowlistChipsContainer.innerHTML = '<span style="color:#6b7280; font-size:10px;">No channels allowlisted yet.</span>';
      return;
    }
    allowlist.forEach((channel) => {
      const chip = document.createElement('span');
      chip.className = 'allowlist-chip';
      chip.innerHTML = \`
        <span>@\${channel}</span>
        <button class="allowlist-chip-remove" data-channel="\${channel}" title="Remove exemption">✕</button>
      \`;
      chip.querySelector('.allowlist-chip-remove').addEventListener('click', (e) => {
        const c = e.target.getAttribute('data-channel');
        allowlist = allowlist.filter(x => x !== c);
        saveAndBroadcast('adblock_channel_allowlist', allowlist);
        renderAllowlistChips();
      });
      allowlistChipsContainer.appendChild(chip);
    });
  }

  function updateAdStats(stats) {
    if (!stats) return;
    const total = stats.totalBlocked || 0;
    if (popupAdblockCount) popupAdblockCount.textContent = total;
    if (statTotalBlocked) statTotalBlocked.textContent = total;
    if (statVideoSkipped) statVideoSkipped.textContent = stats.videoAdsSkipped || 0;
    if (statBannersHidden) statBannersHidden.textContent = stats.bannersBlocked || (stats.mastheadBlocked || 0);
  }

  // Load storage
  if (typeof chrome !== 'undefined' && chrome.storage) {
    if (chrome.storage.sync) {
      chrome.storage.sync.get(null, (data) => {
        storageData = data || {};
        masterSwitch.checked = storageData.master_switch !== false;
        if (storageData.adblock_channel_allowlist) {
          const raw = Array.isArray(storageData.adblock_channel_allowlist)
            ? storageData.adblock_channel_allowlist
            : String(storageData.adblock_channel_allowlist).split(',').flatMap(x => x.split(' '));
          allowlist = raw.map(normalizeChannel).filter(Boolean);
        }
        renderList();
        updateAdblockControls();
        renderAllowlistChips();
      });
    }

    if (chrome.storage.local) {
      chrome.storage.local.get(['adblock_realtime_stats'], (res) => {
        if (res && res.adblock_realtime_stats) {
          updateAdStats(res.adblock_realtime_stats);
        }
      });

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.adblock_realtime_stats) {
          updateAdStats(changes.adblock_realtime_stats.newValue);
        }
      });
    }
  } else {
    POPUP_SETTINGS.forEach(s => { storageData[s.id] = s.defaultEnabled; });
    renderList();
    updateAdblockControls();
    renderAllowlistChips();
  }

  // Tab switching
  if (tabBtnFeatures && tabBtnAdblock) {
    tabBtnFeatures.addEventListener('click', () => {
      tabBtnFeatures.classList.add('active');
      tabBtnAdblock.classList.remove('active');
      featuresContent.style.display = 'block';
      adblockContent.style.display = 'none';
    });

    tabBtnAdblock.addEventListener('click', () => {
      tabBtnAdblock.classList.add('active');
      tabBtnFeatures.classList.remove('active');
      featuresContent.style.display = 'none';
      adblockContent.style.display = 'flex';
      updateAdblockControls();
      renderAllowlistChips();
    });
  }

  // AdBlock Tab Toggle Handlers
  if (heroMasterToggle) {
    heroMasterToggle.addEventListener('change', (e) => {
      const checked = e.target.checked;
      saveAndBroadcast('block_all_ads', checked);
      renderList();
    });
  }
  if (toggleVideo) {
    toggleVideo.addEventListener('change', (e) => {
      saveAndBroadcast('block_video_instream_ads', e.target.checked);
      renderList();
    });
  }
  if (toggleMasthead) {
    toggleMasthead.addEventListener('change', (e) => {
      saveAndBroadcast('hide_masthead_ads', e.target.checked);
      renderList();
    });
  }
  if (toggleBanners) {
    toggleBanners.addEventListener('change', (e) => {
      saveAndBroadcast('hide_banner_ads', e.target.checked);
      renderList();
    });
  }
  if (toggleBumpers) {
    toggleBumpers.addEventListener('change', (e) => {
      saveAndBroadcast('block_bumper_ads', e.target.checked);
      renderList();
    });
  }
  if (toggleSearch) {
    toggleSearch.addEventListener('change', (e) => {
      saveAndBroadcast('hide_search_sponsored_ads', e.target.checked);
      renderList();
    });
  }
  if (toggleOverlays) {
    toggleOverlays.addEventListener('change', (e) => {
      saveAndBroadcast('hide_instream_overlay_ads', e.target.checked);
      renderList();
    });
  }
  if (toggleEnableAllowlist) {
    toggleEnableAllowlist.addEventListener('change', (e) => {
      saveAndBroadcast('adblock_enable_allowlist', e.target.checked);
    });
  }

  // Allowlist Addition
  function handleAddAllowlistChannel() {
    if (!allowlistInput) return;
    const val = normalizeChannel(allowlistInput.value);
    if (!val) return;
    if (!allowlist.includes(val)) {
      allowlist.push(val);
      saveAndBroadcast('adblock_channel_allowlist', allowlist);
      renderAllowlistChips();
    }
    allowlistInput.value = '';
  }

  if (allowlistAddBtn) {
    allowlistAddBtn.addEventListener('click', handleAddAllowlistChannel);
  }
  if (allowlistInput) {
    allowlistInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddAllowlistChannel();
      }
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
          saveAndBroadcast(item.id, checked);
          updateAdblockControls();
        });
      }

      const select = row.querySelector('select');
      if (select) {
        select.addEventListener('change', (e) => {
          const sVal = e.target.value;
          saveAndBroadcast(item.id, sVal);
        });
      }

      listContainer.appendChild(row);
    });
  }

  // Master switch
  masterSwitch.addEventListener('change', () => {
    const isChecked = masterSwitch.checked;
    saveAndBroadcast('master_switch', isChecked);
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
- **AdBlock & Commercial Shield**: Blocks in-stream video commercials with 0ms fast-skip, removes home masthead ads, collapses banner ads, and suppresses sponsored search results.
- **Zero-Gap Layout Collapse**: Uses \`visibility: collapse !important;\` and container zeroing to eliminate empty DOM gaps and blank boxes in the video grid.
- **Black-Screen Flicker Elimination**: Immediately hides player overlay containers (\`.ytp-ad-player-overlay\`) and accelerates ad transitions to prevent black pauses.
- **Creator Exemption Allowlist**: Whitelist your favorite creators (\`@handle\` or channel ID) so their channels stay fully monetized while all other ads remain blocked.
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
  <circle cx="92" cy="36" r="10" fill="#10b981" stroke="#ffffff" stroke-width="2" />
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
      name: 'adblock-service.js',
      path: 'adblock-service.js',
      type: 'javascript',
      content: generateAdBlockServiceJs(),
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

  // Package true binary PNG icons for Chrome Extension Manifest V3 compliance
  zip.file('icons/icon16.png', decodeBase64ToUint8Array(BASE64_ICON16));
  zip.file('icons/icon32.png', decodeBase64ToUint8Array(BASE64_ICON32));
  zip.file('icons/icon48.png', decodeBase64ToUint8Array(BASE64_ICON48));
  zip.file('icons/icon128.png', decodeBase64ToUint8Array(BASE64_ICON128));
  zip.file('icons/icon.svg', generateIconSvg());

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
