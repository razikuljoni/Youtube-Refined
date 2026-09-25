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
  Maximize2
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePreset, setActivePreset] = useState<string>('balanced_mindful');

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
                Popup
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Untrap-Style Extension Experience</p>
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

      {/* Global Instant Search Bar */}
      <div className="p-3 bg-[#13151b] border-b border-white/5 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all settings (e.g. comments, 4K, blur, shorts)..."
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
            <span>Full Settings Studio</span>
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
          if (catId === 'custom_css') return null; // handled separately above
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
