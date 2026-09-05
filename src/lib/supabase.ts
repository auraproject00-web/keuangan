import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that the URL is actually a proper URL (not a publishable key or garbage string)
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
);

// Wrap in try-catch to prevent the entire app from crashing on bad config
let _supabase: ReturnType<typeof createClient> | null = null;
if (isSupabaseConfigured) {
  try {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('[Supabase] Failed to initialize client:', e);
  }
}

export const supabase = _supabase as ReturnType<typeof createClient>;

