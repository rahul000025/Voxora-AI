'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Mic2,
  ChevronDown,
  Search,
  Volume2,
  Play,
  Square,
  Check,
  Sparkles,
  X,
  Filter,
  Globe
} from 'lucide-react';
import { VoiceItem } from '@/lib/types';
import { previewVoiceSample } from '@/lib/api';
import { useToast } from '@/components/Toast';

interface VoiceSelectorProps {
  voices: VoiceItem[];
  selectedVoice: string;
  onSelectVoice: (voiceShortName: string) => void;
  isLoadingVoices?: boolean;
}

export default function VoiceSelector({
  voices,
  selectedVoice,
  onSelectVoice,
  isLoadingVoices = false,
}: VoiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const { error: toastError } = useToast();

  const currentVoiceObj = useMemo(() => {
    return (
      voices.find((v) => v.short_name === selectedVoice) ||
      voices[0] || {
        short_name: 'hi-IN-SwaraNeural',
        friendly_name: 'Swara (Hindi - India)',
        gender: 'Female',
        locale: 'hi-IN',
        language: 'Hindi',
        is_featured: true,
        preview_text: 'नमस्ते! मैं स्वरा हूँ।'
      }
    );
  }, [voices, selectedVoice]);

  const uniqueLanguages = useMemo(() => {
    const langs = Array.from(new Set(voices.map((v) => v.language))).filter(Boolean);
    // Put Hindi and English at the front
    const priority = ['Hindi', 'English (India)', 'English (US)', 'English (UK)'];
    const rest = langs.filter((l) => !priority.includes(l)).sort();
    return ['All', ...priority.filter((p) => langs.includes(p)), ...rest];
  }, [voices]);

  const filteredVoices = useMemo(() => {
    return voices.filter((v) => {
      const matchSearch =
        searchQuery === '' ||
        v.friendly_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.language.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLang =
        selectedLanguage === 'All' ||
        v.language.toLowerCase() === selectedLanguage.toLowerCase();

      const matchGender =
        selectedGender === 'All' ||
        v.gender.toLowerCase() === selectedGender.toLowerCase();

      return matchSearch && matchLang && matchGender;
    });
  }, [voices, searchQuery, selectedLanguage, selectedGender]);

  const handlePlayPreview = async (e: React.MouseEvent, voice: VoiceItem) => {
    e.stopPropagation();

    if (playingPreview === voice.short_name) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
      setPlayingPreview(null);
      return;
    }

    try {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPlayingPreview(voice.short_name);

      const previewUrl = await previewVoiceSample(voice.short_name, voice.preview_text);
      const audio = new Audio(previewUrl);
      audioPreviewRef.current = audio;

      audio.onended = () => {
        setPlayingPreview(null);
        audioPreviewRef.current = null;
      };

      audio.onerror = () => {
        setPlayingPreview(null);
        audioPreviewRef.current = null;
      };

      await audio.play();
    } catch (err: any) {
      console.warn('Preview playback failed:', err);
      toastError('Voice preview preview not available yet.');
      setPlayingPreview(null);
    }
  };

  return (
    <>
      {/* Selected Voice Card / Trigger Button */}
      <div className="bg-[#11151c]/90 rounded-2xl border border-white/10 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-lime-400/10 text-lime-400">
              <Mic2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Selected Voice</h3>
              <p className="text-[11px] text-slate-400">Choose gender, accent & language</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-xs font-semibold text-lime-400 hover:text-lime-300 hover:underline flex items-center gap-1"
          >
            Browse All ({voices.length})
          </button>
        </div>

        {/* Current Active Voice Card */}
        <div
          onClick={() => setIsOpen(true)}
          className="group relative cursor-pointer p-3.5 rounded-xl border border-lime-500/30 bg-gradient-to-r from-lime-950/20 to-black/30 hover:border-lime-400/60 transition-all flex items-center justify-between gap-3 shadow-inner"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 font-bold text-sm">
              {currentVoiceObj.gender === 'Female' ? '♀' : '♂'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white group-hover:text-lime-300 transition-colors">
                  {currentVoiceObj.friendly_name}
                </span>
                {currentVoiceObj.is_featured && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30">
                    Neural Pro
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{currentVoiceObj.language}</span>
                <span>•</span>
                <span>{currentVoiceObj.gender}</span>
                <span>•</span>
                <span className="font-mono text-[10px] text-slate-500">{currentVoiceObj.locale}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handlePlayPreview(e, currentVoiceObj)}
              className="p-2 rounded-lg bg-white/5 hover:bg-lime-400/20 text-slate-300 hover:text-lime-300 border border-white/10 transition-colors"
              title="Audition Voice Preview"
              aria-label="Audition voice"
            >
              {playingPreview === currentVoiceObj.short_name ? (
                <Square className="w-4 h-4 text-lime-400 fill-lime-400" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* Full Voice Directory Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f131a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Select Neural Voice</h3>
                  <p className="text-xs text-slate-400">
                    Choose from {voices.length} high-fidelity studio voices across global languages
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Controls */}
            <div className="p-4 border-b border-white/5 space-y-3 bg-[#0d1016]">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by voice name (Swara, Neerja, Jenny), language, or locale..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-lime-400/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filters row: Language & Gender */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Language Select */}
                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar">
                  <span className="text-slate-400 font-semibold whitespace-nowrap text-[11px]">
                    Language:
                  </span>
                  {uniqueLanguages.slice(0, 7).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                        selectedLanguage === lang
                          ? 'bg-lime-400 text-black font-bold shadow-md shadow-lime-400/20'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Gender Tabs */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                  {['All', 'Female', 'Male'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGender(g)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedGender === g
                          ? 'bg-white/15 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Voices Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px]">
              {filteredVoices.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400">
                  <p className="text-sm">No neural voices matched your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLanguage('All');
                      setSelectedGender('All');
                    }}
                    className="mt-2 text-xs text-lime-400 underline font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredVoices.map((voice) => {
                  const isSelected = selectedVoice === voice.short_name;
                  const isPlayingThis = playingPreview === voice.short_name;

                  return (
                    <div
                      key={voice.short_name}
                      onClick={() => {
                        onSelectVoice(voice.short_name);
                        setIsOpen(false);
                      }}
                      className={`group p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-lime-400/10 border-lime-400 text-white shadow-[0_0_15px_rgba(163,230,53,0.15)]'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-lime-400 text-black'
                              : 'bg-white/10 text-slate-300 group-hover:text-white'
                          }`}
                        >
                          {voice.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-100 group-hover:text-lime-300">
                              {voice.friendly_name}
                            </span>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-lime-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span>{voice.language}</span>
                            <span>•</span>
                            <span className="font-mono text-[10px] text-slate-500">{voice.locale}</span>
                          </div>
                        </div>
                      </div>

                      {/* Audition Button */}
                      <button
                        type="button"
                        onClick={(e) => handlePlayPreview(e, voice)}
                        className={`p-2 rounded-lg border transition-all ${
                          isPlayingThis
                            ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_10px_#a3e635]'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                        }`}
                        title="Audition voice snippet"
                        aria-label={`Audition ${voice.friendly_name}`}
                      >
                        {isPlayingThis ? (
                          <Square className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-[#0a0c10] flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredVoices.length} voices</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
