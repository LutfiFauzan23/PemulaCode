import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Brain,
  Database,
  ImagePlus,
  MessageSquare,
  MoreHorizontal,
  Palette,
  Pencil,
  Reply,
  Search,
  Share2,
  Terminal,
  ThumbsUp,
  X,
} from 'lucide-react-native';

import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  TextInput,
  View,
} from 'react-native';

import { CommunityMediaView } from '@/components/community/CommunityMediaView';
import { MessageComposer, type PendingMedia } from '@/components/community/MessageComposer';
import { PendingMediaPreview } from '@/components/community/PendingMediaPreview';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useCommunityPosts } from '@/hooks/use-community-posts';
import { useMediaPicker } from '@/hooks/use-media-picker';
import {
  createComment,
  createPost,
  setPostLike,
  uploadCommunityMedia,
} from '@/services/communityService';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslation } from '@/translations';
import type { CommunityMedia } from '@/types/community';
import { relativeTime } from '@/utils/relative-time';

import { TAB_BAR_CLEARANCE } from './_layout';

interface PostData {
  accentColor: string;
  avatar: string;
  category: string;
  code?: string;
  content?: string;
  id: string;

  initialComments: number;
  initialLikes: number;

  liked?: boolean;
  media?: CommunityMedia | null;
  time: string;
  title: string;
  username: string;
}

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

/** Topik populer di strip chip; satu-satunya sumber kebenaran untuk chip topik. */
const TRENDING_TOPICS = [
  { icon: Terminal, label: '#ReactJS', value: 'ReactJS' },
  { icon: Palette, label: '#TailwindCSS', value: 'TailwindCSS' },
  { icon: Database, label: '#SQL_Hacks', value: 'SQL_Hacks' },
  { icon: Brain, label: '#LogicHelp', value: 'LogicHelp' },
] as const;

