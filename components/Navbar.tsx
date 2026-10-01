'use client';

import React from 'react';
import { 
  Download, 
  Sliders, 
  Eye, 
  FileCode2, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  Power,
  AppWindow,
  Camera
} from 'lucide-react';
import { PRESETS, PresetConfig } from '@/lib/extension-data';

interface NavbarProps {
  activeTab: 'simulator' | 'popup' | 'controls' | 'code' | 'architecture';
  setActiveTab: (tab: 'simulator' | 'popup' | 'controls' | 'code' | 'architecture') => void;
  masterSwitch: boolean;
  setMasterSwitch: (enabled: boolean) => void;
  activePreset: string;
  onSelectPreset: (preset: PresetConfig) => void;
  activeFeatureCount: number;
  totalFeatureCount: number;
  onDownloadZip: () => void;
  onOpenGuide: () => void;
  onOpenScreenshots?: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  masterSwitch,
  setMasterSwitch,
  activePreset,
  onSelectPreset,
  activeFeatureCount,
  totalFeatureCount,
  onDownloadZip,
  onOpenGuide,
  onOpenScreenshots,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0f1015]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Master Toggle */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-red-500/25 ring-1 ring-white/20 flex-shrink-0 flex items-center justify-center bg-zinc-900">
              <svg viewBox="0 0 512 512" className="w-full h-full">
                <rect width="512" height="512" rx="120" fill="#121319" />
                <rect x="90" y="115" width="332" height="282" rx="72" fill="url(#navBrandGrad)" />
                <path d="M224 195 L332 256 L224 317 Z" fill="#ffffff" />
                <circle cx="396" cy="116" r="32" fill="#10b981" stroke="#ffffff" strokeWidth="4" />
                <defs>
                  <linearGradient id="navBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff1a40" />
                    <stop offset="50%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg tracking-tight">YouTube Refined</span>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Untrap Mode
                </span>
              </div>
              <p className="text-xs text-zinc-400">Customizable Distraction-Free Chrome Extension</p>
            </div>
          </div>

          {/* Master Switch */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/10">
            <button
              onClick={() => setMasterSwitch(!masterSwitch)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                masterSwitch
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${masterSwitch ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{masterSwitch ? 'Shield Active' : 'Extension Paused'}</span>
            </button>
            <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
              {activeFeatureCount}/{totalFeatureCount} Active
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 bg-zinc-900/60 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/15'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('popup')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'popup'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/15'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AppWindow className="w-3.5 h-3.5 text-pink-400" />
            <span>Extension Popup UI</span>
          </button>

          <button
            onClick={() => setActiveTab('controls')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'controls'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/15'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>All Settings Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/15'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Extension Code</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/15'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Architecture & Roadmap</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenScreenshots && (
            <button
              onClick={onOpenScreenshots}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300 hover:text-white transition-all"
              title="View 10 Reference Screenshots & Settings Groups"
            >
              <Camera className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">10 Screenshots</span>
            </button>
          )}

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all"
            title="How to install in Chrome"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install Guide</span>
          </button>

          <button
            onClick={onDownloadZip}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-red-500/20 ring-1 ring-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ZIP</span>
          </button>
        </div>

      </div>

      {/* Preset Sub-bar */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-3">
        <div className="flex items-center gap-2 text-zinc-400 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-zinc-300">Quick Presets:</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                activePreset === preset.id
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-white/5 hover:border-white/10'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
