'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  Maximize2, 
  Check, 
  Sliders,
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
import { CategoryScreenshot } from '@/lib/extension-data';

interface CategoryScreenshotCardProps {
  categoryId: string;
  categoryLabel: string;
  screenshot: CategoryScreenshot;
  onOpenModal: () => void;
}

export default function CategoryScreenshotCard({
  categoryId,
  categoryLabel,
  screenshot,
  onOpenModal
}: CategoryScreenshotCardProps) {
  const [previewState, setPreviewState] = useState<'after' | 'before'>('after');

  const getCategoryIcon = () => {
    switch (categoryId) {
      case 'home': return <Home className="w-4 h-4 text-emerald-400" />;
      case 'shorts': return <Compass className="w-4 h-4 text-rose-400" />;
      case 'watch': return <Tv className="w-4 h-4 text-indigo-400" />;
      case 'sidebar': return <Menu className="w-4 h-4 text-cyan-400" />;
      case 'header': return <Search className="w-4 h-4 text-amber-400" />;
      case 'search': return <Filter className="w-4 h-4 text-purple-400" />;
      case 'visual': return <Eye className="w-4 h-4 text-pink-400" />;
      case 'mindful': return <Clock className="w-4 h-4 text-teal-400" />;
      case 'custom_css': return <Code2 className="w-4 h-4 text-purple-400" />;
      case 'subscriptions': return <Layers className="w-4 h-4 text-amber-400" />;
      case 'channel': return <Compass className="w-4 h-4 text-blue-400" />;
      case 'library': return <Tv className="w-4 h-4 text-teal-400" />;
      case 'embedded': return <Maximize2 className="w-4 h-4 text-rose-400" />;
      case 'decoration': return <Sparkles className="w-4 h-4 text-violet-400" />;
      case 'ads': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default: return <Sliders className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-zinc-950/90 to-[#0e1017]/90 p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            {getCategoryIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Visual Screenshot Reference
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {screenshot.badge}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {screenshot.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick inline before/after toggle */}
          <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-white/10 text-xs">
            <button
              onClick={() => setPreviewState('after')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                previewState === 'after'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Refined (After)
            </button>
            <button
              onClick={() => setPreviewState('before')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                previewState === 'before'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Default (Before)
            </button>
          </div>

          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors border border-white/10"
          >
            <Maximize2 className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">Expand Screenshot</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed">
        {screenshot.subtitle}
      </p>

      {/* Mini Visual Screenshot Preview Strip */}
      <div 
        onClick={onOpenModal}
        className="group relative cursor-pointer rounded-xl border border-white/10 bg-[#0f0f0f] p-4 overflow-hidden hover:border-rose-500/40 transition-all duration-200"
      >
        <div className="flex items-center justify-between text-[11px] pb-3 border-b border-white/5 text-zinc-400">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${previewState === 'after' ? 'bg-emerald-400' : 'bg-red-500'}`} />
            <span className="font-semibold text-zinc-200">
              {previewState === 'after' ? 'YouTube Refined Active State' : 'YouTube Default State'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 group-hover:text-rose-400 transition-colors flex items-center gap-1">
            Click to open high-res reference ➔
          </span>
        </div>

        <div className="py-3 text-xs">
          {previewState === 'after' ? (
            <div className="flex items-start gap-3 text-emerald-300">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">{screenshot.afterDescription}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {screenshot.annotatedFeatures.map((feat, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-medium"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-red-300">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">{screenshot.beforeDescription}</p>
                <p className="text-[11px] text-zinc-400">
                  Multiple attention triggers, infinite recommendations, and visual clutter engineered to maximize platform retention.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
