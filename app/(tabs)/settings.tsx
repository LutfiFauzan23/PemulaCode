import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Globe,
  Info,
  LogOut,
  Moon,
  ShieldCheck,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { appConfig } from '@/constants/app';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from Pemula Code?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]
    );
  };

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" backgroundColor={colors.light.background} />

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
            backgroundColor: colors.light.background,
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            paddingHorizontal: spacing[5],
            paddingTop: spacing[2],
          }}>
          {/* Left: Back Button */}
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.push('/(tabs)');
              }
            }}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed
                ? colors.light.surfaceContainerHigh
                : colors.light.surfaceContainerLow,
              borderRadius: radius.full,
              height: 40,
              justifyContent: 'center',
              width: 40,
            })}>
            <ArrowLeft color={colors.light.primary} size={20} />
          </Pressable>

          {/* Center: Title */}
          <AppText
            color={colors.light.primary}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              lineHeight: 28,
            }}>
            Settings
          </AppText>

          {/* Right: Profile Avatar */}
          <View
            style={{
              borderColor: colors.light.primary,
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
        </View>

        {/* 2. SECTION 1 — GENERAL PREFERENCES */}
        <View style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.light.primary}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 13,
              fontWeight: 'bold',
              letterSpacing: 0.5,
              marginBottom: spacing[3],
              textTransform: 'uppercase',
            }}>
            General Preferences
          </AppText>

          {/* Card Container */}
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: colors.light.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              overflow: 'hidden',
              shadowColor: colors.light.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }}>
            
            {/* Item 1: Dark Mode */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.light.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Moon color={colors.light.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.light.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    Dark Mode
                  </AppText>
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    Adjust interface appearance
                  </AppText>
                </View>
              </View>

              <Switch
                accessibilityLabel="Toggle Dark Mode"
                onValueChange={setIsDarkMode}
                thumbColor="#ffffff"
                trackColor={{
                  false: colors.light.surfaceContainerHigh,
                  true: colors.light.primary,
                }}
                value={isDarkMode}
              />
            </View>

            {/* Divider */}
            <View style={{ backgroundColor: colors.light.outlineVariant, height: 1, marginHorizontal: spacing[4] }} />

            {/* Item 2: Language */}
            <Pressable
              accessibilityLabel="Language Settings"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.light.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.light.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Globe color={colors.light.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.light.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    Language
                  </AppText>
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    English (United States)
                  </AppText>
                </View>
              </View>

              <ChevronRight color={colors.light.outline} size={20} />
            </Pressable>

            {/* Divider */}
            <View style={{ backgroundColor: colors.light.outlineVariant, height: 1, marginHorizontal: spacing[4] }} />

            {/* Item 3: Notification Settings */}
            <Pressable
              accessibilityLabel="Notification Settings"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.light.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.light.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Bell color={colors.light.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.light.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    Notification Settings
                  </AppText>
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    Manage alerts and reminders
                  </AppText>
                </View>
              </View>

              <ChevronRight color={colors.light.outline} size={20} />
            </Pressable>

          </View>
        </View>

        {/* 3. SECTION 2 — ACCOUNT & SAFETY */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.light.primary}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 13,
              fontWeight: 'bold',
              letterSpacing: 0.5,
              marginBottom: spacing[3],
              textTransform: 'uppercase',
            }}>
            Account & Safety
          </AppText>

          {/* Card Container */}
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: colors.light.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              overflow: 'hidden',
              shadowColor: colors.light.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }}>
            
            {/* Item 1: Privacy */}
            <Pressable
              accessibilityLabel="Privacy Settings"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.light.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.light.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <ShieldCheck color={colors.light.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.light.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    Privacy
                  </AppText>
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    Data usage and visibility
                  </AppText>
                </View>
              </View>

              <ChevronRight color={colors.light.outline} size={20} />
            </Pressable>

            {/* Divider */}
            <View style={{ backgroundColor: colors.light.outlineVariant, height: 1, marginHorizontal: spacing[4] }} />

            {/* Item 2: About Application */}
            <Pressable
              accessibilityLabel="About Application"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.light.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.light.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Info color={colors.light.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.light.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    About Application
                  </AppText>
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    Version {appConfig.version ?? '2.4.0'} (Stable)
                  </AppText>
                </View>
              </View>

              <ChevronRight color={colors.light.outline} size={20} />
            </Pressable>

          </View>
        </View>

        {/* 4. SIGN OUT BUTTON */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <Pressable
            accessibilityLabel="Sign Out"
            accessibilityRole="button"
            onPress={handleSignOut}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed ? '#fef2f2' : 'rgba(255, 255, 255, 0.95)',
              borderColor: '#fecaca',
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 2,
              flexDirection: 'row',
              gap: spacing[3],
              paddingHorizontal: spacing[5],
              paddingVertical: spacing[4],
              shadowColor: colors.light.error,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            })}>
            <LogOut color={colors.light.error} size={20} />
            <AppText
              color={colors.light.error}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 16,
                lineHeight: 22,
              }}>
              Sign Out
            </AppText>
          </Pressable>
        </View>

        {/* 5. BRANDING / FOOTER */}
        <View style={{ alignItems: 'center', marginTop: spacing[8], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.light.primary}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 15,
              lineHeight: 20,
            }}>
            Pemula Code
          </AppText>
          <AppText
            color="#94a3b8"
            style={{
              fontFamily: typography.family.mono,
              fontSize: 11,
              letterSpacing: 1.5,
              marginTop: spacing[1],
            }}>
            MADE WITH PRIDE FOR GEN Z
          </AppText>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}
