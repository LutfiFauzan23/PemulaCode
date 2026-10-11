export type CommunityMediaType = 'image' | 'video';

export interface CommunityMedia {
  /** 'image' dirender sebagai gambar, 'video' sebagai kartu pemutar. */
  type: CommunityMediaType;
  url: string;
}

export interface CommunityAuthor {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface CommunityPost {
  accentColor: string;
  author: CommunityAuthor;
  authorId: string;
  category: string;
  code: string | null;
  commentsCount: number;
  content: string | null;
  createdAt: string;
  id: string;
  likedByMe: boolean;
  likesCount: number;
  media: CommunityMedia | null;
  title: string;
}

export interface CommunityComment {
  author: CommunityAuthor;
  authorId: string;
  content: string;
  createdAt: string;
  id: string;
  media: CommunityMedia | null;
  /** Terisi bila komentar ini adalah balasan dari komentar lain. */
  parentCommentId: string | null;
  postId: string;
}

export interface NewPostInput {
  category: string;
  code?: string;
  content?: string;
  media?: CommunityMedia | null;
  title: string;
}

export interface NewCommentInput {
  content: string;
  media?: CommunityMedia | null;
  /** Diisi bila balasan ini menanggapi komentar tertentu (balasan bersarang). */
  parentCommentId?: string | null;
}

export interface MediaUploadInput {
  /** Jenis media menentukan contentType dan thumbnail di feed. */
  type: CommunityMediaType;
  /** Nama file asli dari picker, dipakai untuk menentukan ekstensi. */
  fileName?: string | null;
  /** Ukuran file dalam byte (opsional, untuk validasi lebih awal). */
  sizeBytes?: number | null;
  /** URI dari expo-image-picker (`file://…`, `blob:…`, atau data URI di web). */
  uri: string;
  userId: string;
}
