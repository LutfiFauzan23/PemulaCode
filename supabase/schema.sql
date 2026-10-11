-- ============================================================================
-- PemulaCode — Skema database komunitas (Supabase / PostgreSQL)
-- ============================================================================
-- Cara pakai:
--   1. Buka Supabase Dashboard -> SQL Editor -> New query.
--   2. Tempel SELURUH isi file ini, lalu Run.
--   3. File ini idempotent: aman dijalankan ulang.
--
-- Struktur:
--   profiles      : data publik user (username, nama, avatar, XP, streak)
--   posts         : pesan/topik diskusi forum (bisa berisi foto atau video)
--   comments      : balasan pada sebuah post/pesan (bisa bersarang & berisi media)
--   post_likes    : relasi like user <-> post (unik per pasangan)
--   storage       : bucket `community-media` untuk foto/video komunitas
--
-- Realtime:
--   Tabel posts, comments, dan post_likes ditambahkan ke publication
--   `supabase_realtime`, sehingga perubahan langsung dikirim ke client.
--
-- XP & leaderboard:
--   Kolom `xp`/`streak_count` di profiles hanya boleh diubah lewat fungsi
--   `record_activity()`, sehingga client tidak bisa mengobral XP sendiri.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. TABEL
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles (id) on delete cascade,
  category      text not null default 'Umum',
  title         text not null,
  content       text,
  code          text,
  accent_color  text not null default '#4648d4',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts (id) on delete cascade,
  author_id   uuid not null references public.profiles (id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 1b. TAMBAHAN: media (foto/video), balasan bersarang, XP & streak
-- ---------------------------------------------------------------------------
-- Ditulis sebagai `alter table ... add column if not exists` supaya file ini
-- tetap idempotent dan aman dijalankan pada database yang sudah ada.

alter table public.profiles
  add column if not exists xp                integer not null default 0,
  add column if not exists streak_count      integer not null default 0,
  add column if not exists last_active_date  date;

alter table public.posts
  add column if not exists media_url   text,
  add column if not exists media_type  text;

alter table public.comments
  add column if not exists parent_comment_id uuid references public.comments (id) on delete cascade,
  add column if not exists media_url         text,
  add column if not exists media_type        text;

-- `media_type` hanya boleh 'image' atau 'video' (atau null bila tanpa media).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_media_type_check') then
    alter table public.posts
      add constraint posts_media_type_check
      check (media_type is null or media_type in ('image', 'video'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'comments_media_type_check') then
    alter table public.comments
      add constraint comments_media_type_check
      check (media_type is null or media_type in ('image', 'video'));
  end if;
end;
$$;

create table if not exists public.post_likes (
  post_id     uuid not null references public.posts (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists posts_created_at_idx    on public.posts (created_at desc);
create index if not exists posts_author_id_idx      on public.posts (author_id);
create index if not exists comments_post_id_idx     on public.comments (post_id, created_at);
create index if not exists comments_parent_id_idx   on public.comments (parent_comment_id);
create index if not exists post_likes_user_id_idx   on public.post_likes (user_id);
-- Leaderboard diurutkan dari XP terbesar.
create index if not exists profiles_xp_idx          on public.profiles (xp desc);

-- ---------------------------------------------------------------------------
-- 2. PROFIL OTOMATIS SAAT SIGN-UP
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'user'
  );

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    base_username,
    coalesce(new.raw_user_meta_data ->> 'full_name', base_username),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Jaga `updated_at` tetap akurat.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 2b. XP & STREAK HANYA BOLEH DIUBAH SERVER
-- ---------------------------------------------------------------------------
-- Policy `users update own profile` mengizinkan user mengubah baris miliknya
-- (mis. nama/avatar). Tanpa penjaga di bawah, user bisa menulis XP sendiri dan
-- leaderboard jadi tidak bisa dipercaya. Trigger ini mengembalikan nilai
-- statistik ke nilai lama kecuali perubahan datang dari `record_activity()`.

create or replace function public.protect_profile_stats()
returns trigger
language plpgsql
as $$
begin
  if coalesce(current_setting('app.allow_stats_update', true), 'off') <> 'on' then
    new.xp               := old.xp;
    new.streak_count     := old.streak_count;
    new.last_active_date := old.last_active_date;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_stats on public.profiles;
create trigger profiles_protect_stats
  before update on public.profiles
  for each row execute function public.protect_profile_stats();

/**
 * Catat aktivitas belajar user yang sedang login.
 *
 * `p_xp_delta` ditambahkan ke XP (dibatasi 0..500 per panggilan supaya client
 * tidak bisa melompatkan XP), dan `p_streak` menimpa jumlah streak harian bila
 * dikirim. Dipanggil app setelah kuis/tantangan harian selesai.
 */
create or replace function public.record_activity(p_xp_delta integer default 0, p_streak integer default null)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.profiles;
  delta  integer;
begin
  if auth.uid() is null then
    raise exception 'record_activity: user belum login';
  end if;

  delta := greatest(0, least(coalesce(p_xp_delta, 0), 500));

  perform set_config('app.allow_stats_update', 'on', true);

  update public.profiles
     set xp               = greatest(0, least(10000000, xp + delta)),
         streak_count     = case
                              when p_streak is null then streak_count
                              else greatest(0, least(10000, p_streak))
                            end,
         last_active_date = current_date
   where id = auth.uid()
  returning * into result;

  perform set_config('app.allow_stats_update', 'off', true);

  return result;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

alter table public.profiles    enable row level security;
alter table public.posts       enable row level security;
alter table public.comments    enable row level security;
alter table public.post_likes  enable row level security;

-- profiles: bisa dibaca siapa saja, hanya pemilik yang boleh mengubah.
drop policy if exists "profiles are readable by everyone" on public.profiles;
create policy "profiles are readable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- posts: semua bisa baca, hanya penulis asli yang boleh menulis/ubah/hapus.
drop policy if exists "posts are readable by everyone" on public.posts;
create policy "posts are readable by everyone"
  on public.posts for select
  using (true);

drop policy if exists "authenticated users create posts" on public.posts;
create policy "authenticated users create posts"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "authors update own posts" on public.posts;
create policy "authors update own posts"
  on public.posts for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "authors delete own posts" on public.posts;
create policy "authors delete own posts"
  on public.posts for delete
  to authenticated
  using (auth.uid() = author_id);

-- comments: pola sama seperti posts.
drop policy if exists "comments are readable by everyone" on public.comments;
create policy "comments are readable by everyone"
  on public.comments for select
  using (true);

drop policy if exists "authenticated users create comments" on public.comments;
create policy "authenticated users create comments"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "authors delete own comments" on public.comments;
create policy "authors delete own comments"
  on public.comments for delete
  to authenticated
  using (auth.uid() = author_id);

-- post_likes: semua bisa baca jumlah like, hanya pemilik yang bisa like/unlike.
drop policy if exists "likes are readable by everyone" on public.post_likes;
create policy "likes are readable by everyone"
  on public.post_likes for select
  using (true);

drop policy if exists "users like as themselves" on public.post_likes;
create policy "users like as themselves"
  on public.post_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "users update own likes" on public.post_likes;
create policy "users update own likes"
  on public.post_likes for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users remove own likes" on public.post_likes;
create policy "users remove own likes"
  on public.post_likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. GRANTS (safeguard; project baru biasanya sudah memberi ini)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.posts, public.comments, public.post_likes to anon, authenticated;
grant insert, update, delete on public.posts, public.comments, public.post_likes to authenticated;
grant insert, update on public.profiles to authenticated;
grant execute on function public.record_activity(integer, integer) to authenticated;

-- ---------------------------------------------------------------------------
-- 4b. STORAGE UNTUK FOTO/VIDEO KOMUNITAS
-- ---------------------------------------------------------------------------
-- Bucket publik supaya media bisa langsung ditampilkan di feed. Yang bisa
-- mengunggah hanya user login, dan hanya ke folder bernama id dirinya sendiri
-- (`community-media/<user-id>/...`), sehingga media user lain tidak bisa
-- ditimpa atau dihapus.

insert into storage.buckets (id, name, public)
values ('community-media', 'community-media', true)
on conflict (id) do update set public = true;

drop policy if exists "community media is readable by everyone" on storage.objects;
create policy "community media is readable by everyone"
  on storage.objects for select
  using (bucket_id = 'community-media');

drop policy if exists "users upload own community media" on storage.objects;
create policy "users upload own community media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'community-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete own community media" on storage.objects;
create policy "users delete own community media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'community-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- 5. REALTIME
-- ---------------------------------------------------------------------------
-- Menambahkan tabel ke publication `supabase_realtime` membuat perubahan
-- langsung dipush ke client yang subscribe (INSERT/UPDATE/DELETE).

do $$
declare
  t text;
begin
  foreach t in array array['posts', 'comments', 'post_likes'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. (OPSIONAL) RESET LEADERBOARD & XP
-- ---------------------------------------------------------------------------
-- Data contoh lama (Dev_Mia, Master_Coda, dll.) sudah dihapus dari app dan
-- tidak pernah tersimpan di database, jadi leaderboard baru otomatis mulai
-- dari nol dengan data pengguna asli. Perintah di bawah HANYA dijalankan
-- sekali bila kamu yakin ingin menghapus XP/streak yang sudah terkumpul di
-- database yang sudah ada (mis. hasil uji coba). Sengaja tidak dieksekusi
-- otomatis supaya menjalankan ulang skema tidak pernah menghapus progres.
--
-- update public.profiles
--    set xp               = 0,
--        streak_count      = 0,
--        last_active_date  = null;

-- ---------------------------------------------------------------------------
-- 7. SEGARKAN SCHEMA CACHE POSTGREST
-- ---------------------------------------------------------------------------
-- Tanpa ini, PostgREST bisa saja masih memegang struktur lama dan membuang
-- permintaan dengan error "could not find the column ... in the schema cache"
-- meski kolomnya sudah ada. Dijalankan otomatis setiap kali file ini dieksekusi.

notify pgrst, 'reload schema';