const INITIAL_POSTS: PostData[] = [
  {
    id: 'post-1',
    username: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    time: '2j yang lalu',
    category: 'JavaScript',
    title: 'Bagaimana cara terbaik melakukan centering div dengan CSS Grid?',
    content:
      'Saya sedang mencoba merapikan tata letak elemen HTML. Apakah ada tips praktis untuk centering elemen secara vertikal dan horizontal?',
    initialLikes: 124,
    initialComments: 42,
    accentColor: '#9b4500',
  },
  {
    id: 'post-2',
    username: 'Dev_Mia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    time: '5j yang lalu',
    category: 'Show & Tell',
    title: 'Cara paling bersih untuk fetch API di React 18 🚀',
    code: `const [data, setData] = useState(null);

useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(setData);

  return () => controller.abort();
}, [url]);`,
    initialLikes: 890,
    initialComments: 12,
    accentColor: '#4648d4',
  },
  {
    id: 'post-3',
    username: 'Master_Coda',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    time: '10j yang lalu',
    category: 'Karir',
    title: 'Jangan abaikan membaca dokumentasi resmi!',
    content:
      'Banyak pemula langsung terjun membuat project tanpa membaca panduan dasar. Luangkan waktu 15 menit membaca dokumentasi resmi untuk memahami konsepnya.',
    initialLikes: 2100,
    initialComments: 156,
    accentColor: '#00629d',
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const { colors: c, mode } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTopic, setActiveTopic] = useState('ReactJS');

  // Interactive state for likes
  const authUser = useAuthStore((state) => state.user);
  const {
    isConfigured,
    isLoading: isFeedLoading,
    isLive,
    posts: serverPosts,
    reload: reloadPosts,
  } = useCommunityPosts();

  // Perubahan like optimistis di atas nilai dari server.
  const [likeOverrides, setLikeOverrides] = useState<
    Record<string, { delta: number; liked: boolean }>
  >({});

  // Modals state
  const [, setSelectedPostId] = useState<string | null>(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  // Lampiran foto/video untuk form post panjang.
  const createMedia = useMediaPicker();

  // Pesan yang sedang dibalas (null = tidak ada).
  const [replyingTo, setReplyingTo] = useState<PostData | null>(null);
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Saat Supabase belum dikonfigurasi, tampilkan data demo.
  const allPosts: PostData[] = React.useMemo(() => {
    if (!isConfigured) return INITIAL_POSTS;

    return serverPosts.map((post) => ({
      accentColor: post.accentColor,
      avatar: post.author.avatarUrl ?? FALLBACK_AVATAR,
      category: post.category,
      code: post.code ?? undefined,
      content: post.content ?? undefined,
      id: post.id,
      initialComments: post.commentsCount,
      initialLikes: post.likesCount,
      liked: post.likedByMe,
      media: post.media,
      time: relativeTime(post.createdAt),
      title: post.title,
      username: post.author.username,
    }));
  }, [isConfigured, serverPosts]);

  // Kolom pencarian benar-benar menyaring feed: judul, isi, penulis, topik.
  const feedPosts = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allPosts;
    return allPosts.filter((post) =>
      [post.title, post.content ?? '', post.username, post.category].some((field) =>
        field.toLowerCase().includes(query),
      ),
    );
  }, [allPosts, searchQuery]);

  const toggleLike = (post: PostData) => {
    const override = likeOverrides[post.id];
    const currentlyLiked = override ? override.liked : !!post.liked;
    const nextLiked = !currentlyLiked;

    setLikeOverrides((prev) => ({
      ...prev,
      [post.id]: { delta: nextLiked ? 1 : -1, liked: nextLiked },
    }));

    if (isConfigured && authUser) {
      void setPostLike(post.id, authUser.id, nextLiked);
    }
  };

  /**
   * Pastikan user siap menulis. Mengembalikan `false` sekaligus menampilkan
   * alasan bila belum login atau Supabase belum dikonfigurasi.
   */
  const ensureCanWrite = (action: string): boolean => {
    if (!isConfigured) {
      Alert.alert(
        'Supabase belum dikonfigurasi',
        'Isi .env.local dengan URL dan key Supabase lalu restart Expo. Lihat supabase/README.md.'
      );
      return false;
    }
    if (!authUser) {
      Alert.alert('Login dulu', `Kamu harus login untuk ${action}.`, [
        { text: 'Batal', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/(auth)/login') },
      ]);
      return false;
    }
    return true;
  };

  /** Unggah lampiran (bila ada) dan kembalikan media yang siap disimpan. */
  const uploadMediaIfAny = async (
    media: PendingMedia | null
  ): Promise<{ error: string | null; media: CommunityMedia | null }> => {
    if (!media) return { error: null, media: null };
    if (!authUser) return { error: 'Login dulu untuk mengirim media.', media: null };

    const { data, error } = await uploadCommunityMedia({
      fileName: media.fileName,
      sizeBytes: media.sizeBytes,
      type: media.type,
      uri: media.uri,
      userId: authUser.id,
    });

    if (error) return { error, media: null };
    return { error: null, media: { type: media.type, url: data } };
  };

  const handlePublish = async () => {
    const title = newPostTitle.trim();
    if (!title) {
      Alert.alert('Perhatian', 'Judul post tidak boleh kosong.');
      return;
    }
    if (!ensureCanWrite('membuat post') || !authUser) return;

    const uploaded = await uploadMediaIfAny(createMedia.media);
    if (uploaded.error) {
      Alert.alert('Gagal mengunggah media', uploaded.error);
      return;
    }

    const { error } = await createPost(
      { category: activeTopic, content: newPostContent, media: uploaded.media, title },
      authUser.id
    );

    if (error) {
      Alert.alert('Gagal mempublikasikan', error);
      return;
    }

    setIsCreatePostModalOpen(false);
    setNewPostTitle('');
    setNewPostContent('');
    createMedia.clear();
    void reloadPosts();
  };

  /** Balas sebuah pesan (tersimpan sebagai komentar yang terlihat semua orang). */
  const handleSendReply = async (
    text: string,
    pending: PendingMedia | null
  ): Promise<boolean> => {
    if (!replyingTo) return false;
    if (!ensureCanWrite('membalas pesan') || !authUser) return false;

    setIsSendingReply(true);
    const uploaded = await uploadMediaIfAny(pending);
    if (uploaded.error) {
      setIsSendingReply(false);
      Alert.alert('Gagal mengunggah media', uploaded.error);
      return false;
    }

    const { error } = await createComment(replyingTo.id, authUser.id, {
      content: text || 'Mengirim lampiran',
      media: uploaded.media,
    });
    setIsSendingReply(false);

    if (error) {
      Alert.alert('Gagal mengirim balasan', error);
      return false;
    }

    setReplyingTo(null);
    void reloadPosts();
    return true;
  };

  const handleOpenOptions = (postId: string) => {
    setSelectedPostId(postId);
    setIsOptionsModalOpen(true);
  };

  const formatLikes = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  /** Bagikan judul post lewat share sheet bawaan sistem. */
  const handleSharePost = async (title: string) => {
    try {
      await Share.share({ message: title });
    } catch {
      // Pengguna menutup share sheet / platform tanpa share — tidak perlu aksi.
    }
  };

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: c.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: TAB_BAR_CLEARANCE,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}>
            
            {/* 1. TOP APP BAR */}
            <View
              style={{
                alignItems: 'center',
                backgroundColor: c.background,
                flexDirection: 'row',
                height: 60,
                justifyContent: 'space-between',
                paddingHorizontal: spacing[5],
                paddingTop: spacing[2],
              }}>
              {/* Left: Avatar + Title */}
              <Pressable
                accessibilityLabel="Profile Avatar"
                accessibilityRole="button"
                style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
                <View
                  style={{
                    borderColor: c.primary,
                    borderRadius: radius.full,
                    borderWidth: 2,
                    height: 40,
                    overflow: 'hidden',
                    width: 40,
                  }}>
                  <Image
                    source={require('@/assets/images/welcome-hero.png')}
                    style={{ height: '100%', width: '100%' }}
                    resizeMode="cover"
                  />
                </View>
                <AppText
                  color={c.primary}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 20,
                    lineHeight: 28,
                  }}>
                  Pemula Code
                </AppText>
              </Pressable>

              {/* Right: Bell Notification */}
              <Pressable
                accessibilityLabel="Notifications"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => router.push('/notifications')}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor: pressed
                    ? c.surfaceContainerHigh
                    : c.surfaceContainerLow,
                  borderRadius: radius.full,
                  height: 40,
                  justifyContent: 'center',
                  width: 40,
                })}>
                <Bell color={c.text} size={20} />
              </Pressable>
            </View>

            {/* 2. SEARCH DISCUSSIONS */}
            <View style={{ marginTop: spacing[4], paddingHorizontal: spacing[5] }}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.surfaceContainerLow,
                  borderColor: isSearchFocused
                    ? c.primary
                    : c.outlineVariant,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: spacing[3],
                  minHeight: 52,
                  paddingHorizontal: spacing[4],
                }}>
                <Search
                  color={isSearchFocused ? c.primary : c.outline}
                  size={20}
                />
                <TextInput
                  accessibilityLabel="Search discussions"
                  onBlur={() => setIsSearchFocused(false)}
                  onChangeText={setSearchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={t('searchDiscussions')}
                  placeholderTextColor={c.outline}
                  style={{
                    color: c.text,
                    flex: 1,
                    fontFamily: typography.family.sans,
                    fontSize: 15,
                    minHeight: 48,
                    paddingVertical: 0,
                  }}
                  value={searchQuery}
                />
              </View>
            </View>

            {/* 3. TRENDING TOPICS */}
            <View style={{ marginTop: spacing[5] }}>
              <View
                style={{
                  marginBottom: spacing[3],
                  paddingHorizontal: spacing[5],
                }}>
                <AppText
                  color={c.text}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 18,
                    lineHeight: 26,
                  }}>
                  {t('trendingTopics')}
                </AppText>
              </View>

              {/* Topic Chips Horizontal Scroll */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing[3], paddingHorizontal: spacing[5] }}>
                {TRENDING_TOPICS.map((topic) => {
                  const isActive = activeTopic === topic.value;
                  return (
                    <Pressable
                      key={topic.value}
                      accessibilityLabel={`${topic.label} Topic`}
                      accessibilityRole="button"
                      onPress={() => setActiveTopic(topic.value)}
                      style={({ pressed }) => ({
                        alignItems: 'center',
                        backgroundColor: isActive
                          ? c.primary
                          : c.surfaceContainerLow,
                        borderColor: isActive ? c.primary : c.outlineVariant,
                        borderRadius: radius.full,
                        borderWidth: 1,
                        flexDirection: 'row',
                        gap: spacing[2],
                        opacity: pressed ? 0.85 : 1,
                        paddingHorizontal: spacing[4],
                        paddingVertical: spacing[2],
                      })}>
                      <topic.icon
                        color={isActive ? '#ffffff' : c.onSurfaceVariant}
                        size={16}
                      />
                      <AppText
                        color={isActive ? '#ffffff' : c.onSurfaceVariant}
                        style={{
                          fontFamily: typography.family.mono,
                          fontSize: 13,
                          fontWeight: isActive ? 'bold' : '500',
                        }}>
                        {topic.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* 4. COMMUNITY FEED */}
            <View
              style={{
                gap: spacing[5],
                marginTop: spacing[5],
                paddingHorizontal: spacing[5],
              }}>
              {/* Status koneksi realtime */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: spacing[2],
                }}>
                <View
                  style={{
                    backgroundColor: !isConfigured
                      ? c.outline
                      : isLive
                        ? '#16a34a'
                        : '#f59e0b',
                    borderRadius: radius.full,
                    height: 8,
                    width: 8,
                  }}
                />
                <AppText
                  color={c.onSurfaceVariant}
                  style={{ fontFamily: typography.family.mono, fontSize: 12 }}>
                  {!isConfigured
                    ? 'Mode demo - Supabase belum dikonfigurasi'
                    : isFeedLoading
                      ? 'Memuat feed...'
                      : isLive
                        ? 'Realtime aktif'
                        : 'Menghubungkan...'}
                </AppText>
              </View>

              {/* Tidak ada hasil untuk kata kunci pencarian */}
              {feedPosts.length === 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: c.surfaceContainerLowest,
                    borderColor: c.outlineVariant,
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    padding: spacing[6],
                  }}>
                  <Search color={c.outline} size={28} />
                  <AppText
                    color={c.onSurfaceVariant}
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      marginTop: spacing[3],
                      textAlign: 'center',
                    }}>
                    {t('noMatchingDiscussions')}
                  </AppText>
                </View>
              ) : null}

              {feedPosts.map((post) => {
                const override = likeOverrides[post.id];
                const isLiked = override ? override.liked : !!post.liked;
                const currentLikes = post.initialLikes + (override?.delta ?? 0);

                return (
                  <Pressable
                    key={post.id}
                    accessibilityRole="button"
                    onPress={() => router.push(`/community/${post.id}` as never)}
                    style={{
                      backgroundColor: c.surfaceContainerLowest,
                      borderColor: c.outlineVariant,
                      borderLeftColor: post.accentColor,
                      borderLeftWidth: 4,
                      borderRadius: radius['2xl'],
                      borderWidth: 1,
                      elevation: 4,
                      padding: spacing[5],
                      shadowColor: c.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.08,
                      shadowRadius: 12,
                    }}>
                    {/* Post Header */}
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: spacing[3],
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          gap: spacing[3],
                        }}>
                        <Image
                          source={{ uri: post.avatar }}
                          style={{ borderRadius: radius.full, height: 38, width: 38 }}
                          resizeMode="cover"
                        />
                        <View>
                          <AppText
                            color={c.text}
                            style={{
                              fontFamily: typography.family.sansBold,
                              fontSize: 15,
                              lineHeight: 20,
                            }}>
                            {post.username}
                          </AppText>
                          <AppText
                            color={c.onSurfaceVariant}
                            style={{
                              fontFamily: typography.family.mono,
                              fontSize: 12,
                              lineHeight: 16,
                            }}>
                            {post.time} {t('inCategory')} {post.category}
                          </AppText>
                        </View>
                      </View>

                      {/* More Options Button */}
                      <Pressable
                        accessibilityLabel="Post options"
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={() => handleOpenOptions(post.id)}>
                        <MoreHorizontal color={c.outline} size={20} />
                      </Pressable>
                    </View>

                    {/* Post Title */}
                    <AppText
                      color={c.text}
                      style={{
                        fontFamily: typography.family.sansBold,
                        fontSize: 18,
                        lineHeight: 25,
                      }}>
                      {post.title}
                    </AppText>

                    {/* Post Body Content */}
                    {post.content ? (
                      <AppText
                        color={c.onSurfaceVariant}
                        style={{
                          fontSize: 14,
                          lineHeight: 21,
                          marginTop: spacing[2],
                        }}>
                        {post.content}
                      </AppText>
                    ) : null}

                    {/* Foto / video lampiran */}
                    {post.media ? <CommunityMediaView media={post.media} /> : null}

                    {/* Post Code Block */}
                    {post.code ? (
                      <View
                        style={{
                          backgroundColor: '#1e293b',
                          borderRadius: radius.xl,
                          marginTop: spacing[3],
                          overflow: 'hidden',
                          padding: spacing[4],
                        }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <AppText
                            color="#f8fafc"
                            style={{
                              fontFamily: typography.family.mono,
                              fontSize: 13,
                              lineHeight: 20,
                            }}>
                            {post.code}
                          </AppText>
                        </ScrollView>
                      </View>
                    ) : null}

                    {/* Interaction Buttons Row */}
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: spacing[4],
                        paddingTop: spacing[3],
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          gap: spacing[5],
                        }}>
                        {/* Like Button */}
                        <Pressable
                          accessibilityLabel="Like post"
                          accessibilityRole="button"
                          hitSlop={8}
                          onPress={() => toggleLike(post)}
                          style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: spacing[1],
                          }}>
                          {isLiked ? (
                            <ThumbsUp
                              color={c.primary}
                              size={18}
                              fill={c.primary}
                            />
                          ) : (
                            <ThumbsUp color={c.outline} size={18} />
                          )}
                          <AppText
                            color={
                              isLiked
                                ? c.primary
                                : c.onSurfaceVariant
                            }
                            style={{
                              fontFamily: typography.family.mono,
                              fontSize: 13,
                              fontWeight: isLiked ? 'bold' : 'normal',
                            }}>
                            {formatLikes(currentLikes)}
                          </AppText>
                        </Pressable>

                        {/* Reply Button → membalas pesan ini tanpa keluar dari feed */}
                        <Pressable
                          accessibilityLabel={t('reply')}
                          accessibilityRole="button"
                          hitSlop={8}
                          onPress={() => setReplyingTo(post)}
                          style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: spacing[1],
                          }}>
                          <Reply color={c.outline} size={18} />
                          <AppText
                            color={c.onSurfaceVariant}
                            style={{
                              fontFamily: typography.family.mono,
                              fontSize: 13,
                            }}>
                            {t('reply')}
                          </AppText>
                        </Pressable>

                        {/* Comment Button */}
                        <Pressable
                          accessibilityLabel="Comment on post"
                          accessibilityRole="button"
                          hitSlop={8}
                          onPress={() => router.push(`/community/${post.id}` as never)}
                          style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: spacing[1],
                          }}>
                          <MessageSquare color={c.outline} size={18} />
                          <AppText
                            color={c.onSurfaceVariant}
                            style={{
                              fontFamily: typography.family.mono,
                              fontSize: 13,
                            }}>
                            {post.initialComments}
                          </AppText>
                        </Pressable>

                        {/* Share Button */}
                        <Pressable
                          accessibilityLabel="Share post"
                          accessibilityRole="button"
                          hitSlop={8}
                          onPress={() => void handleSharePost(post.title)}>
                          <Share2 color={c.outline} size={18} />
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* 5. CREATE POST FAB */}
          <Pressable
            accessibilityLabel="Create Post"
            accessibilityRole="button"
            onPress={() => setIsCreatePostModalOpen(true)}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed
                ? c.primaryPressed
                : c.primary,
              borderRadius: radius.xl,
              // 12 (offset navbar) + 68 (tinggi navbar) + 12 (jarak) —
              // melayang tepat di atas tab bar.
              bottom: 92,
              elevation: 8,
              height: 56,
              justifyContent: 'center',
              position: 'absolute',
              right: 20,
              shadowColor: c.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              width: 56,
            })}>
            <Pencil color="#ffffff" size={24} />
          </Pressable>
        </View>

      {/* OPTIONS MODAL */}
      <Modal
        animationType="fade"
        transparent
        visible={isOptionsModalOpen}
        onRequestClose={() => setIsOptionsModalOpen(false)}>
        <Pressable
          onPress={() => setIsOptionsModalOpen(false)}
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing[5],
          }}>
          <Pressable
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderRadius: radius['2xl'],
              padding: spacing[5],
              width: '100%',
              maxWidth: 320,
              gap: spacing[3],
            }}>
            <AppText
              color={c.text}
              style={{ fontFamily: typography.family.sansBold, fontSize: 18, textAlign: 'center' }}>
              {t('postOptions')}
            </AppText>
            <Pressable
              onPress={() => setIsOptionsModalOpen(false)}
              style={{
                backgroundColor: c.surfaceContainerLow,
                borderRadius: radius.lg,
                paddingVertical: spacing[3],
                alignItems: 'center',
              }}>
              <AppText color={c.primary} style={{ fontSize: 15, fontWeight: '600' }}>
                {t('savePost')}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setIsOptionsModalOpen(false)}
              style={{
                backgroundColor: c.surfaceContainerLow,
                borderRadius: radius.lg,
                paddingVertical: spacing[3],
                alignItems: 'center',
              }}>
              <AppText color={c.danger} style={{ fontSize: 15, fontWeight: '600' }}>
                {t('reportPost')}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setIsOptionsModalOpen(false)}
              style={{
                paddingVertical: spacing[2],
                alignItems: 'center',
              }}>
              <AppText color={c.onSurfaceVariant} style={{ fontSize: 14 }}>
                {t('cancel')}
              </AppText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* CREATE POST MODAL */}
      <Modal
        animationType="slide"
        transparent
        visible={isCreatePostModalOpen}
        onRequestClose={() => setIsCreatePostModalOpen(false)}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderTopLeftRadius: radius['2xl'],
              borderTopRightRadius: radius['2xl'],
              padding: spacing[6],
              gap: spacing[4],
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <AppText
                color={c.text}
                style={{ fontFamily: typography.family.sansBold, fontSize: 20 }}>
                {t('createNewPost')}
              </AppText>
              <Pressable hitSlop={8} onPress={() => setIsCreatePostModalOpen(false)}>
                <X color={c.outline} size={22} />
              </Pressable>
            </View>

            <TextInput
              onChangeText={setNewPostTitle}
              placeholder={t('postTitle')}
              placeholderTextColor={c.outline}
              style={{
                borderColor: c.outlineVariant,
                borderRadius: radius.lg,
                borderWidth: 1,
                color: c.text,
                fontSize: 16,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
              }}
              value={newPostTitle}
            />

            <TextInput
              multiline
              onChangeText={setNewPostContent}
              placeholder={t('whatToDiscuss')}
              placeholderTextColor={c.outline}
              style={{
                borderColor: c.outlineVariant,
                borderRadius: radius.lg,
                borderWidth: 1,
                color: c.text,
                fontSize: 15,
                minHeight: 100,
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
                textAlignVertical: 'top',
              }}
              value={newPostContent}
            />

            {createMedia.media ? (
              <PendingMediaPreview media={createMedia.media} onRemove={createMedia.clear} />
            ) : null}

            <Pressable
              accessibilityLabel="Lampirkan foto atau video"
              accessibilityRole="button"
              onPress={createMedia.choose}
              style={{
                alignItems: 'center',
                borderColor: c.outlineVariant,
                borderRadius: radius.lg,
                borderWidth: 1,
                flexDirection: 'row',
                gap: spacing[2],
                justifyContent: 'center',
                paddingVertical: spacing[3],
              }}>
              <ImagePlus color={c.primary} size={18} />
              <AppText color={c.primary} style={{ fontSize: 15, fontWeight: '600' }}>
                {t('addMedia')}
              </AppText>
            </Pressable>

            <Pressable
              onPress={handlePublish}
              style={{
                backgroundColor: c.primary,
                borderRadius: radius.xl,
                paddingVertical: spacing[3],
                alignItems: 'center',
              }}>
              <AppText color="#ffffff" style={{ fontFamily: typography.family.sansBold, fontSize: 16 }}>
                {t('publish')}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* REPLY MODAL: balas pesan dari feed, bisa sekalian lampirkan media */}
      <Modal
        animationType="slide"
        transparent
        visible={replyingTo !== null}
        onRequestClose={() => setReplyingTo(null)}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderTopLeftRadius: radius['2xl'],
              borderTopRightRadius: radius['2xl'],
              gap: spacing[4],
              padding: spacing[6],
            }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText
                color={c.text}
                style={{ fontFamily: typography.family.sansBold, fontSize: 20 }}>
                {t('replyMessage')}
              </AppText>
              <Pressable accessibilityLabel="Tutup" hitSlop={8} onPress={() => setReplyingTo(null)}>
                <X color={c.outline} size={22} />
              </Pressable>
            </View>

            {replyingTo ? (
              <View
                style={{
                  backgroundColor: c.surfaceContainerLow,
                  borderRadius: radius.lg,
                  padding: spacing[4],
                }}>
                <AppText color={c.onSurfaceVariant} numberOfLines={2} style={{ fontSize: 13 }}>
                  {replyingTo.content?.trim() || replyingTo.title}
                </AppText>
              </View>
            ) : null}

            <MessageComposer
              isSending={isSendingReply}
              onSend={handleSendReply}
              placeholder={t('writeMessage')}
              replyToLabel={replyingTo ? `Membalas @${replyingTo.username}` : null}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
