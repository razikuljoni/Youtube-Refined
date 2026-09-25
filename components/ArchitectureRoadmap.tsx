'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Lock, 
  Cpu, 
  CheckCircle2, 
  GitBranch, 
  Zap,
  ServerOff,
  EyeOff,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  Terminal,
  Workflow
} from 'lucide-react';
import { ARCHITECTURE_PLAN } from '@/lib/extension-data';

export default function ArchitectureRoadmap() {
  const phases = [
    {
      phase: 'Phase 1: Foundation & Manifest V3 Core',
      status: 'Completed',
      items: [
        'Establish Manifest V3 architecture with background service worker and content script hooks.',
        'Configure least-privilege permissions: only "storage" and "webNavigation" scoped exclusively to *://*.youtube.com/*.',
        'Build fast-path HTML root attribute synchronizer (data-yr-*) to eliminate flash of unfiltered content (FOUC).'
      ]
    },
    {
      phase: 'Phase 2: Distraction Elimination & Selector Engineering',
      status: 'Completed',
      items: [
        'Map high-specificity CSS selectors for YouTube Polymer Web Components (ytd-browse, ytd-rich-grid-renderer, ytd-comments).',
        'Implement Universal Shorts Eradication: remove sidebar tabs, hide home shelves, and eliminate reels from keyword searches.',
        'Develop secondary watch results blocker to decouple focus while viewing educational and technical content.'
      ]
    },
    {
      phase: 'Phase 3: SPA Interception & Player Enhancements',
      status: 'Completed',
      items: [
        'Listen to YouTube proprietary SPA lifecycle events: yt-navigate-finish and yt-page-data-updated.',
        'Implement seamless redirection from /shorts/[id] to standard video player /watch?v=[id].',
        'Enforce default video quality (4K, 1440p, 1080p), custom playback speeds (1.15x-2.0x), and auto theater mode.'
      ]
    },
    {
      phase: 'Phase 4: Untrap Popup, Global Search & Custom CSS',
      status: 'Completed',
      items: [
        'Build Untrap-inspired compact popup with global setting search, category pill navigation, and instant live sync.',
        'Develop live Custom CSS code injector with starter presets and real-time stylesheet compilation.',
        'Add keyboard shortcuts: [T] Theater, [D] Distraction-free toggle, [B] Thumbnail Gaussian blur.'
      ]
    },
    {
      phase: 'Phase 5: Chrome Web Store Production & CI/CD Packaging',
      status: 'Production Ready',
      items: [
        'Strict CSP enforcement: zero dynamic code execution, no eval(), zero external remote CDN dependencies.',
        'Zero-telemetry policy: 100% on-device storage with chrome.storage.sync; zero external analytics tracking.',
        'Automated GitHub Actions CI/CD workflow (.github/workflows/extension-ci.yml) for linting, testing, and store bundle generation.',
        'Professional vector branding, icon assets (16x16, 48x48, 128x128), and complete store submission documentation.'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#141520] border border-white/10 rounded-2xl p-6 lg:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Architecture & Security Blueprint</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Production Engineering & Publishing Architecture
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            YouTube Refined is engineered to solve modern digital attention capture with production-grade reliability. 
            By leveraging Chrome Manifest V3, zero-flicker CSS injection, and client-side storage, it delivers sub-millisecond distraction elimination while maintaining 100% user privacy and Chrome Web Store review compliance.
          </p>
        </div>
      </div>

      {/* 1. CHROME WEB STORE PUBLISHING & CI/CD READINESS */}
      <div className="bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/20 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Chrome Web Store & GitHub Production Readiness</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Publish
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Automated build verification, clean manifest V3 schema, and zero-telemetry privacy guarantees.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-950/80 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>CI/CD Automation</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              GitHub Actions workflow automatically runs ESLint, type-checking, build validation, and packages the extension zip on every push.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Publishing Guide</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Step-by-step developer console guide provided in <code className="text-zinc-300">docs/CHROME_STORE_PUBLISH_GUIDE.md</code> with exact permission justifications.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-white/5 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Official Vector Branding</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              High-resolution vector logo (`/public/logo.svg`) and Chrome store icon assets (16x16, 48x48, 128x128) pre-packaged.
            </p>
          </div>
        </div>
      </div>

      {/* 2. USER PAIN POINTS & ATTENTION HIJACKING */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. User Pain Points & Cognitive Hijacking Analysis</h3>
            <p className="text-xs text-zinc-400">How default YouTube captures attention and why targeted countermeasures work.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARCHITECTURE_PLAN.painPoints.map((point, index) => (
            <div key={index} className="bg-zinc-950/70 border border-white/5 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <span className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span>{point.title}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed pl-7">{point.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MODULAR ARCHITECTURE (MANIFEST V3) */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Modular Manifest V3 Architecture</h3>
            <p className="text-xs text-zinc-400">Engineered according to Google Chrome Extension Review Standards.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARCHITECTURE_PLAN.modules.map((mod, idx) => (
            <div key={idx} className="bg-zinc-950/70 border border-white/5 rounded-xl p-5 space-y-2">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>{mod.name}</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{mod.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DEVELOPMENT ROADMAP PHASES */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">4. Comprehensive Development Roadmap</h3>
            <p className="text-xs text-zinc-400">Track implementation milestones and architectural delivery.</p>
          </div>
        </div>

        <div className="space-y-4">
          {phases.map((p, idx) => (
            <div key={idx} className="bg-zinc-950/70 border border-white/5 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{p.phase}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {p.status}
                </span>
              </div>
              <ul className="space-y-1.5">
                {p.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SECURITY & DATA PROTECTION COMPLIANCE */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">5. Strict Security & User Privacy Compliance</h3>
            <p className="text-xs text-zinc-400">Google Chrome Web Store single-purpose and privacy policy verification.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARCHITECTURE_PLAN.securityCompliance.map((sec, idx) => (
            <div key={idx} className="bg-zinc-950/70 border border-white/5 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">{sec.standard}</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {sec.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{sec.detail}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3 text-xs text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Security Guarantee:</strong> YouTube Refined requires NO login credentials, transmits NO viewing history to external databases, and uses only native Chrome storage. All rules execute strictly inside your local browser sandbox.
          </p>
        </div>
      </div>
    </div>
  );
}
