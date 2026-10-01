/**
 * AdBlockService
 * Production-grade, high-performance YouTube Ad-Blocking & Shield Engine.
 * 
 * Specifically targets YouTube Polymer elements such as:
 * - 'ytd-ad-slot-renderer' (In-feed ads, search ads, and video grid sponsored slots)
 * - 'ytd-promoted-video-renderer' (Promoted video suggestions and search results)
 * - 'ytd-banner-promo-renderer' (Masthead hero ads and billboard promo banners)
 * - 'ytd-statement-banner-renderer', 'ytd-in-feed-ad-layout-renderer'
 * - 'ytd-promoted-sparkles-web-renderer', '#player-ads', 'ytd-companion-ad-renderer'
 * - Video in-stream ads (.ad-showing, .ad-interrupting, .ytp-ad-module)
 */

declare const chrome: any;

export interface AdBlockConfig {
  enabled: boolean;
  blockAllAds?: boolean;
  blockVideoAds?: boolean;
  hideBannerAds?: boolean;
  hideMastheadAds?: boolean;
  blockBumperAds?: boolean;
  hideSearchAds?: boolean;
  hideOverlays?: boolean;
  hideMerch?: boolean;
  enableAllowlist?: boolean;
  allowedChannels?: string[];
  onAdBlocked?: (selector: string, element: Element) => void;
  onAllowlistExemption?: (channelInfo: string) => void;
}

export interface AdBlockStats {
  totalBlocked: number;
  bannersBlocked: number;
  videoAdsSkipped: number;
  mastheadBlocked: number;
  bumpersBypassed: number;
  searchAdsBlocked: number;
  lastBlockedAt: number | null;
}

export function normalizeChannelIdentifier(input: string): string {
  if (!input) return '';
  let str = input.trim().toLowerCase();
  try {
    if (str.includes('youtube.com/')) {
      const url = new URL(str.startsWith('http') ? str : `https://${str}`);
      str = url.pathname.replace(/^\/+/, '');
      if (str.startsWith('@')) return str.substring(1);
      if (str.startsWith('channel/')) return str.replace('channel/', '');
      if (str.startsWith('c/')) return str.replace('c/', '');
      if (str.startsWith('user/')) return str.replace('user/', '');
      return str;
    }
  } catch (e) {}

  if (str.startsWith('@')) {
    str = str.substring(1);
  }
  return str.trim();
}

export const AD_TARGETS_MAP = {
  // Banner & display commercial units
  bannerAds: [
    'ytd-ad-slot-renderer',
    'ytd-statement-banner-renderer',
    '.ytd-in-feed-ad-layout-renderer',
    'ytd-action-companion-ad-renderer',
    '#player-ads',
    'ytd-companion-ad-renderer',
    '#companion',
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
    'ytd-display-ad-renderer'
  ],

  // Video in-stream pre-roll and mid-roll commercials (Do not include player state classes like .ad-showing)
  videoAds: [
    '.video-ads.ytp-ad-module',
    '.ytp-ad-player-overlay',
    '.ytp-ad-player-overlay-layout',
    '.ytp-ad-preview-container',
    '.ytp-ad-overlay-container',
    '.ytp-ad-image-overlay',
    '.ytp-ad-text-overlay',
    '.ytp-ad-action-interstitial'
  ],

  // Masthead hero billboards at top of home feed
  mastheadAds: [
    '#masthead-ad',
    'ytd-banner-promo-renderer',
    'ytd-masthead-ad-v3-renderer',
    'ytd-video-masthead-ad-v3-renderer',
    'ytd-primetime-promo-renderer',
    '#billboard-ad'
  ],

  // 6-second short unskippable bumper ads
  bumperAds: [
    '.ytp-ad-bumper',
    '.ytp-ad-preview-text',
    'video.html5-main-video[src*="bumper"]'
  ],

  // Search results sponsored listings
  searchAds: [
    'ytd-search ytd-promoted-video-renderer',
    'ytd-search ytd-promoted-sparkles-web-renderer',
    'ytd-search ytd-ad-slot-renderer',
    'ytd-search [layout*="promoted"]'
  ],

  // Overlays and merchandising shelves
  overlaysAndMerch: [
    '.ytp-paid-content-overlay',
    'ytd-merch-shelf-renderer',
    'ytd-product-carousel-renderer'
  ]
};

