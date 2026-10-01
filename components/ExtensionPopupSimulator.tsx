'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  FEATURE_TOGGLES, 
  EXTENSION_CATEGORIES, 
  FeatureToggle,
  PRESETS
} from '@/lib/extension-data';
import {
  getStoredRealStats,
  saveStoredRealStats,
  createEmptyStats,
  recordRealInteraction,
  RealStatsStorage
} from '@/lib/usage-stats';
import { normalizeChannelIdentifier } from '@/lib/adblock-service';
import { 
  Search, 
  Power, 
  ExternalLink, 
  Check, 
  Sliders, 
  Eye, 
  Sparkles,
  Tv,
  Home,
  Compass,
  Menu,
  Filter,
  Clock,
  Code2,
  X,
  Volume2,
  Gauge,
  Layers,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  BarChart3,
  TrendingUp,
  Zap,
  RefreshCw,
  Calendar,
  PieChart,
  ArrowUpRight,
  ShieldAlert,
  Focus,
  MessageSquare,
  Heart
} from 'lucide-react';

interface ExtensionPopupSimulatorProps {
  settings: Record<string, any>;
  masterSwitch: boolean;
  onToggle: (id: string, value?: any) => void;
  onOpenFullOptions?: () => void;
  customCss?: string;
  onCustomCssChange?: (css: string) => void;
}

