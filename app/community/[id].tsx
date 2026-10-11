import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Reply, Share2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Share, View } from 'react-native';

import { CommunityMediaView } from '@/components/community/CommunityMediaView';
import { MessageComposer, type PendingMedia } from '@/components/community/MessageComposer';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useCommunityPost, usePostComments } from '@/hooks/use-community-post';
import { setPostLike, uploadCommunityMedia } from '@/services/communityService';
import { useAuthStore } from '@/stores/auth-store';
import type { CommunityMedia } from '@/types/community';
import { relativeTime } from '@/utils/relative-time';

/** Komentar siap-render, termasuk balasan bersarang dan lampiran media. */
type DisplayComment = {
  createdAt: string;
  id: string;
  media: CommunityMedia | null;
  parentCommentId: string | null;
  replies: DisplayComment[];
  text: string;
  user: string;
};

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

type DemoComment = { createdAt: string; id: string; text: string; user: string };
type DemoPost = {
  author: string;
  avatar: string;
  comments: DemoComment[];
  content: string;
  createdAt: string;
  id: string;
  likesCount: number;
};

const DEMO_POSTS: DemoPost[] = [
  {
    id: 'post-1',
    author: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    content:
      'Saya sedang mencoba merapikan tata letak elemen HTML. Apakah ada tips praktis untuk centering elemen secara vertikal dan horizontal?',
    createdAt: '2 jam yang lalu',
    likesCount: 124,
    comments: [
      {
        id: 'c-1',
        user: 'Dev_Mia',
        text: 'Coba gunakan place-items: center pada CSS Grid.',
        createdAt: '1 jam lalu',
      },
    ],
  },
  {
    id: 'post-2',
    author: 'Dev_Mia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content:
      'Cara paling bersih untuk fetch API di React adalah menggunakan AbortController agar request dapat dibatalkan ketika component unmount.',
    createdAt: '5 jam yang lalu',
    likesCount: 890,
    comments: [],
  },
  {
    id: 'post-3',
    author: 'Master_Coda',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    content:
      'Banyak pemula langsung terjun membuat project tanpa membaca panduan dasar. Luangkan waktu 15 menit membaca dokumentasi resmi untuk memahami konsepnya.',
    createdAt: '10 jam yang lalu',
    likesCount: 2100,
    comments: [],
  },
];

