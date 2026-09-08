import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Brain,
  Database,
  MessageSquare,
  MoreHorizontal,
  Palette,
  Pencil,
  Search,
  Share2,
  Terminal,
  ThumbsUp,
  X,
} from 'lucide-react-native';

import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';

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
  time: string;
  title: string;
  username: string;
}

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
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    'post-1': 124,
    'post-2': 890,
    'post-3': 2100,
  });

  // Modals state
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isCurrentlyLiked = !!prev[postId];
      const newLikedState = !isCurrentlyLiked;

      setLikeCounts((countPrev) => ({
        ...countPrev,
        [postId]: (countPrev[postId] || 0) + (newLikedState ? 1 : -1),
      }));

      return {
        ...prev,
        [postId]: newLikedState,
      };
    });
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

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: c.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 140,
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
                <Bell color={c.primary} size={20} />
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
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
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
                <Pressable hitSlop={8} onPress={() => {}}>
                  <AppText
                    color={c.primary}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 14,
                    }}>
                    {t('seeAll')}
                  </AppText>
                </Pressable>
              </View>

              {/* Topic Chips Horizontal Scroll */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: spacing[3], paddingHorizontal: spacing[5] }}>
                {/* 1. #ReactJS */}
                <Pressable
                  accessibilityLabel="#ReactJS Topic"
                  accessibilityRole="button"
                  onPress={() => setActiveTopic('ReactJS')}
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor:
                      activeTopic === 'ReactJS'
                        ? c.primary
                        : c.surfaceContainerLow,
                    borderColor:
                      activeTopic === 'ReactJS'
                        ? c.primary
                        : c.outlineVariant,
                    borderRadius: radius.full,
                    borderWidth: 1,
                    flexDirection: 'row',
                    gap: spacing[2],
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[2],
                    opacity: pressed ? 0.85 : 1,
                  })}>
                  <Terminal
                    color={
                      activeTopic === 'ReactJS' ? '#ffffff' : c.onSurfaceVariant
                    }
                    size={16}
                  />
                  <AppText
                    color={
                      activeTopic === 'ReactJS' ? '#ffffff' : c.onSurfaceVariant
                    }
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 13,
                      fontWeight: activeTopic === 'ReactJS' ? 'bold' : '500',
                    }}>
                    #ReactJS
                  </AppText>
                </Pressable>

                {/* 2. #TailwindCSS */}
                <Pressable
                  accessibilityLabel="#TailwindCSS Topic"
                  accessibilityRole="button"
                  onPress={() => setActiveTopic('TailwindCSS')}
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor:
                      activeTopic === 'TailwindCSS'
                        ? c.primary
                        : c.surfaceContainerLow,
                    borderColor:
                      activeTopic === 'TailwindCSS'
                        ? c.primary
                        : c.outlineVariant,
                    borderRadius: radius.full,
                    borderWidth: 1,
                    flexDirection: 'row',
                    gap: spacing[2],
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[2],
                    opacity: pressed ? 0.85 : 1,
                  })}>
                  <Palette
                    color={
                      activeTopic === 'TailwindCSS'
                        ? '#ffffff'
                        : c.onSurfaceVariant
                    }
                    size={16}
                  />
                  <AppText
                    color={
                      activeTopic === 'TailwindCSS'
                        ? '#ffffff'
                        : c.onSurfaceVariant
                    }
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 13,
                      fontWeight: activeTopic === 'TailwindCSS' ? 'bold' : '500',
                    }}>
                    #TailwindCSS
                  </AppText>
                </Pressable>

                {/* 3. #SQL_Hacks */}
                <Pressable
                  accessibilityLabel="#SQL_Hacks Topic"
                  accessibilityRole="button"
                  onPress={() => setActiveTopic('SQL_Hacks')}
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor:
                      activeTopic === 'SQL_Hacks'
                        ? c.primary
                        : c.surfaceContainerLow,
                    borderColor:
                      activeTopic === 'SQL_Hacks'
                        ? c.primary
                        : c.outlineVariant,
                    borderRadius: radius.full,
                    borderWidth: 1,
                    flexDirection: 'row',
                    gap: spacing[2],
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[2],
                    opacity: pressed ? 0.85 : 1,
                  })}>
                  <Database
                    color={
                      activeTopic === 'SQL_Hacks'
                        ? '#ffffff'
                        : c.onSurfaceVariant
                    }
                    size={16}
                  />
                  <AppText
                    color={
                      activeTopic === 'SQL_Hacks'
                        ? '#ffffff'
                        : c.onSurfaceVariant
                    }
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 13,
                      fontWeight: activeTopic === 'SQL_Hacks' ? 'bold' : '500',
                    }}>
                    #SQL_Hacks
                  </AppText>
                </Pressable>

                {/* 4. #LogicHelp */}
                <Pressable
                  accessibilityLabel="#LogicHelp Topic"
                  accessibilityRole="button"
                  onPress={() => setActiveTopic('LogicHelp')}
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor:
                      activeTopic === 'LogicHelp'
                        ? c.primary
                        : c.surfaceContainerLow,
                    borderColor:
                      activeTopic === 'LogicHelp'
                        ? c.primary
                        : c.outlineVariant,
                    borderRadius: radius.full,
                    borderWidth: 1,
                    flexDirection: 'row',
                    gap: spacing[2],
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[2],
                    opacity: pressed ? 0.85 : 1,
                  })}>
                  <Brain
                    color={
                      activeTopic === 'LogicHelp'
                        ? '#ffffff'
                        : c.onSurfaceVariant
                    }
                    size={16}
                  />
                  <AppText
                    color={
                      activeTopic === 'LogicHelp'
                        ? '#ffffff'
                        : c.onSurfaceVariant
                    }
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 13,
                      fontWeight: activeTopic === 'LogicHelp' ? 'bold' : '500',
                    }}>
                    #LogicHelp
                  </AppText>
                </Pressable>
              </ScrollView>
            </View>

            {/* 4. COMMUNITY FEED */}
            <View
              style={{
                gap: spacing[5],
                marginTop: spacing[5],
                paddingHorizontal: spacing[5],
              }}>
              {INITIAL_POSTS.map((post) => {
                const isLiked = !!likedPosts[post.id];
                const currentLikes = likeCounts[post.id] ?? post.initialLikes;

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
                          onPress={() => toggleLike(post.id)}
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

                        {/* Comment Button */}
                        <Pressable
                          accessibilityLabel="Comment on post"
                          accessibilityRole="button"
                          hitSlop={8}
                          onPress={() => {}}
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

                        {/* Share Button (Post 1) */}
                        {post.id === 'post-1' ? (
                          <Pressable
                            accessibilityLabel="Share post"
                            accessibilityRole="button"
                            hitSlop={8}
                            onPress={() => {}}>
                            <Share2 color={c.outline} size={18} />
                          </Pressable>
                        ) : null}
                      </View>

                      {/* Overlapping Avatar Group for Post 2 */}
                      {post.id === 'post-2' ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={{
                              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                            }}
                            style={{
                              borderColor: c.surfaceContainerLowest,
                              borderRadius: radius.full,
                              borderWidth: 2,
                              height: 24,
                              width: 24,
                            }}
                          />
                          <Image
                            source={{
                              uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                            }}
                            style={{
                              borderColor: c.surfaceContainerLowest,
                              borderRadius: radius.full,
                              borderWidth: 2,
                              height: 24,
                              marginLeft: -8,
                              width: 24,
                            }}
                          />
                        </View>
                      ) : null}
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
              bottom: 24,
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

            <Pressable
              onPress={() => {
                setIsCreatePostModalOpen(false);
                setNewPostTitle('');
                setNewPostContent('');
              }}
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
    </ScreenContainer>
  );
}
