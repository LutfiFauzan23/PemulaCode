const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** `-1` menandai karakter yang bukan bagian dari alfabet base64. */
const BASE64_LOOKUP = (() => {
  const table = new Int8Array(128).fill(-1);
  for (let i = 0; i < BASE64_ALPHABET.length; i += 1) {
    table[BASE64_ALPHABET.charCodeAt(i)] = i;
  }
  return table;
})();

/** `true` jika string adalah data URI base64 (`data:image/png;base64,...`). */
export function isBase64DataUri(value: string): boolean {
  return /^data:[^,]*;base64,/i.test(value);
}

/**
 * Ubah string base64 (atau data URI base64) menjadi byte yang bisa dikirim ke
 * Supabase Storage. Dipakai di web, tempat image picker mengembalikan data URI,
 * sehingga tidak perlu bergantung pada modul native.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const payload = base64.replace(/^data:[^,]*;base64,/i, '').replace(/=+$/, '');
  const byteLength = Math.floor((payload.length * 3) / 4);
  const bytes = new Uint8Array(byteLength);

  let offset = 0;
  for (let i = 0; i < payload.length; i += 4) {
    const c1 = payload.charCodeAt(i);
    const c2 = payload.charCodeAt(i + 1);
    const c3 = payload.charCodeAt(i + 2);
    const c4 = payload.charCodeAt(i + 3);

    const n1 = c1 < 128 ? BASE64_LOOKUP[c1] : -1;
    const n2 = c2 < 128 ? BASE64_LOOKUP[c2] : -1;
    const n3 = c3 < 128 ? BASE64_LOOKUP[c3] : -1;
    const n4 = c4 < 128 ? BASE64_LOOKUP[c4] : -1;
    if (n1 < 0) break;

    const chunk = (n1 << 18) | ((n2 < 0 ? 0 : n2) << 12) | ((n3 < 0 ? 0 : n3) << 6) | (n4 < 0 ? 0 : n4);

    if (offset < byteLength) bytes[offset++] = (chunk >> 16) & 0xff;
    if (offset < byteLength) bytes[offset++] = (chunk >> 8) & 0xff;
    if (offset < byteLength) bytes[offset++] = chunk & 0xff;
  }

  return bytes;
}
