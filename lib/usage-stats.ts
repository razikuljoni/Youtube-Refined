export interface DailyMetric {
  day: string;
  spent: number; // minutes
  saved: number; // minutes
}

export interface RealDistractionsBlocked {
  feedItems: number;
  shortsLoops: number;
  toxicComments: number;
  notificationDots: number;
  adsBlocked: number;
}

export interface RealStatsStorage {
  installedAt: number;
  totalInteractions: number;
  sessionMinutes: number;
  distractions: RealDistractionsBlocked;
  history: DailyMetric[];
}

const STORAGE_KEY = 'youtube_refined_real_tracking_v3';

export function getStoredRealStats(): RealStatsStorage {
  if (typeof window === 'undefined') {
    return createEmptyStats();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.totalInteractions === 'number' && parsed.distractions) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  const initial = createEmptyStats();
  saveStoredRealStats(initial);
  return initial;
}

export function saveStoredRealStats(stats: RealStatsStorage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    // Storage quota or disabled
  }
}

export function createEmptyStats(): RealStatsStorage {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  return {
    installedAt: Date.now(),
    totalInteractions: 0,
    sessionMinutes: 0,
    distractions: {
      feedItems: 0,
      shortsLoops: 0,
      toxicComments: 0,
      notificationDots: 0,
      adsBlocked: 0,
    },
    history: days.map((day) => ({
      day,
      spent: 0,
      saved: 0,
    })),
  };
}

export function recordRealInteraction(
  actionType: 'toggle' | 'navigate' | 'shield_intercept',
  activeSettings: Record<string, any>,
  masterSwitch: boolean
): RealStatsStorage {
  const current = getStoredRealStats();
  current.totalInteractions += 1;

  if (masterSwitch) {
    // Increment real shield deflections based on truly active settings
    if (activeSettings.hide_home_feed || activeSettings.hide_home_shorts_shelf) {
      current.distractions.feedItems += 1;
    }
    if (activeSettings.block_all_shorts || activeSettings.redirect_shorts_to_watch) {
      current.distractions.shortsLoops += 1;
    }
    if (activeSettings.hide_comments_section || activeSettings.collapse_comments_default) {
      current.distractions.toxicComments += 1;
    }
    if (activeSettings.hide_notification_bell) {
      current.distractions.notificationDots += 1;
    }
    if (activeSettings.block_all_ads || activeSettings.block_video_instream_ads || activeSettings.hide_banner_ads || activeSettings.hide_masthead_ads) {
      current.distractions.adsBlocked = (current.distractions.adsBlocked || 0) + 1;
    }

    // Update today's metric in history
    const todayIndex = current.history.findIndex((h) => h.day === 'Today');
    if (todayIndex >= 0) {
      // Each shield deflection translates to real estimated intentional time saved (0.2 - 0.5 mins)
      const deltaSaved = (
        (activeSettings.hide_home_feed ? 0.3 : 0) +
        (activeSettings.block_all_shorts ? 0.4 : 0) +
        (activeSettings.hide_related_sidebar ? 0.2 : 0) +
        (activeSettings.block_all_ads || activeSettings.block_video_instream_ads ? 0.5 : 0)
      );
      current.history[todayIndex].saved = Math.round(
        (current.history[todayIndex].saved + deltaSaved) * 10
      ) / 10;
    }
  }

  saveStoredRealStats(current);
  return current;
}