export const TARGET_AD_SELECTORS = [
  ...AD_TARGETS_MAP.bannerAds,
  ...AD_TARGETS_MAP.videoAds,
  ...AD_TARGETS_MAP.mastheadAds,
  ...AD_TARGETS_MAP.bumperAds,
  ...AD_TARGETS_MAP.searchAds,
  ...AD_TARGETS_MAP.overlaysAndMerch
];

export const SKIP_BUTTON_SELECTORS = [
  '.ytp-ad-skip-button',
  '.ytp-ad-skip-button-modern',
  '.ytp-ad-skip-button-slot',
  '.ytp-skip-ad-button',
  'button.ytp-ad-skip-button-text',
  '.ytp-ad-overlay-close-button'
];

export class AdBlockService {
  private static instance: AdBlockService | null = null;
  private config: AdBlockConfig = { enabled: false, blockAllAds: false, enableAllowlist: true };
  private allowedChannels: Set<string> = new Set();
  private stats: AdBlockStats = {
    totalBlocked: 0,
    bannersBlocked: 0,
    videoAdsSkipped: 0,
    mastheadBlocked: 0,
    bumpersBypassed: 0,
    searchAdsBlocked: 0,
    lastBlockedAt: null,
  };
  private observer: MutationObserver | null = null;
  private videoCheckInterval: number | null = null;
  private styleTag: HTMLStyleElement | null = null;
  private isRunning: boolean = false;
  private pendingFilterRaf: number | null = null;

  private adWasActive: boolean = false;
  private originalMuted: boolean = false;

  private constructor() {
    this.loadAllowlistFromStorage();
  }

  public static getInstance(): AdBlockService {
    if (!AdBlockService.instance) {
      AdBlockService.instance = new AdBlockService();
    }
    return AdBlockService.instance;
  }

  /**
   * Initializes the AdBlockService with configuration.
   */
  public init(config: Partial<AdBlockConfig> = {}): void {
    this.config = {
      enabled: config.enabled ?? false,
      blockAllAds: config.blockAllAds ?? false,
      blockVideoAds: config.blockVideoAds ?? false,
      hideBannerAds: config.hideBannerAds ?? false,
      hideMastheadAds: config.hideMastheadAds ?? false,
      blockBumperAds: config.blockBumperAds ?? false,
      hideSearchAds: config.hideSearchAds ?? false,
      hideOverlays: config.hideOverlays ?? false,
      hideMerch: config.hideMerch ?? false,
      enableAllowlist: config.enableAllowlist ?? true,
      allowedChannels: config.allowedChannels ?? [],
      onAdBlocked: config.onAdBlocked,
      onAllowlistExemption: config.onAllowlistExemption,
    };

    if (config.allowedChannels && Array.isArray(config.allowedChannels)) {
      this.allowedChannels = new Set(
        config.allowedChannels.map((c) => normalizeChannelIdentifier(c)).filter(Boolean)
      );
    } else {
      this.loadAllowlistFromStorage();
    }

    if (this.config.enabled || this.config.blockAllAds) {
      this.start();
    } else {
      this.stop();
    }
  }

