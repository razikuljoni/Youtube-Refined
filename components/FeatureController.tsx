'use client';

import React, { useState, useMemo } from 'react';
import { 
  FEATURE_TOGGLES, 
  EXTENSION_CATEGORIES, 
  FeatureToggle,
  PRESETS,
  PresetConfig
} from '@/lib/extension-data';
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
  CheckCheck
} from 'lucide-react';

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
      default: return <Sliders className="w-4 h-4" />;
    }
  };

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

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((item) => {
          if (item.category === 'custom_css') return null; // rendered separately above
          const currentValue = settings[item.id];
          const isChecked = typeof currentValue === 'boolean' ? currentValue : !!currentValue;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between gap-4 ${
                isChecked
                  ? 'bg-zinc-900/90 border-white/20 shadow-lg shadow-black/20'
                  : 'bg-zinc-950/60 border-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTagBadgeClass(item.tag)}`}>
                      {item.tag}
                    </span>
                    <h3 className="font-bold text-white text-sm tracking-tight leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  {/* Toggle / Select / Slider Controller */}
                  <div className="flex-shrink-0 pt-1">
                    {item.settingType === 'select' && item.options ? (
                      <select
                        value={currentValue ?? item.options[0].value}
                        onChange={(e) => onToggle(item.id, e.target.value)}
                        className="bg-zinc-800 border border-white/15 text-white rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-rose-500 cursor-pointer"
                      >
                        {item.options.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : item.settingType === 'slider' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={item.min ?? 4}
                          max={item.max ?? 30}
                          step={item.step ?? 2}
                          value={currentValue ?? 12}
                          onChange={(e) => onToggle(item.id, Number(e.target.value))}
                          className="w-20 accent-rose-500 cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-zinc-300 min-w-[32px] text-right">
                          {currentValue ?? 12}{item.unit ?? 'px'}
                        </span>
                      </div>
                    ) : (
                      /* Modern iOS / Untrap Style Toggle Switch */
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => onToggle(item.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                      </label>
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Selector Details Accordion */}
              {item.cssSelector && (
                <div className="pt-2 border-t border-white/5">
                  <button
                    onClick={() => setExpandedSelector(expandedSelector === item.id ? null : item.id)}
                    className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Technical CSS Selector & Rule</span>
                    {expandedSelector === item.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {expandedSelector === item.id && (
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
    </div>
  );
}
