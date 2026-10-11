import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { describeSupabaseConfigIssue, normalizeSupabaseUrl } from '@/utils/supabase-url';

// Expo SDK 57 menyediakan `localStorage` persisten lewat expo-sqlite, sehingga
// sesi login tetap tersimpan setelah app ditutup. Di web, browser sudah punya
// localStorage bawaan, jadi tidak perlu dipasang.
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('expo-sqlite/localStorage/install');
}

type StorageLike = {
  getItem: (key: string) => string | null | Promise<string | null>;
  removeItem: (key: string) => void | Promise<void>;
  setItem: (key: string, value: string) => void | Promise<void>;
};

const authStorage = (globalThis as { localStorage?: StorageLike }).localStorage;

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
// URL dirapikan agar path yang keliru tertempel (mis. `/rest/v1`) tidak membuat
// request auth ditolak PostgREST dengan PGRST125 "Invalid path specified in
// request URL" — penyebab alert saat menekan tombol daftar.
const supabaseUrl = normalizeSupabaseUrl(rawUrl);

const supabaseKey = (
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  ''
).trim();

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseKey.length > 0;

/** `true` jika nilai di `.env.local` perlu dirapikan (mis. masih ada `/rest/v1`). */
export const supabaseUrlWasNormalized = rawUrl.trim().length > 0 && rawUrl.trim() !== supabaseUrl;

/** Pesan masalah konfigurasi untuk ditampilkan ke user, atau `null` jika aman. */
export const supabaseConfigIssue: string | null = describeSupabaseConfigIssue(
  supabaseUrl,
  supabaseKey,
);

// Placeholder lokal dipakai saat belum dikonfigurasi agar tipe tetap non-null.
// Tidak pernah dipanggil karena semua akses dijaga `isSupabaseConfigured`.
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'http://127.0.0.1:54321',
  isSupabaseConfigured ? supabaseKey : 'public-anon-key',
  {
    auth: {
      storage: authStorage,
      autoRefreshToken: true,
      persistSession: true,
      // Android/iOS tidak punya URL untuk membaca sesi, jadi jangan diaktifkan.
      detectSessionInUrl: false,
    },
  },
);

if (isSupabaseConfigured) {
  // Loop refresh token otomatis hanya boleh berjalan saat app aktif.
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
