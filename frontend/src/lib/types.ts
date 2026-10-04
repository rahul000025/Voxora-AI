export interface VoiceItem {
  short_name: string;
  friendly_name: string;
  gender: 'Female' | 'Male' | string;
  locale: string;
  language: string;
  sample_rate?: string;
  is_featured: boolean;
  preview_text: string;
}

export interface VoicesResponse {
  voices: VoiceItem[];
  total: number;
  featured: VoiceItem[];
  languages: string[];
}

export interface TTSRequest {
  text: string;
  voice: string;
  rate?: number | string;
  pitch?: number | string;
  volume?: number | string;
}

export interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  voiceName: string;
  language: string;
  gender: string;
  audioBlob?: Blob;
  audioUrl: string;
  rate: number;
  pitch: number;
  volume: number;
  createdAt: number;
  characterCount: number;
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';
