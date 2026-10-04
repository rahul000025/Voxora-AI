'use client';

import React from 'react';
import { Sliders, RotateCcw, Gauge, Music, Volume2, Sparkles } from 'lucide-react';

interface VoiceSettingsProps {
  rate: number;
  pitch: number;
  volume: number;
  onChangeRate: (val: number) => void;
  onChangePitch: (val: number) => void;
  onChangeVolume: (val: number) => void;
  onReset: () => void;
  disabled?: boolean;
}

export default function VoiceSettings({
  rate,
  pitch,
  volume,
  onChangeRate,
  onChangePitch,
  onChangeVolume,
  onReset,
  disabled = false,
}: VoiceSettingsProps) {
  const isDefault = rate === 0 && pitch === 0 && volume === 0;

  const applyPreset = (r: number, p: number, v: number) => {
    onChangeRate(r);
    onChangePitch(p);
    onChangeVolume(v);
  };

  return (
    <div className="bg-[#11151c]/90 rounded-2xl border border-white/10 p-4 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lime-400/10 text-lime-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Audio Parameters</h3>
            <p className="text-[11px] text-slate-400">Pace, pitch & output dynamics</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={isDefault || disabled}
          className="text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1"
          title="Reset all settings to natural defaults"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Quick Presets */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => applyPreset(0, 0, 0)}
          disabled={disabled}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            rate === 0 && pitch === 0 && volume === 0
              ? 'bg-lime-400 text-black font-bold shadow-sm shadow-lime-400/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
          }`}
        >
          Natural
        </button>
        <button
          type="button"
          onClick={() => applyPreset(25, 0, 0)}
          disabled={disabled}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            rate === 25 && pitch === 0
              ? 'bg-lime-400 text-black font-bold shadow-sm shadow-lime-400/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
          }`}
        >
          Fast (+25%)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(-15, 0, 0)}
          disabled={disabled}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            rate === -15 && pitch === 0
              ? 'bg-lime-400 text-black font-bold shadow-sm shadow-lime-400/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
          }`}
        >
          Slow (-15%)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(0, -15, 10)}
          disabled={disabled}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            pitch === -15
              ? 'bg-lime-400 text-black font-bold shadow-sm shadow-lime-400/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
          }`}
        >
          Deep Pitch
        </button>
        <button
          type="button"
          onClick={() => applyPreset(0, 15, 0)}
          disabled={disabled}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
            pitch === 15
              ? 'bg-lime-400 text-black font-bold shadow-sm shadow-lime-400/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
          }`}
        >
          High Pitch
        </button>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {/* Speaking Rate / Speed */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Gauge className="w-3.5 h-3.5 text-lime-400" />
              Speaking Speed (Rate)
            </span>
            <span className="font-mono text-lime-400 font-semibold">
              {rate > 0 ? `+${rate}%` : `${rate}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="100"
            step="5"
            value={rate}
            onChange={(e) => onChangeRate(Number(e.target.value))}
            disabled={disabled}
            className="w-full accent-lime-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-50% (Slow)</span>
            <span>0% (Normal)</span>
            <span>+100% (Double)</span>
          </div>
        </div>

        {/* Pitch Control */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Music className="w-3.5 h-3.5 text-lime-400" />
              Voice Pitch (Hz)
            </span>
            <span className="font-mono text-lime-400 font-semibold">
              {pitch > 0 ? `+${pitch}Hz` : `${pitch}Hz`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={pitch}
            onChange={(e) => onChangePitch(Number(e.target.value))}
            disabled={disabled}
            className="w-full accent-lime-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-50Hz (Deep)</span>
            <span>0Hz (Default)</span>
            <span>+50Hz (Bright)</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-lime-400" />
              Volume Gain
            </span>
            <span className="font-mono text-lime-400 font-semibold">
              {volume > 0 ? `+${volume}%` : `${volume}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={volume}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            disabled={disabled}
            className="w-full accent-lime-400"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-50% (Softer)</span>
            <span>0% (Standard)</span>
            <span>+50% (Louder)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
