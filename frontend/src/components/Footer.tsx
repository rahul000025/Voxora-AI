'use client';

import React from 'react';
import Link from 'next/link';
import { Volume2, Heart, Github, Terminal, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#07080b] py-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Brand Bio */}
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Voxora <span className="text-lime-400">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ultra-realistic neural AI text-to-speech studio. Craft life-like voices in Hindi, English, and dozens of global dialects with precision pitch, rate, and volume controls.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Trade Name: <strong className="text-slate-300">ER RAHUL THAKUR</strong></span>
            <span>•</span>
            <span>Powered by Edge Neural TTS</span>
            <span>•</span>
            <span>Next.js 15</span>
          </div>
        </div>

        {/* Quick links & Tech Badges */}
        <div className="flex flex-wrap gap-8 text-xs">
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-3 text-[11px]">Studio</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/studio" className="hover:text-lime-400 transition-colors">
                  Voice Studio
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-lime-400 transition-colors">
                  Generation Archive
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lime-400 transition-colors flex items-center gap-1"
                >
                  FastAPI Swagger <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-3 text-[11px]">Voices</h4>
            <ul className="space-y-2">
              <li className="text-slate-400">Hindi (Swara & Madhur)</li>
              <li className="text-slate-400">English India (Neerja & Prabhat)</li>
              <li className="text-slate-400">English US (Jenny, Guy, Aria)</li>
              <li className="text-slate-400">English UK (Sonia, Ryan)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} Voxora AI. Trade Name: <span className="text-lime-400 font-bold">ER RAHUL THAKUR</span>. All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          <span>Designed & Developed with precision by <strong className="text-slate-200">ER RAHUL THAKUR</strong>.</span>
        </div>
      </div>
    </footer>
  );
}
