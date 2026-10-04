import { HistoryItem } from './types';
import { supabase, isSupabaseConfigured } from './supabase';

const HISTORY_STORAGE_KEY = 'voxora_tts_history_v1';

export function getLocalHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: HistoryItem[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load generation history from localStorage:', e);
    return [];
  }
}

export function saveLocalHistoryItem(item: HistoryItem): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getLocalHistory();
    // Prepend new item, keep latest 50
    const updated = [item, ...existing.filter(i => i.id !== item.id)].slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));

    // Optional Supabase sync in background
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          client
            .from('tts_generations')
            .insert({
              id: item.id,
              user_id: data.session.user.id,
              text: item.text,
              voice: item.voice,
              voice_name: item.voiceName,
              language: item.language,
              gender: item.gender,
              rate: item.rate,
              pitch: item.pitch,
              volume: item.volume,
              created_at: new Date(item.createdAt).toISOString()
            })
            .then(({ error }) => {
              if (error) console.warn('Supabase history sync error:', error.message);
            });
        }
      });
    }

    return updated;
  } catch (e) {
    console.error('Failed to save generation item to localStorage:', e);
    return getLocalHistory();
  }
}

export function deleteLocalHistoryItem(id: string): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getLocalHistory();
    const updated = existing.filter(i => i.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.from('tts_generations').delete().eq('id', id).then();
    }

    return updated;
  } catch (e) {
    console.error('Failed to delete history item:', e);
    return getLocalHistory();
  }
}

export function clearLocalHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}
