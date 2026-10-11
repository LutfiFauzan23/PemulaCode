import { mapLeaderboardRow } from '@/services/progressService';

// babel-jest mengangkat `jest.mock` ke atas import, jadi urutannya aman.
jest.mock('@/config/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: {},
}));

describe('mapLeaderboardRow', () => {
  it('maps a real profile row into a leaderboard entry', () => {
    const entry = mapLeaderboardRow({
      id: 'user-1',
      username: 'lutfi',
      full_name: 'Lutfi R',
      avatar_url: 'https://x/a.png',
      xp: 320,
      streak_count: 4,
    });

    expect(entry).toEqual({
      id: 'user-1',
      username: 'lutfi',
      fullName: 'Lutfi R',
      avatarUrl: 'https://x/a.png',
      xp: 320,
      streakCount: 4,
    });
  });

  it('falls back to 0 for missing or invalid numbers', () => {
    expect(mapLeaderboardRow({ id: 'u', username: 'a', xp: null, streak_count: 'abc' })).toMatchObject({
      xp: 0,
      streakCount: 0,
    });
    expect(mapLeaderboardRow({ id: 'u', username: 'a', xp: -50, streak_count: -1 })).toMatchObject({
      xp: 0,
      streakCount: 0,
    });
  });

  it('rounds fractional xp down so ranking stays stable', () => {
    expect(mapLeaderboardRow({ id: 'u', username: 'a', xp: 12.9 }).xp).toBe(12);
  });

  it('handles a row without a username or avatar', () => {
    expect(mapLeaderboardRow({ id: 'u' })).toMatchObject({
      username: 'Pengguna',
      fullName: null,
      avatarUrl: null,
    });
  });

  it('survives null input', () => {
    expect(mapLeaderboardRow(null).xp).toBe(0);
  });
});
