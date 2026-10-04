'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Volume2, Sparkles, Mic, History, User, CheckCircle2, AlertCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { checkBackendHealth } from '@/lib/api';

interface NavbarProps {
  onOpenAuth?: () => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const pathname = usePathname();
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((res) => {
      if (mounted) setIsBackendOnline(res.isHealthy);
    });

    const interval = setInterval(() => {
      checkBackendHealth().then((res) => {
        if (mounted) setIsBackendOnline(res.isHealthy);
      });
    }, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090b0e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              Voxora <span className="text-lime-400">AI</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-lime-400/15 text-lime-400 border border-lime-400/20">
                Studio
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'text-white bg-white/5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </Link>
          <Link
            href="/studio"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              pathname === '/studio'
                ? 'text-lime-400 bg-lime-400/10 border border-lime-400/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice Studio
          </Link>
          <Link
            href="/history"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              pathname === '/history'
                ? 'text-white bg-white/5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            Generations
          </Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            API Docs
            <span className="text-[10px] text-lime-400">↗</span>
          </a>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Backend Status indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-white/5 bg-white/[0.02]"
            title={
              isBackendOnline
                ? 'FastAPI Edge-TTS engine is online'
                : 'Backend is starting up or disconnected'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendOnline ? 'bg-lime-400 shadow-[0_0_8px_#a3e635]' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-400 text-[11px]">
              {isBackendOnline ? 'Engine Online' : 'Connecting...'}
            </span>
          </div>

          <ThemeToggle />

          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all hidden sm:flex items-center justify-center"
              title="Account / Cloud Sync"
              aria-label="Account Settings"
            >
              <User className="w-4 h-4" />
            </button>
          )}

          <Link
            href="/studio"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold lime-glow-btn flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Launch Studio
          </Link>
        </div>
      </div>
    </header>
  );
}
