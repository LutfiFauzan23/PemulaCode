import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { nextStreakRecord, type StreakRecord } from '@/utils/streak';

/** Kunci untuk user yang belum login (mode demo) — tetap punya streak sendiri. */
export const GUEST_STREAK_KEY = 'guest';

type StreakState = {
  /** Record per akun (`user.id`), jadi tiap akun mulai dari 0 dan tidak saling bercampur. */
  streaks: Record<string, StreakRecord>;
  /** Catat bahwa user menyelesaikan soal; otomatis menangani +1 atau reset. */
  recordActivity: (userKey: string, todayKey?: string) => void;
  /** Hapus riwayat streak satu akun (mis. saat sign out / reset data). */
  resetStreak: (userKey: string) => void;
};

export const useStreakStore = create<StreakState>()(
  persist(
    (set) => ({
      streaks: {},

      recordActivity: (userKey, todayKey) =>
        set((state) => ({
          streaks: {
            ...state.streaks,
            [userKey]: nextStreakRecord(state.streaks[userKey], todayKey),
          },
        })),

      resetStreak: (userKey) =>
        set((state) => {
          const streaks = { ...state.streaks };
          delete streaks[userKey];
          return { streaks };
        }),
    }),
    {
      name: 'pemulacode-streak',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
