'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Features from '@/components/Features';
import SupabaseAuthModal from '@/components/SupabaseAuthModal';
import { Mic, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function HomePage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col bg-grid-pattern">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="flex-1">
        <HeroSection />
        <Features />

        {/* Engine Comparison & Architecture Section */}
        <section className="py-20 border-t border-white/5 bg-[#0b0e13]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Commercial Architecture & Scalability
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Designed with a decoupled FastAPI service and modern Next.js 15 interface.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Edge TTS Free Tier */}
              <div className="p-6 rounded-3xl border border-lime-500/40 bg-lime-950/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                    Current Implementation
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400/20 text-lime-400">
                    Active
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">Edge-TTS Neural Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Powers this project with Microsoft's neural voices at zero API cost. Ideal for development, prototypes, and low-to-medium volume commercial use without external subscription billing.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Free unlimited test synthesis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Native Hindi (Swara, Madhur)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>300+ multi-dialect voices</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Azure Speech Enterprise Upgrade */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Enterprise Production
                </span>
                <h3 className="text-lg font-bold text-white">Azure Speech Services</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When scaling to hundreds of concurrent users with strict 99.99% SLAs, switch the backend provider to Azure Cognitive Services using the exact same API models and voice short names.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Official Microsoft Cloud SLA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>High-throughput concurrency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Custom Neural Voice cloning</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: ElevenLabs Alternative */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Voice Cloning Tier
                </span>
                <h3 className="text-lg font-bold text-white">ElevenLabs / Cartesia</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Easily integrate ElevenLabs or Cartesia APIs into the FastAPI `tts_service` adapter for extreme emotional inflection and instant custom voice cloning when budget permits.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Instant Voice Cloning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ultra-low latency streaming</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Subtle emotional control</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to generate your first voiceover?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Launch the Voice Studio, type in your text, and listen to the power of Voxora AI neural speech in seconds.
            </p>
            <div className="pt-2">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl lime-glow-btn text-black font-extrabold text-base transition-all transform hover:scale-105"
              >
                <Mic className="w-5 h-5" />
                Open Voice Studio Now
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SupabaseAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <Footer />
    </div>
  );
}
