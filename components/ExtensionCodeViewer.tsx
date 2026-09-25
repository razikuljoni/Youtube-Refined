'use client';

import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Folder, 
  FileText, 
  FileJson, 
  FileType, 
  ExternalLink 
} from 'lucide-react';
import { getAllExtensionFiles, ExtensionFile } from '@/lib/extension-packager';

interface ExtensionCodeViewerProps {
  settings: Record<string, any>;
  onDownloadZip: () => void;
}

export default function ExtensionCodeViewer({
  settings,
  onDownloadZip,
}: ExtensionCodeViewerProps) {
  const files = getAllExtensionFiles(settings);
  const [selectedFileName, setSelectedFileName] = useState<string>(files[0].name);
  const [copied, setCopied] = useState(false);

  const selectedFile = files.find(f => f.name === selectedFileName) || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (type: ExtensionFile['type']) => {
    switch (type) {
      case 'json':
        return <FileJson className="w-4 h-4 text-amber-400" />;
      case 'javascript':
        return <FileCode2 className="w-4 h-4 text-yellow-400" />;
      case 'css':
        return <FileType className="w-4 h-4 text-sky-400" />;
      case 'html':
        return <FileCode2 className="w-4 h-4 text-orange-400" />;
      case 'markdown':
        return <FileText className="w-4 h-4 text-indigo-400" />;
      default:
        return <FileText className="w-4 h-4 text-zinc-400" />;
    }
  };

  const lines = selectedFile.content.split('\n');

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Chrome Extension Source Code</h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Fully standard Manifest V3 package with options page, popup UI with global search, content scripts, background worker, and high-performance CSS.
          </p>
        </div>

        <button
          onClick={onDownloadZip}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-red-500/20 ring-1 ring-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Download All (.zip)</span>
        </button>
      </div>

      {/* Code Explorer Window */}
      <div className="bg-[#0b0c10] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[620px]">
        {/* Left File Tree Column */}
        <div className="w-full md:w-64 bg-[#101217] border-b md:border-b-0 md:border-r border-white/10 p-3 flex flex-col gap-1 flex-shrink-0">
          <div className="px-3 py-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-zinc-500" />
            <span>Project Files ({files.length})</span>
          </div>

          <div className="space-y-0.5 overflow-y-auto max-h-[300px] md:max-h-none flex-1">
            {files.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileName(file.name)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-all text-left ${
                    isSelected
                      ? 'bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`}
                >
                  {getFileIcon(file.type)}
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/5 text-[11px] text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-300">Ready to load unpacked:</p>
            <p className="text-zinc-500">Extract .zip and load into chrome://extensions</p>
          </div>
        </div>

        {/* Right Code Display Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0e13]">
          {/* File Tab Header */}
          <div className="bg-[#14161f] border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
              {getFileIcon(selectedFile.type)}
              <span className="font-semibold text-white">{selectedFile.path}</span>
              <span className="text-zinc-500 text-[11px]">({lines.length} lines)</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>

          {/* Syntax Highlighted Lines */}
          <div className="flex-1 p-4 font-mono text-xs overflow-auto leading-relaxed select-text">
            <pre className="text-zinc-300 whitespace-pre">
              {lines.map((line, idx) => (
                <div key={idx} className="table-row hover:bg-white/[0.03]">
                  <span className="table-cell pr-4 text-right select-none text-zinc-600 w-10 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell">{line || ' '}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
