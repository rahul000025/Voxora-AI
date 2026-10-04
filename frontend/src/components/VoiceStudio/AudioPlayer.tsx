'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Sparkles,
  RefreshCw,
  Clock,
  Radio
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface AudioPlayerProps {
  audioUrl: string | null;
  audioBlob?: Blob | null;
  voiceName?: string;
  language?: string;
  textSnippet?: string;
  isGenerating?: boolean;
  onRegenerate?: () => void;
}

export default function AudioPlayer({
  audioUrl,
  audioBlob,
  voiceName = 'Neural Voice',
  language = 'Hindi / English',
  textSnippet = '',
  isGenerating = false,
  onRegenerate,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const { success, info } = useToast();

  // Reset playback state when audioUrl changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.error('Playback error:', err);
      });
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioRef.current.muted = nextMute;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.8];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const cleanVoice = voiceName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const filename = `voxora_${cleanVoice}_${Date.now()}.mp3`;

    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    success(`Downloaded speech as ${filename}`);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#11151c]/90 rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden native audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lime-400/10 text-lime-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Audio Output</h3>
            <p className="text-[11px] text-slate-400">
              {audioUrl ? `${voiceName} • ${language}` : 'Awaiting voice generation'}
            </p>
          </div>
        </div>

        {audioUrl && onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isGenerating}
            className="text-xs text-lime-400 hover:text-lime-300 disabled:opacity-50 transition-colors flex items-center gap-1.5 font-medium"
            title="Regenerate speech with current voice settings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        )}
      </div>

      {!audioUrl ? (
        /* Empty / Idle State */
        <div className="py-10 px-4 text-center border border-dashed border-white/10 rounded-xl bg-black/20 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3">
            <Sparkles className="w-6 h-6 text-lime-400/60" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200 mb-1">No speech generated yet</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            Enter your text script above, choose your preferred neural voice, and click{' '}
            <span className="text-lime-400 font-medium">Generate Speech</span>.
          </p>
        </div>
      ) : (
        /* Active Player Controls */
        <div className="space-y-4">
          {/* Waveform Visualizer Simulation */}
          <div className="h-14 rounded-xl bg-black/40 border border-white/5 p-2 flex items-center justify-center gap-1 overflow-hidden px-4">
            {Array.from({ length: 42 }).map((_, idx) => {
              const progress = duration > 0 ? currentTime / duration : 0;
              const barProgress = idx / 42;
              const isPast = barProgress <= progress;
              const randomH = Math.sin(idx * 0.4) * 0.5 + 0.5; // Natural wave shape
              const heightPct = isPlaying
                ? Math.min(100, Math.max(15, (randomH * 70) + (Math.sin((idx + currentTime * 8)) * 25)))
                : Math.max(15, randomH * 60);

              return (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-100 ${
                    isPast
                      ? 'bg-lime-400 shadow-[0_0_6px_rgba(163,230,53,0.6)]'
                      : 'bg-white/10'
                  }`}
                  style={{
                    height: `${heightPct}%`,
                  }}
                />
              );
            })}
          </div>

          {/* Scrubber Seek Bar */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.05"
              value={currentTime}
              onChange={handleSeek}
              disabled={!audioUrl}
              className="w-full cursor-pointer accent-lime-400"
              aria-label="Seek audio"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Primary Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Play/Pause & Replay */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="w-12 h-12 rounded-xl lime-glow-btn flex items-center justify-center text-black"
                title={isPlaying ? 'Pause Speech' : 'Play Speech'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={handleReplay}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Restart from beginning"
                aria-label="Replay"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={cycleSpeed}
                className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs font-semibold transition-colors"
                title="Change playback speed"
              >
                {playbackSpeed}x
              </button>
            </div>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 accent-lime-400"
                aria-label="Volume slider"
              />
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/30 hover:border-lime-400/60 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              title="Download MP3 file"
            >
              <Download className="w-4 h-4" />
              Download MP3
            </button>
          </div>

          {/* Script Snippet Preview */}
          {textSnippet && (
            <div className="mt-3 p-2.5 rounded-xl bg-black/20 border border-white/5 text-[11px] text-slate-400 italic line-clamp-2">
              &quot;{textSnippet}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
