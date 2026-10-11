import { GUEST_STREAK_KEY, useStreakStore } from '../streak-store';
import { displayStreak } from '@/utils/streak';

// Store ini dipersist ke AsyncStorage, yang modul native-nya tidak tersedia di
// Jest. Pakai mock resmi dari paketnya supaya persistensinya tetap teruji.
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const getState = () => useStreakStore.getState();

beforeEach(() => {
  useStreakStore.setState({ streaks: {} });
});

describe('streak-store', () => {
  test('a brand new account starts from zero', () => {
    expect(getState().streaks['user-a']).toBeUndefined();
    expect(displayStreak(getState().streaks['user-a'], '2026-01-01')).toBe(0);
  });

  test('records the first completed quiz as a 1-day streak', () => {
    getState().recordActivity('user-a', '2026-01-01');

    expect(getState().streaks['user-a']).toEqual({ count: 1, lastDate: '2026-01-01' });
  });

  test('adds a day when the user practices on consecutive days', () => {
    getState().recordActivity('user-a', '2026-01-01');
    getState().recordActivity('user-a', '2026-01-02');
    getState().recordActivity('user-a', '2026-01-03');

    expect(getState().streaks['user-a'].count).toBe(3);
  });

  test('resets to zero after a missed day, then starts again from 1', () => {
    getState().recordActivity('user-a', '2026-01-01');
    getState().recordActivity('user-a', '2026-01-02');
    expect(getState().streaks['user-a'].count).toBe(2);

    // 3 Januari terlewat → rantai putus.
    expect(displayStreak(getState().streaks['user-a'], '2026-01-04')).toBe(0);

    // Mengerjakan soal lagi pada 4 Januari → mulai dari 1.
    getState().recordActivity('user-a', '2026-01-04');
    expect(getState().streaks['user-a']).toEqual({ count: 1, lastDate: '2026-01-04' });
  });

  test('keeps each account streak separate', () => {
    getState().recordActivity('user-a', '2026-01-01');
    getState().recordActivity('user-a', '2026-01-02');
    getState().recordActivity('user-b', '2026-01-02');

    expect(getState().streaks['user-a'].count).toBe(2);
    expect(getState().streaks['user-b'].count).toBe(1);
  });

  test('has a dedicated key for the guest/demo user', () => {
    getState().recordActivity(GUEST_STREAK_KEY, '2026-01-01');

    expect(getState().streaks[GUEST_STREAK_KEY].count).toBe(1);
    expect(getState().streaks['user-a']).toBeUndefined();
  });

  test('resetStreak forgets one account only', () => {
    getState().recordActivity('user-a', '2026-01-01');
    getState().recordActivity('user-b', '2026-01-01');

    getState().resetStreak('user-a');

    expect(getState().streaks['user-a']).toBeUndefined();
    expect(getState().streaks['user-b'].count).toBe(1);
  });
});
