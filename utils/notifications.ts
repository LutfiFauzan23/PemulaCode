import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

const DAILY_REMINDER_ID = 'daily-learning-reminder';
const REMINDER_CHANNEL_ID = 'learning-reminders';

type NotificationsModule = typeof import('expo-notifications');

let cached: NotificationsModule | null | undefined;

/**
 * `expo-notifications` cannot be imported on Android inside Expo Go. Since SDK
 * 53 the package runs `addPushTokenListener` from a side-effect module
 * (`DevicePushTokenAutoRegistration.fx`), and that throws because remote
 * notifications were removed from Expo Go.
 *
 * Expo Router eagerly evaluates every route module to build the route tree, so
 * a top-level import here would crash the whole app the moment the tabs load
 * (and surface as a confusing "route is missing the required default export"
 * warning). Loading it lazily keeps startup safe and lets the UI degrade
 * gracefully; the real APIs activate in a development/production build.
 */
function loadNotifications(): NotificationsModule | null {
  if (Platform.OS === 'web' || isRunningInExpoGo()) return null;
  if (cached !== undefined) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require('expo-notifications') as NotificationsModule;
    cached.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    cached = null;
  }

  return cached;
}

/** Whether reminders can actually be scheduled in the current runtime. */
export function areNotificationsSupported(): boolean {
  return loadNotifications() !== null;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = loadNotifications();
  if (!Notifications) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
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
  const Notifications = loadNotifications();
  if (!Notifications) return '';

  await cancelAllReminders();

  return Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Waktu belajar',
      body: 'Luangkan waktu sebentar untuk melanjutkan belajar coding.',
      sound: 'default',
      ...(Platform.OS === 'android' ? { channelId: REMINDER_CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllReminders(): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
}
