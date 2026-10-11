import { File as ExpoFile } from 'expo-file-system';

import { isSupabaseConfigured, supabase } from '@/config/supabase';
import type {
  CommunityComment,
  CommunityMedia,
  CommunityPost,
  MediaUploadInput,
  NewCommentInput,
  NewPostInput,
} from '@/types/community';
import { base64ToUint8Array, isBase64DataUri } from '@/utils/base64';

export type ServiceResult<T> = { data: T; error: string | null };

const NOT_CONFIGURED = 'Supabase belum dikonfigurasi.';

/** Bucket Storage untuk foto/video komunitas (dibuat oleh `supabase/schema.sql`). */
export const COMMUNITY_MEDIA_BUCKET = 'community-media';

/** Batas ukuran file yang diunggah dari app (server tetap punya batas sendiri). */
export const MAX_MEDIA_BYTES = 20 * 1024 * 1024;

export const MEDIA_TOO_LARGE_MESSAGE =
  'Ukuran file terlalu besar. Maksimal 20 MB — kompres dulu atau pilih file yang lebih kecil.';

const AUTHOR_FIELDS = 'id, username, full_name, avatar_url';
const MEDIA_FIELDS = 'media_url, media_type';

/**
 * Satu query mengambil post, penulisnya, jumlah komentar, dan jumlah like.
 * PostgREST mengembalikan agregat sebagai array `[{ count }]`.
 */
export const POST_SELECT = [
  'id',
  'author_id',
  'category',
  'title',
  'content',
  'code',
  'accent_color',
  'created_at',
  MEDIA_FIELDS,
  `author:profiles!posts_author_id_fkey (${AUTHOR_FIELDS})`,
  'comments (count)',
  'post_likes (count)',
].join(',');

export const COMMENT_SELECT = [
  'id',
  'post_id',
  'author_id',
  'content',
  'created_at',
  'parent_comment_id',
  MEDIA_FIELDS,
  `author:profiles!comments_author_id_fkey (${AUTHOR_FIELDS})`,
].join(',');

type RawRow = Record<string, unknown>;

function asRecord(value: unknown): RawRow | null {
  return typeof value === 'object' && value !== null ? (value as unknown as RawRow) : null;
}

function count(value: unknown): number {
  const first = Array.isArray(value) ? value[0] : value;
  const record = asRecord(first);
  const raw = record ? record.count : first;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapAuthor(value: unknown) {
  const record = asRecord(value);
  return {
    id: String(record?.id ?? ''),
    username: String(record?.username ?? 'Pengguna'),
    fullName: (record?.full_name as string | null) ?? null,
    avatarUrl: (record?.avatar_url as string | null) ?? null,
  };
}

/** Media hanya dianggap ada bila URL **dan** jenisnya valid. */
export function mapMedia(url: unknown, type: unknown): CommunityMedia | null {
  if (typeof url !== 'string' || !url) return null;
  if (type !== 'image' && type !== 'video') return null;
  return { type, url };
}

/** Di-export agar bisa diuji tanpa jaringan. */
export function mapPostRow(row: RawRow, likedIds: ReadonlySet<string> = new Set()): CommunityPost {
  const id = String(row.id ?? '');
  return {
    id,
    authorId: String(row.author_id ?? ''),
    author: mapAuthor(row.author),
    category: String(row.category ?? 'Umum'),
    title: String(row.title ?? ''),
    content: (row.content as string | null) ?? null,
    code: (row.code as string | null) ?? null,
    accentColor: String(row.accent_color ?? '#4648d4'),
    createdAt: String(row.created_at ?? ''),
    likesCount: count(row.post_likes),
    commentsCount: count(row.comments),
    likedByMe: likedIds.has(id),
    media: mapMedia(row.media_url, row.media_type),
  };
}

/** Di-export agar bisa diuji tanpa jaringan. */
export function mapCommentRow(row: RawRow): CommunityComment {
  return {
    id: String(row.id ?? ''),
    postId: String(row.post_id ?? ''),
    authorId: String(row.author_id ?? ''),
    author: mapAuthor(row.author),
    content: String(row.content ?? ''),
    createdAt: String(row.created_at ?? ''),
    media: mapMedia(row.media_url, row.media_type),
    parentCommentId: (row.parent_comment_id as string | null) ?? null,
  };
}

async function likedPostIds(userId?: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  const { data } = await supabase.from('post_likes').select('post_id').eq('user_id', userId);
  return new Set((data ?? []).map((row) => String((row as { post_id: string }).post_id)));
}

export async function fetchPosts(userId?: string | null): Promise<ServiceResult<CommunityPost[]>> {
  if (!isSupabaseConfigured) return { data: [], error: null };

  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return { data: [], error: error.message };

  const liked = await likedPostIds(userId);
  return { data: (data ?? []).map((row) => mapPostRow(row as unknown as RawRow, liked)), error: null };
}

export async function fetchPost(
  postId: string,
  userId?: string | null,
): Promise<ServiceResult<CommunityPost | null>> {
  if (!isSupabaseConfigured) return { data: null, error: null };

  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('id', postId)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: null };

  const liked = await likedPostIds(userId);
  return { data: mapPostRow(data as unknown as RawRow, liked), error: null };
}

