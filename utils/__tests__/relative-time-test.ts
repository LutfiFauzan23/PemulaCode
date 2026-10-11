import { relativeTime } from '@/utils/relative-time';

const NOW = new Date('2026-10-08T12:00:00.000Z').getTime();

describe('relativeTime', () => {
  it('returns "Baru saja" for the current moment', () => {
    expect(relativeTime(new Date(NOW).toISOString(), NOW)).toBe('Baru saja');
  });

  it('returns minutes for recent timestamps', () => {
    const fiveMinutesAgo = new Date(NOW - 5 * 60_000).toISOString();
    expect(relativeTime(fiveMinutesAgo, NOW)).toBe('5 menit yang lalu');
  });

  it('returns hours for same-day timestamps', () => {
    const twoHoursAgo = new Date(NOW - 2 * 60 * 60_000).toISOString();
    expect(relativeTime(twoHoursAgo, NOW)).toBe('2 jam yang lalu');
  });

  it('returns days within the last week', () => {
    const threeDaysAgo = new Date(NOW - 3 * 24 * 60 * 60_000).toISOString();
    expect(relativeTime(threeDaysAgo, NOW)).toBe('3 hari yang lalu');
  });

  it('falls back to a formatted date for older timestamps', () => {
    const result = relativeTime(new Date(NOW - 30 * 24 * 60 * 60_000).toISOString(), NOW);
    expect(result).not.toMatch(/yang lalu/);
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles missing and invalid input gracefully', () => {
    expect(relativeTime(null, NOW)).toBe('Baru saja');
    expect(relativeTime(undefined, NOW)).toBe('Baru saja');
    expect(relativeTime('bukan-tanggal', NOW)).toBe('Baru saja');
  });
});
