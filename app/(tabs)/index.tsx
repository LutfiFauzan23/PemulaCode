import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Brain,
  Code2,
  Flame,
  MessageCircle,
  PlayCircle,
  Search,
  Trophy,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
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
import { getDisplayName } from '@/utils/display-name';

import { TAB_BAR_CLEARANCE } from './_layout';
import { useStreak } from '@/hooks/use-streak';
import { useAuthStore } from '@/stores/auth-store';
import { useProgressStore } from '@/stores/progress-store';
import { useNotificationsStore } from '@/stores/notifications-store';

export default function HomeScreen() {
  const router = useRouter();
  const { colors: c, mode } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const overallProgress = useProgressStore((state) => state.getOverallProgress());
  const htmlProgress = useProgressStore((state) => state.getCourseProgress('html'));
  const unreadNotifications = useNotificationsStore((state) => state.notifications.filter((item) => !item.read).length);
  // Sapaan memakai nama panggilan user: "Halo, <nama>!" ("Hello, <nama>!" saat
  // bahasa Inggris). Kalau nama belum ada, pakai sapaan netral.
  const nickname = useAuthStore((state) =>
    getDisplayName(state.profile?.username, state.user?.user_metadata?.username),
  );
  // Streak dihitung per akun: mulai dari 0, +1 tiap hari ada soal yang
  // diselesaikan, dan reset ke 0 kalau sehari terlewat.
  const { streak } = useStreak();

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: c.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_CLEARANCE,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* Top App Bar */}
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
          {/* Left: Avatar + App Title */}
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
            <Bell color={c.text} size={20} />
            {unreadNotifications > 0 && (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.danger,
                  borderRadius: radius.full,
                  height: unreadNotifications > 9 ? 20 : 17,
                  justifyContent: 'center',
                  minWidth: unreadNotifications > 9 ? 20 : 17,
                  position: 'absolute',
                  right: -2,
                  top: -2,
                }}>
                <AppText
                  color="#ffffff"
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 10,
                  }}>
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </AppText>
              </View>
            )}
          </Pressable>
        </View>

        {/* Greeting + Streak Row */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing[4],
            paddingHorizontal: spacing[5],
          }}>
          {/* Left: Greeting */}
          <View style={{ flex: 1 }}>
            <AppText
              color={c.onSurfaceVariant}
              style={{
                fontFamily: typography.family.mono,
                fontSize: 14,
                lineHeight: 20,
              }}>
              {nickname ? t('helloName', { name: nickname }) : t('helloLearner')}
            </AppText>
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 26,
                lineHeight: 34,
                marginTop: spacing[1],
              }}>
              {t('readyToLearn')}
            </AppText>
          </View>

          {/* Right: Streak Card */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: c.secondaryFixed,
              borderColor: c.secondary,
              borderRadius: radius.xl,
              borderWidth: 1,
              flexDirection: 'row',
              gap: spacing[2],
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
            }}>
            <Flame color={c.secondary} size={22} fill={c.secondary} />
            <AppText
              accessibilityLabel={`${streak} ${t('dayStreak')}`}
              color={c.secondary}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 18,
                lineHeight: 24,
              }}>
              {streak}
            </AppText>
          </View>
        </View>

        {/* Search Bar */}
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
              accessibilityLabel="Search lessons, languages, or help"
              onBlur={() => setIsSearchFocused(false)}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('searchMaterials')}
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

        {/* Overall Mastery Card */}
        <View style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderColor: c.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 6,
              padding: spacing[5],
              shadowColor: c.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            }}>
            {/* Title & Percentage Header */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 26,
                }}>
                {t('overallMastery')}
              </AppText>
              <AppText
                color={c.primary}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 26,
                }}>
                {overallProgress}%
              </AppText>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                backgroundColor: c.primaryFixed,
                borderRadius: radius.full,
                height: 12,
                marginTop: spacing[3],
                overflow: 'hidden',
                width: '100%',
              }}>
              <View
                style={{
                  backgroundColor: c.primary,
                  borderRadius: radius.full,
                  height: '100%',
                  width: `${overallProgress}%`,
                }}
              />
            </View>

            {/* Legend Dots */}
            <View style={{ flexDirection: 'row', gap: spacing[5], marginTop: spacing[4] }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
                <View
                  style={{
                    backgroundColor: c.secondary,
                    borderRadius: 4,
                    height: 8,
                    width: 8,
                  }}
                />
                <AppText
                  color={c.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 13,
                    lineHeight: 18,
                  }}>
                  {t('htmlCssLabel')}
                </AppText>
              </View>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
                <View
                  style={{
                    backgroundColor: c.primary,
                    borderRadius: 4,
                    height: 8,
                    width: 8,
                  }}
                />
                <AppText
                  color={c.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 13,
                    lineHeight: 18,
                  }}>
                  {t('jsCoreLabel')}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Challenge Card */}
        <View style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              backgroundColor: c.primary,
              borderRadius: radius['2xl'],
              elevation: 6,
              overflow: 'hidden',
              padding: spacing[5],
              position: 'relative',
              shadowColor: c.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
            }}>
            {/* Decorative Icon */}
            <View
              aria-hidden
              pointerEvents="none"
              style={{ opacity: 0.15, position: 'absolute', right: -10, top: -10 }}>
              <Brain color="#ffffff" size={110} />
            </View>

            <AppText
              color="rgba(255, 255, 255, 0.8)"
              style={{
                fontFamily: typography.family.mono,
                fontSize: 12,
                letterSpacing: 1,
              }}>
              {t('dailyChallenge')}
            </AppText>

            <AppText
              color={c.onPrimary}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 22,
                lineHeight: 30,
                marginTop: spacing[2],
              }}>
              {t('arrayMapLogic')}
            </AppText>

            <View style={{ alignItems: 'flex-start', marginTop: spacing[4] }}>
              <Pressable
                accessibilityLabel="Solve Now"
                accessibilityRole="button"
                onPress={() => router.push('/daily-challenge')}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#f0f0ff' : '#ffffff',
                  borderRadius: radius.lg,
                  paddingHorizontal: spacing[5],
                  paddingVertical: spacing[3],
                })}>
                <AppText
                  color={c.primary}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 14,
                    lineHeight: 20,
                  }}>
                  {t('solveNow')}
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Continue Learning Section */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: spacing[2],
              marginBottom: spacing[3],
            }}>
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              {htmlProgress > 0 ? t('continueLearning') : t('startLearning')}
            </AppText>
            <PlayCircle color={c.primary} size={22} />
          </View>

          <Pressable
            accessibilityLabel="Continue Learning Course Card"
            accessibilityRole="button"
            onPress={() => router.push('/(tabs)/learn')}
            style={({ pressed }) => ({
              borderRadius: radius['2xl'],
              elevation: 6,
              overflow: 'hidden',
              opacity: pressed ? 0.92 : 1,
              shadowColor: c.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
            })}>
            <View style={{ height: 200, position: 'relative', width: '100%' }}>
              <Image
                source={require('@/assets/images/welcome-hero.png')}
                style={{ height: '100%', width: '100%' }}
                resizeMode="cover"
              />
              {/* Dark Gradient / Contrast Overlay */}
              <View
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  bottom: 0,
                  justifyContent: 'space-between',
                  left: 0,
                  padding: spacing[5],
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}>
                <View>
                  <View style={{ alignItems: 'flex-start' }}>
                    <View
                      style={{
                        backgroundColor: c.secondary,
                        borderRadius: radius.sm,
                        paddingHorizontal: spacing[2],
                        paddingVertical: spacing[1],
                      }}>
                      <AppText
                        color="#ffffff"
                        style={{
                          fontFamily: typography.family.mono,
                          fontSize: 11,
                          letterSpacing: 0.5,
                        }}>
                        HTML
                      </AppText>
                    </View>
                  </View>
                  <AppText
                    color="rgba(255, 255, 255, 0.85)"
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 13,
                      marginTop: spacing[2],
                    }}>
                    {t('moduleTagIntro')}
                  </AppText>
                  <AppText
                    color="#ffffff"
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 22,
                      lineHeight: 28,
                      marginTop: spacing[1],
                    }}>
                    {t('htmlEssentials')}
                  </AppText>
                </View>

                {/* Progress Bar Row */}
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      borderRadius: radius.full,
                      flex: 1,
                      height: 8,
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        backgroundColor: c.secondary,
                        borderRadius: radius.full,
                        height: '100%',
                        width: `${htmlProgress}%`,
                      }}
                    />
                  </View>
                  <AppText
                    color="#ffffff"
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 14,
                    }}>
                    {htmlProgress}%
                  </AppText>
                </View>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Shortcut Cards Horizontal Scroll */}
        <View style={{ marginTop: spacing[6], marginBottom: spacing[4] }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing[4], paddingHorizontal: spacing[5] }}>
            {/* Card 1: Community */}
            <Pressable
              accessibilityLabel="Community Shortcut"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/community')}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? c.surfaceContainer
                  : c.surfaceContainerLowest,
                borderColor: c.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 140,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.primaryFixed,
                  borderRadius: radius.full,
                  height: 44,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 44,
                }}>
                <MessageCircle color={c.primary} size={22} />
              </View>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  lineHeight: 22,
                }}>
                {t('community')}
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  marginTop: spacing[1],
                }}>
                24 {t('discussions')}
              </AppText>
            </Pressable>

            {/* Card 2: Playground */}
            <Pressable
              accessibilityLabel="Playground Shortcut"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/playground')}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? c.surfaceContainer
                  : c.surfaceContainerLowest,
                borderColor: c.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 140,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.secondaryFixed,
                  borderRadius: radius.full,
                  height: 44,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 44,
                }}>
                <Code2 color={c.secondary} size={22} />
              </View>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  lineHeight: 22,
                }}>
                {t('playground')}
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  marginTop: spacing[1],
                }}>
                3 {t('draftsSaved')}
              </AppText>
            </Pressable>

            {/* Card 3: Rankings */}
            <Pressable
              accessibilityLabel="Rankings Shortcut"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/leaderboard')}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? c.surfaceContainer
                  : c.surfaceContainerLowest,
                borderColor: c.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 140,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.tertiaryFixed,
                  borderRadius: radius.full,
                  height: 44,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 44,
                }}>
                <Trophy color="#2563eb" size={22} />
              </View>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  lineHeight: 22,
                }}>
                {t('leaderboard')}
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  marginTop: spacing[1],
                }}>
                #42 {t('globalRank')}
              </AppText>
            </Pressable>
          </ScrollView>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
