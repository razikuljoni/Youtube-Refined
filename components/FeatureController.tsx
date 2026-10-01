'use client';

import React, { useState, useMemo } from 'react';
import { 
  FEATURE_TOGGLES, 
  EXTENSION_CATEGORIES, 
  FeatureToggle,
  PRESETS,
  PresetConfig
} from '@/lib/extension-data';
import CategoryScreenshotCard from './CategoryScreenshotCard';
import ReferenceScreenshotModal from './ReferenceScreenshotModal';
import SettingsGroupScreenshotGallery from './SettingsGroupScreenshotGallery';
import { 
  Search, 
  Sliders, 
  Check, 
  Code2, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Gauge,
  Layers,
  Filter,
  Eye,
  Tv,
  Home,
  Compass,
  Menu,
  Clock,
  Play,
  Copy,
  CheckCheck,
  Camera,
  Maximize2,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Heart,
  Plus,
  Trash2,
  UserCheck
} from 'lucide-react';
import { normalizeChannelIdentifier } from '@/lib/adblock-service';

interface FeatureControllerProps {
  settings: Record<string, any>;
  masterSwitch: boolean;
  onToggle: (id: string, val?: any) => void;
  onResetDefaults: () => void;
  onExportConfig: () => void;
  onImportConfig: (json: string) => void;
  customCss?: string;
  onCustomCssChange?: (css: string) => void;
}

