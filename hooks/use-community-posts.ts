import { useCallback, useEffect, useRef, useState } from 'react';

import { isSupabaseConfigured } from '@/config/supabase';
import {
  fetchPosts,
  subscribeToCommunity,
  type RealtimeStatus,
} from '@/services/communityService';
import { useAuthStore } from '@/stores/auth-store';
import type { CommunityPost } from '@/types/community';

/**
 * Memuat feed komunitas lalu berlangganan perubahan Realtime. Setiap
 * INSERT/UPDATE/DELETE pada posts/comments/post_likes memicu muat ulang
 * (di-debounce) sehingga jumlah like & komentar selalu akurat.
 */
export function useCommunityPosts() {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<RealtimeStatus>(
    isSupabaseConfigured ? 'connecting' : 'offline',
  );

  const alive = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    // Tanpa konfigurasi, `isLoading` memang sudah `false` sejak awal.
    if (!isSupabaseConfigured) return;

    const result = await fetchPosts(userId);
    if (!alive.current) return;
    setPosts(result.data);
    setError(result.error);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    alive.current = true;
    void load();
    return () => {
      alive.current = false;
    };
  }, [load]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const schedule = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void load();
      }, 250);
    };

    const unsubscribe = subscribeToCommunity(schedule, setStatus);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      unsubscribe();
    };
  }, [load]);

  return {
    error,
    isConfigured: isSupabaseConfigured,
    isLoading,
    isLive: status === 'live',
    posts,
    reload: load,
    status,
  };
}
