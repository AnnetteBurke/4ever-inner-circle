/**
 * Supabase client setup.
 *
 * Not yet wired up — env vars are placeholders. Activated in Phase 1, session 3.
 *
 * When you reach session 3 with Claude Code:
 *   1. Create a free Supabase project at supabase.com
 *   2. From Project Settings → API, copy the URL and anon key
 *   3. Paste them into .env.local (created from .env.local.example)
 *   4. Claude Code will then enable magic-link couple authentication
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create a client if env vars are set. Otherwise we'd crash on first load.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(supabase);
