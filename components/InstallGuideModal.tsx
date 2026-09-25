'use client';

import React from 'react';
import { 
  X, 
  Download, 
  FolderCheck, 
  ToggleRight, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
}

export default function InstallGuideModal({
  isOpen,
  onClose,
  onDownloadZip,
}: InstallGuideModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Download Extension Package',
      description: 'Click the button below to get the pre-bundled "youtube-refined-extension.zip" containing all Manifest V3 production files.',
      badge: 'Step 1'
    },
    {
      num: '02',
      title: 'Extract Zip to a Folder',
      description: 'Right click the downloaded .zip and extract it to a folder (e.g., in your Documents or Desktop). Keep all files intact.',
      badge: 'Step 2'
    },
    {
      num: '03',
      title: 'Open chrome://extensions/',
      description: 'In your browser (Chrome, Brave, Edge, Opera, or Arc), open a new tab and paste chrome://extensions/ into the address bar.',
      badge: 'Step 3'
    },
    {
      num: '04',
      title: 'Turn on "Developer Mode"',
      description: 'Look at the top-right corner of the Extensions page and toggle the "Developer mode" switch to ON.',
      badge: 'Step 4'
    },
    {
      num: '05',
      title: 'Click "Load Unpacked"',
      description: 'In the top-left menu, click "Load unpacked", then select the unzipped "youtube-refined-extension" folder.',
      badge: 'Step 5'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121318] border border-white/10 rounded-2xl max-w-2xl w-full p-6 lg:p-8 relative shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>5-Minute Quick Setup</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            How to Load YouTube Refined in Chrome
          </h2>
          <p className="text-xs text-zinc-400">
            Works out of the box on Google Chrome, Brave, Microsoft Edge, Opera, and Arc browser.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-4 p-3.5 rounded-xl bg-zinc-900/70 border border-white/5 items-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md">
                {step.num}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">{step.badge}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Verification Check */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            Once loaded, open <strong>https://www.youtube.com</strong>. You will notice the distraction shield active immediately!
          </span>
        </div>

        {/* Action Bottom */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
          >
            Close
          </button>

          <button
            onClick={() => {
              onDownloadZip();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-red-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Extension .ZIP</span>
          </button>
        </div>

      </div>
    </div>
  );
}
