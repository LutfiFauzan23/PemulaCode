import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  ChevronRight,
  Globe,
  Info,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  User,
} from 'lucide-react-native';

import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/context/ThemeContext';
import { appConfig } from '@/constants/app';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useSettingsStore } from '@/stores/settings-store';
import { useTranslation } from '@/translations';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, setMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const isDarkMode = mode === 'dark';

  const handleSignOut = () => {
    Alert.alert(
      t('confirmSignOut'),
      t('confirmSignOutMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('signOut'),
          style: 'destructive',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]
    );
  };

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

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
            backgroundColor: colors.background,
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
                ? colors.surfaceContainerHigh
                : colors.surfaceContainerLow,
              borderRadius: radius.full,
              height: 40,
              justifyContent: 'center',
              width: 40,
            })}>
            <ChevronRight
              color={colors.primary}
              size={20}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </Pressable>

          {/* Center: Title */}
          <AppText
            color={colors.primary}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              lineHeight: 28,
            }}>
            {t('settings')}
          </AppText>

          {/* Right: Profile Avatar */}
          <Pressable
            accessibilityLabel="View Profile"
            accessibilityRole="button"
            onPress={() => router.push('/(tabs)/profile')}
            style={({ pressed }) => ({
              borderColor: colors.primary,
              borderRadius: radius.full,
              borderWidth: 2,
              height: 40,
              opacity: pressed ? 0.8 : 1,
              overflow: 'hidden',
              width: 40,
            })}>
            <Image
              source={require('@/assets/images/welcome-hero.png')}
              style={{ height: '100%', width: '100%' }}
              resizeMode="cover"
            />
          </Pressable>
        </View>

        {/* 2. SECTION 1 — GENERAL PREFERENCES */}
        <View style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.primary}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 13,
              fontWeight: 'bold',
              letterSpacing: 0.5,
              marginBottom: spacing[3],
              textTransform: 'uppercase',
            }}>
            {t('generalPreferences')}
          </AppText>

          {/* Card Container */}
          <View
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              overflow: 'hidden',
              shadowColor: colors.primary,
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
                    backgroundColor: colors.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  {isDarkMode ? (
                    <Moon color={colors.primary} size={20} />
                  ) : (
                    <Sun color={colors.primary} size={20} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    {t('darkMode')}
                  </AppText>
                  <AppText
                    color={colors.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    {t('adjustAppearance')}
                  </AppText>
                </View>
              </View>

              {/* Minimalist Light / Dark Toggle Switch */}
              <Pressable
                accessibilityLabel={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                accessibilityRole="switch"
                accessibilityState={{ checked: isDarkMode }}
                onPress={toggleTheme}
                style={({ pressed }) => ({
                  backgroundColor: isDarkMode ? colors.primary : (colors.surfaceContainerHigh || '#e2e8f0'),
                  borderRadius: 16,
                  height: 32,
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                  padding: 3,
                  width: 56,
                })}>
                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: isDarkMode ? 'flex-end' : 'flex-start',
                    backgroundColor: '#ffffff',
                    borderRadius: 13,
                    elevation: 3,
                    height: 26,
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                    width: 26,
                  }}>
                  {isDarkMode ? (
                    <Moon color={colors.primary} size={15} />
                  ) : (
                    <Sun color="#f59e0b" size={15} />
                  )}
                </View>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={{ backgroundColor: colors.outlineVariant, height: 1, marginHorizontal: spacing[4] }} />

            {/* Item 2: Language */}
            <Pressable
              accessibilityLabel="Language Settings"
              accessibilityRole="button"
              onPress={() => setShowLanguagePicker(!showLanguagePicker)}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Globe color={colors.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    {t('language')}
                  </AppText>
                  <AppText
                    color={colors.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    {language === 'id' ? t('indonesia') : t('english')}
                  </AppText>
                </View>
              </View>

              <ChevronRight
                color={colors.outline}
                size={20}
                style={{
                  transform: [{ rotate: showLanguagePicker ? '90deg' : '0deg' }],
                }}
              />
            </Pressable>

            {/* Language Picker (inline expanded) */}
            {showLanguagePicker && (
              <View
                style={{
                  backgroundColor: colors.surfaceContainerLow,
                  borderTopColor: colors.outlineVariant,
                  borderTopWidth: 1,
                  paddingHorizontal: spacing[5],
                  paddingVertical: spacing[3],
                  gap: spacing[2],
                }}>
                {/* Indonesia option */}
                <Pressable
                  accessibilityLabel="Select Indonesia"
                  accessibilityRole="radio"
                  onPress={() => { setLanguage('id'); setShowLanguagePicker(false); }}
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor: language === 'id'
                      ? colors.primaryFixed
                      : pressed
                      ? colors.surfaceContainerHigh
                      : 'transparent',
                    borderColor: language === 'id' ? colors.primary : colors.outlineVariant,
                    borderRadius: radius.xl,
                    borderWidth: 1.5,
                    flexDirection: 'row',
                    gap: spacing[3],
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[3],
                  })}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderColor: language === 'id' ? colors.primary : colors.outline,
                      borderRadius: radius.full,
                      borderWidth: 2,
                      height: 20,
                      justifyContent: 'center',
                      width: 20,
                    }}>
                    {language === 'id' && (
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: radius.full,
                          height: 10,
                          width: 10,
                        }}
                      />
                    )}
                  </View>
                  <AppText
                    color={language === 'id' ? colors.primary : colors.text}
                    style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                    🇮🇩  {t('indonesia')}
                  </AppText>
                </Pressable>

                {/* English option */}
                <Pressable
                  accessibilityLabel="Select English"
                  accessibilityRole="radio"
                  onPress={() => { setLanguage('en'); setShowLanguagePicker(false); }}
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor: language === 'en'
                      ? colors.primaryFixed
                      : pressed
                      ? colors.surfaceContainerHigh
                      : 'transparent',
                    borderColor: language === 'en' ? colors.primary : colors.outlineVariant,
                    borderRadius: radius.xl,
                    borderWidth: 1.5,
                    flexDirection: 'row',
                    gap: spacing[3],
                    paddingHorizontal: spacing[4],
                    paddingVertical: spacing[3],
                  })}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderColor: language === 'en' ? colors.primary : colors.outline,
                      borderRadius: radius.full,
                      borderWidth: 2,
                      height: 20,
                      justifyContent: 'center',
                      width: 20,
                    }}>
                    {language === 'en' && (
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: radius.full,
                          height: 10,
                          width: 10,
                        }}
                      />
                    )}
                  </View>
                  <AppText
                    color={language === 'en' ? colors.primary : colors.text}
                    style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                    🇺🇸  {t('english')}
                  </AppText>
                </Pressable>
              </View>
            )}

            {/* Divider */}
            <View style={{ backgroundColor: colors.outlineVariant, height: 1, marginHorizontal: spacing[4] }} />

            {/* Item 3: Notification Settings */}
            <Pressable
              accessibilityLabel="Notification Settings"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Bell color={colors.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    {t('notificationSettings')}
                  </AppText>
                  <AppText
                    color={colors.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    {t('manageAlerts')}
                  </AppText>
                </View>
              </View>

              <ChevronRight color={colors.outline} size={20} />
            </Pressable>

          </View>
        </View>

        {/* 3. SECTION 2 — ACCOUNT & SAFETY */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.primary}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 13,
              fontWeight: 'bold',
              letterSpacing: 0.5,
              marginBottom: spacing[3],
              textTransform: 'uppercase',
            }}>
            {t('accountSafety')}
          </AppText>

          {/* Card Container */}
          <View
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              overflow: 'hidden',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }}>
            
            {/* Item 1: Profile */}
            <Pressable
              accessibilityLabel="My Profile"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/profile')}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <User color={colors.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    {t('myProfile')}
                  </AppText>
                  <AppText
                    color={colors.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    {t('viewStats')}
                  </AppText>
                </View>
              </View>

              <ChevronRight color={colors.outline} size={20} />
            </Pressable>

            {/* Divider */}
            <View style={{ backgroundColor: colors.outlineVariant, height: 1, marginHorizontal: spacing[4] }} />

            {/* Item 2: Privacy */}
            <Pressable
              accessibilityLabel="Privacy Settings"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <ShieldCheck color={colors.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    {t('privacy')}
                  </AppText>
                  <AppText
                    color={colors.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    {t('dataUsage')}
                  </AppText>
                </View>
              </View>

              <ChevronRight color={colors.outline} size={20} />
            </Pressable>

            {/* Divider */}
            <View style={{ backgroundColor: colors.outlineVariant, height: 1, marginHorizontal: spacing[4] }} />

            {/* Item 3: About Application */}
            <Pressable
              accessibilityLabel="About Application"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.surfaceContainerLow
                  : 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: spacing[4],
              })}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.primaryFixed,
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Info color={colors.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                      lineHeight: 22,
                    }}>
                    {t('aboutApplication')}
                  </AppText>
                  <AppText
                    color={colors.onSurfaceVariant}
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      marginTop: spacing[1],
                    }}>
                    {t('version')} {appConfig.version ?? '2.4.0'} ({t('stable')})
                  </AppText>
                </View>
              </View>

              <ChevronRight color={colors.outline} size={20} />
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
              backgroundColor: pressed ? colors.surfaceContainerHigh : colors.surfaceContainerLowest,
              borderColor: colors.error,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 2,
              flexDirection: 'row',
              gap: spacing[3],
              paddingHorizontal: spacing[5],
              paddingVertical: spacing[4],
              shadowColor: colors.error,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              opacity: pressed ? 0.85 : 1,
            })}>
            <LogOut color={colors.error} size={20} />
            <AppText
              color={colors.error}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 16,
                lineHeight: 22,
              }}>
              {t('signOut')}
            </AppText>
          </Pressable>
        </View>

        {/* 5. BRANDING / FOOTER */}
        <View style={{ alignItems: 'center', marginTop: spacing[8], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.primary}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 15,
              lineHeight: 20,
            }}>
            Pemula Code
          </AppText>
          <AppText
            color={colors.outline}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 11,
              letterSpacing: 1.5,
              marginTop: spacing[1],
            }}>
            {t('madeWithPride')}
          </AppText>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}
