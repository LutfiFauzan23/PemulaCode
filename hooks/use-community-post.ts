import { useCallback, useEffect, useRef, useState } from 'react';

import { isSupabaseConfigured } from '@/config/supabase';
import {
  createComment,
  fetchComments,
  fetchPost,
  subscribeToComments,
  subscribeToCommunity,
} from '@/services/communityService';
import { useAuthStore } from '@/stores/auth-store';
import type { CommunityComment, CommunityPost, NewCommentInput } from '@/types/community';

export function useCommunityPost(postId: string | undefined) {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(postId) && isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  const load = useCallback(async () => {
    // Tanpa postId/konfigurasi, `isLoading` memang sudah `false` sejak awal.
    if (!postId || !isSupabaseConfigured) return;

    const result = await fetchPost(postId, userId);
    if (!alive.current) return;
    setPost(result.data);
    setError(result.error);
    setIsLoading(false);
  }, [postId, userId]);

  useEffect(() => {
    alive.current = true;
    void load();
    return () => {
      alive.current = false;
    };
  }, [load]);

  useEffect(() => {
    if (!postId || !isSupabaseConfigured) return;
    return subscribeToCommunity(() => {
      void load();
    });
  }, [postId, load]);

  return { error, isConfigured: isSupabaseConfigured, isLoading, post, reload: load };
}

export function usePostComments(postId: string | undefined) {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(postId) && isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  const load = useCallback(async () => {
    // Tanpa postId/konfigurasi, `isLoading` memang sudah `false` sejak awal.
    if (!postId || !isSupabaseConfigured) return;

    const result = await fetchComments(postId);
    if (!alive.current) return;
    setComments(result.data);
    setError(result.error);
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    alive.current = true;
    void load();
    return () => {
      alive.current = false;
    };
  }, [load]);

  useEffect(() => {
    if (!postId || !isSupabaseConfigured) return;
    return subscribeToComments(postId, () => {
      void load();
    });
  }, [postId, load]);

  /**
   * Kirim balasan. Menerima teks saja atau objek lengkap (media + balasan
   * bersarang) supaya kolom pesan bisa mengirim lampiran juga.
   */
  const addComment = useCallback(
    async (input: NewCommentInput | string): Promise<string | null> => {
      const message: NewCommentInput = typeof input === 'string' ? { content: input } : input;
      const trimmed = message.content.trim();

      if (!postId) return 'Post tidak ditemukan.';
      if (!trimmed && !message.media) return null;
      if (!isSupabaseConfigured) return 'Supabase belum dikonfigurasi.';
      if (!userId) return 'Kamu harus login untuk berkomentar.';

      const result = await createComment(postId, userId, {
        ...message,
        content: trimmed || 'Mengirim lampiran',
      });
      if (result.error) return result.error;
      await load();
      return null;
    },
    [postId, userId, load],
  );

  return { addComment, comments, error, isLoading, reload: load };
}