export async function fetchComments(postId: string): Promise<ServiceResult<CommunityComment[]>> {
  if (!isSupabaseConfigured) return { data: [], error: null };

  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map((row) => mapCommentRow(row as unknown as RawRow)), error: null };
}

export async function createPost(
  input: NewPostInput,
  authorId: string,
): Promise<ServiceResult<string | null>> {
  if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };

  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: authorId,
      category: input.category,
      title: input.title.trim(),
      content: input.content?.trim() || null,
      code: input.code?.trim() || null,
      media_url: input.media?.url ?? null,
      media_type: input.media?.type ?? null,
    })
    .select('id')
    .single();

  if (error) return { data: null, error: error.message };
  return { data: String((data as { id: string }).id), error: null };
}

export async function deletePost(postId: string): Promise<ServiceResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  return { data: null, error: error?.message ?? null };
}

export async function createComment(
  postId: string,
  authorId: string,
  input: NewCommentInput | string,
): Promise<ServiceResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };

  // Menerima string langsung agar pemanggil lama tetap bekerja.
  const message: NewCommentInput = typeof input === 'string' ? { content: input } : input;

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    author_id: authorId,
    content: message.content.trim(),
    parent_comment_id: message.parentCommentId ?? null,
    media_url: message.media?.url ?? null,
    media_type: message.media?.type ?? null,
  });

  return { data: null, error: error?.message ?? null };
}

export async function deleteComment(commentId: string): Promise<ServiceResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };
  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  return { data: null, error: error?.message ?? null };
}

// ---------------------------------------------------------------------------
// MEDIA (foto/video)
// ---------------------------------------------------------------------------

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'm4v', 'webm', 'avi', 'mkv', '3gp'];

function extensionOf(input: MediaUploadInput): string {
  const fromName = input.fileName?.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;

  const fromUri = input.uri.split('?')[0].split('.').pop()?.toLowerCase();
  if (fromUri && /^[a-z0-9]{2,5}$/.test(fromUri)) return fromUri;

  return input.type === 'video' ? 'mp4' : 'jpg';
}

function contentTypeOf(input: MediaUploadInput): string {
  const extension = extensionOf(input);
  if (input.type === 'video') {
    if (extension === 'mov') return 'video/quicktime';
    if (extension === 'webm') return 'video/webm';
    return 'video/mp4';
  }
  if (extension === 'png') return 'image/png';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
}

/**
 * Ambil isi file dari URI picker menjadi byte.
 *
 * Tiga bentuk URI perlu ditangani: data URI (web), `blob:`/`http(s):` (web dan
 * hasil unduhan), serta `file://` (perangkat) yang dibaca lewat expo-file-system.
 */
async function readUriBytes(uri: string): Promise<Uint8Array> {
  if (isBase64DataUri(uri)) return base64ToUint8Array(uri);

  if (/^(blob|https?):/i.test(uri)) {
    const response = await fetch(uri);
    return new Uint8Array(await response.arrayBuffer());
  }

  return await new ExpoFile(uri).bytes();
}