export default function FeatureController({
  settings,
  masterSwitch,
  onToggle,
  onResetDefaults,
  onExportConfig,
  onImportConfig,
  customCss = '',
  onCustomCssChange,
}: FeatureControllerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSelector, setExpandedSelector] = useState<string | null>(null);
  const [copiedCss, setCopiedCss] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [newChannelInput, setNewChannelInput] = useState('');
  const [allowlistChannels, setAllowlistChannels] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const { AdBlockService } = require('@/lib/adblock-service');
        const list = AdBlockService.getInstance().getAllowlist();
        if (list && list.length > 0) return list;
      } catch (e) {}
    }
    return ['@mkbhd', '@veritasium'];
  });

  const handleAddAllowlistChannel = (val?: string) => {
    const channelToAdd = val || newChannelInput;
    if (!channelToAdd.trim()) return;
    const norm = normalizeChannelIdentifier(channelToAdd);
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

  const handleRemoveAllowlistChannel = (channel: string) => {
    const norm = normalizeChannelIdentifier(channel);
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
  const [activeScreenshot, setActiveScreenshot] = useState<{
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
  } | null>(null);

  // Filter features
  const filteredFeatures = useMemo(() => {
    return FEATURE_TOGGLES.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const currentCategoryObj = useMemo(() => {
    return EXTENSION_CATEGORIES.find((c) => c.id === activeCategory);
  }, [activeCategory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportConfig(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const getTagBadgeClass = (tag: FeatureToggle['tag']) => {
    switch (tag) {
      case 'Shorts Blocker':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Anti-Distraction':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Visual Comfort':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Focus':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Ad Blocker':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Creator Support':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Clean UI':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-white/5';
    }
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'shorts': return <Compass className="w-4 h-4" />;
      case 'watch': return <Tv className="w-4 h-4" />;
      case 'sidebar': return <Menu className="w-4 h-4" />;
      case 'header': return <Search className="w-4 h-4" />;
      case 'search': return <Filter className="w-4 h-4" />;
      case 'visual': return <Eye className="w-4 h-4" />;
      case 'mindful': return <Clock className="w-4 h-4" />;
      case 'custom_css': return <Code2 className="w-4 h-4" />;
      case 'subscriptions': return <Layers className="w-4 h-4 text-amber-400" />;
      case 'channel': return <Compass className="w-4 h-4 text-blue-400" />;
      case 'library': return <Tv className="w-4 h-4 text-teal-400" />;
      case 'embedded': return <Maximize2 className="w-4 h-4 text-rose-400" />;
      case 'decoration': return <Sparkles className="w-4 h-4 text-violet-400" />;
      case 'ads': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default: return <Sliders className="w-4 h-4" />;
    }
  };

  const getSubGroupIcon = (subGroup: string, catId?: string) => {
    const s = subGroup.toLowerCase();
    if (s.includes('ad') || s.includes('shield') || s.includes('commercial')) return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    if (s.includes('feed') || s.includes('home')) return <Home className="w-4 h-4 text-rose-400" />;
    if (s.includes('short')) return <Compass className="w-4 h-4 text-red-400" />;
    if (s.includes('player') || s.includes('watch') || s.includes('screen')) return <Tv className="w-4 h-4 text-blue-400" />;
    if (s.includes('related') || s.includes('sidebar')) return <Menu className="w-4 h-4 text-amber-400" />;
    if (s.includes('comment') || s.includes('community')) return <MessageSquare className="w-4 h-4 text-emerald-400" />;
    if (s.includes('masthead') || s.includes('header')) return <Search className="w-4 h-4 text-purple-400" />;
    if (s.includes('search')) return <Filter className="w-4 h-4 text-cyan-400" />;
    if (s.includes('thumbnail') || s.includes('blur') || s.includes('title')) return <Eye className="w-4 h-4 text-amber-400" />;
    if (s.includes('watched')) return <Clock className="w-4 h-4 text-orange-400" />;
    if (s.includes('typography') || s.includes('theme') || s.includes('decoration')) return <Sparkles className="w-4 h-4 text-violet-400" />;
    if (s.includes('mindful') || s.includes('friction')) return <Clock className="w-4 h-4 text-indigo-400" />;
    if (s.includes('subscription')) return <Layers className="w-4 h-4 text-amber-400" />;
    if (s.includes('channel') || s.includes('menu')) return <Compass className="w-4 h-4 text-blue-400" />;
    if (s.includes('library')) return <Tv className="w-4 h-4 text-teal-400" />;
    if (s.includes('embed')) return <Maximize2 className="w-4 h-4 text-rose-400" />;
    if (catId) return getCategoryIcon(catId);
    return <Sliders className="w-4 h-4 text-zinc-400" />;
  };

  // Group features by subGroup for clean single-card background presentation
  const groupedSections = useMemo(() => {
    const list: {
      subGroup: string;
      category: string;
      items: FeatureToggle[];
    }[] = [];
    const map = new Map<string, { subGroup: string; category: string; items: FeatureToggle[] }>();

    filteredFeatures.forEach((item) => {
      if (item.category === 'custom_css') return;
      const subGroupName = item.subGroup || (
        EXTENSION_CATEGORIES.find((c) => c.id === item.category)?.label || 'General Settings'
      );
      const key = `${item.category}__${subGroupName}`;
      if (!map.has(key)) {
        const groupObj = { subGroup: subGroupName, category: item.category, items: [] };
        map.set(key, groupObj);
        list.push(groupObj);
      }
      map.get(key)!.items.push(item);
    });

    return list;
  }, [filteredFeatures]);

  const handleCopyCss = () => {
    if (customCss) {
      navigator.clipboard.writeText(customCss);
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    }
  };

  const sampleSnippets = [
    {
      title: 'Minimalist Modern Font',
      css: `body, ytd-app, #video-title {\n  font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif !important;\n}`,
    },
    {
      title: 'Darker Matte Background',
      css: `ytd-app, #page-manager, ytd-masthead {\n  background-color: #08090b !important;\n}\n#masthead-container {\n  border-bottom: 1px solid rgba(255,255,255,0.06) !important;\n}`,
    },
    {
      title: 'Rounded Video Thumbnails',
      css: `ytd-thumbnail, ytd-thumbnail img, .ytp-cairo-refresh-signature-moments {\n  border-radius: 16px !important;\n}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Control Header & Actions */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Full Settings Studio</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-medium">
                {filteredFeatures.length} Available Controls
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              Configure every element of YouTube with instant live feedback, including player quality, speed, columns, and custom CSS.
            </p>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600/25 to-indigo-600/25 hover:from-rose-600/35 hover:to-indigo-600/35 border border-rose-500/40 text-xs font-semibold text-white transition-all shadow-sm"
              title="Open full gallery of 10 reference screenshots and settings groups"
            >
              <Camera className="w-3.5 h-3.5 text-rose-400" />
              <span>📸 Reference Screenshots (10 Groups)</span>
            </button>

            {currentCategoryObj?.screenshot && (
              <button
                onClick={() => setActiveScreenshot({
                  title: currentCategoryObj.screenshot!.title,
                  badge: currentCategoryObj.screenshot!.badge,
                  subtitle: currentCategoryObj.screenshot!.subtitle,
                  beforeText: currentCategoryObj.screenshot!.beforeDescription,
                  afterText: currentCategoryObj.screenshot!.afterDescription,
                  mockType: currentCategoryObj.screenshot!.mockType,
                })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-xs font-semibold text-rose-300 transition-colors shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-rose-400" />
                <span>📸 Screenshot Visual Guide</span>
              </button>
            )}

            <button
              onClick={onExportConfig}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-zinc-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-zinc-400" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={onResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold text-red-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Global Search and Category Navigation */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all settings by keyword, selector, or category (e.g. comments, 4K, blur, shorts)..."
              className="w-full bg-zinc-950/70 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {EXTENSION_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20 ring-1 ring-white/20'
                      : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CUSTOM CSS EDITOR SECTION (Active when selected or in 'all') */}
      {(activeCategory === 'all' || activeCategory === 'custom_css') && (!searchQuery || 'custom css'.includes(searchQuery.toLowerCase())) && (
        <div className="bg-[#12141c] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Custom CSS Live Engine</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Realtime Injection
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Write or paste custom CSS rules. Immediately injected into both the simulator and the Chrome Extension.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCss}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-medium text-zinc-200 transition-colors"
              >
                {copiedCss ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copiedCss ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!settings.enable_custom_css}
                  onChange={(e) => onToggle('enable_custom_css', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={customCss}
              onChange={(e) => onCustomCssChange && onCustomCssChange(e.target.value)}
              placeholder={`/* Enter custom CSS rules to apply to YouTube */\n#video-title {\n  font-weight: 600 !important;\n}\n\n#thumbnail {\n  border-radius: 12px !important;\n}`}
              rows={6}
              className="w-full bg-[#090a0f] border border-white/15 rounded-xl p-3 font-mono text-xs text-zinc-200 focus:outline-none focus:border-purple-500/80 transition-colors selection:bg-purple-600"
            />
          </div>

          {/* Quick Snippet Starter Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Quick Snippet Starters:</span>
            <div className="flex flex-wrap gap-2">
              {sampleSnippets.map((snip) => (
                <button
                  key={snip.title}
                  onClick={() => {
                    const next = (customCss ? customCss + '\n\n' : '') + snip.css;
                    if (onCustomCssChange) onCustomCssChange(next);
                    if (!settings.enable_custom_css) onToggle('enable_custom_css', true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-white/10 text-[11px] text-zinc-300 font-medium transition-all"
                >
                  + Add {snip.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Screenshot Banner Guide */}
      {currentCategoryObj?.screenshot && !searchQuery && (
        <CategoryScreenshotCard
          categoryId={currentCategoryObj.id}
          categoryLabel={currentCategoryObj.label}
          screenshot={currentCategoryObj.screenshot}
          onOpenModal={() => setActiveScreenshot({
            title: currentCategoryObj.screenshot!.title,
            badge: currentCategoryObj.screenshot!.badge,
            subtitle: currentCategoryObj.screenshot!.subtitle,
            beforeText: currentCategoryObj.screenshot!.beforeDescription,
            afterText: currentCategoryObj.screenshot!.afterDescription,
            mockType: currentCategoryObj.screenshot!.mockType,
          })}
        />
      )}

      {/* Grouped Settings in Single Unified Cards (iOS / Untrap Style) */}
      <div className="space-y-6">
        {groupedSections.map((group) => {
          const enabledCount = group.items.filter((item) => {
            const val = settings[item.id];
            if (typeof val === 'boolean') return val;
            if (typeof val === 'string' && val !== 'default' && val !== 'auto' && val !== '1.0') return true;
            return false;
          }).length;

          const isAdFiltering = group.subGroup === 'Ad Filtering';

          return (
            <div
              key={`${group.category}__${group.subGroup}`}
              className={`border rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm transition-all hover:border-white/15 ${
                isAdFiltering 
                  ? 'bg-gradient-to-b from-[#131b17] to-zinc-900/95 border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-emerald-950/20' 
                  : 'bg-zinc-900/90 border-white/10'
              }`}
            >
              {/* Group / Section Header with Icon */}
              <div className={`px-5 py-3.5 border-b flex items-center justify-between flex-wrap gap-2 ${
                isAdFiltering ? 'bg-emerald-950/30 border-emerald-500/20' : 'bg-zinc-800/60 border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                    isAdFiltering ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10'
                  }`}>
                    {getSubGroupIcon(group.subGroup, group.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
                      <span>{group.subGroup}</span>
                      {isAdFiltering && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          AdBlock Engine
                        </span>
                      )}
                      {activeCategory === 'all' && (
                        <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
                          • {EXTENSION_CATEGORIES.find((c) => c.id === group.category)?.label}
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdFiltering && (
                    <div className="flex items-center gap-1.5 mr-1">
                      <button
                        onClick={() => group.items.forEach(it => onToggle(it.id, true))}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1"
                        title="Enable all ad-blocking filters"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Enable All</span>
                      </button>
                      <button
                        onClick={() => group.items.forEach(it => onToggle(it.id, false))}
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/5 transition-all"
                        title="Disable all ad filters"
                      >
                        Disable All
                      </button>
                    </div>
                  )}
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    enabledCount > 0 
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                      : 'bg-white/5 text-zinc-400 border-white/5'
                  }`}>
                    {enabledCount} of {group.items.length} enabled
                  </span>
                </div>
              </div>

              {/* Group Settings in Single Card Background with Dividers */}
              <div className="divide-y divide-white/5">
                {group.items.map((item) => {
                  const currentValue = settings[item.id];
                  const isChecked = typeof currentValue === 'boolean' ? currentValue : !!currentValue;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isChecked ? 'bg-white/[0.015]' : 'hover:bg-white/[0.01]'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 pr-0 sm:pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-sm tracking-tight leading-snug">
                            {item.name}
                          </h4>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTagBadgeClass(item.tag)}`}>
                            {item.tag}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                          {item.description}
                        </p>

                        {/* Reference Screenshot Button if available */}
                        <div className="pt-1 flex flex-wrap items-center gap-3">
                          {item.referenceScreenshot && (
                            <button
                              onClick={() => setActiveScreenshot({
                                title: item.referenceScreenshot!.title,
                                badge: item.referenceScreenshot!.badge,
                                subtitle: item.name,
                                beforeText: item.referenceScreenshot!.beforeText,
                                afterText: item.referenceScreenshot!.afterText,
                                highlightText: item.referenceScreenshot!.highlightSelectorText,
                                mockType: item.referenceScreenshot!.mockType || item.category,
                                settingId: item.id,
                                currentValue: currentValue,
                                onToggleSetting: (val) => onToggle(item.id, val)
                              })}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 border border-rose-500/30 text-[11px] font-semibold transition-all hover:scale-[1.02]"
                            >
                              <Camera className="w-3 h-3 text-rose-400" />
                              <span>📸 View Screenshot</span>
                            </button>
                          )}

                          {item.cssSelector && (
                            <button
                              onClick={() => setExpandedSelector(expandedSelector === item.id ? null : item.id)}
                              className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
                            >
                              {expandedSelector === item.id ? 'Hide Selector' : 'View Selector'}
                            </button>
                          )}
                        </div>

                        {expandedSelector === item.id && item.cssSelector && (
                          <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-zinc-300 space-y-1">
                            <p className="text-zinc-500 text-[10px] uppercase">Target Selector:</p>
                            <code className="text-rose-300 break-all">{item.cssSelector}</code>
                            {item.cssRule && (
                              <>
                                <p className="text-zinc-500 text-[10px] uppercase pt-1">Injected Rule:</p>
                                <code className="text-emerald-300 break-all">{item.cssRule}</code>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Controller: Toggle, Slider, or Select */}
                      <div className="flex-shrink-0 flex items-center gap-3 self-end sm:self-center">
                        {item.settingType === 'select' && item.options ? (
                          <select
                            value={currentValue ?? item.options[0].value}
                            onChange={(e) => onToggle(item.id, e.target.value)}
                            className="bg-zinc-800 border border-white/15 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-rose-500 cursor-pointer shadow-sm"
                          >
                            {item.options.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : item.settingType === 'slider' ? (
                          <div className="flex items-center gap-2.5 bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-white/10">
                            <input
                              type="range"
                              min={item.min ?? 4}
                              max={item.max ?? 30}
                              step={item.step ?? 2}
                              value={currentValue ?? item.defaultEnabled ?? 12}
                              onChange={(e) => onToggle(item.id, Number(e.target.value))}
                              className="w-24 accent-rose-500 cursor-pointer"
                            />
                            <span className="text-xs font-mono font-bold text-zinc-200 min-w-[36px] text-right">
                              {currentValue ?? item.defaultEnabled ?? 12}{item.unit ?? 'px'}
                            </span>
                          </div>
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => onToggle(item.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600 shadow-inner"></div>
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Creator Support Allowlist Manager */}
              {isAdFiltering && (
                <div className="p-5 bg-emerald-950/20 border-t border-emerald-500/20 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-white text-sm">Creator Support Allowlist</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {allowlistChannels.length} Creators Exempt
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 w-full sm:w-auto">
                      Exempt specific channels from ad-blocking so your favorite creators still receive full monetization.
                    </p>
                  </div>

                  {/* Input Form */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={newChannelInput}
                        onChange={(e) => setNewChannelInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddAllowlistChannel();
                          }
                        }}
                        placeholder="Enter YouTube channel ID (UC...) or handle (e.g. @mkbhd, @veritasium)..."
                        className="w-full bg-zinc-900 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => handleAddAllowlistChannel()}
                      disabled={!newChannelInput.trim()}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Channel</span>
                    </button>
                  </div>

                  {/* Quick suggestions */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-zinc-400">
                    <span className="text-zinc-500">Quick Add:</span>
                    {['@mkbhd', '@veritasium', '@kurzgesagt', '@lexfridman', '@fireship'].map((suggest) => {
                      const isAdded = allowlistChannels.some((c) => normalizeChannelIdentifier(c) === normalizeChannelIdentifier(suggest));
                      return (
                        <button
                          key={suggest}
                          onClick={() => handleAddAllowlistChannel(suggest)}
                          disabled={isAdded}
                          className={`px-2 py-0.5 rounded-lg border text-[10px] font-medium transition-all ${
                            isAdded
                              ? 'bg-zinc-800 text-zinc-500 border-white/5 cursor-default'
                              : 'bg-zinc-800/80 hover:bg-zinc-700 text-emerald-300 border-emerald-500/20 hover:border-emerald-500/40'
                          }`}
                        >
                          {suggest} {isAdded ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Channels Chips */}
                  <div className="pt-1">
                    {allowlistChannels.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No creator channels currently allowlisted. Add @handles or channel IDs above to exempt them.</p>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        {allowlistChannels.map((channel) => (
                          <div
                            key={channel}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium shadow-sm shadow-emerald-950/30"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{channel.startsWith('@') ? channel : `@${channel}`}</span>
                            <button
                              onClick={() => handleRemoveAllowlistChannel(channel)}
                              className="text-zinc-400 hover:text-rose-400 p-0.5 transition-colors ml-0.5"
                              title={`Remove ${channel} from allowlist`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-white/5 space-y-3">
          <Filter className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching settings found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try searching for another keyword like &ldquo;Shorts&rdquo;, &ldquo;Comments&rdquo;, &ldquo;Thumbnails&rdquo;, or &ldquo;Sidebar&rdquo;.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
      {/* Reference Screenshot Modal */}
      {activeScreenshot && (
        <ReferenceScreenshotModal
          isOpen={!!activeScreenshot}
          onClose={() => setActiveScreenshot(null)}
          screenshotData={activeScreenshot}
        />
      )}

      {/* 10 Reference Screenshots Gallery */}
      <SettingsGroupScreenshotGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        settings={settings}
        onToggle={onToggle}
      />
    </div>
  );
}
