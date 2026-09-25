'use client';

import React, { useState, useMemo } from 'react';
import { 
  FEATURE_TOGGLES, 
  EXTENSION_CATEGORIES, 
  FeatureToggle,
  PRESETS
} from '@/lib/extension-data';
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
  MessageSquare
} from 'lucide-react';

interface ExtensionPopupSimulatorProps {
  settings: Record<string, any>;
  masterSwitch: boolean;
  onToggle: (id: string, value?: any) => void;
  onOpenFullOptions?: () => void;
  customCss?: string;
  onCustomCssChange?: (css: string) => void;
}

interface DailyStat {
  day: string;
  spent: number; // in minutes
  saved: number; // in minutes
}

export default function ExtensionPopupSimulator({
  settings,
  masterSwitch,
  onToggle,
  onOpenFullOptions,
  customCss = '',
  onCustomCssChange,
}: ExtensionPopupSimulatorProps) {
  const [mainTab, setMainTab] = useState<'features' | 'stats'>('features');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'all'>('today');

  // Interactive stats data with simulation support
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([
    { day: 'Mon', spent: 45, saved: 85 },
    { day: 'Tue', spent: 50, saved: 110 },
    { day: 'Wed', spent: 30, saved: 95 },
    { day: 'Thu', spent: 65, saved: 140 },
    { day: 'Fri', spent: 40, saved: 105 },
    { day: 'Sat', spent: 75, saved: 160 },
    { day: 'Today', spent: 38, saved: 105 },
  ]);

  const [distractionsBlocked, setDistractionsBlocked] = useState({
    feedItems: 842,
    shortsLoops: 296,
    toxicComments: 184,
    notificationDots: 106,
  });

  const [simulatedSessionNotice, setSimulatedSessionNotice] = useState<string | null>(null);

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

  const activeCount = Object.entries(settings).filter(([key, val]) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string' && val !== 'default' && val !== 'auto' && val !== '1.0') return true;
    return false;
  }).length;

  // Stats Calculations
  const statsSummary = useMemo(() => {
    if (timeRange === 'today') {
      const todayStat = dailyStats[dailyStats.length - 1];
      const spent = todayStat.spent;
      const saved = todayStat.saved;
      const total = spent + saved;
      const efficiency = total > 0 ? Math.round((saved / total) * 100) : 0;
      return {
        spentMinutes: spent,
        savedMinutes: saved,
        efficiency,
        blockedCount: 248,
      };
    } else if (timeRange === 'week') {
      const spent = dailyStats.reduce((acc, curr) => acc + curr.spent, 0);
      const saved = dailyStats.reduce((acc, curr) => acc + curr.saved, 0);
      const total = spent + saved;
      const efficiency = total > 0 ? Math.round((saved / total) * 100) : 0;
      return {
        spentMinutes: spent,
        savedMinutes: saved,
        efficiency,
        blockedCount: distractionsBlocked.feedItems + distractionsBlocked.shortsLoops + distractionsBlocked.toxicComments,
      };
    } else {
      // all-time
      const spent = 1120; // ~18.6h
      const saved = 2890; // ~48h
      const efficiency = Math.round((saved / (spent + saved)) * 100);
      return {
        spentMinutes: spent,
        savedMinutes: saved,
        efficiency,
        blockedCount: 6840,
      };
    }
  }, [timeRange, dailyStats, distractionsBlocked]);

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  // Simulate test session action
  const handleSimulateSession = () => {
    setDailyStats((prev) => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.spent += 15;
      last.saved += 25;
      updated[updated.length - 1] = last;
      return updated;
    });
    setDistractionsBlocked((prev) => ({
      feedItems: prev.feedItems + 24,
      shortsLoops: prev.shortsLoops + 6,
      toxicComments: prev.toxicComments + 12,
      notificationDots: prev.notificationDots + 3,
    }));
    setSimulatedSessionNotice('+15m Focused Session Logged (+25m Distraction Saved)!');
    setTimeout(() => setSimulatedSessionNotice(null), 3000);
  };

  const handleResetStats = () => {
    setDailyStats([
      { day: 'Mon', spent: 0, saved: 0 },
      { day: 'Tue', spent: 0, saved: 0 },
      { day: 'Wed', spent: 0, saved: 0 },
      { day: 'Thu', spent: 0, saved: 0 },
      { day: 'Fri', spent: 0, saved: 0 },
      { day: 'Sat', spent: 0, saved: 0 },
      { day: 'Today', spent: 0, saved: 0 },
    ]);
    setDistractionsBlocked({
      feedItems: 0,
      shortsLoops: 0,
      toxicComments: 0,
      notificationDots: 0,
    });
    setSimulatedSessionNotice('Statistics reset to zero.');
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
      default: return <Sliders className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryLabel = (catId: string) => {
    const cat = EXTENSION_CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.label : catId;
  };

  // Find maximum minutes for bar chart scale
  const maxBarValue = useMemo(() => {
    const maxVal = Math.max(...dailyStats.map((d) => Math.max(d.spent, d.saved)), 160);
    return maxVal;
  }, [dailyStats]);

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
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">YouTube Refined</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Extension
              </span>
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

      {/* Main Mode Segmented Tabs: Settings vs Usage Stats */}
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
          onClick={() => setMainTab('stats')}
          className={`flex items-center gap-1.5 px-3 py-2 font-semibold border-b-2 transition-all ${
            mainTab === 'stats'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Usage Statistics</span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            Charts
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
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{activeCount} active settings</span>
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

      {/* ======================= TAB 2: USAGE STATISTICS DASHBOARD ======================= */}
      {mainTab === 'stats' && (
        <div className="flex-1 overflow-y-auto max-h-[440px] p-3 space-y-3.5 animate-in fade-in duration-200">
          
          {/* Time Filter Pills */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5 bg-[#171922] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setTimeRange('today')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  timeRange === 'today'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeRange('week')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  timeRange === 'week'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  timeRange === 'all'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All-Time
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Tracking Active</span>
            </div>
          </div>

          {/* Simulation Notice Banner */}
          {simulatedSessionNotice && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl text-[11px] flex items-center justify-between animate-in fade-in">
              <span>{simulatedSessionNotice}</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Time Spent */}
            <div className="bg-[#161822] border border-white/5 rounded-2xl p-3 space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-400 text-[10px] font-medium">
                <span>Time on YouTube</span>
                <Clock className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-xl font-bold text-white tracking-tight">
                {formatMinutes(statsSummary.spentMinutes)}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <span className="w-2 h-2 rounded-sm bg-rose-500"></span>
                <span>Actual Watch Time</span>
              </div>
            </div>

            {/* Time Saved */}
            <div className="bg-[#161822] border border-emerald-500/20 rounded-2xl p-3 space-y-1 relative overflow-hidden bg-gradient-to-br from-[#161822] to-emerald-950/20">
              <div className="flex items-center justify-between text-emerald-400 text-[10px] font-medium">
                <span>Time Saved</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-emerald-300 tracking-tight">
                {formatMinutes(statsSummary.savedMinutes)}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400/80 font-medium">
                <span className="w-2 h-2 rounded-sm bg-emerald-400"></span>
                <span>Avoided Rabbit Holes</span>
              </div>
            </div>
          </div>

          {/* Dual Bar Chart: Time Spent vs Time Saved Comparison */}
          <div className="bg-[#151720] border border-white/5 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-rose-400" />
                  Daily Time: Spent vs Saved
                </h4>
                <p className="text-[10px] text-zinc-400">Past 7 days distraction defense comparison</p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-2.5 text-[9px] font-medium text-zinc-400">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-rose-500"></span>
                  <span>Spent</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-emerald-400"></span>
                  <span>Saved</span>
                </div>
              </div>
            </div>

            {/* Visual Bars Container */}
            <div className="h-36 pt-3 flex items-end justify-between gap-2 border-b border-white/10 pb-2">
              {dailyStats.map((stat, idx) => {
                const spentHeightPercent = Math.max(Math.round((stat.spent / maxBarValue) * 100), 4);
                const savedHeightPercent = Math.max(Math.round((stat.saved / maxBarValue) * 100), 4);
                const isToday = stat.day === 'Today';

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-24">
                      {/* Red bar: Time Spent */}
                      <div
                        style={{ height: `${spentHeightPercent}%` }}
                        className={`w-2.5 rounded-t-sm bg-gradient-to-t from-rose-700 to-rose-500 transition-all group-hover:brightness-125 relative`}
                        title={`${stat.day} Spent: ${formatMinutes(stat.spent)}`}
                      ></div>

                      {/* Green bar: Time Saved */}
                      <div
                        style={{ height: `${savedHeightPercent}%` }}
                        className={`w-2.5 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all group-hover:brightness-125 relative`}
                        title={`${stat.day} Saved: ${formatMinutes(stat.saved)}`}
                      ></div>
                    </div>

                    <span className={`text-[10px] font-medium ${isToday ? 'text-white font-bold underline decoration-rose-500 underline-offset-4' : 'text-zinc-500'}`}>
                      {stat.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
              <span>0m</span>
              <span>Daily Average: ~1h 45m Saved</span>
              <span>{maxBarValue}m</span>
            </div>
          </div>

          {/* Focus Efficiency Circular Gauge & Ratio */}
          <div className="bg-[#151720] border border-white/5 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-white text-xs">Refined Focus Efficiency</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                You prevented <strong className="text-emerald-400">{statsSummary.efficiency}%</strong> of algorithmic rabbit-hole watch time.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[10px] text-zinc-400">
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Mindful Intentional
                </span>
                <span>{statsSummary.blockedCount}+ traps averted</span>
              </div>
            </div>

            {/* Circular Ring Meter */}
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-700"
                  strokeDasharray={`${statsSummary.efficiency}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-extrabold text-white">{statsSummary.efficiency}%</span>
              </div>
            </div>
          </div>

          {/* Breakdown of Intercepted Distractions */}
          <div className="bg-[#151720] border border-white/5 rounded-2xl p-3 space-y-2.5">
            <h5 className="font-bold text-white text-[11px] flex items-center justify-between">
              <span>Distractions Deflected by Refined</span>
              <span className="text-zinc-500 font-normal">Live Counter</span>
            </h5>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Home Feed Infinite Video Shelves
                </span>
                <span className="font-mono font-bold text-white">{distractionsBlocked.feedItems}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Shorts & Reel Autoplay Traps
                </span>
                <span className="font-mono font-bold text-white">{distractionsBlocked.shortsLoops}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Flame Comment Threads Collapsed
                </span>
                <span className="font-mono font-bold text-white">{distractionsBlocked.toxicComments}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Red Dot Notification Alerts Silenced
                </span>
                <span className="font-mono font-bold text-white">{distractionsBlocked.notificationDots}</span>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={handleSimulateSession}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Session (+25m Saved)</span>
            </button>
            <button
              onClick={handleResetStats}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/5 transition-colors"
              title="Reset Stats"
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
