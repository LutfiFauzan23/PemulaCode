import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, Flame, Lightbulb, Trophy, Trash2 } from 'lucide-react-native';
import React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';
import { AppNotification, useNotificationsStore } from '@/stores/notifications-store';

function NotificationIcon({ type, color }: { type: AppNotification['type']; color: string }) {
  const Icon = type === 'streak' ? Flame : type === 'achievement' ? Trophy : type === 'content' ? BookOpen : Lightbulb;
  return <Icon color={color} size={21} />;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const { t } = useTranslation();
  const notifications = useNotificationsStore((state) => state.notifications);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const remove = useNotificationsStore((state) => state.remove);
  const unreadCount = notifications.filter((item) => !item.read).length;

  return <ScreenContainer padded={false} style={{ backgroundColor: c.background }}><View style={{ flex: 1, paddingHorizontal: spacing[5], paddingTop: spacing[4] }}>
    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[5] }}><Pressable accessibilityLabel={t('back')} onPress={() => router.back()} style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2], paddingVertical: spacing[2] }}><ArrowLeft color={c.text} size={22} /><AppText color={c.text}>{t('back')}</AppText></Pressable><AppText color={c.primary} style={{ fontFamily: typography.family.sansBold, fontSize: 14 }} onPress={markAllAsRead}>{unreadCount > 0 ? t('markAllNotificationsRead') : ''}</AppText></View>
    <AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 26, marginBottom: spacing[4] }}>{t('notificationHistory')}</AppText>
    <FlatList data={notifications} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 100, flexGrow: notifications.length === 0 ? 1 : undefined }} renderItem={({ item }) => <Pressable onPress={() => markAsRead(item.id)} style={{ alignItems: 'center', backgroundColor: item.read ? c.surfaceContainerLowest : c.primaryFixed, borderColor: c.outlineVariant, borderRadius: radius.xl, borderWidth: 1, flexDirection: 'row', marginBottom: spacing[3], padding: spacing[4] }}><View style={{ alignItems: 'center', backgroundColor: item.read ? c.surfaceContainerHigh : c.primary, borderRadius: radius.full, height: 42, justifyContent: 'center', marginRight: spacing[3], width: 42 }}><NotificationIcon color={item.read ? c.onSurfaceVariant : '#fff'} type={item.type} /></View><View style={{ flex: 1 }}><View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}><AppText color={c.text} style={{ flex: 1, fontFamily: typography.family.sansBold, fontSize: 15 }}>{item.title}</AppText>{!item.read && <View style={{ backgroundColor: c.primary, borderRadius: radius.full, height: 8, marginLeft: spacing[2], width: 8 }} />}</View><AppText color={c.onSurfaceVariant} style={{ fontSize: 13, lineHeight: 19, marginTop: spacing[1] }}>{item.message}</AppText><View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing[2] }}><AppText color={c.outline} style={{ fontFamily: typography.family.mono, fontSize: 11 }}>{item.timestamp}</AppText><Pressable accessibilityLabel={t('deleteNotification')} hitSlop={8} onPress={() => remove(item.id)}><Trash2 color={c.outline} size={16} /></Pressable></View></View></Pressable>} ListEmptyComponent={<View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}><BellEmpty color={c.outline} /><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 18, marginTop: spacing[3] }}>{t('noNotifications')}</AppText><AppText color={c.onSurfaceVariant} style={{ marginTop: spacing[1] }}>{t('noNotificationsDesc')}</AppText></View>} />
  </View></ScreenContainer>;
}

function BellEmpty({ color }: { color: string }) { return <View style={{ alignItems: 'center', borderColor: color, borderRadius: radius.full, borderWidth: 2, height: 64, justifyContent: 'center', width: 64 }}><BookOpen color={color} size={28} /></View>; }

