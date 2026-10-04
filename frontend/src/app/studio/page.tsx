'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TextEditor from '@/components/VoiceStudio/TextEditor';
import VoiceSelector from '@/components/VoiceStudio/VoiceSelector';
import VoiceSettings from '@/components/VoiceStudio/VoiceSettings';
import AudioPlayer from '@/components/VoiceStudio/AudioPlayer';
import HistoryDrawer from '@/components/VoiceStudio/HistoryDrawer';
import SupabaseAuthModal from '@/components/SupabaseAuthModal';
import { useToast } from '@/components/Toast';
import { VoiceItem, HistoryItem, GenerationStatus } from '@/lib/types';
import { CURATED_VOICES, SampleText } from '@/lib/sampleData';
import { fetchVoices, generateSpeech } from '@/lib/api';
import { getLocalHistory, saveLocalHistoryItem, deleteLocalHistoryItem, clearLocalHistory } from '@/lib/storage';
import { Sparkles, Loader2, History, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function StudioPage() {
  // Studio states
  const [text, setText] = useState<string>(
    'नमस्ते! वोक्सोरा एआई में आपका स्वागत है। Welcome to Voxora AI, your next-generation neural speech studio.'
  );
  const [voices, setVoices] = useState<VoiceItem[]>(CURATED_VOICES);
  const [selectedVoice, setSelectedVoice] = useState<string>('hi-IN-SwaraNeural');
  const [rate, setRate] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);

  // Audio output states
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History & Auth drawers
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { success, error: toastError, info } = useToast();

  // Load voices & history on mount
  useEffect(() => {
    let mounted = true;
    fetchVoices().then((res) => {
      if (mounted && res.voices.length > 0) {
        setVoices(res.voices);
      }
    });

    const saved = getLocalHistory();
    setHistoryItems(saved);

    return () => {
      mounted = false;
    };
  }, []);

  const activeVoiceObj = voices.find((v) => v.short_name === selectedVoice) || voices[0];

  const handleGenerate = async () => {
    if (!text.trim()) {
      toastError('Please enter some text to generate audio.');
      return;
    }

    setStatus('generating');
    setErrorMessage(null);

    try {
      const result = await generateSpeech({
        text,
        voice: selectedVoice,
        rate,
        pitch,
        volume,
      });

      setAudioBlob(result.blob);
      setAudioUrl(result.audioUrl);
      setStatus('success');
      success(`Voice synthesized with ${activeVoiceObj.friendly_name}`);

      // Save to history
      const historyItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        text: text.trim(),
        voice: selectedVoice,
        voiceName: activeVoiceObj.friendly_name,
        language: activeVoiceObj.language,
        gender: activeVoiceObj.gender,
        audioBlob: result.blob,
        audioUrl: result.audioUrl,
        rate,
        pitch,
        volume,
        createdAt: Date.now(),
        characterCount: text.trim().length,
      };

      const updated = saveLocalHistoryItem(historyItem);
      setHistoryItems(updated);
    } catch (err: any) {
      console.error('Generation error:', err);
      const msg = err.message || 'Speech generation failed. Ensure backend server is running.';
      setErrorMessage(msg);
      setStatus('error');
      toastError(msg);
    }
  };

  const handleSelectSample = (sample: SampleText) => {
    setText(sample.text);
    if (sample.suggestedVoice) {
      setSelectedVoice(sample.suggestedVoice);
    }
    info(`Loaded "${sample.title}" sample script`);
  };

  const handleResetSettings = () => {
    setRate(0);
    setPitch(0);
    setVolume(0);
    info('Reset audio parameters to defaults');
  };

  const handlePlayHistoryItem = (item: HistoryItem) => {
    setText(item.text);
    setSelectedVoice(item.voice);
    setRate(item.rate);
    setPitch(item.pitch);
    setVolume(item.volume);
    setAudioUrl(item.audioUrl);
    setAudioBlob(item.audioBlob || null);
    setIsHistoryOpen(false);
    info(`Loaded session: ${item.voiceName}`);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteLocalHistoryItem(id);
    setHistoryItems(updated);
    info('Removed generation from history');
  };

  const handleClearAllHistory = () => {
    clearLocalHistory();
    setHistoryItems([]);
    info('Cleared all history');
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col bg-grid-pattern">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6">
        {/* Studio Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Neural Voice Studio
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30">
                v1.0
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Synthesize natural, human-like voiceovers in Hindi, English, and 50+ languages with studio-grade dynamics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <History className="w-4 h-4 text-lime-400" />
              History
              <span className="px-1.5 py-0.2 rounded-full bg-lime-400/20 text-lime-400 font-mono text-[10px]">
                {historyItems.length}
              </span>
            </button>
          </div>
        </div>

        {/* Studio Grid: Editor / Output on Left, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Text Editor + Action Button + Audio Player */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* Text Editor */}
            <TextEditor
              text={text}
              onChange={setText}
              onSelectSample={handleSelectSample}
              disabled={status === 'generating'}
            />

            {/* Error banner if generation failed */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-3 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Synthesis Error:</span>
                  <p className="leading-relaxed">{errorMessage}</p>
                  <p className="text-[11px] text-red-300/80">
                    Make sure the FastAPI backend server is running at <code className="bg-red-900/40 px-1 py-0.5 rounded">http://localhost:8000</code>.
                  </p>
                </div>
              </div>
            )}

            {/* Primary Action Button: Generate Voice */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={status === 'generating' || !text.trim()}
                className="flex-1 py-3.5 px-6 rounded-2xl lime-glow-btn text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                {status === 'generating' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Synthesizing Voice...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Speech ({text.trim().length} chars)</span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Output Player */}
            <AudioPlayer
              audioUrl={audioUrl}
              audioBlob={audioBlob}
              voiceName={activeVoiceObj?.friendly_name}
              language={activeVoiceObj?.language}
              textSnippet={text}
              isGenerating={status === 'generating'}
              onRegenerate={handleGenerate}
            />
          </div>

          {/* Right Column (5 cols / 4 cols): Voice Selector & Voice Settings */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5">
            {/* Voice Selector */}
            <VoiceSelector
              voices={voices}
              selectedVoice={selectedVoice}
              onSelectVoice={setSelectedVoice}
            />

            {/* Voice Settings: Pitch, Rate, Volume */}
            <VoiceSettings
              rate={rate}
              pitch={pitch}
              volume={volume}
              onChangeRate={setRate}
              onChangePitch={setPitch}
              onChangeVolume={setVolume}
              onReset={handleResetSettings}
              disabled={status === 'generating'}
            />

            {/* Studio Pro Tips Card */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Zap className="w-4 h-4 text-lime-400" />
                <span>Studio Pro Tips</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
                <li>
                  <strong className="text-slate-300">Hindi Speech:</strong> Select <span className="text-lime-400">Swara</span> or <span className="text-lime-400">Madhur</span> for natural Devanagari Hindi or Hinglish text.
                </li>
                <li>
                  <strong className="text-slate-300">Pacing:</strong> Adjust speaking rate to +15% for modern energetic commercials or -15% for meditation guides.
                </li>
                <li>
                  <strong className="text-slate-300">Audio Export:</strong> Click <span className="text-lime-400">Download MP3</span> on any player to save the 48kbps studio-grade audio file directly.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onPlayItem={handlePlayHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Supabase Cloud Sync Modal */}
      <SupabaseAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <Footer />
    </div>
  );
}
