import {
  areNotificationsSupported,
  cancelAllReminders,
  requestNotificationPermissions,
  scheduleDailyReminder,
} from '../notifications';

// Importing expo-notifications throws on Android in Expo Go (SDK 53+), so these
// helpers must degrade to safe no-ops there instead of ever loading it.
jest.mock('expo', () => ({
  isRunningInExpoGo: () => true,
}));

describe('notification helpers in Expo Go', () => {
  test('reports notifications as unsupported', () => {
    expect(areNotificationsSupported()).toBe(false);
  });

  test('resolves permission requests to false instead of throwing', async () => {
    await expect(requestNotificationPermissions()).resolves.toBe(false);
  });

  test('scheduling is a safe no-op', async () => {
    await expect(scheduleDailyReminder(19, 0)).resolves.toBe('');
  });

  test('cancelling is a safe no-op', async () => {
    await expect(cancelAllReminders()).resolves.toBeUndefined();
  });
});
