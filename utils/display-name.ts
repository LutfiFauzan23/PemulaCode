/**
 * Nama panggilan yang dipakai untuk menyapa user di Home.
 *
 * Sumbernya berurutan:
 * 1. `profiles.username` — nama panggilan yang diisi saat daftar (atau diubah
 *    di Pengaturan → Profil). Ini yang paling akurat karena bisa diperbarui.
 * 2. `user_metadata.username` — nilai yang dikirim saat sign-up; dipakai
 *    sebagai cadangan saat profil belum sempat dibuat/muat.
 *
 * Mengembalikan `null` jika keduanya kosong supaya pemanggil bisa memilih
 * sapaan cadangan.
 */
export function getDisplayName(
  profileUsername: string | null | undefined,
  metadataUsername: unknown,
): string | null {
  const fromProfile = typeof profileUsername === 'string' ? profileUsername.trim() : '';
  if (fromProfile) return fromProfile;

  const fromMetadata = typeof metadataUsername === 'string' ? metadataUsername.trim() : '';
  return fromMetadata || null;
}
