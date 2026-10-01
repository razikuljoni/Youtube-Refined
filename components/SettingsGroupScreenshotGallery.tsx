'use client';

import React, { useState } from 'react';
import { 
  Sliders, 
  Search, 
  Tv, 
  Eye, 
  Compass, 
  Menu, 
  Check, 
  Sparkles, 
  Maximize2, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  Filter,
  Layers,
  Camera,
  X
} from 'lucide-react';

export interface GroupScreenshotRef {
  id: string;
  number: number;
  groupName: string;
  category: string;
  browseLabel: string;
  subGroups: {
    title: string;
    items: { label: string; defaultVal: boolean; note?: string }[];
  }[];
  summary: string;
  beforeDescription: string;
  afterDescription: string;
  mockType: string;
}

export const GROUP_SCREENSHOT_REFS: GroupScreenshotRef[] = [
  {
    id: 'ref-1',
    number: 1,
    groupName: 'Subscriptions Feed',
    category: 'subscriptions',
    browseLabel: 'Subscriptions... PLUS',
    subGroups: [
      {
        title: 'Subscriptions',
        items: [
          { label: 'Hide Watched Videos', defaultVal: false },
          { label: 'Hide Live And Premiere Videos', defaultVal: false },
          { label: 'Hide Upcoming Videos', defaultVal: false },
          { label: 'Hide Shorts', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 1: Cleans your /feed/subscriptions inbox by purging watched videos, premiere countdowns, and Shorts shelves.',
    beforeDescription: 'Subscriptions tab is cluttered with previously watched videos, upcoming premiere countdown traps, and vertical Shorts shelves.',
    afterDescription: 'Clean chronological inbox of fresh long-form uploads from creators you follow. No Shorts, no watched cards.',
    mockType: 'subscriptions'
  },
  {
    id: 'ref-2',
    number: 2,
    groupName: 'Channel Page: Redirect & Header',
    category: 'channel',
    browseLabel: 'Channel... PLUS',
    subGroups: [
      {
        title: 'Redirect',
        items: [
          { label: 'Start Page On Channel Is (Home Page / Videos / Shorts)', defaultVal: false }
        ]
      },
      {
        title: 'Header',
        items: [
          { label: 'Hide Banner', defaultVal: false },
          { label: 'Grayscale Banner', defaultVal: false },
          { label: 'Hide Channel Avatar', defaultVal: false },
          { label: 'Grayscale Channel Avatar', defaultVal: false },
          { label: 'Hide Channel Name', defaultVal: false },
          { label: 'Hide \'Verified\' Badge', defaultVal: false },
          { label: 'Hide Channel ID', defaultVal: false },
          { label: 'Hide Subscribers Count', defaultVal: false },
          { label: 'Hide Videos Count', defaultVal: false },
          { label: 'Hide Channel Tagline', defaultVal: false },
          { label: 'Hide Links', defaultVal: false },
          { label: 'Hide \'Subscribe\' Button', defaultVal: false },
          { label: 'Hide \'Purchase\' Button', defaultVal: false },
          { label: 'Hide \'Join\' Button', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 2: Channel redirection, header banner stripping, avatar muting, and membership/purchase button removal.',
    beforeDescription: 'Creator profile headers feature high-contrast promotional banners, subscriber metrics, and prominent purchase/join storefront buttons.',
    afterDescription: 'Quiet profile header: redirects to direct videos, grayscales or removes banner art, and hides follower metrics.',
    mockType: 'channel_header'
  },
  {
    id: 'ref-3',
    number: 3,
    groupName: 'Channel: Menu Bar & Sections',
    category: 'channel',
    browseLabel: 'Channel... PLUS',
    subGroups: [
      {
        title: 'Horizontal Menu Bar',
        items: [
          { label: 'Hide Entire Menu', defaultVal: false },
          { label: 'Hide \'Home\' Button', defaultVal: false },
          { label: 'Hide \'Videos\' Button', defaultVal: false },
          { label: 'Hide \'Shorts\' Button', defaultVal: false },
          { label: 'Hide \'Live\' Button', defaultVal: false },
          { label: 'Hide \'Releases\' Button', defaultVal: false },
          { label: 'Hide \'Podcasts\' Button', defaultVal: false },
          { label: 'Hide \'Playlists\' Button', defaultVal: false },
          { label: 'Hide \'Community\' Button', defaultVal: false },
          { label: 'Hide \'Store\' Button', defaultVal: false },
          { label: 'Hide \'Channels\' Button', defaultVal: false },
          { label: 'Hide \'Search\' Button', defaultVal: false }
        ]
      },
      {
        title: 'Sections',
        items: [
          { label: 'Hide \'For You\' Section', defaultVal: false },
          { label: 'Hide \'Videos\' Section', defaultVal: false },
          { label: 'Hide \'Popular Videos\' Section', defaultVal: false },
          { label: 'Hide \'Playlist\' Section', defaultVal: false },
          { label: 'Hide \'Shorts\' Section', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 3: Granular control over the horizontal tabs bar and algorithmic shelves on creator channels.',
    beforeDescription: 'Overloaded menu bar with 12 tabs and algorithmically pushed "For You" shelves that derail browsing.',
    afterDescription: 'Simplified navigation showing only intentional tabs and direct chronological video shelves.',
    mockType: 'channel_menu'
  },
  {
    id: 'ref-4',
    number: 4,
    groupName: 'Channel: Sections Continued',
    category: 'channel',
    browseLabel: 'Channel... PLUS',
    subGroups: [
      {
        title: 'Sections (Continued)',
        items: [
          { label: 'Hide \'Our Members\' Section', defaultVal: false },
          { label: 'Hide \'Featured\' Section', defaultVal: false },
          { label: 'Hide \'Releases\' Section', defaultVal: false },
          { label: 'Hide \'Live\' Section', defaultVal: false },
          { label: 'Hide \'Play All\' Buttons', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 4: Removes sponsor membership showcases, trailers, live broadcast shelves, and autoplay "Play All" triggers.',
    beforeDescription: 'Auto-playing channel trailers, member recognition boards, and binge "Play All" buttons encourage continuous watching.',
    afterDescription: 'Clean channel layout focused purely on deliberate video selection without auto-play hooks.',
    mockType: 'channel_menu'
  },
  {
    id: 'ref-5',
    number: 5,
    groupName: 'Shorts Page: Details & Scrolling',
    category: 'shorts',
    browseLabel: 'Shorts Page PLUS',
    subGroups: [
      {
        title: 'Redirect & Others',
        items: [
          { label: 'Redirect Shorts To Normal Player', defaultVal: false },
          { label: 'Disable Scrolling', defaultVal: false }
        ]
      },
      {
        title: 'Details',
        items: [
          { label: 'Hide Description', defaultVal: false },
          { label: 'Hide Channel Avatar', defaultVal: false },
          { label: 'Hide Channel Username', defaultVal: false },
          { label: 'Hide Likes Count', defaultVal: false },
          { label: 'Hide Comments Count', defaultVal: false },
          { label: 'Hide Dislike And Share Labels', defaultVal: false }
        ]
      },
      {
        title: 'Buttons (Part 1)',
        items: [
          { label: 'Hide \'Play\' Button', defaultVal: false },
          { label: 'Hide \'Mute\' Button', defaultVal: false },
          { label: 'Hide \'Subscribe\' Button', defaultVal: false },
          { label: 'Hide \'Like\' Button', defaultVal: false },
          { label: 'Hide \'Dislike\' Button', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 5: Disable infinite swipe scrolling on Shorts, hide creator metadata overlay, and remove action rail buttons.',
    beforeDescription: 'Vertical Shorts player bombards you with text descriptions, hashtags, follower counts, and instant scroll triggers.',
    afterDescription: 'Restores control by locking scroll gestures, hiding social metric counters, or redirecting to /watch?v= completely.',
    mockType: 'shorts_details'
  },
  {
    id: 'ref-6',
    number: 6,
    groupName: 'Shorts Page: Action Buttons',
    category: 'shorts',
    browseLabel: 'Shorts Page PLUS',
    subGroups: [
      {
        title: 'Buttons (Part 2)',
        items: [
          { label: 'Hide \'Comments\' Button', defaultVal: false },
          { label: 'Hide \'Share\' Button', defaultVal: false },
          { label: 'Hide \'More\' Button', defaultVal: false },
          { label: 'Hide \'Sound\' Button', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 6: Strips the speech bubble comments icon, viral share hooks, and audio sound remix buttons.',
    beforeDescription: 'Action buttons on the right edge constantly invite viral sharing, comment debates, and remixing rabbit holes.',
    afterDescription: 'Clean vertical frame with extraneous interactive icons removed.',
    mockType: 'shorts_buttons'
  },
  {
    id: 'ref-7',
    number: 7,
    groupName: 'Library Page / You Feed',
    category: 'library',
    browseLabel: 'Library Page PLUS',
    subGroups: [
      {
        title: 'Library Sections',
        items: [
          { label: 'Hide Your Avatar', defaultVal: false },
          { label: 'Hide \'History\' Section', defaultVal: false },
          { label: 'Hide \'Watch Later\' Section', defaultVal: false },
          { label: 'Hide \'Playlists\' Section', defaultVal: false },
          { label: 'Hide \'Liked Videos\' Section', defaultVal: false },
          { label: 'Hide \'Your Clips\' Section', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 7: Dedicated switches for every component of the "You" account and library page.',
    beforeDescription: 'The library tab displays excessive user analytics, avatar banners, and reminders of past watch history.',
    afterDescription: 'Minimalist library interface where you choose exactly which sections remain visible.',
    mockType: 'library'
  },
  {
    id: 'ref-8',
    number: 8,
    groupName: 'Embedded Video Player',
    category: 'embedded',
    browseLabel: 'Embed Video PLUS',
    subGroups: [
      {
        title: 'End Screen & Shadows',
        items: [
          { label: 'Hide Suggestions In The Video End', defaultVal: false },
          { label: 'Hide Cards In The Video End', defaultVal: false },
          { label: 'Hide Video Player Bar Gradient Shadow', defaultVal: false },
          { label: 'Hide Top Gradient Shadow', defaultVal: false },
          { label: 'Hide Recommendations On Pause', defaultVal: false }
        ]
      },
      {
        title: 'Overlays & Controls',
        items: [
          { label: 'Hide Video Title', defaultVal: false },
          { label: 'Hide Video Time', defaultVal: false },
          { label: 'Hide Channel Avatar', defaultVal: false },
          { label: 'Hide Watermark', defaultVal: false },
          { label: 'Hide \'Watch On YouTube\' Button', defaultVal: false },
          { label: 'Hide \'YouTube\' Button', defaultVal: false },
          { label: 'Hide \'Play / Pause / Replay\' Button', defaultVal: false },
          { label: 'Hide \'Volume\' Button', defaultVal: false },
          { label: 'Hide \'Captions\' Button', defaultVal: false },
          { label: 'Hide \'Settings\' Button', defaultVal: false },
          { label: 'Hide \'Full Screen\' Button', defaultVal: false },
          { label: 'Hide \'Share\' Button', defaultVal: false },
          { label: 'Hide \'More From\' Button', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 8: Strips end-of-video recommendation grids, pause popups, watermark logos, and gradient shadows on embedded players.',
    beforeDescription: 'Pausing or finishing an embedded YouTube video on external websites summons a grid of external YouTube recommendations.',
    afterDescription: 'Cinema frame with pure video playback. No pause overlays, no YouTube watermarks, and no redirect hooks.',
    mockType: 'embedded'
  },
  {
    id: 'ref-9',
    number: 9,
    groupName: 'Decoration & Theming',
    category: 'decoration',
    browseLabel: 'Decoration PLUS',
    subGroups: [
      {
        title: 'Typography & Colors',
        items: [
          { label: 'Font (Default / System / Inter / Monospace / Serif)', defaultVal: false },
          { label: 'Base Color (Custom Accent Highlight)', defaultVal: false },
          { label: 'Primary Background Color (Deep Dark / OLED / Slate)', defaultVal: false }
        ]
      }
    ],
    summary: 'Directly mirrors Screenshot 9 & 10: Tailor custom fonts, primary accent base color, and background canvas tone.',
    beforeDescription: 'Default YouTube forces standard high-contrast red highlights and fixed theme colors.',
    afterDescription: 'Custom aesthetic tuning with bespoke typography, soothing accent palette, and OLED pitch-black background.',
    mockType: 'decoration'
  },
  {
    id: 'ref-10',
    number: 10,
    groupName: 'Header & Search Bar',
    category: 'header',
    browseLabel: 'Header PLUS',
    subGroups: [
      {
        title: 'Search Bar',
        items: [
          { label: 'Hide Search Bar', defaultVal: false },
          { label: 'Hide Search Suggestions', defaultVal: false },
          { label: 'Hide Previous Searches', defaultVal: false },
          { label: 'Hide \'Voice Search\' Button', defaultVal: false }
        ]
      },
      {
        title: 'Logo & Buttons',
        items: [
          { label: 'Hide Logo', defaultVal: false },
          { label: 'Logo Color (Default / Grayscale)', defaultVal: false },
          { label: 'Hide \'Create\' Button', defaultVal: false },
          { label: 'Hide Notifications Count', defaultVal: false }
        ]
      }
    ],
    summary: 'Quiets the masthead by removing unread counter badges, voice search mic, logo redirect traps, and upload buttons.',
    beforeDescription: 'Stock YouTube header has bright red notification badges, aggressive search suggestions, and clickable branding pushing you back to the home feed.',
    afterDescription: 'Clean, serene masthead with centered search, muted neutral logo, zero unread alerts, and distractions eliminated.',
    mockType: 'header'
  },
  {
    id: 'ref-11',
    number: 11,
    groupName: 'Ad Blocker & Ads Shield',
    category: 'ads',
    browseLabel: 'Ad Shield PLUS',
    subGroups: [
      {
        title: 'Master Ad Shield',
        items: [
          { label: 'Master Ad Shield (Block All YouTube Ads)', defaultVal: false },
        ]
      },
      {
        title: 'Video & In-Stream Ads',
        items: [
          { label: 'Auto-Skip & Block Video In-Stream Ads (Pre-Roll & Mid-Roll)', defaultVal: false },
          { label: 'Auto-Bypass 6-Second Bumper Ads', defaultVal: false },
          { label: 'Hide In-Stream Video Overlays & Lower-Third Popups', defaultVal: false },
          { label: 'Hide "Includes Paid Promotion" Floating Disclaimers', defaultVal: false },
          { label: 'Hide Sponsored End-Screen Cards & Merchandise Links', defaultVal: false },
        ]
      },
      {
        title: 'Banner & Display Ads',
        items: [
          { label: 'Hide Home Page Masthead Hero Billboard Ads', defaultVal: false },
          { label: 'Hide Banner, Feed & Display Commercial Ads', defaultVal: false },
          { label: 'Hide Watch Page Sidebar Companion Ads', defaultVal: false },
        ]
      },
      {
        title: 'Search & Feed Sponsored Ads',
        items: [
          { label: 'Hide Sponsored Promoted Ads in Search Results', defaultVal: false },
          { label: 'Hide Creator Merch & Product Shopping Shelves', defaultVal: false },
        ]
      }
    ],
    summary: 'Universal Ad Shield: Complete eradication of in-stream video ads, masthead hero banners, bumper ads, and sponsored search promotions without playback pauses or anti-adblock detection.',
    beforeDescription: 'Unskippable 15-second commercial interruptions, mid-roll popups, home masthead billboard, and sponsored search ad slots destroy the viewing flow.',
    afterDescription: '100% ad-free playback: video ads are automatically fast-tracked and skipped in <50ms, masthead promos are hidden, and search listings remain purely organic.',
    mockType: 'ads'
  }
];

interface SettingsGroupScreenshotGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: Record<string, any>;
  onToggle?: (id: string, val?: any) => void;
}

export default function SettingsGroupScreenshotGallery({
  isOpen,
  onClose,
  settings = {},
  onToggle
}: SettingsGroupScreenshotGalleryProps) {
  const [selectedRefIndex, setSelectedRefIndex] = useState(0);
  const [compareMode, setCompareMode] = useState<'after' | 'before'>('after');

  if (!isOpen) return null;

  const activeRef = GROUP_SCREENSHOT_REFS[selectedRefIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl bg-[#12141c] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
              📸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Untrap Reference Screenshots & Settings Groups
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  11 Screenshots & Ad Shield
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Visual documentation of all settings group names, sub-groups, and toggles matching the uploaded reference screenshots.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Layout: Left Sidebar + Right Screenshot Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Screenshot Selector Sidebar */}
          <div className="w-full md:w-72 bg-zinc-950/70 border-r border-white/10 p-3 overflow-y-auto space-y-1.5 flex-shrink-0">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Reference Screenshots (1-10)
            </div>
            {GROUP_SCREENSHOT_REFS.map((ref, idx) => {
              const isSelected = selectedRefIndex === idx;
              return (
                <button
                  key={ref.id}
                  onClick={() => setSelectedRefIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/25 ring-1 ring-white/20'
                      : 'bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 border border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isSelected ? 'bg-white text-rose-600' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      #{ref.number}
                    </span>
                    <span className="truncate">{ref.groupName}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-zinc-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Reference Display Panel */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#0e1017]">
            {/* Group Banner */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      Screenshot #{activeRef.number}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                      Browse: {activeRef.browseLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                    {activeRef.groupName}
                  </h3>
                </div>

                <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-white/10 text-xs">
                  <button
                    onClick={() => setCompareMode('after')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      compareMode === 'after'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    ✨ Refined State
                  </button>
                  <button
                    onClick={() => setCompareMode('before')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      compareMode === 'before'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🚨 Default Cluttered
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeRef.summary}
              </p>
            </div>

            {/* Untrap Mock UI Panel Representation */}
            <div className="rounded-2xl border border-white/10 bg-[#161824] p-4 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <span className="text-xs font-bold text-white tracking-tight">
                    Settings Panel Layout (As shown in Screenshot #{activeRef.number})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Preset: My Setup • {activeRef.browseLabel}
                </span>
              </div>

              {/* Sub-groups and Switches */}
              <div className="space-y-4">
                {activeRef.subGroups.map((sg, sgIdx) => (
                  <div key={sgIdx} className="space-y-2">
                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      {sg.title}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sg.items.map((item, itemIdx) => (
                        <div 
                          key={itemIdx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/70 border border-white/5 text-xs hover:border-white/15 transition-all"
                        >
                          <span className="text-zinc-200 font-medium truncate pr-2">
                            {item.label}
                          </span>
                          <div className="w-9 h-5 bg-zinc-700/80 rounded-full flex items-center p-0.5 cursor-default">
                            <div className="w-4 h-4 rounded-full bg-zinc-400 shadow"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Before vs After Impact Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className={`p-4 rounded-2xl border transition-all ${
                compareMode === 'before'
                  ? 'bg-red-500/10 border-red-500/40 text-red-200 shadow-lg'
                  : 'bg-zinc-900/60 border-white/5 text-zinc-400'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Default Clutter Impact</span>
                </div>
                <p className="leading-relaxed">
                  {activeRef.beforeDescription}
                </p>
              </div>

              <div className={`p-4 rounded-2xl border transition-all ${
                compareMode === 'after'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 shadow-lg'
                  : 'bg-zinc-900/60 border-white/5 text-zinc-400'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>YouTube Refined Result</span>
                </div>
                <p className="leading-relaxed">
                  {activeRef.afterDescription}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 px-6 bg-zinc-900/90 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All 10 screenshot references integrated into YouTube Refined</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRefIndex((selectedRefIndex - 1 + GROUP_SCREENSHOT_REFS.length) % GROUP_SCREENSHOT_REFS.length)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
            >
              Previous Ref
            </button>
            <button
              onClick={() => setSelectedRefIndex((selectedRefIndex + 1) % GROUP_SCREENSHOT_REFS.length)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
            >
              Next Ref #{GROUP_SCREENSHOT_REFS[(selectedRefIndex + 1) % GROUP_SCREENSHOT_REFS.length].number}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
