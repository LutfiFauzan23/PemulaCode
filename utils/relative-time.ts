const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Ubah timestamp ISO menjadi teks relatif singkat berbahasa Indonesia,
 * mis. "Baru saja", "5 menit yang lalu", "2 jam yang lalu", "3 hari yang lalu".
 */
export function relativeTime(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return 'Baru saja';

  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return 'Baru saja';

  const diff = Math.max(0, now - timestamp);

  if (diff < MINUTE) return 'Baru saja';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} menit yang lalu`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} jam yang lalu`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)} hari yang lalu`;

  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
