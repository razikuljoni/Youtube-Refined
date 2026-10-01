'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Minimize, 
  Search, 
  Bell, 
  Video as VideoIcon, 
  Mic, 
  Compass, 
  Home, 
  Flame, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Sparkles, 
  Tv, 
  Radio, 
  CheckCircle,
  EyeOff,
  Filter,
  RefreshCw,
  Compass as ShortsIcon,
  Sliders,
  Gauge,
  Subtitles,
  Keyboard,
  Layers,
  Settings as SettingsIcon,
  Focus,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  Heart,
  Code2,
  Cpu,
  Binary,
  Headphones
} from 'lucide-react';

const HOME_TOPIC_CHIPS = [
  { id: 'All', label: 'All', icon: Sparkles },
  { id: 'Podcasts', label: 'Podcasts', icon: Radio },
  { id: 'TypeScript', label: 'TypeScript', icon: Code2 },
  { id: 'Computer Science', label: 'Computer Science', icon: Cpu },
  { id: 'Mathematics', label: 'Mathematics', icon: Binary },
  { id: 'Ambient Music', label: 'Ambient Music', icon: Headphones },
  { id: 'System Design', label: 'System Design', icon: Layers },
  { id: 'AI & Engineering', label: 'AI & Engineering', icon: Flame },
];

interface SimulatorProps {
  settings: Record<string, any>;
  masterSwitch: boolean;
  onToggleTweak: (id: string, value?: any) => void;
  customCss?: string;
}

