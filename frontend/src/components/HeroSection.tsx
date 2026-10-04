'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Mic,
  Zap,
  Globe,
  Sliders
} from 'lucide-react';
import { CURATED_VOICES } from '@/lib/sampleData';
import { previewVoiceSample } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function HeroSection() {
  const [activeVoiceSnippet, setActiveVoiceSnippet] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const { info, error: toastError } = useToast();

  const handleAudition = async (voiceShortName: string, text: string) => {
    if (activeVoiceSnippet === voiceShortName) {
      if (audioObj) audioObj.pause();
      setActiveVoiceSnippet(null);
      return;
    }

    try {
      if (audioObj) audioObj.pause();
      setActiveVoiceSnippet(voiceShortName);

      const url = await previewVoiceSample(voiceShortName, text);
      const audio = new Audio(url);
      setAudioObj(audio);

      audio.onended = () => {
        setActiveVoiceSnippet(null);
      };
      audio.onerror = () => {
        setActiveVoiceSnippet(null);
      };

      await audio.play();
    } catch (err) {
      setActiveVoiceSnippet(null);
      toastError('Start backend to test live neural audition');
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-lime-400/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-300 text-xs font-semibold backdrop-blur-md animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-lime-400" />
          <span>Next-Generation Neural Text-to-Speech</span>
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
        </div>

        {/* Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Turn Any Text Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-lime-400 to-lime-500">
              Cinema-Grade
            </span>{' '}
            AI Speech.
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Generate human-like voiceovers in <strong className="text-slate-200">Hindi</strong>,{' '}
            <strong className="text-slate-200">English</strong>, and 50+ languages with studio pitch, rate, and MP3 export.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/studio"
            className="px-7 py-3.5 rounded-2xl lime-glow-btn text-black font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Mic className="w-5 h-5" />
            Launch Voice Studio
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <a
            href="#samples"
            className="px-6 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-sm sm:text-base backdrop-blur-md transition-all flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-lime-400" />
            Listen to Voice Demos
          </a>
        </div>

        {/* Interactive Quick Audition Showcase Widget */}
        <div className="pt-10 max-w-3xl mx-auto">
          <div className="p-4 sm:p-6 rounded-3xl border border-white/10 bg-[#11151c]/80 backdrop-blur-xl shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-lime-400/10 text-lime-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">Instant Voice Audition</h3>
                  <p className="text-[11px] text-slate-400">Hear the neural difference right now</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-full border border-lime-400/20">
                100% Free Neural Model
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CURATED_VOICES.slice(0, 4).map((voice) => {
                const isPlaying = activeVoiceSnippet === voice.short_name;
                return (
                  <div
                    key={voice.short_name}
                    className="p-3 rounded-2xl bg-black/40 border border-white/5 hover:border-lime-500/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{voice.friendly_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({voice.gender})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">
                        &quot;{voice.preview_text}&quot;
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAudition(voice.short_name, voice.preview_text)}
                      className={`p-2.5 rounded-xl transition-all ${
                        isPlaying
                          ? 'bg-lime-400 text-black shadow-[0_0_12px_#a3e635]'
                          : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
                      }`}
                      title="Audition Voice"
                      aria-label={`Audition ${voice.friendly_name}`}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 text-center">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-black text-lime-400">300+</div>
            <div className="text-xs text-slate-400 mt-0.5">Neural Voices</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-black text-lime-400">50+</div>
            <div className="text-xs text-slate-400 mt-0.5">Global Languages</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-black text-lime-400">&lt;500ms</div>
            <div className="text-xs text-slate-400 mt-0.5">Synthesis Latency</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl font-black text-lime-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Free Starting Tier</div>
          </div>
        </div>
      </div>
    </section>
  );
}
