import { useCallback, useEffect, useRef, useState } from 'react';

import { isSupabaseConfigured } from '@/config/supabase';
import { fetchLeaderboard, type LeaderboardEntry } from '@/services/progressService';

/**
 * Peringkat dari data pengguna asli (`profiles.xp`).
 *
 * Saat Supabase belum dikonfigurasi, `isLoading` sudah `false` sejak awal dan
 * daftar kosong — layar menampilkan keadaan kosong, bukan peringkat palsu.
 */
export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  const load = useCallback(async () => {
    // Tanpa konfigurasi, `isLoading` memang sudah `false` sejak awal.
    if (!isSupabaseConfigured) return;

    const result = await fetchLeaderboard();
    if (!alive.current) return;

    setEntries(result.data);
    setError(result.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    alive.current = true;
    void load();
    return () => {
      alive.current = false;
    };
  }, [load]);

  return { entries, error, isConfigured: isSupabaseConfigured, isLoading, reload: load };
}
