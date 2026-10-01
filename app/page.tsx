'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Simulator from '@/components/Simulator';
import FeatureController from '@/components/FeatureController';
import ExtensionPopupSimulator from '@/components/ExtensionPopupSimulator';
import ArchitectureRoadmap from '@/components/ArchitectureRoadmap';
import ExtensionCodeViewer from '@/components/ExtensionCodeViewer';
import InstallGuideModal from '@/components/InstallGuideModal';
import SettingsGroupScreenshotGallery from '@/components/SettingsGroupScreenshotGallery';
import { 
  FEATURE_TOGGLES, 
  PRESETS, 
  PresetConfig 
} from '@/lib/extension-data';
import { downloadExtensionZip } from '@/lib/extension-packager';
import { 
  Sparkles, 
  Download, 
  ShieldCheck, 
  Sliders, 
  Eye, 
  Zap, 
  Lock, 
  Flame, 
  Check, 
  HelpCircle,
  Clock,
  Compass,
  AppWindow,
  Gauge,
  Layers,
  Code2,
  Camera
} from 'lucide-react';
import { recordRealInteraction } from '@/lib/usage-stats';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'popup' | 'controls' | 'code' | 'architecture'>('simulator');
  const [masterSwitch, setMasterSwitch] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>('stock_default');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isScreenshotsOpen, setIsScreenshotsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customCss, setCustomCss] = useState<string>(
    `/* YouTube Refined - Custom CSS Engine */\n#video-title {\n  font-weight: 600 !important;\n}\n\nytd-masthead {\n  backdrop-filter: blur(8px) !important;\n}`
  );

  // Initialize with stock defaults (all tweaks disabled out of the box as requested)
  const [settings, setSettings] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {
      home_grid_columns: 'default',
      default_video_quality: 'auto',
      custom_playback_speed: '1.0',
      auto_theater_mode: false,
      auto_captions_mode: 'default',
      custom_keyboard_shortcuts: false,
      thumbnail_blur_amount: 12,
      watched_video_blur_level: 8,
      watched_video_opacity_level: 40,
      enable_custom_css: false,
    };
    FEATURE_TOGGLES.forEach((f) => {
      if (f.settingType === 'select' && f.options && f.options.length > 0) {
        initial[f.id] = 'default';
      } else if (f.settingType === 'slider') {
        initial[f.id] = f.defaultEnabled ?? f.min ?? 12;
      } else {
        initial[f.id] = false; // All toggles default to disabled
      }
    });
    return initial;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleTweak = (id: string, value?: any) => {
    if (id === 'master_switch') {
      setMasterSwitch(value !== undefined ? !!value : !masterSwitch);
      showToast(value ? 'Master Shield Activated' : 'Master Shield Paused');
      return;
    }

    setSettings((prev) => {
      const nextVal = value !== undefined ? value : !prev[id];
      const updated = { ...prev, [id]: nextVal };
      setActivePreset('custom');
      // Record real user interaction in usage tracker
      recordRealInteraction('toggle', updated, masterSwitch);
      return updated;
    });

    const displayKey = id.replace(/_/g, ' ');
    showToast(`Updated "${displayKey}"`);
  };

  const handleSelectPreset = (preset: PresetConfig) => {
    setActivePreset(preset.id);
    setSettings((prev) => {
      const updated = { ...prev };
      for (const [key, val] of Object.entries(preset.settings)) {
        updated[key] = val;
      }
      return updated;
    });
    showToast(`Switched to "${preset.name}" preset!`);
  };

  const handleResetDefaults = () => {
    const defaults: Record<string, any> = {
      home_grid_columns: 'default',
      default_video_quality: 'auto',
      custom_playback_speed: '1.0',
      auto_theater_mode: false,
      auto_captions_mode: 'default',
      custom_keyboard_shortcuts: false,
      thumbnail_blur_amount: 12,
      watched_video_blur_level: 8,
      watched_video_opacity_level: 40,
      enable_custom_css: false,
    };
    FEATURE_TOGGLES.forEach((f) => {
      defaults[f.id] = f.defaultEnabled; // false by default
    });
    setSettings(defaults);
    setActivePreset('stock_default');
    showToast('Reset to default clean state (no tweaks enabled).');
  };

  const handleExportConfig = () => {
    const exportPayload = {
      settings,
      customCss,
      exportedAt: new Date().toISOString(),
      extension: 'YouTube Refined',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'youtube-refined-config.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
    showToast('Exported config JSON file.');
  };

  const handleImportConfig = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.settings) {
          setSettings((prev) => ({ ...prev, ...parsed.settings }));
          if (parsed.customCss) setCustomCss(parsed.customCss);
        } else {
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
        setActivePreset('custom');
        showToast('Successfully imported custom settings!');
      }
    } catch {
      showToast('Error importing JSON. Invalid format.');
    }
  };

  const handleDownloadZip = async () => {
    try {
      showToast('Generating Manifest V3 Extension .zip...');
      const payload = {
        ...settings,
        enable_custom_css: settings.enable_custom_css,
        custom_css_rules: customCss,
      };
      await downloadExtensionZip(payload);
      showToast('Downloaded youtube-refined-extension.zip! Check Install Guide.');
    } catch (err) {
      console.error(err);
      showToast('Failed to bundle extension zip.');
    }
  };

  // Active tweak counter
  const activeFeatureCount = Object.entries(settings).filter(([k, v]) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string' && v !== 'default' && v !== 'auto' && v !== '1.0') return true;
    return false;
  }).length;
  const totalFeatureCount = FEATURE_TOGGLES.length;

  return (
    <div className="min-h-screen bg-[#090a0d] text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masterSwitch={masterSwitch}
        setMasterSwitch={setMasterSwitch}
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
        activeFeatureCount={activeFeatureCount}
        totalFeatureCount={totalFeatureCount}
        onDownloadZip={handleDownloadZip}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenScreenshots={() => setIsScreenshotsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-white/20 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hero Section with Quick Overview */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#13141c] via-[#0f1016] to-[#090a0d] border border-white/10 p-6 lg:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Full-Flaged Untrap Alternative • Production Grade Chrome Extension</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              YouTube <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-indigo-400">Refined</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              Full control over YouTube&apos;s UI: eradicate Shorts, blackout home recommendations, enforce 1080p/4K default quality, set custom playback speeds, customize grid columns, and inject custom CSS.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleDownloadZip}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-red-500/20 ring-1 ring-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Download Extension Package (.zip)</span>
              </button>

              <button
                onClick={() => setActiveTab('popup')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-xs font-semibold text-pink-300 transition-colors"
              >
                <AppWindow className="w-4 h-4 text-pink-400" />
                <span>Try Extension Popup</span>
              </button>

              <button
                onClick={() => setIsScreenshotsOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors shadow-sm"
              >
                <Camera className="w-4 h-4 text-rose-400" />
                <span>Reference Screenshots (10)</span>
              </button>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-zinc-400" />
                <span>Installation Tutorial</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="space-y-0.5">
              <span className="text-xs text-zinc-400">Architecture</span>
              <p className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Manifest V3</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs text-zinc-400">Playback Quality</span>
              <p className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-400" />
                <span>Force 4K / 1080p</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs text-zinc-400">Columns & Layout</span>
              <p className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>2-6 Columns Grid</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs text-zinc-400">Custom CSS</span>
              <p className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-rose-400" />
                <span>Live Injected</span>
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Tab Views */}
        <section className="space-y-6">
          {activeTab === 'simulator' && (
            <div className="space-y-8">
              <Simulator
                settings={settings}
                masterSwitch={masterSwitch}
                onToggleTweak={handleToggleTweak}
                customCss={customCss}
              />
              
              {/* Companion Popup Preview Drawer right under simulator for instant side-by-side tweaking */}
              <div className="bg-[#12131a] border border-white/10 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <AppWindow className="w-5 h-5 text-pink-400" />
                      <span>Extension Popup & Search Companion</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      This represents the exact popup window that opens when clicking the YouTube Refined icon in Google Chrome.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('controls')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-semibold text-white transition-colors self-start sm:self-auto"
                  >
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Open Full Settings Studio</span>
                  </button>
                </div>

                <div className="flex justify-center py-2">
                  <ExtensionPopupSimulator
                    settings={settings}
                    masterSwitch={masterSwitch}
                    onToggle={handleToggleTweak}
                    onOpenFullOptions={() => setActiveTab('controls')}
                    customCss={customCss}
                    onCustomCssChange={setCustomCss}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'popup' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Chrome Extension Popup UI</h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Clean, modern Untrap-inspired popup window featuring global search, grouped section navigation, live toggle buttons, and direct custom CSS injection.
                </p>
              </div>

              <div className="flex justify-center py-6">
                <ExtensionPopupSimulator
                  settings={settings}
                  masterSwitch={masterSwitch}
                  onToggle={handleToggleTweak}
                  onOpenFullOptions={() => setActiveTab('controls')}
                  customCss={customCss}
                  onCustomCssChange={setCustomCss}
                />
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <FeatureController
              settings={settings}
              masterSwitch={masterSwitch}
              onToggle={handleToggleTweak}
              onResetDefaults={handleResetDefaults}
              onExportConfig={handleExportConfig}
              onImportConfig={handleImportConfig}
              customCss={customCss}
              onCustomCssChange={setCustomCss}
            />
          )}

          {activeTab === 'code' && (
            <ExtensionCodeViewer
              settings={settings}
              onDownloadZip={handleDownloadZip}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureRoadmap />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#0c0d11] py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">YouTube Refined</span>
            <span>• Full Untrap Alternative Chrome Extension & Studio</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('architecture')} className="hover:text-zinc-300">
              Architecture & Security
            </button>
            <button onClick={() => setActiveTab('code')} className="hover:text-zinc-300">
              Source Code
            </button>
            <button onClick={() => setIsGuideOpen(true)} className="hover:text-zinc-300">
              Install Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Installation Guide Modal */}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onDownloadZip={handleDownloadZip}
      />

      {/* Untrap 10 Reference Screenshots & Settings Groups Gallery */}
      <SettingsGroupScreenshotGallery
        isOpen={isScreenshotsOpen}
        onClose={() => setIsScreenshotsOpen(false)}
        settings={settings}
        onToggle={handleToggleTweak}
      />
    </div>
  );
}
