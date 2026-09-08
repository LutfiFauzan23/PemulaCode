import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';
import { cancelAllReminders, requestNotificationPermissions, scheduleDailyReminder } from '@/utils/notifications';

const STORAGE_KEY = 'pemulacode-notification-preferences';
type Preferences = { dailyReminder: boolean; reminderHour: number; reminderMinute: number; streakProtection: boolean; achievements: boolean; newContent: boolean };
const defaults: Preferences = { dailyReminder: false, reminderHour: 19, reminderMinute: 0, streakProtection: true, achievements: true, newContent: true };

function Toggle({ value, onPress, label }: { value: boolean; onPress: () => void; label: string }) {
  const { colors: c } = useTheme();
  return <Pressable accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: value }} onPress={onPress} style={{ backgroundColor: value ? c.primary : c.surfaceContainerHigh, borderRadius: 16, height: 32, justifyContent: 'center', padding: 3, width: 56 }}><View style={{ alignSelf: value ? 'flex-end' : 'flex-start', backgroundColor: '#fff', borderRadius: 13, height: 26, width: 26 }} /></Pressable>;
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState(defaults);

  useEffect(() => { AsyncStorage.getItem(STORAGE_KEY).then((value) => { if (value) setPreferences({ ...defaults, ...JSON.parse(value) }); }); }, []);

  const save = async (next: Preferences) => { setPreferences(next); await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const toggleDaily = async () => {
    if (preferences.dailyReminder) { await cancelAllReminders(); await save({ ...preferences, dailyReminder: false }); return; }
    const granted = await requestNotificationPermissions();
    if (!granted) { Alert.alert(t('notificationPermissionTitle'), t('notificationPermissionMessage')); return; }
    await scheduleDailyReminder(preferences.reminderHour, preferences.reminderMinute);
    await save({ ...preferences, dailyReminder: true });
  };
  const changeTime = async (delta: number) => { const hour = (preferences.reminderHour + delta + 24) % 24; if (preferences.dailyReminder) await scheduleDailyReminder(hour, preferences.reminderMinute); await save({ ...preferences, reminderHour: hour }); };
  const option = (title: string, description: string, value: boolean, onPress: () => void) => <View style={{ alignItems: 'center', backgroundColor: c.surfaceContainerLowest, borderColor: c.outlineVariant, borderRadius: radius.xl, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[3], padding: spacing[4] }}><View style={{ flex: 1, paddingRight: spacing[3] }}><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 16 }}>{title}</AppText><AppText color={c.onSurfaceVariant} style={{ fontSize: 13, lineHeight: 18, marginTop: spacing[1] }}>{description}</AppText></View><Toggle label={title} value={value} onPress={onPress} /></View>;

  return <ScreenContainer padded={false} style={{ backgroundColor: c.background }}><ScrollView contentContainerStyle={{ padding: spacing[5], paddingBottom: 120 }}><Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => router.back()} style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2], marginBottom: spacing[6] }}><ArrowLeft color={c.text} size={22} /><AppText color={c.text}>{t('back')}</AppText></Pressable><View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], marginBottom: spacing[6] }}><View style={{ alignItems: 'center', backgroundColor: c.primaryFixed, borderRadius: radius.xl, height: 48, justifyContent: 'center', width: 48 }}><Bell color={c.primary} size={24} /></View><View><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 24 }}>{t('notificationSettings')}</AppText><AppText color={c.onSurfaceVariant}>{t('manageAlerts')}</AppText></View></View>
    {option(t('dailyReminder'), t('dailyReminderDesc'), preferences.dailyReminder, toggleDaily)}
    <View style={{ alignItems: 'center', backgroundColor: preferences.dailyReminder ? c.surfaceContainerLowest : c.surfaceContainerHigh, borderColor: c.outlineVariant, borderRadius: radius.xl, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[5], opacity: preferences.dailyReminder ? 1 : 0.55, padding: spacing[4] }}><View><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 16 }}>{t('reminderTime')}</AppText><AppText color={c.onSurfaceVariant} style={{ fontSize: 13 }}>{String(preferences.reminderHour).padStart(2, '0')}:00</AppText></View><View style={{ flexDirection: 'row', gap: spacing[2] }}><Pressable disabled={!preferences.dailyReminder} onPress={() => changeTime(-1)} style={{ backgroundColor: c.primaryFixed, borderRadius: radius.full, padding: spacing[3] }}><AppText color={c.primary}>-</AppText></Pressable><Pressable disabled={!preferences.dailyReminder} onPress={() => changeTime(1)} style={{ backgroundColor: c.primaryFixed, borderRadius: radius.full, padding: spacing[3] }}><AppText color={c.primary}>+</AppText></Pressable></View></View>
    {option(t('streakProtection'), t('streakProtectionDesc'), preferences.streakProtection, () => save({ ...preferences, streakProtection: !preferences.streakProtection }))}
    {option(t('achievementsLeaderboard'), t('achievementsLeaderboardDesc'), preferences.achievements, () => save({ ...preferences, achievements: !preferences.achievements }))}
    {option(t('newContentUpdates'), t('newContentUpdatesDesc'), preferences.newContent, () => save({ ...preferences, newContent: !preferences.newContent }))}
  </ScrollView></ScreenContainer>;
}
