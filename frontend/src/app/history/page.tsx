'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HistoryItem } from '@/lib/types';
import { getLocalHistory, deleteLocalHistoryItem, clearLocalHistory } from '@/lib/storage';
import { useToast } from '@/components/Toast';
import {
  History,
  Play,
  Pause,
  Download,
  Trash2,
  Search,
  Volume2,
  Sparkles,
  ArrowRight,
  Clock,
  Mic
} from 'lucide-react';

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { success, info } = useToast();

  useEffect(() => {
    setItems(getLocalHistory());
  }, []);

  const handlePlay = (item: HistoryItem) => {
    if (activeAudioId === item.id) {
      if (audioElement) {
        audioElement.pause();
      }
      setActiveAudioId(null);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(item.audioUrl);
    setAudioElement(audio);
    setActiveAudioId(item.id);

    audio.onended = () => {
      setActiveAudioId(null);
    };

    audio.play().catch(console.error);
  };

  const handleDownload = (item: HistoryItem) => {
    const a = document.createElement('a');
    a.href = item.audioUrl;
    a.download = `voxora_${item.voice.toLowerCase()}_${item.id}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    success('Downloaded audio file');
  };

  const handleDelete = (id: string) => {
    const updated = deleteLocalHistoryItem(id);
    setItems(updated);
    info('Removed generation from archive');
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your generation history?')) {
      clearLocalHistory();
      setItems([]);
      info('Cleared all archive history');
    }
  };

  const filtered = items.filter(
    (item) =>
      item.text.toLowerCase().includes(search.toLowerCase()) ||
      item.voiceName.toLowerCase().includes(search.toLowerCase()) ||
      item.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col bg-grid-pattern">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-lime-400" />
              Speech Archive & Generations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Access and download all your past neural voice generations with exact parameter timestamps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Archive
              </button>
            )}
            <Link
              href="/studio"
              className="px-4 py-2 rounded-xl lime-glow-btn text-black text-xs font-bold flex items-center gap-1.5"
            >
              <Mic className="w-4 h-4" />
              Create New
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search generations by text, voice, or language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#11151c] border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-lime-400/50"
          />
        </div>

        {/* Archive Cards Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center rounded-2xl border border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3">
              <Sparkles className="w-7 h-7 text-lime-400/60" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No Generations Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {search
                ? 'No audio matches your search filter.'
                : 'You have not synthesized any speech yet.'}
            </p>
            <Link
              href="/studio"
              className="mt-4 px-4 py-2 rounded-xl lime-glow-btn text-black text-xs font-bold flex items-center gap-1.5"
            >
              Open Studio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const isPlaying = activeAudioId === item.id;
              const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-white/10 bg-[#11151c]/90 hover:border-lime-400/40 shadow-xl transition-all flex flex-col justify-between space-y-4 backdrop-blur-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center font-bold text-xs">
                          {item.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-lime-300 transition-colors">
                            {item.voiceName}
                          </h4>
                          <span className="text-[11px] text-slate-400">{item.language}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{formattedDate}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                      &quot;{item.text}&quot;
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{item.characterCount} chars</span>
                      <span>•</span>
                      <span>Rate: {item.rate > 0 ? `+${item.rate}%` : `${item.rate}%`}</span>
                      <span>•</span>
                      <span>Pitch: {item.pitch > 0 ? `+${item.pitch}Hz` : `${item.pitch}Hz`}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handlePlay(item)}
                      className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isPlaying
                          ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.4)]'
                          : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/5'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span>Play Audio</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      className="p-2 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/30 transition-colors"
                      title="Download MP3"
                      aria-label="Download MP3"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-white/5 transition-colors"
                      title="Delete from archive"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
