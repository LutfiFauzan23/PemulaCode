import { useCallback } from 'react';

import { useAuthStore } from '@/stores/auth-store';
import { GUEST_STREAK_KEY, useStreakStore } from '@/stores/streak-store';
import { displayStreak, toDateKey } from '@/utils/streak';

/**
 * Streak untuk akun yang sedang login.
 *
 * - `streak` siap ditampilkan (0 kalau belum pernah mengerjakan atau rantainya
 *   sudah putus karena melewatkan sehari).
 * - `recordActivity()` dipanggil setiap kali user menyelesaikan soal.
 */
export function useStreak() {
  const userKey = useAuthStore((state) => state.user?.id ?? GUEST_STREAK_KEY);
  const record = useStreakStore((state) => state.streaks[userKey]);
  const recordActivityInStore = useStreakStore((state) => state.recordActivity);

  /**
   * Catat aktivitas hari ini dan kembalikan jumlah streak terbaru, supaya
   * pemanggil bisa ikut mengirimkannya ke server (leaderboard).
   */
  const recordActivity = useCallback((): number => {
    const today = toDateKey();
    recordActivityInStore(userKey, today);
    return displayStreak(useStreakStore.getState().streaks[userKey], today);
  }, [recordActivityInStore, userKey]);

  return { recordActivity, streak: displayStreak(record, toDateKey()) };
}
