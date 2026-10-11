import {
  daysBetweenKeys,
  displayStreak,
  nextStreakRecord,
  toDateKey,
  type StreakRecord,
} from '@/utils/streak';

describe('toDateKey', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toDateKey(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  it('uses the local day, not UTC', () => {
    // 1 Januari 2026 pukul 06:00 waktu lokal harus tetap tanggal 1,
    // walaupun di UTC masih 31 Desember.
    expect(toDateKey(new Date(2026, 0, 1, 6, 0, 0))).toBe('2026-01-01');
  });
});

describe('daysBetweenKeys', () => {
  it('counts whole days across month and year boundaries', () => {
    expect(daysBetweenKeys('2026-01-31', '2026-02-01')).toBe(1);
    expect(daysBetweenKeys('2026-12-31', '2027-01-01')).toBe(1);
    expect(daysBetweenKeys('2026-03-01', '2026-02-27')).toBe(-2);
  });

  it('returns null for malformed keys', () => {
    expect(daysBetweenKeys('kemarin', '2026-01-01')).toBeNull();
    expect(daysBetweenKeys('2026-01-01', '')).toBeNull();
  });
});

describe('nextStreakRecord', () => {
  it('starts a brand new account at 1 for the first completed quiz', () => {
    expect(nextStreakRecord(undefined, '2026-01-01')).toEqual({
      count: 1,
      lastDate: '2026-01-01',
    });
  });

  it('does not double count when the user completes another quiz the same day', () => {
    const first = nextStreakRecord(undefined, '2026-01-01');
    expect(nextStreakRecord(first, '2026-01-01')).toEqual({ count: 1, lastDate: '2026-01-01' });
  });

  it('increments the streak on the next consecutive day', () => {
    const day1 = nextStreakRecord(undefined, '2026-01-01');
    const day2 = nextStreakRecord(day1, '2026-01-02');
    const day3 = nextStreakRecord(day2, '2026-01-03');

    expect(day2.count).toBe(2);
    expect(day3.count).toBe(3);
    expect(day3.lastDate).toBe('2026-01-03');
  });

  it('restarts from 1 after a missed day', () => {
    const record: StreakRecord = { count: 5, lastDate: '2026-01-01' };

    // 2 Januari dilewatkan, user mengerjakan soal lagi 3 Januari.
    expect(nextStreakRecord(record, '2026-01-03')).toEqual({
      count: 1,
      lastDate: '2026-01-03',
    });
  });

  it('restarts when the stored date is unreadable', () => {
    expect(nextStreakRecord({ count: 9, lastDate: 'entah' }, '2026-01-03')).toEqual({
      count: 1,
      lastDate: '2026-01-03',
    });
  });

  it('keeps the record when the device clock moves backwards', () => {
    const record: StreakRecord = { count: 4, lastDate: '2026-01-05' };
    expect(nextStreakRecord(record, '2026-01-04')).toEqual(record);
  });
});

describe('displayStreak', () => {
  it('shows 0 for an account with no history', () => {
    expect(displayStreak(undefined, '2026-01-10')).toBe(0);
  });

  it('shows the count while today is still open (activity today or yesterday)', () => {
    expect(displayStreak({ count: 3, lastDate: '2026-01-10' }, '2026-01-10')).toBe(3);
    expect(displayStreak({ count: 3, lastDate: '2026-01-09' }, '2026-01-10')).toBe(3);
  });

  it('drops to 0 once a full day was missed', () => {
    expect(displayStreak({ count: 7, lastDate: '2026-01-08' }, '2026-01-10')).toBe(0);
    expect(displayStreak({ count: 7, lastDate: '2025-12-30' }, '2026-01-10')).toBe(0);
  });
});
