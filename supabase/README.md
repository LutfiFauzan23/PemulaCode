# Supabase — Database & Forum Realtime PemulaCode

Folder ini berisi skema database komunitas dan panduan menghubungkannya ke app.

## Ringkasan arsitektur

```
Expo app
  ├─ config/supabase.ts        → 1 client Supabase (sesi disimpan via expo-sqlite)
  ├─ stores/auth-store.ts      → auth email/password (sign up / sign in / sign out)
  ├─ services/communityService.ts → CRUD post, komentar, like + langganan Realtime
  └─ hooks/use-community-*.ts  → memuat data + auto-refresh saat ada perubahan
```

Realtime bekerja dengan dua hal:

1. Tabel (`posts`, `comments`, `post_likes`) ditambahkan ke publication
   `supabase_realtime` (sudah ada di `schema.sql`).
2. App membuka **channel** dan mendengarkan event `postgres_changes`
   (`subscribeToCommunity` / `subscribeToComments`). Setiap INSERT/UPDATE/DELETE
   yang lolos RLS akan langsung dikirim ke perangkat, lalu hook memuat ulang
   datanya.

## 1. Buat project Supabase

1. Buka <https://database.new> dan login/daftar.
2. Pilih organization + region (mis. Singapore), lalu tunggu project selesai dibuat.

## 2. Jalankan skema

1. Di dashboard project, buka **SQL Editor → New query**.
2. Tempel seluruh isi [`schema.sql`](./schema.sql), lalu klik **Run**.
3. File itu idempotent (aman dijalankan ulang). Ia membuat:
   - tabel `profiles`, `posts`, `comments`, `post_likes`
   - trigger pembuatan profil otomatis saat user sign-up
   - Row Level Security + policy (semua boleh baca; hanya pemilik boleh menulis)
   - publication Realtime untuk tiga tabel

## 3. Ambil kredensial

Buka **Project Settings → API**:

- **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
- **Publishable key** (project baru bisa juga menyebutnya `anon` key) → `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

> Kedua nilai ini memang publik dan ikut terkirim bersama app. Keamanan data
> dijaga oleh RLS, **bukan** oleh kunci ini.
> **Jangan pernah** menaruh `service_role` / secret key di app — kunci itu
> melewati RLS dan memberi akses penuh ke seluruh database.

Buat `.env.local` di root project (file ini sudah di-`.gitignore`):

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxx
```

Lalu **restart** dev server (`npx expo start`) karena env dibaca saat bundling.

`.env.example` berisi template yang sama.

## 4. (Opsional) Matikan konfirmasi email

Secara default Supabase meminta user mengonfirmasi email sebelum bisa login.
Untuk uji cepat: **Authentication → Sign In / Providers → Email → matikan
"Confirm email"**, lalu simpan. Kalau dibiarkan aktif, app tetap menangani
kasus ini (menampilkan pesan "Cek Email Kamu" setelah daftar).

## 5. Cek bahwa semuanya jalan

1. Jalankan app, buka tab **Community**. Indikator di atas feed akan berubah
   dari "Menghubungkan..." menjadi **"Realtime aktif"** (titik hijau).
2. Daftar akun lewat layar **Register**, lalu publikasikan sebuah post.
3. Untuk menguji realtime: buka app yang sama di perangkat/emulator kedua
   (atau tab web), login dengan akun lain, lalu kirim komentar. Komentar akan
   muncul di layar pertama **tanpa perlu refresh**.

Kalau `.env.local` masih kosong, app otomatis memakai **data demo** dan
menampilkan "Mode demo - Supabase belum dikonfigurasi".

## Struktur tabel

| Tabel        | Kolom utama                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| `profiles`   | `id` (FK ke `auth.users`), `username`, `full_name`, `avatar_url`, `xp`, `streak_count`, `last_active_date` |
| `posts`      | `id`, `author_id`, `category`, `title`, `content`, `code`, `accent_color`, `media_url`, `media_type` |
| `comments`   | `id`, `post_id`, `author_id`, `content`, `created_at`, `parent_comment_id`, `media_url`, `media_type` |
| `post_likes` | `post_id`, `user_id` (primary key gabungan, mencegah like ganda)             |
| `storage`    | bucket `community-media` (foto/video pesan & balasan, folder per user id)   |

## 6. Pesan, foto/video, dan balasan

`schema.sql` juga membuat bucket Storage **`community-media`**:

- **Publik dibaca** supaya media langsung tampil di feed.
- **Hanya user login** yang boleh mengunggah, dan hanya ke folder bernama id
  dirinya (`community-media/<user-id>/...`) — media orang lain tidak bisa
  ditimpa/dihapus.

Dari app, kolom pesan di tab Community bisa mengirim teks + satu foto/video,
setiap pesan bisa **dibalas** (balasan juga boleh berisi media), dan semuanya
terlihat oleh pengguna lain. Balasan bersarang satu tingkat lewat kolom
`parent_comment_id`.

## 7. XP, streak, dan leaderboard

- `profiles.xp` dan `profiles.streak_count` **hanya** bisa diubah lewat fungsi
  `record_activity(p_xp_delta, p_streak)`. Trigger `protect_profile_stats`
  mengembalikan nilai lama bila update datang dari client biasa, jadi XP tidak
  bisa diperbesar dari app.
- App memanggil `record_activity` setiap kuis/tantangan harian selesai (XP) dan
  saat streak lokal berubah.
- Leaderboard membaca `profiles` dan mengurutkan dari `xp` terbesar. Tidak ada
  lagi data contoh, jadi peringkat benar-benar milik pengguna terdaftar.

**Reset leaderboard/XP**: data contoh lama tidak pernah tersimpan di database,
sehingga anggota baru otomatis mulai dari 0. Bila kamu ingin menghapus XP/streak
yang sudah terkumpul (mis. hasil uji coba), jalankan sekali perintah
`update public.profiles set xp = 0, streak_count = 0, last_active_date = null;`
(pertama baris di bagian "6. (OPSIONAL) RESET" pada `schema.sql`). Perintah itu
sengaja dikomentari supaya menjalankan ulang skema tidak pernah menghapus
progres.

> Setelah memperbarui `schema.sql`, jalankan ulang seluruh file di **SQL Editor**
> supaya kolom media, bucket Storage, dan fungsi `record_activity` ikut dibuat.
> File itu idempotent, jadi aman dijalankan berkali-kali.

## Troubleshooting

| Gejala | Penyebab & solusi |
| --- | --- |
| `could not find the column ... in the schema cache` (mis. `media_type`) | Skema lama belum dijalankan / cache belum segar. Tempel & jalankan ulang seluruh `schema.sql` di SQL Editor (file ini idempotent, dan baris terakhirnya me-refresh cache PostgREST). |
| `Could not find the table 'public.posts'` | Cache skema belum menyegar. Jalankan ulang query setelah tabel dibuat. |
| `permission denied for table posts` (`42501`) | Grant belum ada. `schema.sql` sudah menyertakan `grant`; jalankan ulang. |
| Tab Community tetap "Menghubungkan..." | Realtime belum aktif untuk tabel tersebut, atau RLS memblokir. Pastikan `schema.sql` dijalankan penuh, dan user sudah login. |
| Like/komentar tidak tersimpan | User belum login (RLS mensyaratkan `auth.uid() = author_id`). Login dulu. |
| Select mengembalikan `[]` tanpa error | Policy `select` tidak cocok. Cek kebijakan di **Authentication → Policies**. |

## Keamanan

- RLS aktif di keempat tabel; tulis hanya boleh oleh pemilik baris.
- Gunakan hanya publishable/anon key di app. Simpan secret di server.