export default function Simulator({
  settings,
  masterSwitch,
  onToggleTweak,
  customCss = '',
}: SimulatorProps) {
  const [currentPage, setCurrentPage] = useState<'home' | 'watch' | 'subscriptions' | 'search'>('home');
  const [activeHomeChip, setActiveHomeChip] = useState('All');
  const [isPlaying, setIsPlaying] = useState(false);
  const [prevAutoTheater, setPrevAutoTheater] = useState(settings.auto_theater_mode);
  const [userTheaterOverride, setUserTheaterOverride] = useState<boolean | null>(null);

  if (settings.auto_theater_mode !== prevAutoTheater) {
    setPrevAutoTheater(settings.auto_theater_mode);
    setUserTheaterOverride(null);
  }

  const [prevAutoCaptions, setPrevAutoCaptions] = useState(settings.auto_captions_mode);
  const [userCaptionsOverride, setUserCaptionsOverride] = useState<boolean | null>(null);

  if (settings.auto_captions_mode !== prevAutoCaptions) {
    setPrevAutoCaptions(settings.auto_captions_mode);
    setUserCaptionsOverride(null);
  }
  const [searchQuery, setSearchQuery] = useState('');
  const [frictionDismissed, setFrictionDismissed] = useState(false);
  const [frictionCountdown, setFrictionCountdown] = useState(5);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const isEnabled = (key: string) => masterSwitch && !!settings[key];

  // Creator allowlist exemption check for the simulated creator: Core Tech Engineering (@coretechengineering)
  const isCurrentCreatorAllowlisted = useMemo(() => {
    if (settings.adblock_enable_allowlist === false) return false;
    const raw = settings.adblock_channel_allowlist;
    if (!raw) return false;
    const channels = (Array.isArray(raw) ? raw : String(raw).split(/[,\s;]+/))
      .map((s: string) => s.replace(/^@/, '').trim().toLowerCase())
      .filter(Boolean);
    return channels.includes('coretechengineering') || channels.includes('coretech');
  }, [settings.adblock_enable_allowlist, settings.adblock_channel_allowlist]);

  // Is ad blocking active on the current video / page?
  const isAdBlockActiveOnCurrentPage = useMemo(() => {
    if (!masterSwitch) return false;
    if (isCurrentCreatorAllowlisted) return false;
    return !!(settings.block_all_ads || settings.block_video_instream_ads || settings.hide_banner_ads || settings.hide_masthead_ads);
  }, [masterSwitch, isCurrentCreatorAllowlisted, settings.block_all_ads, settings.block_video_instream_ads, settings.hide_banner_ads, settings.hide_masthead_ads]);

  // Dynamic quality resolution string
  const getQualityBadgeLabel = () => {
    switch (settings.default_video_quality) {
      case 'hd2160': return '4K 2160p Ultra HD';
      case 'hd1440': return '1440p QHD';
      case 'hd1080': return '1080p60 Full HD';
      case 'hd720': return '720p HD';
      case 'large': return '480p SD';
      case 'small': return '240p';
      default: return '1080p60 Full HD';
    }
  };

  const theaterMode = userTheaterOverride !== null ? userTheaterOverride : (masterSwitch && !!settings.auto_theater_mode);
  const captionsActive = userCaptionsOverride !== null ? userCaptionsOverride : (settings.auto_captions_mode === 'always_on');
  const showFrictionModal = masterSwitch && !!settings.enable_intentional_friction_pause && currentPage === 'home' && !frictionDismissed;
  const focusModeActive = isEnabled('focus_mode_cinema');

  // Mindfulness countdown timer
  useEffect(() => {
    if (!showFrictionModal) return;

    const timer = setInterval(() => {
      setFrictionCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showFrictionModal]);

  // Grid columns class based on settings.home_grid_columns
  const getGridColsClass = () => {
    const cols = settings.home_grid_columns;
    if (cols === '2') return 'grid-cols-1 sm:grid-cols-2';
    if (cols === '3') return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    if (cols === '4') return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
    if (cols === '5') return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
    if (cols === '6') return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6';
    return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'; // default
  };

  const getVideoThumbnailStyle = (video: { watchedProgress?: number }) => {
    let style: React.CSSProperties = {};
    if (isEnabled('blur_thumbnails_until_hover')) {
      const radius = settings.thumbnail_blur_amount || 12;
      style.filter = `blur(${radius}px)`;
    } else if (isEnabled('blur_dim_watched_videos') && video.watchedProgress) {
      const blurPx = settings.watched_video_blur_level ?? 8;
      const opacityVal = (settings.watched_video_opacity_level ?? 40) / 100;
      style.filter = `blur(${blurPx}px) opacity(${opacityVal})`;
    }
    return style;
  };

  // Sample realistic YouTube video database
  const sampleVideos = [
    {
      id: 'v1',
      title: 'How Operating Systems Actually Work (Under the Hood)',
      author: 'Core Tech Engineering',
      views: '1.4M views',
      time: '3 months ago',
      duration: '42:15',
      channelVerified: true,
      color: 'from-amber-600 to-orange-900',
      category: 'Computer Science',
      badge: 'Deep Dive',
      watchedProgress: 0.85
    },
    {
      id: 'v2',
      title: 'Building a Distributed Cache from Scratch in Rust',
      author: 'Systems Architect',
      views: '620K views',
      time: '2 weeks ago',
      duration: '28:40',
      channelVerified: true,
      color: 'from-cyan-600 to-blue-900',
      category: 'Coding',
      badge: 'Technical'
    },
    {
      id: 'v3',
      title: 'The Hidden Mathematics of Modern Cryptography',
      author: 'Number Theory Daily',
      views: '890K views',
      time: '5 days ago',
      duration: '19:04',
      channelVerified: true,
      color: 'from-purple-600 to-indigo-950',
      category: 'Mathematics',
      badge: 'Lecture'
    },
    {
      id: 'v4',
      title: 'Ambient Deep Focus Work Music (Binaural Beats 432Hz)',
      author: 'Mindful Soundscapes',
      views: '3.1M views',
      time: '1 year ago',
      duration: '3:00:00',
      channelVerified: true,
      color: 'from-emerald-700 to-teal-950',
      category: 'Focus',
      badge: 'Audio'
    },
    {
      id: 'v5',
      title: 'Understanding Database Indexing: B-Trees vs LSM Trees',
      author: 'Backend Mastery',
      views: '410K views',
      time: '1 month ago',
      duration: '34:12',
      channelVerified: true,
      color: 'from-red-600 to-rose-950',
      category: 'Databases',
      badge: 'Architecture',
      watchedProgress: 1.0
    },
    {
      id: 'v6',
      title: 'Why Most Modern Web Apps Feel Cluttered and Slow',
      author: 'Design & Code Craft',
      views: '980K views',
      time: '4 weeks ago',
      duration: '16:55',
      channelVerified: true,
      color: 'from-violet-600 to-purple-900',
      category: 'Design',
      badge: 'Productivity'
    },
  ];

  const sampleShorts = [
    { id: 's1', title: 'Top 3 Terminal productivity tricks #coding', views: '2.4M', color: 'from-rose-500 to-pink-700' },
    { id: 's2', title: 'Why RAM speed matters more than you think #hardware', views: '890K', color: 'from-amber-500 to-red-700' },
    { id: 's3', title: '1-minute explanation of Git rebase vs merge #git', views: '1.8M', color: 'from-cyan-500 to-blue-700' },
    { id: 's4', title: 'Best free tools for software engineers #tips', views: '950K', color: 'from-purple-500 to-indigo-700' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Live Custom CSS Style Injection tag */}
      {masterSwitch && settings.enable_custom_css && customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}

      {/* Simulator Control Toolbar */}
      <div className="bg-[#121319] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live YouTube Interactive Simulator</span>
          </div>
          <span className="text-zinc-500 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">
            Reflecting settings in real-time
          </span>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setCurrentPage('home')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'home' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Home Feed
          </button>
          <button
            onClick={() => setCurrentPage('watch')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'watch' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Watch Player
          </button>
          <button
            onClick={() => setCurrentPage('subscriptions')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'subscriptions' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setCurrentPage('search')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentPage === 'search' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Search
          </button>
        </div>

        {/* Live Playback Indicator Pills */}
        <div className="flex items-center gap-2">
          {settings.default_video_quality && typeof settings.default_video_quality === 'string' && settings.default_video_quality !== 'auto' && (
            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              <span>{String(settings.default_video_quality).replace('hd', '')}p</span>
            </span>
          )}

          {settings.custom_playback_speed && settings.custom_playback_speed !== '1.0' && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1">
              <span>{settings.custom_playback_speed}x Speed</span>
            </span>
          )}

          {settings.home_grid_columns && settings.home_grid_columns !== 'default' && (
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>{settings.home_grid_columns} Cols</span>
            </span>
          )}

          {/* Ad Shield Status Indicator */}
          {isEnabled('block_all_ads') || isEnabled('block_video_instream_ads') || isEnabled('hide_masthead_ads') ? (
            <button
              onClick={() => onToggleTweak('block_all_ads', false)}
              className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Click to unblock ads"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Ad Shield: 100% Ad-Free</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleTweak('block_all_ads', true)}
              className="px-2.5 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Click to enable Master Ad Shield"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Ads Visible (Click to Block)</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulated YouTube Window Frame */}
      <div className={`relative bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all ${
        isEnabled('clean_sans_serif_font') ? 'font-sans' : 'font-sans'
      }`}>
        
        {/* Intentional Friction Breathing Prompt Modal */}
        {showFrictionModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="max-w-md w-full bg-[#18181b] border border-white/20 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold animate-pulse">
                {frictionCountdown > 0 ? frictionCountdown : '✓'}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Mindful Pause</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Take a breath. What specific knowledge or video did you open YouTube for today?
                </p>
              </div>

              <input
                type="text"
                placeholder="e.g. Docker container networking tutorial..."
                className="w-full bg-zinc-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  disabled={frictionCountdown > 0}
                  onClick={() => setFrictionDismissed(true)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                    frictionCountdown > 0
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  {frictionCountdown > 0 ? `Wait ${frictionCountdown}s to breathe...` : 'Enter YouTube Intentionally'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. YOUTUBE MASTHEAD / HEADER */}
        {focusModeActive && currentPage === 'watch' ? (
          <header className="h-11 bg-[#0b0c10] border-b border-white/10 px-4 flex items-center justify-between text-xs select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
                <Focus className="w-3.5 h-3.5 text-rose-400" />
                Focus Mode Active
              </span>
              <span className="text-zinc-500 text-[11px] hidden sm:inline">— Video Player & Comments Only (All Other UI Hidden)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-zinc-400 hover:text-white text-[11px] flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
              <button
                onClick={() => onToggleTweak('focus_mode_cinema', false)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium transition-colors border border-white/5"
              >
                Exit Focus Mode
              </button>
            </div>
          </header>
        ) : (
          <header className="h-14 bg-[#0f0f0f] border-b border-[#272727] px-4 flex items-center justify-between gap-4 select-none">
            {/* Brand Left */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-[#272727] text-zinc-300">
                <div className="space-y-1 w-4">
                  <div className="h-0.5 bg-current"></div>
                  <div className="h-0.5 bg-current"></div>
                  <div className="h-0.5 bg-current"></div>
                </div>
              </button>

              <div 
                onClick={() => setCurrentPage('home')}
                className={`flex items-center gap-1 cursor-pointer transition-opacity ${
                  isEnabled('hide_youtube_logo') ? 'opacity-30 grayscale' : 'opacity-100'
                }`}
              >
                <div className="w-7 h-5 rounded-md bg-red-600 flex items-center justify-center text-white">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span className="font-bold text-white tracking-tighter text-base">YouTube</span>
                <span className="text-[10px] text-zinc-400 self-start ml-0.5 font-medium">Refined</span>
              </div>
            </div>

            {/* Search Bar Center */}
            <div className={`flex-1 ${isEnabled('center_search_bar') ? 'max-w-2xl mx-auto' : 'max-w-xl'} flex items-center justify-center gap-2`}>
              <div className="w-full flex items-center bg-[#121212] border border-[#303030] rounded-full overflow-hidden focus-within:border-blue-500">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
                <button 
                  onClick={() => setCurrentPage('search')}
                  className="bg-[#222222] hover:bg-[#2a2a2a] px-5 py-2 border-l border-[#303030] text-zinc-300"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {!isEnabled('hide_voice_search_mic') && (
                <button className="p-2.5 rounded-full bg-[#222] hover:bg-[#333] text-zinc-300">
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User & Actions Right */}
            <div className="flex items-center gap-2">
              {!isEnabled('hide_create_button') && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#272727] hover:bg-[#383838] text-xs font-semibold text-white">
                  <VideoIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Create</span>
                </button>
              )}

              {!isEnabled('hide_notification_bell') && (
                <button className="p-2 rounded-full hover:bg-[#272727] text-zinc-300 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600"></span>
                </button>
              )}

              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/20 transition-opacity ${
                isEnabled('hide_user_avatar_menu') ? 'opacity-15 grayscale' : 'opacity-100'
              }`}>
                U
              </div>
            </div>
          </header>
        )}

        {/* 2. BODY CONTENT (SIDEBAR + MAIN CANVAS) */}
        <div className="flex">
          {/* LEFT SIDEBAR GUIDE */}
          {!isEnabled('hide_sidebar_guide') && (!focusModeActive || currentPage !== 'watch') && (
            <aside className="w-56 flex-shrink-0 bg-[#0f0f0f] border-r border-[#272727] p-3 hidden lg:flex flex-col gap-1 text-xs">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  currentPage === 'home' ? 'bg-[#272727] text-white font-semibold' : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              {!isEnabled('block_all_shorts') && (
                <button 
                  onClick={() => alert('Shorts clicked (Auto-redirects to regular video if enabled)')}
                  className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-zinc-400 hover:bg-[#1a1a1a] hover:text-white font-medium"
                >
                  <ShortsIcon className="w-4 h-4 text-red-500" />
                  <span>Shorts</span>
                </button>
              )}

              {!isEnabled('hide_sidebar_subscriptions_nav') && (
                <button 
                  onClick={() => setCurrentPage('subscriptions')}
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                    currentPage === 'subscriptions' ? 'bg-[#272727] text-white font-semibold' : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  <span>Subscriptions</span>
                </button>
              )}

              <div className="my-2 border-t border-[#272727]"></div>

              {!isEnabled('hide_sidebar_subscriptions') && (
                <div className="space-y-1">
                  <span className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Subscriptions</span>
                  {['Veritasium', '3Blue1Brown', 'Fireship', 'Lex Fridman', 'Computerphile'].map((name) => (
                    <button key={name} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:bg-[#1a1a1a] hover:text-white text-left">
                      <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] text-white font-bold">
                        {name[0]}
                      </div>
                      <span className="truncate">{name}</span>
                    </button>
                  ))}
                </div>
              )}

              {!isEnabled('hide_sidebar_explore') && (
                <>
                  <div className="my-2 border-t border-[#272727]"></div>
                  <span className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Explore</span>
                  <div className="flex items-center gap-4 px-3 py-2 text-zinc-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg">
                    <Flame className="w-4 h-4" />
                    <span>Trending</span>
                  </div>
                  <div className="flex items-center gap-4 px-3 py-2 text-zinc-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg">
                    <Radio className="w-4 h-4" />
                    <span>Podcasts</span>
                  </div>
                </>
              )}

              {!isEnabled('hide_sidebar_footer') && (
                <div className="mt-auto pt-4 text-[10px] text-zinc-600 px-3 space-y-1">
                  <p>About Press Copyright</p>
                  <p>Contact us Creators</p>
                  <p>© 2026 YouTube Refined Lab</p>
                </div>
              )}
            </aside>
          )}

          {/* MAIN PAGE VIEW CONTAINER */}
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-h-[750px] relative">
            
            {/* ======================= VIEW: HOME PAGE ======================= */}
            {currentPage === 'home' && (
              <div className="space-y-6">
                
                {/* Topic Filter Chips with domain icons & modern segmented design */}
                {!isEnabled('hide_home_chips') && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
                    {HOME_TOPIC_CHIPS.map((chip) => {
                      const IconComponent = chip.icon;
                      const isActive = activeHomeChip === chip.id;
                      return (
                        <button
                          key={chip.id}
                          onClick={() => setActiveHomeChip(chip.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                            isActive
                              ? 'bg-white text-black border-white shadow-sm'
                              : 'bg-[#272727] text-zinc-300 border-white/5 hover:bg-[#383838] hover:text-white'
                          }`}
                        >
                          <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                          <span>{chip.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* If Home Feed is hidden -> Zen Sanctuary Mode */}
                {isEnabled('hide_home_feed') ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Intentional Sanctuary Active</h2>
                    <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                      Algorithmic home recommendations have been removed. Use the top search bar above to look up specific tutorials, lectures, or music.
                    </p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setCurrentPage('subscriptions')}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-white/10"
                      >
                        View Subscriptions Feed
                      </button>
                      <button 
                        onClick={() => setCurrentPage('watch')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 text-xs font-semibold text-white shadow-md"
                      >
                        Open Sample Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* YOUTUBE MASTHEAD HERO AD BILLBOARD */}
                    {!isEnabled('block_all_ads') && !isEnabled('hide_masthead_ads') && !isEnabled('hide_banner_ads') && (
                      <div className="relative rounded-2xl bg-gradient-to-r from-[#171923] via-[#1b1e2e] to-[#12141c] border border-amber-500/30 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl transition-all animate-in fade-in">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-400 text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded tracking-wide">
                              AD • SPONSORED
                            </span>
                            <span className="text-xs font-semibold text-zinc-300">CloudScale Serverless Databases</span>
                            <code className="text-[10px] font-mono text-amber-300/80 bg-zinc-900/80 px-1.5 py-0.5 rounded border border-white/10 hidden sm:inline">
                              &lt;ytd-banner-promo-renderer&gt;
                            </code>
                          </div>
                          <h3 className="text-base font-bold text-white tracking-tight">
                            Ultra-Low Latency Edge Databases for Modern Full-Stack Applications
                          </h3>
                          <p className="text-xs text-zinc-400 line-clamp-1">
                            Deploy globally replicated PostgreSQL and Redis with automated scale-to-zero in 45 cloud regions.
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <button 
                            onClick={() => onToggleTweak('hide_masthead_ads', true)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-semibold transition-colors"
                            title="Test hiding this ad"
                          >
                            Hide Ad ✕
                          </button>
                          <button 
                            onClick={() => onToggleTweak('block_all_ads', true)}
                            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-md"
                          >
                            Block All Ads 🛡️
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Active Recommendation Feed with Column Settings */}
                    <div className={`grid ${getGridColsClass()} gap-5`}>
                      {sampleVideos.map((video, idx) => (
                        <React.Fragment key={video.id}>
                          {/* IN-FEED SPONSORED AD SLOT (Zero-gap collapse when blocked) */}
                          {idx === 1 && !isEnabled('block_all_ads') && !isEnabled('hide_banner_ads') && (
                            <div className="space-y-2.5 p-3 rounded-2xl bg-gradient-to-br from-[#191b26] to-[#12131b] border border-amber-500/30 flex flex-col justify-between shadow-lg relative group transition-all animate-in fade-in">
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-r from-amber-900/50 to-purple-900/50 p-3 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                  <span className="bg-amber-400 text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow">
                                    AD • SPONSORED
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleTweak('hide_banner_ads', true);
                                    }}
                                    className="text-zinc-400 hover:text-white text-xs bg-black/60 px-1.5 py-0.5 rounded transition-colors"
                                    title="Zero-gap collapse this ad slot"
                                  >
                                    Hide Ad ✕
                                  </button>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-white leading-tight block">Serverless Vector DBs</span>
                                  <span className="text-[10px] text-amber-200">Scale AI apps with zero cold start</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-xs font-bold text-white line-clamp-1">Vector Search with Sub-10ms Latency</h3>
                                <p className="text-[11px] text-zinc-400">Zero-gap collapsible commercial slot.</p>
                              </div>
                            </div>
                          )}

                          <div 
                            onClick={() => setCurrentPage('watch')}
                            className="group cursor-pointer space-y-2.5"
                          >
                            {/* Video Thumbnail */}
                            <div 
                              style={getVideoThumbnailStyle(video)}
                              className={`relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${video.color} p-4 flex flex-col justify-between transition-all duration-300 ${
                                isEnabled('grayscale_thumbnails') ? 'grayscale hover:grayscale-0' : ''
                              } ${isEnabled('blur_dim_watched_videos') && video.watchedProgress ? 'group-hover:filter-none group-hover:opacity-100' : ''}`}
                            >
                              <span className="self-start text-[11px] font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white/90">
                                {video.badge}
                              </span>
                              
                              <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 rounded-full bg-black/70 text-white flex items-center justify-center backdrop-blur-sm">
                                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                                </div>
                              </div>

                              {/* Duration Badge */}
                              {!isEnabled('hide_video_duration_badges') && (
                                <span className="self-end text-[11px] font-semibold px-1.5 py-0.5 rounded bg-black/80 text-white">
                                  {video.duration}
                                </span>
                              )}

                              {/* Watched Progress Line */}
                              {video.watchedProgress && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700/80 overflow-hidden">
                                  <div 
                                    className="h-full bg-red-600" 
                                    style={{ width: `${Math.round(video.watchedProgress * 100)}%` }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Video Info Metadata */}
                            <div className="flex gap-3">
                              <div className="w-9 h-9 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center font-bold text-xs text-white">
                                {video.author[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                                  {video.title}
                                </h3>
                                <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                                  <span>{video.author}</span>
                                  {video.channelVerified && <CheckCircle className="w-3 h-3 text-zinc-400 fill-zinc-400 text-black" />}
                                </p>
                                {!isEnabled('hide_view_count_and_date') && (
                                  <p className="text-xs text-zinc-500">
                                    {video.views} • {video.time}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>

                    {/* SHORTS CAROUSEL SHELF */}
                    {!isEnabled('block_all_shorts') && !isEnabled('hide_home_shorts_shelf') && (
                      <div className="pt-6 border-t border-[#272727] space-y-4">
                        <div className="flex items-center gap-2">
                          <ShortsIcon className="w-5 h-5 text-red-500" />
                          <h3 className="text-base font-bold text-white">Shorts</h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {sampleShorts.map((short) => (
                            <div 
                              key={short.id}
                              style={getVideoThumbnailStyle({})}
                              className={`aspect-[9/16] rounded-xl bg-gradient-to-b ${short.color} p-3 flex flex-col justify-end relative overflow-hidden group cursor-pointer ${
                                isEnabled('grayscale_thumbnails') ? 'grayscale hover:grayscale-0' : ''
                              }`}
                            >
                              <h4 className="text-xs font-semibold text-white leading-tight line-clamp-2">
                                {short.title}
                              </h4>
                              <span className="text-[10px] text-zinc-300 mt-1">{short.views} views</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EXPLORE MORE TOPICS SHELF */}
                    {!isEnabled('hide_home_explore_more_topics') && (
                      <div className="pt-6 border-t border-[#272727] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-rose-400" />
                            <h3 className="text-sm font-bold text-white">Explore more topics</h3>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">Suggested categories</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Quantum Computing', 'Rust Systems', 'Linear Algebra', 'Distributed Systems', 'UI Architecture', 'Kernel Development'].map((topic) => (
                            <button
                              key={topic}
                              className="px-3 py-1.5 rounded-full bg-[#1e2028] hover:bg-[#282a36] text-xs font-medium text-zinc-200 border border-white/10 transition-colors"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MOST RELEVANT SHELF */}
                    {!isEnabled('hide_home_most_relevant') && (
                      <div className="pt-6 border-t border-[#272727] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-sm font-bold text-white">Most relevant for your subscriptions</h3>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">Curated picks</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {sampleVideos.slice(2, 4).map((rel) => (
                            <div key={'rel_' + rel.id} onClick={() => setCurrentPage('watch')} className="flex gap-3 bg-[#161822]/60 p-2.5 rounded-xl border border-white/5 hover:border-white/15 cursor-pointer transition-all">
                              <div className={`w-32 aspect-video rounded-lg bg-gradient-to-br ${rel.color} flex-shrink-0 flex items-end p-1`}>
                                <span className="text-[10px] font-semibold bg-black/80 px-1 rounded text-white">{rel.duration}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-semibold text-white truncate">{rel.title}</h4>
                                <p className="text-[11px] text-zinc-400 mt-1">{rel.author}</p>
                                <span className="text-[10px] text-zinc-500">{rel.views}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ======================= VIEW: WATCH VIDEO ======================= */}
            {currentPage === 'watch' && (
              <div className={`grid gap-6 ${theaterMode || isEnabled('hide_related_sidebar') || focusModeActive ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-3'}`}>
                
                {/* VIDEO PLAYER & METADATA COLUMN */}
                <div className={`${theaterMode || isEnabled('hide_related_sidebar') || focusModeActive ? 'col-span-1 max-w-5xl mx-auto w-full' : 'xl:col-span-2'} space-y-4`}>
                  
                  {/* The Video Player Screen */}
                  <div className={`relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 flex flex-col justify-between p-4 shadow-2xl transition-all ${
                    !isEnabled('disable_ambient_mode') ? 'ring-8 ring-indigo-500/20 shadow-indigo-500/10' : ''
                  }`}>
                    {/* Simulated Ambient Lighting Canvas Glow */}
                    {!isEnabled('disable_ambient_mode') && (
                      <div className="absolute -inset-4 bg-gradient-to-r from-red-600/30 via-indigo-600/30 to-purple-600/30 blur-2xl -z-10 pointer-events-none"></div>
                    )}

                    {/* Top Watermark / Status */}
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        {isCurrentCreatorAllowlisted ? (
                          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1.5 animate-in fade-in">
                            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                            <span>Creator Exempt (@coretechengineering) • Ads Shown</span>
                          </span>
                        ) : !isAdBlockActiveOnCurrentPage ? (
                          <span className="bg-yellow-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <span>Ad • 1 of 2 (0:05)</span>
                          </span>
                        ) : (
                          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white flex items-center gap-1.5 border border-emerald-500/20 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>{getQualityBadgeLabel()}</span>
                            <span className="text-[10px] text-emerald-400 font-normal">🛡️ Ad-Free (0ms Fast-Skip)</span>
                          </span>
                        )}
                        {settings.custom_playback_speed && settings.custom_playback_speed !== '1.0' && (
                          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 text-[10px] font-semibold">
                            {settings.custom_playback_speed}x Pace
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!isCurrentCreatorAllowlisted && !isAdBlockActiveOnCurrentPage && (
                          <button 
                            onClick={() => onToggleTweak('block_video_instream_ads', true)}
                            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-2.5 py-1 rounded-md border border-yellow-500/40 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Auto-Skip Ad (0ms) ➔
                          </button>
                        )}
                        {isCurrentCreatorAllowlisted && (
                          <span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded text-[10px] font-medium border border-rose-500/20">
                            Creator Supported
                          </span>
                        )}
                        {isEnabled('disable_autoplay_toggle') && (
                          <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/30 font-medium">
                            Autoplay Locked OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Center Action */}
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-transform hover:scale-110"
                      >
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1 fill-current" />}
                      </button>
                    </div>

                    {/* Closed Captions Live Banner */}
                    {captionsActive && (
                      <div className="self-center bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/10 text-white text-xs font-medium max-w-lg text-center animate-in fade-in duration-200">
                        [Speaker]: The CPU scheduler switches threads using hardware timer interrupts every few milliseconds.
                      </div>
                    )}

                    {/* Lower-Third In-Stream Overlay Banner (If Not Hidden and Ads Allowed) */}
                    {(isCurrentCreatorAllowlisted || !isAdBlockActiveOnCurrentPage) && !isEnabled('hide_instream_overlay_ads') && (
                      <div className="self-center bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-yellow-500/40 text-white text-xs flex items-center gap-3 animate-in fade-in max-w-md shadow-xl">
                        <span className="bg-yellow-400 text-black font-extrabold text-[9px] px-1 rounded">AD</span>
                        <span className="truncate">Sponsored: Try NextGen Cloud IDE • Free 30-Day Pro Trial</span>
                        <button 
                          onClick={() => onToggleTweak('hide_instream_overlay_ads', true)}
                          className="text-zinc-400 hover:text-white text-xs ml-auto"
                          title="Hide Overlay Banner"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Endscreen Suggestion Card Simulation (If Not Hidden) */}
                    {!isEnabled('hide_endscreen_cards') && isPlaying && (
                      <div className="absolute bottom-16 right-6 w-48 bg-[#1f1f1f]/90 border border-white/20 rounded-lg p-2.5 shadow-xl">
                        <span className="text-[10px] text-zinc-400 block mb-1">Recommended Next:</span>
                        <p className="text-xs font-semibold text-white truncate">Next Video Teaser Card</p>
                      </div>
                    )}

                    {/* Player Controls Bar */}
                    <div className="space-y-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 rounded-xl">
                      {/* Timeline bar with Ad yellow segment when active */}
                      <div className="h-1 w-full bg-zinc-700 rounded-full overflow-hidden cursor-pointer flex">
                        <div className={`h-full ${!isEnabled('block_all_ads') && !isEnabled('block_video_instream_ads') ? 'bg-yellow-400 w-1/4' : 'bg-red-600 w-1/3'} transition-all`}></div>
                        {!isEnabled('block_all_ads') && !isEnabled('block_video_instream_ads') && (
                          <div className="h-full bg-yellow-500/40 w-1.5 ml-8"></div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-zinc-300 text-xs">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>
                          <Volume2 className="w-4 h-4" />
                          <span>12:45 / 42:15</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Captions Toggle Button */}
                          <button 
                            onClick={() => setUserCaptionsOverride(!captionsActive)}
                            className={`p-1 rounded transition-colors ${
                              captionsActive ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
                            }`}
                            title="Toggle Subtitles / Captions (C)"
                          >
                            <Subtitles className="w-4 h-4" />
                          </button>

                          {/* Quality Selector */}
                          <span className="text-[11px] font-mono text-zinc-400">
                            {typeof settings.default_video_quality === 'string' ? settings.default_video_quality.replace('hd', '') : '1080'}p
                          </span>

                          {/* Focus Mode Quick Toggle */}
                          <button 
                            onClick={() => onToggleTweak('focus_mode_cinema', !focusModeActive)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all ${
                              focusModeActive
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                            }`}
                            title="Focus Mode (Video & Comments Only)"
                          >
                            <Focus className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[11px]">{focusModeActive ? 'Focus ON' : 'Focus'}</span>
                          </button>

                          <button 
                            onClick={() => setUserTheaterOverride(!theaterMode)}
                            className="hover:text-white flex items-center gap-1"
                            title="Toggle Theater Mode (T)"
                          >
                            {theaterMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            <span className="text-[11px]">{theaterMode ? 'Standard' : 'Theater'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video Title and Author Bar (Hidden in Focus Mode) */}
                  {!focusModeActive && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <h1 className="text-lg lg:text-xl font-bold text-white leading-snug">
                        How Operating Systems Actually Work (Under the Hood)
                      </h1>

                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#272727]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white">
                            C
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-sm text-white">Core Tech Engineering</span>
                              <CheckCircle className="w-3.5 h-3.5 text-zinc-400 fill-zinc-400 text-black" />
                            </div>
                            {!isEnabled('hide_view_count_and_date') && (
                              <span className="text-xs text-zinc-500">1.28M subscribers</span>
                            )}
                          </div>
                          <button className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors ml-2">
                            Subscribe
                          </button>
                          {!isEnabled('hide_channel_join_button') && (
                            <button className="px-3.5 py-1.5 rounded-full bg-[#272727] hover:bg-[#383838] border border-white/10 text-white font-semibold text-xs transition-colors">
                              Join
                            </button>
                          )}
                        </div>

                        {/* Interaction Buttons */}
                        {!isEnabled('hide_share_clip_download_bar') && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-[#272727] rounded-full overflow-hidden text-xs">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#383838] text-white">
                                <ThumbsUp className="w-4 h-4" />
                                {!isEnabled('hide_like_dislike_counts') && <span>48K</span>}
                              </button>
                              <div className="h-4 w-px bg-zinc-600"></div>
                              <button className="px-3 py-1.5 hover:bg-[#383838] text-white">
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </div>

                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#272727] hover:bg-[#383838] text-xs font-semibold text-white">
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* COMMENTS SECTION */}
                  {!isEnabled('hide_comments_section') ? (
                    isEnabled('collapse_comments_default') && !commentsExpanded ? (
                      /* Collapsed Fold Button */
                      <div className="pt-2 animate-in fade-in duration-200">
                        <button
                          onClick={() => setCommentsExpanded(true)}
                          className="w-full py-3.5 px-4 rounded-2xl bg-[#161822] hover:bg-[#1f2230] border border-white/10 text-white font-medium flex items-center justify-between transition-all group cursor-pointer shadow-lg shadow-black/40"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <div className="text-xs font-bold text-white flex items-center gap-2">
                                <span>Comments Collapsed by YouTube Refined</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-mono">428</span>
                              </div>
                              <p className="text-[11px] text-zinc-400">Click to reveal discussions on request</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-rose-400 group-hover:text-rose-300 font-semibold">
                            <span>Show Comments</span>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    ) : (
                      /* Expanded Comments */
                      <div className="pt-4 space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <div className="flex items-center gap-4">
                            <h3 className="font-bold text-white text-base">428 Comments</h3>
                            <span className="text-xs text-zinc-400">Sort by: Top comments</span>
                          </div>
                          {isEnabled('collapse_comments_default') && (
                            <button
                              onClick={() => setCommentsExpanded(false)}
                              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
                            >
                              <span>Collapse Comments</span>
                              <ChevronUp className="w-3.5 h-3.5 text-rose-400" />
                            </button>
                          )}
                        </div>

                        {/* Sample Comment Items */}
                        <div className="space-y-4">
                          <div className="flex gap-3 text-xs">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-white">
                              A
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Alex Dev</span>
                                <span className="text-zinc-500 text-[11px]">2 days ago</span>
                              </div>
                              <p className="text-zinc-300 leading-relaxed">
                                The explanation on virtual memory paging and translation lookaside buffer (TLB) at 18:20 was cleaner than my entire college lecture series!
                              </p>
                              <div className="flex items-center gap-3 text-zinc-400 pt-1">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span>241</span>
                                <ThumbsDown className="w-3.5 h-3.5" />
                                <span>Reply</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 text-xs">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center font-bold text-white">
                              S
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Sarah Lin</span>
                                <span className="text-zinc-500 text-[11px]">1 week ago</span>
                              </div>
                              <p className="text-zinc-300 leading-relaxed">
                                Rewatching this while building my toy kernel. Highly recommended resource.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                      <EyeOff className="w-4 h-4 text-rose-400" />
                      <span>Comments section hidden completely by YouTube Refined shield.</span>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: UP NEXT / RELATED VIDEOS SIDEBAR */}
                {!isEnabled('hide_related_sidebar') && !focusModeActive && (
                  <div className={`space-y-4 ${
                    isEnabled('separate_scroll_related_sidebar')
                      ? 'max-h-[580px] overflow-y-auto pr-2 custom-scrollbar border-l border-white/10 pl-3 bg-zinc-950/40 rounded-xl p-3'
                      : ''
                  }`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm">Related Videos</h3>
                      {isEnabled('separate_scroll_related_sidebar') && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Independent Scroll
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      {/* SIDEBAR COMPANION AD (IF NOT BLOCKED OR CREATOR ALLOWLISTED) */}
                      {(isCurrentCreatorAllowlisted || (!isEnabled('block_all_ads') && !isEnabled('hide_sidebar_companion_ads') && !isEnabled('hide_banner_ads'))) && (
                        <div className="p-3 rounded-xl bg-zinc-900 border border-amber-500/25 space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold bg-amber-400 text-black px-1.5 py-0.5 rounded">AD</span>
                              <code className="text-[9px] font-mono text-zinc-400">&lt;ytd-ad-slot-renderer&gt;</code>
                            </div>
                            <button 
                              onClick={() => onToggleTweak('hide_sidebar_companion_ads', true)}
                              className="text-[10px] text-zinc-400 hover:text-white"
                              title="Hide Companion Ad"
                            >
                              Hide ad ✕
                            </button>
                          </div>
                          <div className="aspect-[3/1] bg-gradient-to-r from-indigo-900 via-purple-900 to-zinc-900 rounded-lg p-2 flex flex-col justify-end">
                            <span className="text-xs font-bold text-white leading-tight">Hire Senior Rust Engineers</span>
                            <span className="text-[10px] text-indigo-300">Global Tech Talent Marketplace</span>
                          </div>
                        </div>
                      )}

                      {sampleVideos.slice(1, 5).map((related) => (
                        <div 
                          key={related.id} 
                          className="flex gap-3 group cursor-pointer"
                        >
                          <div 
                            style={getVideoThumbnailStyle(related)}
                            className={`w-36 aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${related.color} flex-shrink-0 flex items-end p-1.5 ${
                              isEnabled('grayscale_thumbnails') ? 'grayscale hover:grayscale-0' : ''
                            } ${isEnabled('blur_dim_watched_videos') && related.watchedProgress ? 'group-hover:filter-none group-hover:opacity-100' : ''}`}
                          >
                            <span className="text-[10px] font-semibold px-1 rounded bg-black/80 text-white">
                              {related.duration}
                            </span>
                            {related.watchedProgress && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-700/80 overflow-hidden">
                                <div 
                                  className="h-full bg-red-600" 
                                  style={{ width: `${Math.round(related.watchedProgress * 100)}%` }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-blue-400 leading-tight">
                              {related.title}
                            </h4>
                            <p className="text-[11px] text-zinc-400 mt-1">{related.author}</p>
                            {!isEnabled('hide_view_count_and_date') && (
                              <p className="text-[10px] text-zinc-500">{related.views}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ======================= VIEW: SUBSCRIPTIONS FEED ======================= */}
            {currentPage === 'subscriptions' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Subscriptions (Clean Chronological Feed)</h2>
                  <span className="text-xs text-emerald-400 font-medium">✓ No Shorts or algorithmic bait</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sampleVideos.slice(0, 4).map((video) => (
                    <div key={video.id} onClick={() => setCurrentPage('watch')} className="cursor-pointer space-y-2">
                      <div 
                        style={getVideoThumbnailStyle(video)}
                        className={`aspect-video rounded-xl bg-gradient-to-br ${video.color} p-3 flex flex-col justify-between ${
                          isEnabled('grayscale_thumbnails') ? 'grayscale hover:grayscale-0' : ''
                        }`}
                      >
                        <span className="self-end text-[11px] font-semibold px-1.5 py-0.5 rounded bg-black/80 text-white">
                          {video.duration}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white line-clamp-2">{video.title}</h3>
                      <p className="text-xs text-zinc-400">{video.author} • {video.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================= VIEW: SEARCH RESULTS ======================= */}
            {currentPage === 'search' && (
              <div className="space-y-5 max-w-4xl">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-[#272727] pb-3">
                  <span>Results for &ldquo;{searchQuery || 'system architecture'}&rdquo;</span>
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filters</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* SPONSORED SEARCH PROMOTED RESULT (IF NOT BLOCKED) */}
                  {!isEnabled('block_all_ads') && !isEnabled('hide_search_sponsored_ads') && (
                    <div className="p-3.5 rounded-xl bg-[#161824] border border-amber-500/25 flex flex-col sm:flex-row gap-4 animate-in fade-in">
                      <div className="sm:w-64 aspect-video rounded-lg bg-gradient-to-br from-amber-700 via-orange-900 to-zinc-950 p-3 flex flex-col justify-between flex-shrink-0">
                        <span className="self-start text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-black">
                          AD • SPONSORED
                        </span>
                        <div>
                          <span className="text-xs font-bold text-white block">NextGen Enterprise Cloud Infra</span>
                          <span className="text-[10px] text-amber-300">cloudinfra-modernize.io</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Promoted Web Result</span>
                            <code className="text-[9px] font-mono text-zinc-400 bg-zinc-900/60 px-1 py-0.5 rounded border border-white/5">
                              &lt;ytd-promoted-video-renderer&gt;
                            </code>
                          </div>
                          <button 
                            onClick={() => onToggleTweak('hide_search_sponsored_ads', true)}
                            className="text-[10px] text-zinc-400 hover:text-white"
                            title="Hide sponsored result"
                          >
                            Hide ad ✕
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-white">Automated Global Kubernetes & PostgreSQL Orchestration</h4>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          Deploy high-availability multi-region services with zero downtime and automated failover. Claim $200 free cloud credits today.
                        </p>
                      </div>
                    </div>
                  )}

                  {sampleVideos.slice(0, 3).map((video) => (
                    <div 
                      key={video.id} 
                      onClick={() => setCurrentPage('watch')}
                      className="flex flex-col sm:flex-row gap-4 group cursor-pointer"
                    >
                      <div 
                        style={getVideoThumbnailStyle(video)}
                        className={`sm:w-64 aspect-video rounded-xl bg-gradient-to-br ${video.color} p-3 flex flex-col justify-end flex-shrink-0 ${
                          isEnabled('grayscale_thumbnails') ? 'grayscale hover:grayscale-0' : ''
                        }`}
                      >
                        <span className="self-end text-[11px] font-semibold px-1.5 py-0.5 rounded bg-black/80 text-white">
                          {video.duration}
                        </span>
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 leading-snug">
                          {video.title}
                        </h3>
                        {!isEnabled('hide_view_count_and_date') && (
                          <p className="text-xs text-zinc-400">{video.views} • {video.time}</p>
                        )}
                        <p className="text-xs text-zinc-500 pt-1">{video.author}</p>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          In this in-depth guide, we inspect CPU scheduling, virtual address mapping, kernel space vs user space context switches, and interrupt handlers.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* If Shorts in search are not blocked */}
                {!isEnabled('block_all_shorts') && !isEnabled('hide_search_shorts') && (
                  <div className="pt-4 border-t border-[#272727] space-y-3">
                    <div className="flex items-center gap-2">
                      <ShortsIcon className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-bold text-white">Shorts in Search Results</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {sampleShorts.slice(0, 2).map((s) => (
                        <div key={s.id} className="aspect-[9/16] rounded-lg bg-zinc-800 p-2 flex items-end text-[11px] font-medium text-white">
                          {s.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
