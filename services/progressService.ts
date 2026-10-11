import { isSupabaseConfigured, supabase } from '@/config/supabase';

import type { ServiceResult } from './communityService';

/**
 * XP, streak, dan leaderboard.
 *
 * Semua angka berasal dari tabel `public.profiles` yang diisi lewat fungsi
 * `record_activity()` di server — bukan dari data contoh di app. Trigger
 * `protect_profile_stats` menolak perubahan XP/streak langsung dari client,
 * jadi peringkat tidak bisa dipalsukan dari sisi app.
 */
export interface LeaderboardEntry {
  avatarUrl: string | null;
  fullName: string | null;
  id: string;
  /** Jumlah hari beruntun terakhir yang tersimpan di server. */
  streakCount: number;
  username: string;
  xp: number;
}

export const LEADERBOARD_SELECT = 'id, username, full_name, avatar_url, xp, streak_count';

type RawRow = Record<string, unknown>;

function numberOrZero(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

/** Di-export agar bisa diuji tanpa jaringan. */
export function mapLeaderboardRow(row: RawRow | null | undefined): LeaderboardEntry {
  return {
    id: String(row?.id ?? ''),
    username: String(row?.username ?? 'Pengguna'),
    fullName: (row?.full_name as string | null) ?? null,
    avatarUrl: (row?.avatar_url as string | null) ?? null,
    xp: numberOrZero(row?.xp),
    streakCount: numberOrZero(row?.streak_count),
  };
}

/** Peringkat dihitung dari XP terbesar; seri diurutkan berdasarkan nama. */
export async function fetchLeaderboard(limit = 50): Promise<ServiceResult<LeaderboardEntry[]>> {
  if (!isSupabaseConfigured) return { data: [], error: null };

  const { data, error } = await supabase
    .from('profiles')
    .select(LEADERBOARD_SELECT)
    .order('xp', { ascending: false })
    .order('username', { ascending: true })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map((row) => mapLeaderboardRow(row as RawRow)), error: null };
}

/**
 * Catat aktivitas belajar user yang sedang login (XP + streak).
 *
 * `xpDelta` dan `streakCount` divalidasi ulang di server (dibatasi 0..500 per
 * panggilan), jadi nilai dari client tidak bisa dipakai untuk melompatkan XP.
 */
export async function recordActivity(
  xpDelta: number,
  streakCount?: number | null,
): Promise<ServiceResult<LeaderboardEntry | null>> {
  if (!isSupabaseConfigured) return { data: null, error: null };

  const { data, error } = await supabase.rpc('record_activity', {
    p_xp_delta: Math.max(0, Math.floor(xpDelta)),
    p_streak: typeof streakCount === 'number' ? Math.max(0, Math.floor(streakCount)) : null,
  });

  if (error) return { data: null, error: error.message };
  return { data: mapLeaderboardRow(data as RawRow), error: null };
}
