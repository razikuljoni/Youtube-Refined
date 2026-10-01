'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Maximize2, 
  Lock, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Tv,
  Home,
  Compass,
  Menu,
  Search,
  Filter,
  Clock,
  Code2,
  Layers
} from 'lucide-react';
import { SettingScreenshot, CategoryScreenshot } from '@/lib/extension-data';

interface ReferenceScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotData: {
    title: string;
    badge?: string;
    subtitle?: string;
    beforeText: string;
    afterText: string;
    highlightText?: string;
    category?: string;
    mockType?: string;
    settingId?: string;
    currentValue?: any;
    onToggleSetting?: (val: any) => void;
  } | null;
}

export default function ReferenceScreenshotModal({
  isOpen,
  onClose,
  screenshotData
}: ReferenceScreenshotModalProps) {
  const [viewMode, setViewMode] = useState<'after' | 'before' | 'split'>('after');
  const [splitPos, setSplitPos] = useState(50);

  if (!isOpen || !screenshotData) return null;

  const mockType = screenshotData.mockType || 'home';

  const renderMockUi = (isRefined: boolean) => {
    switch (mockType) {
      case 'home':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100">
            {/* Header */}
            <div className="h-12 bg-[#0f0f0f] border-b border-[#272727] px-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-5 rounded flex items-center justify-center font-bold text-[10px] ${isRefined ? 'bg-zinc-700 text-zinc-300' : 'bg-red-600 text-white'}`}>
                  ▶
                </div>
                <span className="font-bold tracking-tight text-sm">YouTube</span>
                {isRefined && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">REFINED</span>
                )}
              </div>
              <div className="w-1/2 max-w-sm h-8 bg-[#121212] border border-[#303030] rounded-full px-3 flex items-center justify-between text-zinc-400 text-xs">
                <span>{isRefined ? 'Search intentionally...' : 'Search'}</span>
                <Search className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                {!isRefined && (
                  <div className="relative w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                    🔔
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">9+</span>
                  </div>
                )}
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  U
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-36 bg-[#0f0f0f] border-r border-[#272727] p-2 space-y-1 text-[11px] text-zinc-400">
                <div className="px-2 py-1.5 rounded-lg bg-white/10 text-white flex items-center gap-2 font-medium">
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </div>
                {!isRefined ? (
                  <>
                    <div className="px-2 py-1.5 rounded-lg text-red-400 flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Shorts ⚡</span>
                    </div>
                    <div className="px-2 py-1.5 rounded-lg flex items-center gap-2">
                      <span>Subscriptions</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 px-2 text-[10px] text-zinc-500 uppercase font-bold">Explore</div>
                    <div className="px-2 py-1 text-zinc-400">Trending 🔥</div>
                    <div className="px-2 py-1 text-zinc-400">Gaming 🎮</div>
                  </>
                ) : (
                  <div className="px-2 py-1.5 rounded-lg flex items-center gap-2 text-zinc-400">
                    <span>Subscriptions</span>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {isRefined ? (
                  /* REFINED VIEW */
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Mindful Search-First Sanctuary</h4>
                    <p className="text-xs text-zinc-400 max-w-xs">
                      Algorithmic home recommendations, clickbait thumbnails, and Shorts carousels are completely eliminated. Search only for what you need.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero Distraction Feed Blackout Active</span>
                    </div>
                  </div>
                ) : (
                  /* DISTRACTING UNREFINED VIEW */
                  <div className="space-y-4">
                    {/* Chips */}
                    <div className="flex gap-2">
                      {['All', 'Podcasts', 'Gaming', 'Breaking News', 'Live'].map((c, i) => (
                        <span key={i} className={`text-[10px] px-2.5 py-1 rounded-full ${i === 0 ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300'}`}>
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Shorts Shelf */}
                    <div className="p-2.5 rounded-xl border border-red-500/40 bg-red-950/20 relative">
                      <span className="absolute -top-2.5 right-3 text-[9px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                        Doomscroll Shelf
                      </span>
                      <div className="text-[11px] font-bold text-red-400 mb-2 flex items-center gap-1.5">
                        <Compass className="w-3 h-3" /> Shorts Carousel
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((n) => (
                          <div key={n} className="h-16 bg-zinc-800 rounded-lg flex flex-col justify-end p-1 text-[9px] text-zinc-300">
                            <span className="font-semibold truncate">Shocking truth! #{n}</span>
                            <span className="text-zinc-500 text-[8px]">1.8M views</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Standard Feed Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="space-y-1.5 p-1.5 rounded-lg border border-amber-500/30 bg-amber-950/10 relative">
                          <span className="absolute -top-2 right-1 text-[8px] bg-amber-600 text-black font-bold px-1.5 rounded">
                            Clickbait
                          </span>
                          <div className="h-14 bg-zinc-800 rounded flex items-center justify-center text-zinc-600 font-bold text-xs">
                            THUMBNAIL
                          </div>
                          <p className="text-[10px] font-bold text-zinc-200 line-clamp-1">YOU WON&apos;T BELIEVE THIS HAPPENED!</p>
                          <p className="text-[9px] text-zinc-400">Viral Channel • 4.2M views</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'watch':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100">
            {/* Header */}
            {!isRefined ? (
              <div className="h-10 bg-[#0f0f0f] border-b border-[#272727] px-4 flex items-center justify-between text-xs">
                <span className="font-bold text-sm text-red-500">YouTube</span>
                <span className="text-xs text-zinc-400">Standard Top Masthead</span>
                <div className="w-5 h-5 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center">🔔</div>
              </div>
            ) : (
              <div className="h-8 bg-[#0b0c10] border-b border-white/10 px-4 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Focus Cinema Mode Active
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Header & Secondary Recommendations Suppressed</span>
              </div>
            )}

            {/* Video + Secondary Content Layout */}
            <div className="flex-1 p-3 flex gap-3 overflow-hidden">
              {/* Primary Video Column */}
              <div className={`${isRefined ? 'w-full max-w-2xl mx-auto' : 'flex-1'} flex flex-col space-y-2`}>
                <div className="relative w-full h-36 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                    ▶
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-zinc-300">
                    <span className="font-mono">14:20 / 28:45</span>
                    <span className="bg-rose-500/20 text-rose-300 px-1 rounded font-bold">1080p Locked</span>
                  </div>
                </div>

                {/* Video Info */}
                {!isRefined ? (
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white">Full-Stack TypeScript Engineering Masterclass</h3>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>Tech Academy • 240K views</span>
                      <div className="flex gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">👍 14K</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">Share</span>
                        <span className="px-2 py-0.5 rounded bg-green-600 text-black font-bold">Join $4.99</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center pt-1 text-xs text-zinc-400">
                    <span className="font-medium text-white">Full-Stack TypeScript Engineering Masterclass</span>
                  </div>
                )}

                {/* Comments Section */}
                <div className="pt-2 border-t border-white/10">
                  {isRefined ? (
                    <div className="p-2.5 rounded-xl border border-white/10 bg-zinc-900/60 flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">💬 Comments Section (384)</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Collapsed by Default (Show on Click)
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2 p-2 rounded-xl border border-red-500/30 bg-red-950/10">
                      <div className="flex justify-between items-center text-[10px] text-red-300 font-bold">
                        <span>💬 384 Comments (Active distraction trap)</span>
                        <span className="text-zinc-500">Unfiltered</span>
                      </div>
                      <div className="text-[10px] text-zinc-300 space-y-1">
                        <p className="bg-zinc-800/80 p-1.5 rounded text-[9px]">User492: &quot;This is totally wrong at 12:40! Let me argue...&quot;</p>
                        <p className="bg-zinc-800/80 p-1.5 rounded text-[9px]">Gamer99: &quot;First! Who is watching this in 2026?&quot;</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Up Next Column (Only in unrefined) */}
              {!isRefined && (
                <div className="w-48 border-l border-white/10 pl-3 flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-red-400 font-bold">
                    <span>Up Next Recommendations</span>
                    <span className="bg-red-600 text-white px-1 rounded text-[8px]">ALGORITHM</span>
                  </div>
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="flex gap-2 p-1 rounded bg-zinc-900 border border-zinc-800">
                      <div className="w-14 h-9 bg-zinc-800 rounded flex-shrink-0 flex items-center justify-center text-[8px] text-zinc-500">
                        Thumb
                      </div>
                      <div className="flex-1 text-[9px] leading-tight">
                        <p className="font-semibold text-zinc-200 line-clamp-2">Crazy Drama You Missed Yesterday</p>
                        <p className="text-zinc-500 text-[8px]">890K views</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'shorts':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-red-500" /> Shorts Eradication Engine
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Zero Shorts Surfaces' : 'Shorts Doomloop Active'}
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              {isRefined ? (
                <div className="max-w-md text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">All Vertical Shorts Traps Nuked</h4>
                  <p className="text-xs text-zinc-400">
                    Shorts sidebar navigation button removed, home page reel shelves stripped, creator channel Shorts tab hidden, and any clicked short auto-redirects to normal scrubbable /watch video player.
                  </p>
                  <div className="flex justify-center gap-2 text-[10px] text-zinc-300 font-mono">
                    <span className="px-2 py-1 bg-white/5 rounded border border-white/10">/shorts/ ➔ /watch?v=</span>
                    <span className="px-2 py-1 bg-white/5 rounded border border-white/10">Autoplay Loop: OFF</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 w-full">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[9/16] bg-zinc-900 rounded-xl border border-red-500/40 p-2 flex flex-col justify-between relative overflow-hidden">
                      <span className="text-[8px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded self-start">SHORTS TRAP</span>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-white leading-tight">Infinite dopamine loop #{i}</p>
                        <p className="text-[8px] text-zinc-400">3.4M likes • Auto-replay loop</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'sidebar':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Menu className="w-4 h-4 text-cyan-400" /> Navigation Drawer Breakdown
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Minimal & Zen Navigation' : 'Algorithmic Exploration Overload'}
              </span>
            </div>
            <div className="flex-1 flex gap-4 pt-2 overflow-hidden">
              <div className="w-56 bg-zinc-900/90 rounded-xl border border-white/10 p-3 flex flex-col space-y-2 overflow-y-auto text-xs">
                <div className="px-2 py-1.5 rounded-lg bg-white/10 text-white font-medium flex items-center gap-2">
                  <Home className="w-3.5 h-3.5" /> <span>Home</span>
                </div>
                <div className="px-2 py-1.5 rounded-lg text-zinc-300 flex items-center gap-2">
                  <span>Subscriptions</span>
                </div>
                {!isRefined ? (
                  <>
                    <div className="px-2 py-1 rounded bg-red-950/40 text-red-400 border border-red-500/30 flex items-center justify-between text-[11px]">
                      <span>⚡ Shorts</span>
                      <span className="text-[8px] bg-red-600 text-white px-1 rounded">TRAP</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[10px] text-zinc-500 uppercase font-bold">
                      Explore (Algorithmic)
                    </div>
                    <div className="px-2 py-1 rounded text-red-300/80 bg-red-950/20 flex justify-between text-[11px]">
                      <span>Trending 🔥</span>
                      <span className="text-[8px] text-zinc-500">Distraction</span>
                    </div>
                    <div className="px-2 py-1 rounded text-zinc-400 text-[11px]">Music & Gaming 🎮</div>
                    <div className="px-2 py-1 rounded text-zinc-400 text-[11px]">News & Sports 🏆</div>
                    <div className="pt-2 border-t border-white/10 text-[10px] text-zinc-500 uppercase font-bold">
                      More From YouTube
                    </div>
                    <div className="px-2 py-1 rounded text-zinc-400 text-[11px]">YouTube Premium ($)</div>
                    <div className="px-2 py-1 rounded text-zinc-400 text-[11px]">YouTube Studio</div>
                  </>
                ) : (
                  <div className="p-3 mt-4 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-center space-y-1">
                    <ShieldCheck className="w-5 h-5 mx-auto text-emerald-400" />
                    <p className="text-[11px] font-semibold">Distraction Sections Purged</p>
                    <p className="text-[9px] text-zinc-400">Explore, Shorts, Premium promos, and legal clutter removed.</p>
                  </div>
                )}
              </div>
              <div className="flex-1 bg-zinc-950 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center text-center">
                <span className="text-3xl mb-2">{isRefined ? '📐' : '📦'}</span>
                <h4 className="text-xs font-bold text-white mb-1">
                  {isRefined ? 'Maximized Edge-to-Edge Canvas' : 'Cramped 240px Navigation Penalty'}
                </h4>
                <p className="text-[11px] text-zinc-400 max-w-xs">
                  {isRefined 
                    ? 'Sidebar collapses completely or remains strictly essential, giving maximum room for video playback.' 
                    : 'Dense left rail continuously tempts with trending topics and commercial services.'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'header':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-400" /> Masthead & Top Navigation Focus
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Centered Search Sanctuary' : 'Cluttered Masthead'}
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-4 p-2">
              <div className="h-14 bg-zinc-900 rounded-xl border border-white/10 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-6 rounded flex items-center justify-center font-bold text-xs ${isRefined ? 'bg-zinc-700 text-zinc-300' : 'bg-red-600 text-white'}`}>
                    ▶
                  </div>
                  <span className={`font-bold tracking-tight text-sm ${isRefined ? 'text-zinc-400' : 'text-white'}`}>YouTube</span>
                </div>
                <div className={`${isRefined ? 'w-full max-w-md mx-6' : 'w-72'} h-9 bg-zinc-950 border border-zinc-700 rounded-full px-4 flex items-center justify-between text-xs text-zinc-400`}>
                  <span>{isRefined ? 'Search deliberately without suggestions...' : 'Search YouTube'}</span>
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-3">
                  {!isRefined ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-300">
                        📹+
                      </div>
                      <div className="relative w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                        🔔
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">9+</span>
                      </div>
                    </>
                  ) : (
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 font-mono">
                      Quiet Header Active
                    </div>
                  )}
                  <div className={`w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ${isRefined ? 'opacity-30' : 'opacity-100'}`}>
                    U
                  </div>
                </div>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 text-center text-xs text-zinc-400">
                {isRefined ? (
                  <p className="text-emerald-300 font-medium">
                    ✓ Red badge counters removed • Centered wide search bar • Autocomplete suggestions silenced • Create camera icon hidden
                  </p>
                ) : (
                  <p className="text-red-400 font-medium">
                    ⚠ Urgent red notification badges provoke dopamine checking • Cluttered search bar with pushy predictive autocomplete
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-purple-400" /> Search Results Purity
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Exact Keyword Matches Only' : 'Algorithmic Injections Included'}
              </span>
            </div>
            <div className="flex-1 pt-2 space-y-2 overflow-y-auto">
              {/* Direct query match */}
              <div className="flex gap-3 p-2 rounded-xl bg-zinc-900 border border-white/10 items-center">
                <div className="w-24 h-14 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-mono text-zinc-400">
                  Video
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-bold text-white">Full Python Programming Course for Beginners</p>
                  <p className="text-[10px] text-zinc-400">FreeCodeAcademy • 5.1M views</p>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Exact Match
                </span>
              </div>

              {!isRefined ? (
                <>
                  <div className="p-2 rounded-xl bg-red-950/20 border border-red-500/30">
                    <div className="flex items-center justify-between text-[10px] text-red-400 font-bold mb-1">
                      <span>People also watched (Unrelated Rabbit Hole)</span>
                      <span className="bg-red-600 text-white px-1.5 rounded text-[8px]">INJECTION</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-300">
                      <div className="p-1 bg-zinc-900 rounded">Celebrity Scandal Exposed</div>
                      <div className="p-1 bg-zinc-900 rounded">Top 10 Craziest Stunts</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/20 border border-amber-500/30 flex justify-between items-center text-xs">
                    <span className="text-amber-300 text-[10px]">Ad / Sponsored Channel Spotlight</span>
                    <span className="text-[9px] bg-amber-500 text-black px-1.5 rounded font-bold">SPONSORED</span>
                  </div>
                </>
              ) : (
                <div className="flex gap-3 p-2 rounded-xl bg-zinc-900 border border-white/10 items-center">
                  <div className="w-24 h-14 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-mono text-zinc-400">
                    Video 2
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-white">Python Data Structures & Algorithms Deep Dive</p>
                    <p className="text-[10px] text-zinc-400">MIT OpenCourseWare • 820K views</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    Relevant Match
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'mindful':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" /> Mindful Friction & Habit Checkpoint
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-teal-500/20 text-teal-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Intentional Guardrails Active' : 'Zero Friction (Vulnerable to Binging)'}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              {isRefined ? (
                <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 max-w-sm space-y-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center font-bold text-sm mx-auto">
                    5s
                  </div>
                  <h4 className="text-sm font-bold text-white">Take a breath. What are you here to watch?</h4>
                  <p className="text-xs text-zinc-400">
                    A gentle 5-second checkpoint breaks compulsive opening habits and encourages intentional query searches.
                  </p>
                  <div className="flex justify-center gap-2 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">30-Min Session Timer</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">PIN Lock Option</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-zinc-400 text-xs max-w-sm">
                  <div className="text-4xl">⏱️ ➔ ⏳ ➔ 💤</div>
                  <h4 className="text-sm font-bold text-red-400">Unchecked Habit Loops</h4>
                  <p className="text-zinc-500 text-[11px]">
                    Without intentional friction checkpoints, the average user spends 40+ minutes more on YouTube than planned due to auto-play and infinite feeds.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'custom_css':
        return (
          <div className="relative w-full h-80 bg-[#0a0a0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-purple-400" /> Live Custom CSS Engine
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                Real-Time DOM Injection
              </span>
            </div>
            <div className="flex-1 flex gap-3 pt-3 overflow-hidden text-xs">
              <div className="w-1/2 bg-black/80 rounded-xl border border-white/10 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-1">
                <div className="text-zinc-500">{'/* Live Injected Stylesheet */'}</div>
                <div>ytd-app &#123;</div>
                <div className="pl-4 text-amber-300">--yt-spec-base-background: #000000;</div>
                <div className="pl-4 text-purple-300">border-radius: 16px;</div>
                <div>&#125;</div>
                <div>#player &#123;</div>
                <div className="pl-4 text-cyan-300">box-shadow: 0 10px 40px rgba(0,0,0,0.8);</div>
                <div>&#125;</div>
              </div>
              <div className="flex-1 bg-zinc-900/80 rounded-xl border border-white/10 p-3 flex flex-col items-center justify-center text-center space-y-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h5 className="font-bold text-white text-xs">Instant Browser Styling</h5>
                <p className="text-[10px] text-zinc-400">
                  Custom CSS injects with high-specificity `!important` tags directly into the active tab without needing to restart the browser.
                </p>
              </div>
            </div>
          </div>
        );

      case 'subscriptions':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" /> Subscriptions Feed
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Clean Inbox (No Shorts / Watched Hidden)' : 'Unfiltered Feed (Shorts & Watched Clutter)'}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pt-2">
              {!isRefined ? (
                <>
                  <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 flex items-center justify-between text-[11px]">
                    <span className="text-red-300 font-bold">⚡ Shorts Shelf (6 Carousel Items)</span>
                    <span className="text-[9px] bg-red-500/30 text-red-200 px-1.5 py-0.5 rounded">High Distraction Trap</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5 opacity-50 flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-semibold text-zinc-300">Intro to Distributed Systems</p>
                      <span className="text-[10px] text-zinc-500">Watched yesterday • 100% finished</span>
                    </div>
                    <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Watched</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-semibold text-amber-200">🔴 Live in 4 days: Community Q&A</p>
                      <span className="text-[10px] text-zinc-400">Placeholder notification</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded">Premiere Trap</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-300 font-semibold">✓ Shorts shelves and watched videos automatically hidden</span>
                    <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded">Sanctuary</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-semibold text-white">Advanced Rust Memory Safety Explained</p>
                      <span className="text-[10px] text-zinc-400">Ferris Systems • 3 hours ago • 45 min</span>
                    </div>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">Unwatched Long-form</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-semibold text-white">Next.js 15 Server Actions Deep Dive</p>
                      <span className="text-[10px] text-zinc-400">Web Dev Simplified • 7 hours ago • 28 min</span>
                    </div>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">Unwatched Long-form</span>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'channel':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-400" /> Channel Profile Experience
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Streamlined Header & Tabs' : 'Cluttered Banner, Counts & Store Links'}
              </span>
            </div>
            <div className="flex-1 space-y-2 pt-2 text-xs">
              {!isRefined ? (
                <div className="space-y-2">
                  <div className="h-16 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 p-2 flex items-end justify-between">
                    <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded font-bold text-white">Creator Banner (Visual Distraction)</span>
                    <button className="text-[9px] bg-white text-black font-bold px-2 py-0.5 rounded">Store & Merch ➔</button>
                  </div>
                  <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-xl border border-white/5">
                    <div>
                      <p className="font-bold text-white">TechVisionary</p>
                      <p className="text-[10px] text-zinc-400">1.84M subscribers • 1,290 videos</p>
                    </div>
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-black text-[10px] font-bold rounded-full">
                      JOIN $4.99/mo
                    </button>
                  </div>
                  <div className="flex gap-1 overflow-x-auto text-[9px] text-zinc-400 border-b border-white/10 pb-1">
                    <span className="px-2 py-1 text-white border-b border-white">Home</span>
                    <span className="px-2 py-1">Videos</span>
                    <span className="px-2 py-1 text-rose-400">Shorts</span>
                    <span className="px-2 py-1 text-red-400">Live</span>
                    <span className="px-2 py-1">Releases</span>
                    <span className="px-2 py-1">Community</span>
                    <span className="px-2 py-1">Store</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center px-3 justify-between text-[10px] text-zinc-400">
                    <span>Banner Hidden / Grayscale Active</span>
                    <span className="text-emerald-400 font-mono">Redirects directly to /videos</span>
                  </div>
                  <div className="flex items-center justify-between bg-zinc-900/60 p-2.5 rounded-xl border border-white/10">
                    <div>
                      <p className="font-bold text-white text-xs">TechVisionary</p>
                      <p className="text-[10px] text-emerald-400 font-mono">Subscriber & video metrics hidden</p>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      Join & Store Buttons Stripped
                    </span>
                  </div>
                  <div className="flex gap-2 text-[10px] text-zinc-300 pt-1">
                    <span className="px-3 py-1 bg-white/10 text-white rounded font-semibold">Videos</span>
                    <span className="px-3 py-1 text-zinc-400 hover:text-white">Playlists</span>
                    <span className="text-[9px] text-zinc-500 py-1 ml-auto font-mono">Unwanted tabs removed</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'library':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-teal-400" /> Library / You Page
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-teal-500/20 text-teal-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Minimal Clean Shelves' : 'Heavy Account Vanity & Shelves'}
              </span>
            </div>
            <div className="flex-1 space-y-2 pt-2 text-xs">
              {!isRefined ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center font-bold">JD</div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-xs">John Doe (@johndoe)</p>
                      <p className="text-[10px] text-zinc-400">Badges • Switch Account • Google Account</p>
                    </div>
                  </div>
                  <div className="p-2 bg-red-950/20 border border-red-500/20 rounded-lg text-[10px] text-red-300 flex justify-between items-center">
                    <span>History Shelf (48 thumbnails)</span>
                    <span className="bg-red-500/30 px-1 rounded">Binge Trigger</span>
                  </div>
                  <div className="p-2 bg-zinc-900/60 rounded-lg text-[10px] text-zinc-400">Playables (Mini-Games Arcade Shelf)</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-2 rounded-xl bg-teal-950/20 border border-teal-500/30 text-teal-300 text-[11px] flex justify-between items-center">
                    <span>✓ Avatar & Account Details Suppressed</span>
                    <span className="text-[9px] bg-teal-500/30 px-2 py-0.5 rounded">Private</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white">Watch Later (12 curated videos)</span>
                    <span className="text-[9px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">Organized</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white">Custom Playlists (Study, Work, Chill)</span>
                    <span className="text-[9px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">Distraction-Free</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'embedded':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-rose-400" /> Embedded Player on Web Articles
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isRefined ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}>
                {isRefined ? 'Zero Pause Grids / Pure Cinema' : 'Pause Recommendations & Watermarks'}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-3 text-xs">
              <div className="relative w-full h-44 rounded-xl bg-zinc-950 border border-white/10 overflow-hidden flex items-center justify-center">
                {!isRefined ? (
                  <>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col p-2 justify-between">
                      <div className="flex justify-between items-center text-[10px] text-white">
                        <span className="font-bold">Awesome Tech Talk 2026</span>
                        <span className="bg-red-600 px-1.5 py-0.5 rounded text-[9px] font-bold">Watch on YouTube ↗</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 my-auto">
                        <div className="h-14 bg-zinc-800/90 rounded border border-white/10 flex items-center justify-center text-[9px] text-center text-zinc-300 p-1">
                          Shocking Twist (12M views)
                        </div>
                        <div className="h-14 bg-zinc-800/90 rounded border border-white/10 flex items-center justify-center text-[9px] text-center text-zinc-300 p-1">
                          Celebrity Drama
                        </div>
                        <div className="h-14 bg-zinc-800/90 rounded border border-white/10 flex items-center justify-center text-[9px] text-center text-zinc-300 p-1">
                          Next Up (Auto-play)
                        </div>
                      </div>
                      <div className="text-[9px] text-red-400 font-bold text-center">
                        Pause Popups & Suggestions Enabled
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-base mx-auto">
                        ▶
                      </div>
                      <p className="font-bold text-white text-xs">Pristine Uninterrupted Cinema</p>
                      <p className="text-[10px] text-zinc-400 font-mono">No watermark • No pause grids • No overlay shadows</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 'decoration':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" /> Decoration & Aesthetics Theme
              </span>
              <span className="text-[10px] font-mono text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded border border-violet-500/30">
                Custom Typography & Color Palette
              </span>
            </div>
            <div className="flex-1 p-3 flex flex-col justify-center space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-300 text-xs">Primary Accent Color</span>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500 ring-2 ring-white/20"></span>
                    <span className="w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-emerald-400"></span>
                    <span className="w-5 h-5 rounded-full bg-cyan-500"></span>
                    <span className="w-5 h-5 rounded-full bg-purple-500"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="font-semibold text-zinc-300 text-xs">Font Family Override</span>
                  <span className="text-[11px] font-mono bg-zinc-800 text-emerald-300 px-2 py-0.5 rounded">
                    Inter, system-ui, sans-serif
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="font-semibold text-zinc-300 text-xs">OLED True Black Shade</span>
                  <span className="text-[11px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                    #000000 (Pure Pitch)
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ads':
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-4">
            {isRefined ? (
              /* REFINED AD-FREE STATE */
              <div className="h-full flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-white">YouTube Refined Ad Shield • 100% Ad-Free</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    0ms Skip Speed
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-auto">
                  <div className="col-span-2 aspect-video bg-zinc-950 rounded-xl border border-white/10 relative overflow-hidden flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/70 text-white">1080p60</span>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> No In-Stream Video Ads
                      </span>
                    </div>
                    <div className="text-center">
                      <h5 className="text-xs font-bold text-white">Clean Video Stream Active</h5>
                      <p className="text-[11px] text-zinc-400">Pre-roll, mid-roll & bumper ads bypassed immediately</p>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 w-2/5"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Masthead Ad</span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Purged (0px gap)
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Sidebar Companion</span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Hidden Completely
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>✓ Anti-Detection Safe: No network aborts or video player playback freezes.</span>
                  <span className="font-mono font-bold">AdBlock Style</span>
                </div>
              </div>
            ) : (
              /* UNREFINED DEFAULT STATE (HEAVY ADS) */
              <div className="h-full flex flex-col justify-between">
                {/* Masthead Banner Ad */}
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-black font-extrabold text-[9px] px-1 rounded">AD</span>
                    <span className="font-bold">Sponsored Masthead Hero Billboard: SuperCloud Pro (40% OFF)</span>
                  </div>
                  <span className="text-[10px] text-amber-300 underline cursor-pointer">Learn More ➔</span>
                </div>

                {/* Video In-Stream Ad with Countdown */}
                <div className="grid grid-cols-3 gap-3 my-2">
                  <div className="col-span-2 aspect-video bg-zinc-900 rounded-xl border border-red-500/30 relative overflow-hidden flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-500 text-black">
                        Ad • 1 of 2 (0:15)
                      </span>
                      <span className="text-[10px] text-yellow-400 font-mono">Video will play after ad</span>
                    </div>

                    {/* Pop-up lower third banner */}
                    <div className="self-center bg-black/80 border border-yellow-500/40 p-1.5 px-3 rounded-lg text-[10px] text-zinc-200 max-w-xs text-center">
                      ⚡ Commercial Interruption • Buy New Smartphone Today
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden mr-3">
                        <div className="h-full bg-yellow-500 w-3/4"></div>
                      </div>
                      <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded text-white">
                        Skip in 5s
                      </span>
                    </div>
                  </div>

                  {/* Sidebar Companion Banner Ad */}
                  <div className="p-3 rounded-xl bg-zinc-900 border border-yellow-500/20 flex flex-col justify-between text-xs">
                    <div>
                      <span className="text-[9px] font-bold bg-yellow-400 text-black px-1 rounded">AD</span>
                      <h6 className="font-bold text-white text-xs mt-1">Sidebar Companion Display Ad</h6>
                      <p className="text-[10px] text-zinc-400 mt-1">300x250 Promotional banner slot above Up Next column.</p>
                    </div>
                    <button className="w-full py-1 text-[10px] font-bold bg-yellow-500 text-black rounded mt-2">
                      Visit Sponsor
                    </button>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-300 flex items-center justify-between">
                  <span>🚨 3 Commercial ad elements actively cluttering screen and delaying video.</span>
                  <span className="font-mono text-zinc-400">Stock YouTube</span>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="relative w-full h-80 bg-[#0f0f0f] rounded-b-xl overflow-hidden flex flex-col font-sans select-none border-t border-white/5 text-zinc-100 p-6 items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">{screenshotData.title}</h4>
            <p className="text-xs text-zinc-400 max-w-sm">
              {isRefined ? screenshotData.afterText : screenshotData.beforeText}
            </p>
            {screenshotData.highlightText && (
              <code className="text-[11px] font-mono px-3 py-1 rounded bg-black/60 text-rose-300 border border-white/10">
                {screenshotData.highlightText}
              </code>
            )}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#14161f] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
              📸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {screenshotData.title}
                </h3>
                {screenshotData.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {screenshotData.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {screenshotData.subtitle || 'Visual Reference Mockup & Before/After Comparison'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="px-6 py-2.5 bg-zinc-950/60 border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium text-[11px]">Compare Mode:</span>
            <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 border border-white/10">
              <button
                onClick={() => setViewMode('after')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                  viewMode === 'after'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ✨ Refined (After)
              </button>
              <button
                onClick={() => setViewMode('before')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                  viewMode === 'before'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🚨 Default YouTube (Before)
              </button>
            </div>
          </div>

          {screenshotData.onToggleSetting && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-xs">Setting Active:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!screenshotData.currentValue}
                  onChange={(e) => screenshotData.onToggleSetting!(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>
          )}
        </div>

        {/* Browser Mockup Window */}
        <div className="p-6 bg-zinc-950/80 flex-1 overflow-y-auto space-y-4">
          <div className="rounded-xl border border-white/10 bg-[#0f0f0f] shadow-2xl overflow-hidden">
            {/* Browser Top Bar */}
            <div className="h-8 bg-[#181a20] px-3 flex items-center justify-between border-b border-white/10 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0f0f0f] border border-white/10 text-[11px] text-zinc-400 w-1/2 max-w-xs justify-center">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="truncate">https://www.youtube.com</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <RotateCcw className="w-3 h-3" />
              </div>
            </div>

            {/* Screen Content */}
            {renderMockUi(viewMode === 'after')}
          </div>

          {/* Description Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className={`p-3.5 rounded-xl border transition-all ${
              viewMode === 'before' 
                ? 'bg-red-500/10 border-red-500/40 text-red-200' 
                : 'bg-zinc-900/60 border-white/5 text-zinc-400'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Default YouTube (Without Refined)</span>
              </div>
              <p className="leading-relaxed">
                {screenshotData.beforeText}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all ${
              viewMode === 'after' 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' 
                : 'bg-zinc-900/60 border-white/5 text-zinc-400'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>YouTube Refined Active (Zen Result)</span>
              </div>
              <p className="leading-relaxed">
                {screenshotData.afterText}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-zinc-900/90 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span className="text-[11px]">
            Screenshot reference applies to Chrome, Edge, Brave, Opera & Arc.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