/**
 * Unggah satu foto/video ke Storage lalu kembalikan URL publiknya.
 *
 * Path selalu diawali `user.id` supaya policy Storage membatasi user hanya
 * pada foldernya sendiri.
 */
export async function uploadCommunityMedia(
  input: MediaUploadInput,
): Promise<ServiceResult<string>> {
  if (!isSupabaseConfigured) return { data: '', error: NOT_CONFIGURED };
  if (!input.userId) return { data: '', error: 'Kamu harus login untuk mengunggah media.' };
  if (input.sizeBytes && input.sizeBytes > MAX_MEDIA_BYTES) {
    return { data: '', error: MEDIA_TOO_LARGE_MESSAGE };
  }

  let bytes: Uint8Array;
  try {
    bytes = await readUriBytes(input.uri);
  } catch (error) {
    return {
      data: '',
      error: `Gagal membaca file: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  if (bytes.byteLength === 0) return { data: '', error: 'File kosong, coba pilih ulang.' };
  if (bytes.byteLength > MAX_MEDIA_BYTES) return { data: '', error: MEDIA_TOO_LARGE_MESSAGE };

  const extension = extensionOf(input);
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${input.userId}/${unique}.${extension}`;

  const { error } = await supabase.storage
    .from(COMMUNITY_MEDIA_BUCKET)
    .upload(path, bytes, { contentType: contentTypeOf(input), upsert: false });

  if (error) {
    return {
      data: '',
      error: /bucket/i.test(error.message)
        ? 'Bucket `community-media` belum ada. Jalankan ulang supabase/schema.sql di Supabase.'
        : error.message,
    };
  }

  const { data } = supabase.storage.from(COMMUNITY_MEDIA_BUCKET).getPublicUrl(path);
  return { data: data.publicUrl, error: null };
}

/** Ekstensi video dikenali untuk memberi ikon pemutar yang tepat di feed. */
export function isVideoUrl(url: string): boolean {
  const extension = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXTENSIONS.includes(extension);
}

export async function setPostLike(
  postId: string,
  userId: string,
  liked: boolean,
): Promise<ServiceResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };

  if (liked) {
    // `upsert` membuat operasi ini aman dipanggil dua kali.
    const { error } = await supabase
      .from('post_likes')
      .upsert({ post_id: postId, user_id: userId }, { onConflict: 'post_id,user_id' });
    return { data: null, error: error?.message ?? null };
  }

  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);
  return { data: null, error: error?.message ?? null };
}

export type RealtimeStatus = 'connecting' | 'live' | 'offline';

/**
 * Penambah unik untuk nama channel. `supabase.channel(nama)` mengembalikan
 * instance yang sama untuk nama yang sama, sehingga dua layar yang subscribe
 * bersamaan (feed tetap mounted di bawah layar detail) akan memanggil `.on()`
 * pada channel yang sudah `subscribe()` — itu melempar error. `removeChannel`
 * juga asinkron, jadi nama unik mencegah bentrok saat remount/reload.
 */
let channelSeq = 0;

/**
 * Pantau perubahan tabel posts/comments/post_likes. Setiap perubahan memanggil
 * `onChange`; pemanggil cukup memuat ulang datanya (pola refetch sederhana yang
 * selalu konsisten dengan hasil agregasi di server).
 */
export function subscribeToCommunity(
  onChange: () => void,
  onStatus?: (status: RealtimeStatus) => void,
): () => void {
  if (!isSupabaseConfigured) {
    onStatus?.('offline');
    return () => {};
  }

  const channel = supabase
    .channel(`community-feed-${++channelSeq}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, onChange)
    .subscribe((status) => {
      onStatus?.(status === 'SUBSCRIBED' ? 'live' : 'connecting');
    });

  return () => {
    void supabase.removeChannel(channel);
  };
}

/** Sama seperti di atas, tapi khusus komentar sebuah post. */
export function subscribeToComments(postId: string, onChange: () => void): () => void {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel(`comments-${postId}-${++channelSeq}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
      onChange,
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export const communityService = {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchComments,
  fetchPost,
  fetchPosts,
  setPostLike,
  subscribeToComments,
  subscribeToCommunity,
  uploadCommunityMedia,
};