  /**
   * Loads saved creator allowlist from Chrome storage and localStorage.
   */
  private loadAllowlistFromStorage(): void {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['adblock_channel_allowlist'], (items: any) => {
        if (items && items.adblock_channel_allowlist) {
          const list = Array.isArray(items.adblock_channel_allowlist)
            ? items.adblock_channel_allowlist
            : String(items.adblock_channel_allowlist).split(/[\n,;]+/);
          list.forEach((c: string) => {
            const norm = normalizeChannelIdentifier(c);
            if (norm) this.allowedChannels.add(norm);
          });
        }
      });
    }
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem('yr_adblock_channel_allowlist');
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            arr.forEach((c: string) => {
              const norm = normalizeChannelIdentifier(c);
              if (norm) this.allowedChannels.add(norm);
            });
          }
        }
      } catch (e) {}
    }
  }

  /**
   * Detects the active channel ID, handle, or creator name from YouTube DOM and URL.
   */
  public getCurrentChannelInfo(): { channelId: string | null; handle: string | null; name: string | null } {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return { channelId: null, handle: null, name: null };
    }

    let channelId: string | null = null;
    let handle: string | null = null;
    let name: string | null = null;

    // 1. Channel or Handle Page in URL
    const path = window.location.pathname;
    if (path.startsWith('/@')) {
      handle = path.substring(2).split('/')[0];
    } else if (path.startsWith('/channel/')) {
      channelId = path.split('/')[2] || null;
    } else if (path.startsWith('/c/')) {
      handle = path.split('/')[2] || null;
    }

    // 2. Meta tags on Watch page
    const metaChannelId = document.querySelector('meta[itemprop="channelId"]')?.getAttribute('content');
    if (metaChannelId) channelId = metaChannelId;

    // 3. Polymer video owner elements
    const ownerLink = document.querySelector(
      'ytd-video-owner-renderer a[href*="/@"], ' +
      'ytd-video-owner-renderer a[href*="/channel/"], ' +
      '#owner #channel-name a, ' +
      '#upload-info ytd-channel-name a, ' +
      'ytd-watch-metadata #owner a, ' +
      '#channel-name a'
    ) as HTMLAnchorElement | null;

    if (ownerLink) {
      const href = ownerLink.getAttribute('href') || '';
      if (href.includes('/@')) {
        handle = href.split('/@')[1]?.split('/')[0]?.split('?')[0] || handle;
      } else if (href.includes('/channel/')) {
        channelId = href.split('/channel/')[1]?.split('/')[0]?.split('?')[0] || channelId;
      }
      const text = ownerLink.textContent?.trim();
      if (text) name = text;
    }

    // 4. Text fallback
    if (!name) {
      const nameEl = document.querySelector('ytd-video-owner-renderer #channel-name, #owner-name, #text.ytd-channel-name');
      if (nameEl) name = nameEl.textContent?.trim() || null;
    }

    return { channelId, handle, name };
  }

  /**
   * Checks whether the current page belongs to an allowlisted creator.
   */
  public isCurrentChannelAllowlisted(): boolean {
    if (this.config.enableAllowlist === false || this.allowedChannels.size === 0) {
      return false;
    }

    const info = this.getCurrentChannelInfo();
    const candidates: string[] = [];
    if (info.channelId) candidates.push(normalizeChannelIdentifier(info.channelId));
    if (info.handle) candidates.push(normalizeChannelIdentifier(info.handle));
    if (info.name) candidates.push(normalizeChannelIdentifier(info.name));

    for (const c of candidates) {
      if (c && this.allowedChannels.has(c)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Restores any elements that were hidden before the channel was identified as allowlisted.
   */
  public unhideAllElements(): void {
    if (typeof document === 'undefined') return;
    const blockedEls = document.querySelectorAll('[data-yr-blocked="true"]');
    blockedEls.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.removeProperty('display');
      htmlEl.style.removeProperty('visibility');
      htmlEl.style.removeProperty('height');
      delete htmlEl.dataset.yrBlocked;
    });
  }

  /**
   * Adds a channel ID or handle to the exemption allowlist.
   */
  public addChannelToAllowlist(channel: string): boolean {
    const norm = normalizeChannelIdentifier(channel);
    if (!norm) return false;
    this.allowedChannels.add(norm);
    this.persistAllowlist();
    this.reevaluateFiltering();
    return true;
  }

  /**
   * Removes a channel ID or handle from the allowlist.
   */
  public removeChannelFromAllowlist(channel: string): boolean {
    const norm = normalizeChannelIdentifier(channel);
    if (!norm) return false;
    const deleted = this.allowedChannels.delete(norm);
    if (deleted) {
      this.persistAllowlist();
      this.reevaluateFiltering();
    }
    return deleted;
  }

  /**
   * Returns all allowlisted channel IDs and handles.
   */
  public getAllowlist(): string[] {
    return Array.from(this.allowedChannels);
  }

  /**
   * Replaces the allowlist with an array of channel identifiers.
   */
  public setAllowlist(channels: string[]): void {
    this.allowedChannels = new Set(
      channels.map((c) => normalizeChannelIdentifier(c)).filter(Boolean)
    );
    this.persistAllowlist();
    this.reevaluateFiltering();
  }

  public isChannelAllowlisted(channel: string): boolean {
    const norm = normalizeChannelIdentifier(channel);
    return norm ? this.allowedChannels.has(norm) : false;
  }

  private persistAllowlist(): void {
    const list = this.getAllowlist();
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('yr_adblock_channel_allowlist', JSON.stringify(list));
      } catch (e) {}
    }
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      try {
        chrome.storage.sync.set({ adblock_channel_allowlist: list });
      } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yr-allowlist-updated', { detail: { allowlist: list } }));
    }
  }

  /**
   * Re-evaluates active ad blocking state and unhides ads on allowlisted creator channels.
   */
  public reevaluateFiltering(): void {
    if (this.isCurrentChannelAllowlisted()) {
      if (this.styleTag) {
        this.styleTag.textContent = '';
      }
      this.unhideAllElements();
      const info = this.getCurrentChannelInfo();
      if (this.config.onAllowlistExemption) {
        this.config.onAllowlistExemption(info.handle || info.channelId || info.name || 'creator');
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('yr-channel-exempted', { detail: info }));
      }
    } else if (this.isRunning) {
      this.injectDeclarativeStyles();
      this.filterNow();
    }
  }

  /**
   * Starts the high-performance filtering engine.
   */
  public start(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (this.isRunning) {
      this.filterNow();
      return;
    }

    this.isRunning = true;
    this.injectDeclarativeStyles();
    this.filterNow();
    this.attachObserver();
    this.startVideoAdMonitor();
  }

  /**
   * Stops filtering and removes listeners.
   */
  public stop(): void {
    this.isRunning = false;
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.videoCheckInterval) {
      window.clearInterval(this.videoCheckInterval);
      this.videoCheckInterval = null;
    }
    if (this.pendingFilterRaf) {
      window.cancelAnimationFrame(this.pendingFilterRaf);
      this.pendingFilterRaf = null;
    }
    this.removeDeclarativeStyles();
  }

  /**
   * Dynamically updates active settings and re-evaluates.
   */
  public updateSettings(settings: Record<string, any>): void {
    const isMasterOn = settings.master_switch !== false;
    const isAdBlockActive = isMasterOn && (
      settings.block_all_ads ||
      settings.block_video_instream_ads ||
      settings.hide_banner_ads ||
      settings.hide_masthead_ads ||
      settings.block_bumper_ads ||
      settings.hide_search_sponsored_ads ||
      settings.hide_instream_overlay_ads
    );

    this.config = {
      ...this.config,
      enabled: isAdBlockActive,
      blockAllAds: !!settings.block_all_ads,
      blockVideoAds: !!settings.block_video_instream_ads,
      hideBannerAds: !!settings.hide_banner_ads,
      hideMastheadAds: !!settings.hide_masthead_ads,
      blockBumperAds: !!settings.block_bumper_ads,
      hideSearchAds: !!settings.hide_search_sponsored_ads,
      hideOverlays: !!settings.hide_instream_overlay_ads,
      hideMerch: !!settings.hide_merch_product_shelves,
      enableAllowlist: settings.adblock_enable_allowlist !== false,
    };

    if (settings.adblock_channel_allowlist) {
      if (Array.isArray(settings.adblock_channel_allowlist)) {
        this.setAllowlist(settings.adblock_channel_allowlist);
      } else if (typeof settings.adblock_channel_allowlist === 'string') {
        const list = settings.adblock_channel_allowlist.split(/[\n,;]+/).map((s: string) => s.trim()).filter(Boolean);
        this.setAllowlist(list);
      }
    }

    if (this.config.enabled) {
      this.start();
    } else {
      this.stop();
    }

    this.reevaluateFiltering();
  }

  /**
   * Computes the list of active DOM selectors based on granular toggles.
   */
  public getActiveSelectors(): string[] {
    if (this.config.blockAllAds) {
      return TARGET_AD_SELECTORS;
    }
    const active: string[] = [];
    if (this.config.hideBannerAds) {
      active.push(...AD_TARGETS_MAP.bannerAds);
    }
    if (this.config.blockVideoAds) {
      active.push(...AD_TARGETS_MAP.videoAds);
    }
    if (this.config.hideMastheadAds) {
      active.push(...AD_TARGETS_MAP.mastheadAds);
    }
    if (this.config.blockBumperAds) {
      active.push(...AD_TARGETS_MAP.bumperAds);
    }
    if (this.config.hideSearchAds) {
      active.push(...AD_TARGETS_MAP.searchAds);
    }
    if (this.config.hideOverlays || this.config.hideMerch) {
      active.push(...AD_TARGETS_MAP.overlaysAndMerch);
    }
    return active;
  }

  /**
   * Injects zero-latency CSS rules into <head> to prevent visual flicker before hydration.
   */
  private injectDeclarativeStyles(): void {
    if (typeof document === 'undefined') return;
    if (this.isCurrentChannelAllowlisted()) {
      if (this.styleTag) this.styleTag.textContent = '';
      return;
    }
    if (!this.styleTag) {
      this.styleTag = document.createElement('style');
      this.styleTag.id = 'yr-adblock-service-styles';
      (document.head || document.documentElement).appendChild(this.styleTag);
    }

    const activeSelectors = this.getActiveSelectors();
    if (activeSelectors.length === 0) {
      this.styleTag.textContent = '';
      return;
    }

    const selectors = activeSelectors.join(',\n');
    this.styleTag.textContent = `
      ${selectors} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
        min-height: 0 !important;
      }
      /* Collapse grid wrapper containers completely to eliminate empty black gaps */
      ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
      ytd-rich-item-renderer:has(.ytd-in-feed-ad-layout-renderer),
      ytd-rich-item-renderer:has(ytd-statement-banner-renderer),
      ytd-rich-item-renderer:has(ytd-banner-promo-renderer),
      ytd-rich-section-renderer:has(#masthead-ad),
      ytd-rich-section-renderer:has(ytd-banner-promo-renderer),
      ytd-rich-section-renderer:has(ytd-statement-banner-renderer),
      ytd-rich-section-renderer:has(ytd-ad-slot-renderer),
      ytd-rich-section-renderer:has(ytd-brand-video-singleton-renderer),
      #masthead-ad,
      ytd-masthead-ad-v3-renderer,
      ytd-video-masthead-ad-v3-renderer {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }
    `;
  }

  private removeDeclarativeStyles(): void {
    if (this.styleTag && this.styleTag.parentNode) {
      this.styleTag.parentNode.removeChild(this.styleTag);
      this.styleTag = null;
    }
  }

  /**
   * Scans and purges ads immediately using targeted query selectors.
   */
  public filterNow(): void {
    if (typeof document === 'undefined') return;

    if (this.isCurrentChannelAllowlisted()) {
      if (this.styleTag) this.styleTag.textContent = '';
      this.unhideAllElements();
      const info = this.getCurrentChannelInfo();
      if (this.config.onAllowlistExemption) {
        this.config.onAllowlistExemption(info.handle || info.channelId || info.name || 'creator');
      }
      return;
    }

    const selectors = this.getActiveSelectors();
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          this.hideElement(el, selector);
        });
      } catch (e) {
        // Ignore invalid selector on older engines
      }
    }

    if (this.config.blockVideoAds || this.config.blockBumperAds || this.config.blockAllAds) {
      this.handleVideoAds();
    }
  }

  /**
   * Hides an element instantly and tracks metrics.
   */
  private hideElement(element: Element, selector: string): void {
    const htmlEl = element as HTMLElement;
    if (htmlEl.dataset && htmlEl.dataset.yrBlocked === 'true') {
      return; // Already processed
    }

    // Critical safety: never hide the movie player or main video element
    if (element.id === 'movie_player' || element.tagName.toLowerCase() === 'video' || element.classList.contains('html5-video-player')) {
      return;
    }

    // Collapse parent grid/card wrappers to eliminate empty DOM gaps in feed and search
    const wrapper = element.closest('ytd-rich-item-renderer, ytd-rich-section-renderer, ytd-item-section-renderer');
    const target = (wrapper as HTMLElement) || htmlEl;

    // Apply instantaneous styling
    target.style.setProperty('display', 'none', 'important');
    target.style.setProperty('visibility', 'hidden', 'important');
    target.style.setProperty('height', '0px', 'important');
    target.style.setProperty('min-height', '0px', 'important');
    target.style.setProperty('margin', '0px', 'important');
    target.style.setProperty('padding', '0px', 'important');
    target.style.setProperty('overflow', 'hidden', 'important');
    if (target.dataset) {
      target.dataset.yrBlocked = 'true';
    }

    this.stats.totalBlocked += 1;
    this.stats.lastBlockedAt = Date.now();

    if (selector.includes('masthead') || selector.includes('billboard') || selector.includes('promo-renderer')) {
      this.stats.mastheadBlocked += 1;
    } else if (selector.includes('banner') || selector.includes('slot') || selector.includes('companion')) {
      this.stats.bannersBlocked += 1;
    } else if (selector.includes('bumper')) {
      this.stats.bumpersBypassed += 1;
    } else if (selector.includes('promoted')) {
      this.stats.searchAdsBlocked += 1;
    }

    this.notifyStatsUpdated();

    if (this.config.onAdBlocked) {
      this.config.onAdBlocked(selector, element);
    }
  }

  /**
   * Syncs real-time blocked stats with local storage and custom events.
   */
  private notifyStatsUpdated(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('yr-adblock-stats-updated', { detail: this.stats }));
    }
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      try {
        chrome.storage.local.set({ adblock_realtime_stats: this.stats });
      } catch (e) {}
    }
  }

  /**
   * High-speed mutation observer that inspects added nodes directly
   * avoiding costly document-wide tree traversals.
   */
  private attachObserver(): void {
    if (typeof document === 'undefined') return;
    if (this.observer) return;

    this.observer = new MutationObserver((mutations) => {
      let requiresFilter = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1) { // ELEMENT_NODE
              const element = node as Element;
              // Fast check if element matches any ad selector
              for (const sel of TARGET_AD_SELECTORS) {
                if (element.matches && element.matches(sel)) {
                  this.hideElement(element, sel);
                } else if (element.firstElementChild) {
                  requiresFilter = true;
                }
              }
            }
          }
        } else if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          if (target && target.classList && (target.classList.contains('ad-showing') || target.classList.contains('ad-interrupting'))) {
            this.handleVideoAds();
          }
        }
      }

      if (requiresFilter) {
        this.scheduleDebouncedFilter();
      }
    });

    const root = document.documentElement || document.body;
    if (root) {
      this.observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
    }
  }

  private scheduleDebouncedFilter(): void {
    if (this.pendingFilterRaf) return;
    this.pendingFilterRaf = window.requestAnimationFrame(() => {
      this.pendingFilterRaf = null;
      this.filterNow();
    });
  }

  /**
   * Detects in-stream commercial interruption, fast-forwards the video tag to the end,
   * mutes audio during the ad, and clicks skip buttons in <50ms.
   */
  public handleVideoAds(): void {
    if (typeof document === 'undefined') return;

    if (this.isCurrentChannelAllowlisted()) {
      return; // Do not interrupt or accelerate ads on allowlisted creator videos
    }

    const moviePlayer = document.getElementById('movie_player');
    const video = document.querySelector('video.html5-main-video') as HTMLVideoElement | null;
    if (!moviePlayer || !video) return;

    const isAdActive =
      moviePlayer.classList.contains('ad-showing') ||
      moviePlayer.classList.contains('ad-interrupting') ||
      document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay') !== null;

    if (isAdActive) {
      this.adWasActive = true;
      try {
        video.muted = true;
        video.playbackRate = 16.0;
        // Fast-forward slightly before the end without stalling the player buffer
        if (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime < video.duration - 0.2) {
          video.currentTime = video.duration - 0.1;
        }
      } catch (err) {
        // Protected player state
      }

      // Click standard and modern skip buttons immediately
      for (const sel of SKIP_BUTTON_SELECTORS) {
        const btn = document.querySelector(sel) as HTMLElement | null;
        if (btn && typeof btn.click === 'function') {
          btn.click();
          this.stats.videoAdsSkipped += 1;
          this.stats.totalBlocked += 1;
          this.notifyStatsUpdated();
          break;
        }
      }
    } else if (this.adWasActive) {
      this.adWasActive = false;
      // Ad finished - restore audio and standard speed smoothly
      try {
        video.muted = false;
        video.playbackRate = 1.0;
      } catch (e) {}
    }
  }

  private startVideoAdMonitor(): void {
    if (this.videoCheckInterval) return;
    this.videoCheckInterval = window.setInterval(() => {
      if (this.isRunning) {
        this.handleVideoAds();
      }
    }, 250);
  }

  /**
   * Retrieves the current ad-blocking statistics.
   */
  public getStats(): AdBlockStats {
    return { ...this.stats };
  }

  public resetStats(): void {
    this.stats = {
      totalBlocked: 0,
      bannersBlocked: 0,
      videoAdsSkipped: 0,
      mastheadBlocked: 0,
      bumpersBypassed: 0,
      searchAdsBlocked: 0,
      lastBlockedAt: null,
    };
  }
}
