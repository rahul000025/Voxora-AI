'use client';

import React from 'react';
import { Type, Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { SAMPLE_TEXTS, SampleText } from '@/lib/sampleData';
import { useToast } from '@/components/Toast';

interface TextEditorProps {
  text: string;
  onChange: (value: string) => void;
  onSelectSample?: (sample: SampleText) => void;
  maxLength?: number;
  disabled?: boolean;
}

export default function TextEditor({
  text,
  onChange,
  onSelectSample,
  maxLength = 5000,
  disabled = false,
}: TextEditorProps) {
  const [copied, setCopied] = React.useState(false);
  const { info } = useToast();

  const handleCopy = () => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    info('Text copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChange('');
  };

  const charCount = text.length;
  const isNearLimit = charCount > maxLength * 0.9;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="flex flex-col h-full bg-[#11151c]/90 rounded-2xl border border-white/10 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Top Action Bar */}
      <div className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lime-400/10 text-lime-400">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Script & Narration</h3>
            <p className="text-[11px] text-slate-400">Type or paste your text to turn into speech</p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text.trim() || disabled}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40 transition-colors"
            title="Copy Text"
            aria-label="Copy text"
          >
            {copied ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!text.trim() || disabled}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-40 transition-colors"
            title="Clear Text"
            aria-label="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="px-4 py-2.5 bg-black/20 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-lime-400" />
          Samples:
        </span>
        {SAMPLE_TEXTS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelectSample && onSelectSample(sample)}
            disabled={disabled}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-lime-400/15 hover:text-lime-300 text-slate-300 border border-white/5 hover:border-lime-400/30 whitespace-nowrap transition-all text-[11px]"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Textarea Input */}
      <div className="relative flex-1 p-4 min-h-[220px] flex flex-col">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter or paste your text here (Hindi, English, or any supported language)..."
          className="w-full flex-1 bg-transparent resize-none text-slate-100 placeholder:text-slate-500 text-sm md:text-base leading-relaxed focus:outline-none border-none disabled:opacity-50"
          spellCheck="false"
        />

        {/* Bottom Character Counter */}
        <div className="pt-3 mt-auto border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-[11px] font-medium ${
                isOverLimit
                  ? 'text-red-400'
                  : isNearLimit
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {charCount.toLocaleString()} / {maxLength.toLocaleString()} characters
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            {text.trim() ? `${text.trim().split(/\s+/).length} words` : '0 words'}
          </div>
        </div>
      </div>
    </div>
  );
}