export default function CommunityPostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors: c } = useTheme();

  const demoPost = useMemo(
    () => DEMO_POSTS.find((item) => item.id === id) ?? DEMO_POSTS[0],
    [id],
  );

  const { isConfigured, isLoading: isPostLoading, post: remotePost, reload: reloadPost } =
    useCommunityPost(id);
  const {
    addComment,
    comments: remoteComments,
    isLoading: isCommentsLoading,
  } = usePostComments(id);

  const authUser = useAuthStore((state) => state.user);

  // Like optimistis di atas nilai server.
  const [likeState, setLikeState] = useState<{ delta: number; liked: boolean } | null>(null);
  const isLiked = likeState ? likeState.liked : (remotePost?.likedByMe ?? false);
  const likesCount = (remotePost?.likesCount ?? demoPost.likesCount) + (likeState?.delta ?? 0);

  // Balasan yang sedang ditanggapi → komentar baru menjadi balasan bersarang.
  const [replyTarget, setReplyTarget] = useState<{ id: string; username: string } | null>(null);
  const [isSendingComment, setIsSendingComment] = useState(false);

  // Balasan dikelompokkan satu tingkat di bawah komentar induknya.
  const displayComments: DisplayComment[] = useMemo(() => {
    if (!isConfigured) {
      return demoPost.comments.map((comment) => ({
        createdAt: comment.createdAt,
        id: comment.id,
        media: null,
        parentCommentId: null,
        replies: [],
        text: comment.text,
        user: comment.user,
      }));
    }

    const nodes = new Map<string, DisplayComment>();
    remoteComments.forEach((comment) => {
      nodes.set(comment.id, {
        createdAt: relativeTime(comment.createdAt),
        id: comment.id,
        media: comment.media,
        parentCommentId: comment.parentCommentId,
        replies: [],
        text: comment.content,
        user: comment.author.username,
      });
    });

    const roots: DisplayComment[] = [];
    nodes.forEach((node) => {
      const parent = node.parentCommentId ? nodes.get(node.parentCommentId) : undefined;
      if (parent) parent.replies.push(node);
      else roots.push(node);
    });

    return roots;
  }, [demoPost.comments, isConfigured, remoteComments]);

  const author = remotePost?.author.username ?? demoPost.author;
  const avatar = remotePost?.author.avatarUrl ?? demoPost.avatar;
  const content = remotePost?.content ?? demoPost.content;
  const createdAt = remotePost ? relativeTime(remotePost.createdAt) : demoPost.createdAt;

  const toggleLike = () => {
    if (isConfigured && !authUser) {
      Alert.alert('Login dulu', 'Kamu harus login untuk menyukai post.');
      return;
    }

    const nextLiked = !isLiked;
    setLikeState({ delta: nextLiked ? 1 : -1, liked: nextLiked });

    if (isConfigured && authUser && remotePost) {
      void setPostLike(remotePost.id, authUser.id, nextLiked).then((result) => {
        if (!result.error) void reloadPost();
      });
    }
  };

  /** Kirim komentar/balasan, termasuk lampiran foto/video bila ada. */
  const handleSendComment = async (
    text: string,
    pending: PendingMedia | null,
  ): Promise<boolean> => {
    if (!isConfigured) {
      Alert.alert(
        'Supabase belum dikonfigurasi',
        'Isi .env.local dengan URL dan key Supabase lalu restart Expo. Lihat supabase/README.md.',
      );
      return false;
    }
    if (!authUser) {
      Alert.alert('Login dulu', 'Kamu harus login untuk berkomentar.', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/(auth)/login') },
      ]);
      return false;
    }

    setIsSendingComment(true);

    let media: CommunityMedia | null = null;
    if (pending) {
      const uploaded = await uploadCommunityMedia({
        fileName: pending.fileName,
        sizeBytes: pending.sizeBytes,
        type: pending.type,
        uri: pending.uri,
        userId: authUser.id,
      });

      if (uploaded.error) {
        setIsSendingComment(false);
        Alert.alert('Gagal mengunggah media', uploaded.error);
        return false;
      }
      media = { type: pending.type, url: uploaded.data };
    }

    const error = await addComment({
      content: text,
      media,
      parentCommentId: replyTarget?.id ?? null,
    });
    setIsSendingComment(false);

    if (error) {
      Alert.alert('Gagal mengirim balasan', error);
      return false;
    }

    setReplyTarget(null);
    return true;
  };

  /** Satu komentar + balasan bersarangnya (satu tingkat). */
  const renderComment = (comment: DisplayComment, isReply = false) => (
    <View key={comment.id} style={{ marginBottom: spacing[3] }}>
      <View
        style={{
          backgroundColor: isReply ? c.surfaceContainerLowest : c.surfaceContainerLow,
          borderColor: c.outlineVariant,
          borderLeftWidth: isReply ? 2 : 0,
          borderRadius: radius.lg,
          padding: spacing[4],
        }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <AppText color={c.text} style={{ fontFamily: typography.family.sansBold }}>
            {comment.user}
          </AppText>
          <AppText color={c.outline} style={{ fontSize: 11 }}>
            {comment.createdAt}
          </AppText>
        </View>

        <AppText color={c.onSurfaceVariant} style={{ lineHeight: 20, marginTop: spacing[2] }}>
          {comment.text}
        </AppText>

        {comment.media ? <CommunityMediaView height={150} media={comment.media} /> : null}

        <Pressable
          accessibilityLabel={`Balas komentar ${comment.user}`}
          accessibilityRole="button"
          hitSlop={6}
          onPress={() => setReplyTarget({ id: comment.id, username: comment.user })}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: spacing[1],
            marginTop: spacing[3],
          }}>
          <Reply color={c.outline} size={16} />
          <AppText color={c.onSurfaceVariant} style={{ fontSize: 13 }}>
            Balas
          </AppText>
        </Pressable>
      </View>

      {comment.replies.length > 0 ? (
        <View style={{ marginLeft: spacing[5], marginTop: spacing[2] }}>
          {comment.replies.map((reply) => renderComment(reply, true))}
        </View>
      ) : null}
    </View>
  );

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: c.background }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing[5], paddingBottom: 190 }}>
          <Pressable
            accessibilityLabel="Kembali"
            accessibilityRole="button"
            onPress={() => router.back()}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: spacing[1],
              marginBottom: spacing[5],
            }}>
            <ArrowLeft color={c.primary} size={18} />
            <AppText color={c.primary} style={{ fontFamily: typography.family.sansBold }}>
              Community
            </AppText>
          </Pressable>

          <View
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderColor: c.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              padding: spacing[5],
            }}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
              <Image
                source={{ uri: avatar ?? FALLBACK_AVATAR }}
                style={{ borderRadius: radius.full, height: 44, width: 44 }}
              />
              <View>
                <AppText
                  color={c.text}
                  style={{ fontFamily: typography.family.sansBold, fontSize: 16 }}>
                  {author}
                </AppText>
                <AppText color={c.onSurfaceVariant} style={{ fontSize: 12, marginTop: 2 }}>
                  {createdAt}
                </AppText>
              </View>
            </View>

            {isConfigured && isPostLoading ? (
              <ActivityIndicator color={c.primary} style={{ marginTop: spacing[5] }} />
            ) : (
              <AppText
                color={c.text}
                style={{ fontSize: 16, lineHeight: 25, marginTop: spacing[5] }}>
                {content}
              </AppText>
            )}

            {remotePost?.media ? (
              <CommunityMediaView height={220} media={remotePost.media} />
            ) : null}

            <View
              style={{
                alignItems: 'center',
                borderTopColor: c.outlineVariant,
                borderTopWidth: 1,
                flexDirection: 'row',
                gap: spacing[6],
                marginTop: spacing[5],
                paddingTop: spacing[4],
              }}>
              <Pressable
                accessibilityLabel="Suka"
                accessibilityRole="button"
                onPress={toggleLike}
                style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
                <Heart
                  color={isLiked ? '#dc2626' : c.outline}
                  fill={isLiked ? '#dc2626' : 'transparent'}
                  size={19}
                />
                <AppText color={isLiked ? '#dc2626' : c.onSurfaceVariant}>{likesCount}</AppText>
              </Pressable>

              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
                <MessageCircle color={c.outline} size={19} />
                <AppText color={c.onSurfaceVariant}>{displayComments.length}</AppText>
              </View>

              <Pressable
                accessibilityLabel="Bagikan"
                accessibilityRole="button"
                onPress={() => Share.share({ message: content })}>
                <Share2 color={c.outline} size={19} />
              </Pressable>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: spacing[3],
              marginTop: spacing[6],
            }}>
            <AppText
              color={c.text}
              style={{ fontFamily: typography.family.sansBold, fontSize: 20 }}>
              Komentar
            </AppText>
            {isConfigured ? (
              <AppText
                color={c.onSurfaceVariant}
                style={{ fontFamily: typography.family.mono, fontSize: 11 }}>
                realtime
              </AppText>
            ) : null}
          </View>

          {isConfigured && isCommentsLoading ? (
            <ActivityIndicator color={c.primary} />
          ) : null}

          {displayComments.map((comment) => renderComment(comment))}
        </ScrollView>

        <View
          style={{
            backgroundColor: c.background,
            borderTopColor: c.outlineVariant,
            borderTopWidth: 1,
            bottom: 0,
            left: 0,
            padding: spacing[4],
            position: 'absolute',
            right: 0,
          }}>
          <MessageComposer
            isSending={isSendingComment}
            onSend={handleSendComment}
            placeholder="Tulis komentar…"
            replyToLabel={replyTarget ? `Membalas @${replyTarget.username}` : null}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
