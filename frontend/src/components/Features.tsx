'use client';

import React from 'react';
import Link from 'next/link';
import {
  Languages,
  SlidersHorizontal,
  Download,
  Zap,
  History,
  ShieldCheck,
  CheckCircle,
  Play,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_TEXTS } from '@/lib/sampleData';

const FEATURES_LIST = [
  {
    icon: Languages,
    title: 'Hindi & 50+ Global Languages',
    description:
      'Native Hindi neural models (Swara & Madhur), Indian English (Neerja & Prabhat), American, British, Spanish, French, Japanese, and more.',
    badge: 'Multi-Lingual',
  },
  {
    icon: SlidersHorizontal,
    title: 'Precision Pitch & Pace Sculpting',
    description:
      'Fine-tune speech rate (-50% to +100%) and vocal pitch (-50Hz to +50Hz) for commercials, character acting, or technical guides.',
    badge: 'Pro Audio Controls',
  },
  {
    icon: Download,
    title: 'Instant Studio MP3 Export',
    description:
      'Generate clear, broadcast-grade MP3 audio in seconds. Download directly to your machine or integrate into your video workflows.',
    badge: 'High Fidelity',
  },
  {
    icon: Zap,
    title: 'Powered by Edge-TTS Engine',
    description:
      'Utilize Microsoft Edge neural models at zero cost. No expensive API tokens or credit card needed to get started with speech generation.',
    badge: 'Zero Cost',
  },
  {
    icon: History,
    title: 'Smart History & Archive',
    description:
      'Keep track of all your past generations with timestamped metadata, custom speed settings, instant replay, and one-click re-download.',
    badge: 'Auto Save',
  },
  {
    icon: ShieldCheck,
    title: 'FastAPI Backend & Swagger Docs',
    description:
      'Robust Python backend with input validation, rate limiting, clean CORS configuration, and interactive API documentation.',
    badge: 'Developer Friendly',
  },
];

export default function Features() {
  return (
    <section className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-lime-500/20 bg-lime-500/10 text-lime-400 text-xs font-semibold">
            <span>Engineered for Creators</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need for Studio-Grade AI Speech
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Voxora AI combines state-of-the-art neural speech synthesis with an intuitive creator dashboard designed for podcasters, educators, and developers.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_LIST.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-3xl border border-white/10 bg-[#11151c]/70 hover:border-lime-400/40 hover:bg-[#141922] transition-all shadow-xl hover:shadow-lime-950/20 backdrop-blur-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-lime-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Samples Showcase Section */}
        <div id="samples" className="scroll-mt-24 pt-8">
          <div className="p-8 sm:p-10 rounded-3xl border border-lime-500/20 bg-gradient-to-b from-[#11151c] to-[#090b0e] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Curated Voice Samples</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Test sample scripts directly in the Voice Studio with one click.
                </p>
              </div>
              <Link
                href="/studio"
                className="px-5 py-2.5 rounded-xl lime-glow-btn text-black font-bold text-xs flex items-center gap-2 self-start sm:self-auto"
              >
                Try in Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_TEXTS.map((sample) => (
                <div
                  key={sample.id}
                  className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-lime-500/30 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-lime-400">{sample.title}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {sample.language}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-3">
                      &quot;{sample.text}&quot;
                    </p>
                  </div>

                  <Link
                    href={`/studio`}
                    className="text-xs text-slate-400 hover:text-lime-300 font-semibold flex items-center gap-1 pt-2 border-t border-white/5 transition-colors"
                  >
                    Open in Studio →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
