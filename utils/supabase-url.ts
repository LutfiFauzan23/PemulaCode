export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'Supabase belum dikonfigurasi. Isi EXPO_PUBLIC_SUPABASE_URL dan EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY di .env.local lalu restart Expo.';

export const SUPABASE_URL_DASHBOARD_MESSAGE =
  'URL Supabase yang dipakai adalah URL dashboard. Gunakan Project URL (https://<project-ref>.supabase.co) dari Project Settings → API.';

export const SUPABASE_URL_INVALID_MESSAGE =
  'EXPO_PUBLIC_SUPABASE_URL harus berupa origin project, contoh https://<project-ref>.supabase.co — tanpa path seperti /rest/v1.';

/**
 * Dashboard Supabase menampilkan beberapa URL, sedangkan yang dibutuhkan client
 * hanyalah **origin** project. Fungsi ini membersihkan kesalahan yang paling
 * sering terjadi: spasi berlebih, garis miring di akhir, serta path endpoint
 * (`/rest/v1`, `/auth/v1`, dst.) yang ikut tertempel.
 *
 * Path itu berbahaya: request auth jadi menuju `.../rest/v1/auth/v1/signup`
 * dan ditolak PostgREST dengan PGRST125 "Invalid path specified in request URL"
 * sebelum sampai ke server auth — inilah penyebab alert saat menekan tombol
 * daftar.
 */
export function normalizeSupabaseUrl(raw: string): string {
  return raw
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/(rest|auth|storage|realtime)\/v1$/i, '')
    .replace(/\/+$/, '');
}

/** `true` jika URL berupa origin saja (skema + host, tanpa path). */
export function isSupabaseOrigin(url: string): boolean {
  return /^https?:\/\/[^/\s]+\/?$/.test(url);
}

/**
 * Pesan masalah konfigurasi yang bisa ditampilkan ke user, atau `null` jika
 * tidak ada masalah. Menangkap kasus yang tidak bisa diperbaiki otomatis,
 * seperti menempelkan URL dashboard atau URL dengan path nyasar.
 */
export function describeSupabaseConfigIssue(origin: string, key: string): string | null {
  if (!origin || !key) return SUPABASE_NOT_CONFIGURED_MESSAGE;
  if (/supabase\.com\/dashboard/i.test(origin)) return SUPABASE_URL_DASHBOARD_MESSAGE;
  if (!isSupabaseOrigin(origin)) return SUPABASE_URL_INVALID_MESSAGE;
  return null;
}
