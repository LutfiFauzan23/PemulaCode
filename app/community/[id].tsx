import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Send, Share2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Share, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';

type Comment = { id: string; user: string; text: string; createdAt: string };
type Post = { id: string; author: string; avatar: string; content: string; createdAt: string; likesCount: number; isLiked: boolean; comments: Comment[] };
const posts: Post[] = [
  { id: 'post-1', author: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', content: 'Saya sedang mencoba merapikan tata letak elemen HTML. Apakah ada tips praktis untuk centering elemen secara vertikal dan horizontal?', createdAt: '2 jam yang lalu', likesCount: 124, isLiked: false, comments: [{ id: 'c-1', user: 'Dev_Mia', text: 'Coba gunakan place-items: center pada CSS Grid.', createdAt: '1 jam lalu' }] },
  { id: 'post-2', author: 'Dev_Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', content: 'Cara paling bersih untuk fetch API di React adalah menggunakan AbortController agar request dapat dibatalkan ketika component unmount.', createdAt: '5 jam yang lalu', likesCount: 890, isLiked: false, comments: [] },
  { id: 'post-3', author: 'Master_Coda', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', content: 'Banyak pemula langsung terjun membuat project tanpa membaca panduan dasar. Luangkan waktu 15 menit membaca dokumentasi resmi untuk memahami konsepnya.', createdAt: '10 jam yang lalu', likesCount: 2100, isLiked: false, comments: [] },
];

export default function CommunityPostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors: c } = useTheme();
  const post = useMemo(() => posts.find((item) => item.id === id) ?? posts[0], [id]);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const addComment = () => { const text = commentText.trim(); if (!text) return; setComments((items) => [...items, { id: `comment-${Date.now()}`, user: 'Kamu', text, createdAt: 'Baru saja' }]); setCommentText(''); };
  const toggleLike = () => { setIsLiked((value) => !value); setLikesCount((value) => value + (isLiked ? -1 : 1)); };

  return <ScreenContainer padded={false} style={{ backgroundColor: c.background }}><View style={{ flex: 1 }}><ScrollView contentContainerStyle={{ padding: spacing[5], paddingBottom: 100 }}><Pressable accessibilityRole="button" accessibilityLabel="Kembali" onPress={() => router.back()} style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1], marginBottom: spacing[5] }}><ArrowLeft color={c.primary} size={18} /><AppText color={c.primary} style={{ fontFamily: typography.family.sansBold }}>Community</AppText></Pressable><View style={{ backgroundColor: c.surfaceContainerLowest, borderColor: c.outlineVariant, borderRadius: radius['2xl'], borderWidth: 1, padding: spacing[5] }}><View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}><Image source={{ uri: post.avatar }} style={{ borderRadius: radius.full, height: 44, width: 44 }} /><View><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 16 }}>{post.author}</AppText><AppText color={c.onSurfaceVariant} style={{ fontSize: 12, marginTop: 2 }}>{post.createdAt}</AppText></View></View><AppText color={c.text} style={{ fontSize: 16, lineHeight: 25, marginTop: spacing[5] }}>{post.content}</AppText><View style={{ alignItems: 'center', borderTopColor: c.outlineVariant, borderTopWidth: 1, flexDirection: 'row', gap: spacing[6], marginTop: spacing[5], paddingTop: spacing[4] }}><Pressable accessibilityRole="button" onPress={toggleLike} style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}><Heart color={isLiked ? '#dc2626' : c.outline} fill={isLiked ? '#dc2626' : 'transparent'} size={19} /><AppText color={isLiked ? '#dc2626' : c.onSurfaceVariant}>{likesCount}</AppText></Pressable><View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}><MessageCircle color={c.outline} size={19} /><AppText color={c.onSurfaceVariant}>{comments.length}</AppText></View><Pressable accessibilityRole="button" onPress={() => Share.share({ message: post.content })}><Share2 color={c.outline} size={19} /></Pressable></View></View><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 20, marginTop: spacing[6], marginBottom: spacing[3] }}>Komentar</AppText>{comments.map((comment) => <View key={comment.id} style={{ backgroundColor: c.surfaceContainerLow, borderRadius: radius.lg, marginBottom: spacing[3], padding: spacing[4] }}><View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}><AppText color={c.text} style={{ fontFamily: typography.family.sansBold }}>{comment.user}</AppText><AppText color={c.outline} style={{ fontSize: 11 }}>{comment.createdAt}</AppText></View><AppText color={c.onSurfaceVariant} style={{ lineHeight: 20, marginTop: spacing[2] }}>{comment.text}</AppText></View>)}</ScrollView><View style={{ alignItems: 'center', backgroundColor: c.surfaceContainerLowest, borderTopColor: c.outlineVariant, borderTopWidth: 1, bottom: 0, flexDirection: 'row', gap: spacing[2], padding: spacing[4], position: 'absolute', width: '100%' }}><TextInput accessibilityLabel="Tulis komentar" onChangeText={setCommentText} onSubmitEditing={addComment} placeholder="Tulis komentar..." placeholderTextColor={c.outline} style={{ backgroundColor: c.surfaceContainerLow, borderRadius: radius.full, color: c.text, flex: 1, minHeight: 44, paddingHorizontal: spacing[4] }} value={commentText} /><Pressable accessibilityRole="button" onPress={addComment} style={{ alignItems: 'center', backgroundColor: c.primary, borderRadius: radius.full, height: 44, justifyContent: 'center', width: 44 }}><Send color="#fff" size={18} /></Pressable></View></View></ScreenContainer>;
}
