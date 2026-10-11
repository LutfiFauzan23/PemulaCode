import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '../global.css';
import 'react-native-reanimated';

import { ThemeProvider } from '@/context/ThemeContext';
import { useAuthStore } from '@/stores/auth-store';

export const unstable_settings = {
  anchor: 'splash',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Pulihkan sesi Supabase sekali saat app dibuka.
  useEffect(() => {
    void useAuthStore.getState().initialize();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="settings/account" />
          <Stack.Screen name="settings/privacy" />
          <Stack.Screen name="settings/about" />
          <Stack.Screen name="daily-challenge" />
        </Stack>

        <StatusBar style="auto" />
      </>
    </ThemeProvider>
  );
}