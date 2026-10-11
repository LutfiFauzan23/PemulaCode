/**
 * Aturan streak belajar (per akun).
 *
 * Semua perhitungan tanggal memakai **hari lokal perangkat**, bukan UTC, supaya
 * pergantian hari mengikuti jam user — kalau UTC, user di Indonesia (UTC+7)
 * akan kehilangan kesempatan mengerjakan soal antara pukul 00:00–07:00.
 *
 * Aturannya:
 * - Akun baru mulai dari **0** (belum ada riwayat).
 * - Mengerjakan soal hari ini → **+1**.
 * - Mengerjakan soal lagi di hari yang sama → tidak menambah.
 * - Melewatkan satu hari penuh → **reset ke 0**, lalu hitungan mulai dari 1
 *   saat user mengerjakan soal lagi.
 */

export type StreakRecord = {
  /** Jumlah hari beruntun yang sudah dikerjakan. Selalu ≥ 1 kalau record ada. */
  count: number;
  /** Tanggal lokal terakhir user mengerjakan soal, format `YYYY-MM-DD`. */
  lastDate: string;
};

const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Kunci tanggal lokal (`YYYY-MM-DD`) untuk sebuah tanggal. */
export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Jarak hari antara dua kunci tanggal (positif = `to` lebih baru). */
export function daysBetweenKeys(from: string, to: string): number | null {
  const start = parseDateKey(from);
  const end = parseDateKey(to);
  if (!start || !end) return null;
  // Dibulatkan supaya pergantian DST (23/25 jam) tidak menghasilkan 0.96 hari.
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

/**
 * Record streak setelah user mengerjakan soal hari ini.
 * Mengembalikan record yang sudah diperbarui (tidak memutasi input).
 */
export function nextStreakRecord(
  record: StreakRecord | undefined,
  todayKey: string = toDateKey(),
): StreakRecord {
  if (!record) return { count: 1, lastDate: todayKey };

  const gap = daysBetweenKeys(record.lastDate, todayKey);
  // Tanggal tidak dikenal (data lama/rusak) → mulai ulang dari hari ini.
  if (gap === null) return { count: 1, lastDate: todayKey };
  // Masih hari yang sama (atau jam perangkat mundur) → jangan menambah ganda.
  if (gap <= 0) return { ...record };
  // Hari berikutnya → streak bertambah.
  if (gap === 1) return { count: record.count + 1, lastDate: todayKey };
  // Ada hari yang terlewat → rantai putus, mulai dari 1 lagi.
  return { count: 1, lastDate: todayKey };
}

/**
 * Streak yang ditampilkan hari ini.
 *
 * Dianggap masih hidup kalau aktivitas terakhir **hari ini** (gap 0) atau
 * **kemarin** (gap 1) — hari ini belum berakhir, jadi belum bisa disebut
 * terlewat. Kalau sudah dua hari atau lebih, rantai putus → 0.
 */
export function displayStreak(
  record: StreakRecord | undefined,
  todayKey: string = toDateKey(),
): number {
  if (!record) return 0;
  const gap = daysBetweenKeys(record.lastDate, todayKey);
  if (gap === null) return 0;
  return gap <= 1 ? Math.max(record.count, 0) : 0;
}

function parseDateKey(key: string): Date | null {
  const match = DATE_KEY_PATTERN.exec(key);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}
