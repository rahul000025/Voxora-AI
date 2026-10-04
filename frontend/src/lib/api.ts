import { TTSRequest, VoicesResponse, VoiceItem } from './types';
import { CURATED_VOICES } from './sampleData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function checkBackendHealth(): Promise<{ isHealthy: boolean; voicesCount: number }> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return { isHealthy: true, voicesCount: data.voices_loaded || 0 };
    }
  } catch (error) {
    console.warn('Backend health check error:', error);
  }
  return { isHealthy: false, voicesCount: 0 };
}

export async function fetchVoices(params?: {
  language?: string;
  gender?: string;
  search?: string;
  featured?: boolean;
}): Promise<VoicesResponse> {
  const query = new URLSearchParams();
  if (params?.language) query.set('language', params.language);
  if (params?.gender) query.set('gender', params.gender);
  if (params?.search) query.set('search', params.search);
  if (params?.featured) query.set('featured', 'true');

  try {
    const url = `${API_BASE}/api/voices${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data: VoicesResponse = await res.json();
      return data;
    }
  } catch (error) {
    console.warn('Failed to fetch voices from backend API, using cached curated list:', error);
  }

  // Graceful client fallback
  let filtered = [...CURATED_VOICES];
  if (params?.language) {
    filtered = filtered.filter(v => v.language.toLowerCase().includes(params.language!.toLowerCase()));
  }
  if (params?.gender) {
    filtered = filtered.filter(v => v.gender.toLowerCase() === params.gender!.toLowerCase());
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(v =>
      v.friendly_name.toLowerCase().includes(s) ||
      v.short_name.toLowerCase().includes(s) ||
      v.language.toLowerCase().includes(s)
    );
  }

  const languages = Array.from(new Set(CURATED_VOICES.map(v => v.language))).sort();

  return {
    voices: filtered,
    total: filtered.length,
    featured: CURATED_VOICES.filter(v => v.is_featured),
    languages
  };
}

export async function generateSpeech(request: TTSRequest): Promise<{ blob: Blob; audioUrl: string }> {
  const trimmed = request.text.trim();
  if (!trimmed) {
    throw new Error('Please enter some text before generating audio.');
  }

  if (trimmed.length > 5000) {
    throw new Error('Text exceeds maximum limit of 5,000 characters.');
  }

  const response = await fetch(`${API_BASE}/api/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: trimmed,
      voice: request.voice || 'en-US-JennyNeural',
      rate: request.rate ?? 0,
      pitch: request.pitch ?? 0,
      volume: request.volume ?? 0
    })
  });

  if (!response.ok) {
    let errorDetail = 'Speech generation failed.';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = `Server returned status ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error('Received empty audio file from TTS service.');
  }

  const audioUrl = URL.createObjectURL(blob);
  return { blob, audioUrl };
}

export async function previewVoiceSample(voiceName: string, customText?: string): Promise<string> {
  const response = await fetch(`${API_BASE}/api/preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      voice: voiceName,
      custom_text: customText
    })
  });

  if (!response.ok) {
    throw new Error('Could not fetch voice preview.');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