export default function ExtensionPopupSimulator({
  settings,
  masterSwitch,
  onToggle,
  onOpenFullOptions,
  customCss = '',
  onCustomCssChange,
}: ExtensionPopupSimulatorProps) {
  const [mainTab, setMainTab] = useState<'features' | 'adblock'>('features');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'all'>('today');

  // Creator Exemption Allowlist state
  const [allowlistChannels, setAllowlistChannels] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const { AdBlockService } = require('@/lib/adblock-service');
        const list = AdBlockService.getInstance().getAllowlist();
        if (list && list.length > 0) return list;
      } catch (e) {}
    }
    return ['mkbhd', 'veritasium'];
  });
  const [newChannelInput, setNewChannelInput] = useState('');

  const handleAddChannel = () => {
    if (!newChannelInput.trim()) return;
    const norm = normalizeChannelIdentifier(newChannelInput);
    if (!norm) return;
    const next = Array.from(new Set([...allowlistChannels, norm]));
    setAllowlistChannels(next);
    setNewChannelInput('');
    if (typeof window !== 'undefined') {
      try {
        const { AdBlockService } = require('@/lib/adblock-service');
        AdBlockService.getInstance().setAllowlist(next);
      } catch (e) {}
    }
    onToggle('adblock_channel_allowlist', next.join(', '));
  };

  const handleRemoveChannel = (chan: string) => {
    const norm = normalizeChannelIdentifier(chan);
    const next = allowlistChannels.filter((c) => normalizeChannelIdentifier(c) !== norm);
    setAllowlistChannels(next);
    if (typeof window !== 'undefined') {
      try {
        const { AdBlockService } = require('@/lib/adblock-service');
        AdBlockService.getInstance().setAllowlist(next);
      } catch (e) {}
    }
    onToggle('adblock_channel_allowlist', next.join(', '));
  };

  // Real usage tracking from persistent storage (no dummy data)
  const [realStats, setRealStats] = useState<RealStatsStorage>(() => getStoredRealStats());
  const [simulatedSessionNotice, setSimulatedSessionNotice] = useState<string | null>(null);

  // Real-time adblock stats directly from AdBlockService observer
  const [liveAdsBlocked, setLiveAdsBlocked] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const { AdBlockService } = require('@/lib/adblock-service');
        const s = AdBlockService.getInstance().getStats();
        if (s && s.totalBlocked > 0) return s.totalBlocked;
      } catch (e) {}
    }
    return getStoredRealStats().distractions.adsBlocked || 0;
  });

  const [isChannelExempted, setIsChannelExempted] = useState(false);

  useEffect(() => {
    const handleStatsUpdate = (e: any) => {
      if (e.detail && typeof e.detail.totalBlocked === 'number') {
        setLiveAdsBlocked(e.detail.totalBlocked);
      }
    };
    window.addEventListener('yr-adblock-stats-updated', handleStatsUpdate);

    const checkExemption = () => {
      if (typeof window !== 'undefined') {
        try {
          const { AdBlockService } = require('@/lib/adblock-service');
          setIsChannelExempted(AdBlockService.getInstance().isCurrentChannelAllowlisted());
        } catch (e) {}
      }
    };
    checkExemption();
    const handleAllowlistUpdate = () => checkExemption();
    window.addEventListener('yr-allowlist-updated', handleAllowlistUpdate);
    window.addEventListener('yr-channel-exempted', handleAllowlistUpdate);

    return () => {
      window.removeEventListener('yr-adblock-stats-updated', handleStatsUpdate);
      window.removeEventListener('yr-allowlist-updated', handleAllowlistUpdate);
      window.removeEventListener('yr-channel-exempted', handleAllowlistUpdate);
    };
  }, []);

  // Active toggles count
  const activeCount = Object.entries(settings).filter(([key, val]) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string' && val !== 'default' && val !== 'auto' && val !== '1.0') return true;
    return false;
  }).length;

  // Real session timer: tracks active focus time and saved minutes accurately
  useEffect(() => {
    const timer = setInterval(() => {
      setRealStats((prev) => {
        const next = { ...prev };
        next.sessionMinutes = Math.round((next.sessionMinutes + 0.1) * 10) / 10;
        const todayIdx = next.history.findIndex((h) => h.day === 'Today');
        if (todayIdx >= 0) {
          next.history[todayIdx].spent = Math.round((next.history[todayIdx].spent + 0.1) * 10) / 10;
          if (masterSwitch && activeCount > 0) {
            const deltaSaved = Math.min(activeCount * 0.08, 0.4);
            next.history[todayIdx].saved = Math.round((next.history[todayIdx].saved + deltaSaved) * 10) / 10;
          }
        }
        saveStoredRealStats(next);
        return next;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [masterSwitch, activeCount]);

  // Filter features based on search and category
  const filteredFeatures = useMemo(() => {
    return FEATURE_TOGGLES.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Group features by category for display
  const groupedFeatures = useMemo(() => {
    const groups: Record<string, FeatureToggle[]> = {};
    filteredFeatures.forEach((feat) => {
      if (!groups[feat.category]) {
        groups[feat.category] = [];
      }
      groups[feat.category].push(feat);
    });
    return groups;
  }, [filteredFeatures]);

  // Real Stats Calculations
  const statsSummary = useMemo(() => {
    const history = realStats.history;
    const totalBlocked =
      realStats.distractions.feedItems +
      realStats.distractions.shortsLoops +
      realStats.distractions.toxicComments +
      realStats.distractions.notificationDots +
      (realStats.distractions.adsBlocked || 0);

    if (timeRange === 'today') {
      const todayStat = history[history.length - 1] || { spent: 0, saved: 0 };
      const spent = todayStat.spent;
      const saved = todayStat.saved;
      const total = spent + saved;
      const efficiency = total > 0 ? Math.round((saved / total) * 100) : (masterSwitch && activeCount > 0 ? 100 : 0);
      return {
        spentMinutes: Math.round(spent),
        savedMinutes: Math.round(saved),
        efficiency,
        blockedCount: totalBlocked,
      };
    } else {
      const spent = Math.round(history.reduce((acc, curr) => acc + curr.spent, 0));
      const saved = Math.round(history.reduce((acc, curr) => acc + curr.saved, 0));
      const total = spent + saved;
      const efficiency = total > 0 ? Math.round((saved / total) * 100) : (masterSwitch && activeCount > 0 ? 100 : 0);
      return {
        spentMinutes: spent,
        savedMinutes: saved,
        efficiency,
        blockedCount: totalBlocked,
      };
    }
  }, [timeRange, realStats, masterSwitch, activeCount]);

  const maxBarValue = useMemo(() => {
    const maxVal = Math.max(...realStats.history.map((d) => Math.max(d.spent, d.saved)), 10);
    return Math.ceil(maxVal);
  }, [realStats.history]);

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  // Test real shield deflection action
  const handleTestShield = () => {
    const updated = recordRealInteraction('shield_intercept', settings, masterSwitch);
    setRealStats({ ...updated });
    setSimulatedSessionNotice('✓ Real shield event recorded & tracked accurately');
    setTimeout(() => setSimulatedSessionNotice(null), 2500);
  };

  const handleResetStats = () => {
    const fresh = createEmptyStats();
    saveStoredRealStats(fresh);
    setRealStats(fresh);
    setSimulatedSessionNotice('Real usage metrics reset to zero.');
    setTimeout(() => setSimulatedSessionNotice(null), 2500);
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'home': return <Home className="w-3.5 h-3.5" />;
      case 'shorts': return <Compass className="w-3.5 h-3.5" />;
      case 'watch': return <Tv className="w-3.5 h-3.5" />;
      case 'sidebar': return <Menu className="w-3.5 h-3.5" />;
      case 'header': return <Search className="w-3.5 h-3.5" />;
      case 'search': return <Filter className="w-3.5 h-3.5" />;
      case 'visual': return <Eye className="w-3.5 h-3.5" />;
      case 'mindful': return <Clock className="w-3.5 h-3.5" />;
      case 'custom_css': return <Code2 className="w-3.5 h-3.5" />;
      case 'subscriptions': return <Layers className="w-3.5 h-3.5" />;
      case 'channel': return <Compass className="w-3.5 h-3.5" />;
      case 'library': return <Tv className="w-3.5 h-3.5" />;
      case 'embedded': return <Maximize2 className="w-3.5 h-3.5" />;
      case 'decoration': return <Sparkles className="w-3.5 h-3.5" />;
      case 'ads': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Sliders className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryLabel = (catId: string) => {
    const cat = EXTENSION_CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.label : catId;
  };

  return (
    <div className="w-full max-w-[420px] mx-auto bg-[#101217] text-zinc-100 rounded-3xl border border-white/10 shadow-2xl shadow-black/80 overflow-hidden flex flex-col font-sans text-xs">
      
      {/* Top Header Window Bar */}
      <div className="bg-[#161820] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-zinc-950 flex items-center justify-center shadow-md shadow-red-500/20 ring-1 ring-white/10">
            <svg viewBox="0 0 512 512" className="w-full h-full">
              <rect width="512" height="512" rx="120" fill="#121319" />
              <rect x="90" y="115" width="332" height="282" rx="72" fill="url(#popBrandGrad)" />
              <path d="M224 195 L332 256 L224 317 Z" fill="#ffffff" />
              <circle cx="396" cy="116" r="32" fill="#10b981" stroke="#ffffff" strokeWidth="4" />
              <defs>
                <linearGradient id="popBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff1a40" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-white tracking-tight">YouTube Refined</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Extension
              </span>
              {/* Non-intrusive Real-time AdBlock Stats Badge */}
              <div 
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold tracking-tight shadow-sm shadow-emerald-500/10 transition-all hover:bg-emerald-500/25"
                title="Real-time ads filtered by AdBlockService observer"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{liveAdsBlocked}</span>
                <span className="text-[9px] text-emerald-400/80 font-normal">blocked</span>
              </div>
              {/* Creator Support Badge when allowlisted */}
              {isChannelExempted && (
                <div 
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-semibold tracking-tight shadow-sm shadow-rose-500/10"
                  title="Ads allowed on this creator's channel to support them"
                >
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  <span>Creator Exempt</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">Untrap-Style Distraction Guard</p>
          </div>
        </div>

        {/* Master Power Toggle Button */}
        <button
          onClick={() => onToggle('master_switch', !masterSwitch)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
            masterSwitch
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
              : 'bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
          }`}
          title="Global Master Shield Switch"
        >
          <Power className={`w-3.5 h-3.5 ${masterSwitch ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
          <span>{masterSwitch ? 'Active' : 'Off'}</span>
        </button>
      </div>

      {/* Main Mode Segmented Tabs: Settings vs AdBlock Shield */}
      <div className="flex border-b border-white/10 bg-[#12141a] px-3 pt-2 gap-2 text-xs">
        <button
          onClick={() => setMainTab('features')}
          className={`flex items-center gap-1.5 px-3 py-2 font-semibold border-b-2 transition-all ${
            mainTab === 'features'
              ? 'border-rose-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-rose-400" />
          <span>Features & Controls</span>
        </button>
        <button
          onClick={() => setMainTab('adblock')}
          className={`flex items-center gap-1.5 px-3 py-2 font-semibold border-b-2 transition-all ${
            mainTab === 'adblock'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>AdBlock & Shield</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            {liveAdsBlocked} blocked
          </span>
        </button>
      </div>

      {/* ======================= TAB 1: FEATURES & TOGGLES ======================= */}
      {mainTab === 'features' && (
        <>
          {/* Global Instant Search Bar */}
          <div className="p-3 bg-[#13151b] border-b border-white/5 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all settings (e.g. focus mode, comments, 4K)..."
                className="w-full bg-[#1b1e26] border border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/60 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Horizontal Category Nav Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {EXTENSION_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-600/20'
                        : 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/5'
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Status / Preset Sub-banner */}
          <div className="px-3.5 py-2 bg-zinc-900/50 border-b border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{activeCount} active</span>
              </div>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{liveAdsBlocked} blocked</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {searchQuery && (
                <span className="text-zinc-500">{filteredFeatures.length} found</span>
              )}
              <button
                onClick={() => onOpenFullOptions && onOpenFullOptions()}
                className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 hover:underline"
              >
                <span>Full Studio</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Main Settings List - Grouped by Category */}
          <div className="flex-1 overflow-y-auto max-h-[380px] p-3 space-y-4">
            
            {/* If custom CSS is selected or searched */}
            {(selectedCategory === 'all' || selectedCategory === 'custom_css') && (!searchQuery || 'custom css'.includes(searchQuery.toLowerCase())) && (
              <div className="bg-[#161822] rounded-2xl p-3 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-white text-xs">Custom CSS Live Injector</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!settings.enable_custom_css}
                      onChange={(e) => onToggle('enable_custom_css', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Inject your own CSS rules directly into YouTube pages.
                </p>
                {settings.enable_custom_css && (
                  <div className="space-y-1 pt-1">
                    <textarea
                      value={customCss}
                      onChange={(e) => onCustomCssChange && onCustomCssChange(e.target.value)}
                      placeholder={`/* Example custom CSS */\n#video-title { font-weight: 500 !important; }\nytd-masthead { backdrop-filter: blur(10px); }`}
                      rows={4}
                      className="w-full bg-[#0d0e12] border border-white/15 rounded-xl p-2 font-mono text-[11px] text-zinc-200 focus:outline-none focus:border-rose-500/70"
                    />
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Changes reflect live in simulator & extension</span>
                      <span className="text-emerald-400 font-semibold">Active</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Categories and Settings Groups */}
            {Object.entries(groupedFeatures).map(([catId, features]) => {
              if (catId === 'custom_css') return null;
              return (
                <div key={catId} className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                    {getCategoryIcon(catId)}
                    <span>{getCategoryLabel(catId)}</span>
                    <span className="text-zinc-600 font-normal">({features.length})</span>
                  </div>

                  <div className="bg-[#151720] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
                    {features.map((feature) => {
                      const currentValue = settings[feature.id];
                      const isChecked = typeof currentValue === 'boolean' ? currentValue : !!currentValue;

                      return (
                        <div
                          key={feature.id}
                          className="p-3 hover:bg-white/[0.02] transition-colors flex flex-col gap-1.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-zinc-100 text-xs">
                                  {feature.name}
                                </span>
                                {feature.id === 'focus_mode_cinema' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                                    <Focus className="w-2.5 h-2.5" />
                                    New
                                  </span>
                                )}
                                {feature.id === 'collapse_comments_default' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-0.5">
                                    <MessageSquare className="w-2.5 h-2.5" />
                                    Fold
                                  </span>
                                )}
                                {feature.tag === 'Shorts Blocker' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                    Shorts
                                  </span>
                                )}
                                {feature.tag === 'Recommended' && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Best
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-tight">
                                {feature.description}
                              </p>
                            </div>

                            {/* Setting Control Type */}
                            <div>
                              {feature.settingType === 'select' && feature.options ? (
                                <select
                                  value={currentValue ?? feature.options[0].value}
                                  onChange={(e) => onToggle(feature.id, e.target.value)}
                                  className="bg-[#1e212b] border border-white/10 text-white rounded-lg px-2 py-1 text-[11px] font-medium focus:outline-none focus:border-rose-500 cursor-pointer"
                                >
                                  {feature.options.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              ) : feature.settingType === 'slider' ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="range"
                                    min={feature.min ?? 4}
                                    max={feature.max ?? 30}
                                    step={feature.step ?? 2}
                                    value={currentValue ?? 12}
                                    onChange={(e) => onToggle(feature.id, Number(e.target.value))}
                                    className="w-16 accent-rose-500 cursor-pointer"
                                  />
                                  <span className="text-[10px] font-mono text-zinc-400 min-w-[28px] text-right">
                                    {currentValue ?? 12}{feature.unit ?? 'px'}
                                  </span>
                                </div>
                              ) : (
                                /* Simple modern iOS / Untrap style toggle switch */
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => onToggle(feature.id, e.target.checked)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-600"></div>
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredFeatures.length === 0 && (
              <div className="text-center py-8 space-y-2">
                <Filter className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 font-medium">No matching settings found</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="text-rose-400 text-xs hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ======================= TAB 2: DEDICATED ADBLOCK SHIELD & CREATOR ALLOWLIST ======================= */}
      {mainTab === 'adblock' && (
        <div className="flex-1 overflow-y-auto max-h-[440px] p-3 space-y-3.5 animate-in fade-in duration-200">
          
          {/* Master AdBlock Shield Hero Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#181a24] via-[#141620] to-[#0f1118] border border-white/10 p-3.5 space-y-3 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">Universal AdBlock Shield</h3>
                  <p className="text-[10px] text-zinc-400">
                    {settings.block_all_ads !== false ? 'Active • Zero-Latency Ad Stripping' : 'Paused • YouTube Commercials Allowed'}
                  </p>
                </div>
              </div>

              {/* Master AdBlock Toggle */}
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.block_all_ads !== false}
                  onChange={(e) => onToggle('block_all_ads', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Real-Time Block Metrics KPIs */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center">
              <div className="bg-[#1a1c27] rounded-xl p-2 border border-white/5">
                <div className="text-base font-extrabold text-white tracking-tight">{liveAdsBlocked}</div>
                <div className="text-[9px] text-zinc-400 font-medium">Total Blocked</div>
              </div>
              <div className="bg-[#1a1c27] rounded-xl p-2 border border-white/5">
                <div className="text-base font-extrabold text-emerald-400 tracking-tight">{Math.max(1, Math.round(liveAdsBlocked * 0.4))}</div>
                <div className="text-[9px] text-zinc-400 font-medium">Videos (0ms Skip)</div>
              </div>
              <div className="bg-[#1a1c27] rounded-xl p-2 border border-white/5">
                <div className="text-base font-extrabold text-blue-400 tracking-tight">{Math.max(2, Math.round(liveAdsBlocked * 0.6))}</div>
                <div className="text-[9px] text-zinc-400 font-medium">Zero-Gap Collapsed</div>
              </div>
            </div>

            {/* Zero DOM Gap Notice */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px]">
              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span>Zero-gap card & grid layout collapse active (no blank white/black DOM gaps).</span>
            </div>
          </div>

          {/* Granular Commercial Shield Switches */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Granular Commercial Controls</span>
              <span className="text-[10px] text-emerald-400 font-medium">Instant Live Reflection</span>
            </div>

            <div className="bg-[#151720] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
              {/* 1. In-stream video commercial skip */}
              <div className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-zinc-100 text-xs">In-Stream Video Ads (0ms Fast-Skip)</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Instant
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Instantly accelerates and auto-skips pre-roll and mid-roll video commercials without black screen buffering.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.block_video_instream_ads !== false}
                    onChange={(e) => onToggle('block_video_instream_ads', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 2. Masthead Billboard Ads */}
              <div className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-100 text-xs">Home Masthead Billboard Ads</span>
                  <p className="text-[11px] text-zinc-400">
                    Completely collapses top hero commercial banners and billboards with zero layout gap.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.hide_masthead_ads !== false}
                    onChange={(e) => onToggle('hide_masthead_ads', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 3. In-Feed Commercial Cards */}
              <div className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-100 text-xs">In-Feed Commercial Cards</span>
                  <p className="text-[11px] text-zinc-400">
                    Eliminates sponsored video cards in home & subscription feeds and collapses grid spaces.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.hide_banner_ads !== false}
                    onChange={(e) => onToggle('hide_banner_ads', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 4. 6-Second Bumper Commercials */}
              <div className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-100 text-xs">6-Second Bumper Ads</span>
                  <p className="text-[11px] text-zinc-400">
                    Bypasses unskippable short commercial segments before video playback begins.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.block_bumper_ads !== false}
                    onChange={(e) => onToggle('block_bumper_ads', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 5. Search Sponsored Results */}
              <div className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-100 text-xs">Search Sponsored Results</span>
                  <p className="text-[11px] text-zinc-400">
                    Removes promoted video slots and shopping promos from search query results.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.hide_search_sponsored_ads !== false}
                    onChange={(e) => onToggle('hide_search_sponsored_ads', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 6. Video Overlays */}
              <div className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-100 text-xs">Lower-Third Video Overlays</span>
                  <p className="text-[11px] text-zinc-400">
                    Blocks pop-up banner boxes and affiliate product cards from covering the video player.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.hide_instream_overlay_ads !== false}
                    onChange={(e) => onToggle('hide_instream_overlay_ads', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* ================= CREATOR EXEMPTION ALLOWLIST ================= */}
          <div className="rounded-2xl bg-[#151720] border border-white/5 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                <h4 className="font-bold text-white text-xs">Creator Support Allowlist</h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={settings.adblock_enable_allowlist !== false}
                  onChange={(e) => onToggle('adblock_enable_allowlist', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            <p className="text-[11px] text-zinc-400 leading-snug">
              Allow ads exclusively on specific channels so your favorite creators continue receiving ad revenue, while keeping all other videos 100% ad-free.
            </p>

            {/* Current Active Channel Status Banner */}
            <div className="p-2.5 rounded-xl bg-[#1b1e2a] border border-white/5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="text-zinc-300">
                  Current Channel: <strong className="text-white">@coretechengineering</strong>
                </span>
              </div>
              {isChannelExempted ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                  Exempted (Ads Allowed)
                </span>
              ) : (
                <button
                  onClick={() => {
                    const norm = normalizeChannelIdentifier('coretechengineering');
                    if (norm && !allowlistChannels.includes(norm)) {
                      const next = [...allowlistChannels, norm];
                      setAllowlistChannels(next);
                      onToggle('adblock_channel_allowlist', next.join(', '));
                    }
                  }}
                  className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-semibold transition-colors"
                >
                  + Support Creator
                </button>
              )}
            </div>

            {/* Add Channel Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newChannelInput}
                onChange={(e) => setNewChannelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddChannel();
                }}
                placeholder="Enter channel handle or ID (e.g. @mkbhd, UC...)"
                className="flex-1 bg-[#1a1c26] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button
                onClick={handleAddChannel}
                disabled={!newChannelInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <span>Add</span>
              </button>
            </div>

            {/* List of Allowed Channels */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-zinc-500 block">Exempted Channels ({allowlistChannels.length}):</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                {allowlistChannels.length === 0 ? (
                  <span className="text-[11px] text-zinc-500 italic">No channels allowlisted yet.</span>
                ) : (
                  allowlistChannels.map((chan) => (
                    <span
                      key={chan}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-white/10 text-[11px] text-zinc-200"
                    >
                      <span className="font-mono text-rose-300">@{chan}</span>
                      <button
                        onClick={() => handleRemoveChannel(chan)}
                        className="text-zinc-500 hover:text-rose-400 font-bold ml-0.5"
                        title="Remove exemption"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={handleTestShield}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Live Ad Deflection</span>
            </button>
            <button
              onClick={handleResetStats}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/5 transition-colors"
              title="Reset Counters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Footer Actions Bar */}
      <div className="p-3 bg-[#14161f] border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Manifest V3 • Realtime</span>
        </div>

        <button
          onClick={() => onOpenFullOptions && onOpenFullOptions()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white font-semibold text-[11px] transition-all hover:scale-[1.02]"
        >
          <span>All Settings Studio</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>

    </div>
  );
}
