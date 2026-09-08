import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const DAILY_REMINDER_ID = 'daily-learning-reminder';

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('learning-reminders', {
      name: 'Learning reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<string> {
  await cancelAllReminders();

  return Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Waktu belajar',
      body: 'Luangkan waktu sebentar untuk melanjutkan belajar coding.',
      sound: 'default',
      ...(Platform.OS === 'android' ? { channelId: 'learning-reminders' } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
