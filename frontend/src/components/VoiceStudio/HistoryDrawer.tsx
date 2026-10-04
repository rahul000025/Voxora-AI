'use client';

import React from 'react';
import {
  History,
  X,
  Play,
  Download,
  Trash2,
  Calendar,
  Volume2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { HistoryItem } from '@/lib/types';
import { useToast } from '@/components/Toast';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onPlayItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  items,
  onPlayItem,
  onDeleteItem,
  onClearAll,
}: HistoryDrawerProps) {
  const { info, success } = useToast();

  if (!isOpen) return null;

  const handleDownloadItem = (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = item.audioUrl;
    a.download = `voxora_${item.voice.toLowerCase()}_${item.id}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    success('Downloaded audio from history');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0e1218] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generation History</h3>
              <p className="text-xs text-slate-400">
                {items.length} generated speech files
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear All action */}
        {items.length > 0 && (
          <div className="px-5 py-2.5 bg-black/20 border-b border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400">Local Archive</span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        )}

        {/* Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {items.length === 0 ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-300">No saved generations</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Generated audio files will automatically appear here for instant replay and download.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => onPlayItem(item)}
                className="group p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-lime-500/30 cursor-pointer transition-all space-y-2.5"
              >
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200 group-hover:text-lime-300">
                    <Volume2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>{item.voiceName}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Text snippet */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic">
                  &quot;{item.text}&quot;
                </p>

                {/* Bottom buttons */}
                <div className="flex items-center justify-between pt-1 text-xs border-t border-white/5">
                  <div className="text-[11px] text-slate-400 font-mono">
                    {item.characterCount} chars
                    {item.rate !== 0 && ` • rate: ${item.rate > 0 ? '+' : ''}${item.rate}%`}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleDownloadItem(e, item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-lime-400 hover:bg-lime-400/10 transition-colors"
                      title="Download MP3"
                      aria-label="Download MP3"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
