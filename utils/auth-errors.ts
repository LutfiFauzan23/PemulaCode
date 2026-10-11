/**
 * Error Supabase sering berupa kode teknis yang membingungkan user. Fungsi ini
 * menerjemahkan kasus yang paling sering terjadi ke bahasa manusia, supaya
 * alert bisa menjelaskan langkah perbaikannya.
 */
export function friendlyAuthError(message: string): string {
  if (/invalid path specified in request url/i.test(message)) {
    return 'URL Supabase salah. Pakai Project URL (contoh https://<project-ref>.supabase.co) tanpa /rest/v1 pada EXPO_PUBLIC_SUPABASE_URL, lalu restart Expo.';
  }
  if (/failed to fetch|network request failed|networkerror/i.test(message)) {
    return 'Tidak bisa menghubungi Supabase. Periksa koneksi internet lalu coba lagi.';
  }
  if (/invalid api key|no api key/i.test(message)) {
    return 'Publishable key Supabase tidak valid. Salin ulang dari Project Settings → API.';
  }
  if (/rate limit|too many requests|email rate limit/i.test(message)) {
    return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.';
  }
  if (/user already registered/i.test(message)) {
    return 'Email ini sudah terdaftar. Coba masuk dengan akun tersebut, atau pakai email lain.';
  }
  if (/email not confirmed/i.test(message)) {
    return 'Email belum dikonfirmasi. Buka link konfirmasi di inbox, atau matikan "Confirm email" di Supabase (Authentication → Sign In / Providers → Email) supaya akun bisa langsung dipakai.';
  }
  if (/password should be at least/i.test(message)) {
    return 'Password terlalu lemah. Gunakan minimal 8 karakter.';
  }
  return message;
}
