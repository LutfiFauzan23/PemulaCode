import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Bug,
  Code2,
  Globe,
  Palette,
  Play,
  Terminal,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useProgressStore } from '@/stores/progress-store';
import { useTranslation } from '@/translations';

import { TAB_BAR_CLEARANCE } from './_layout';

export default function LearnScreen() {
  const router = useRouter();
  const { colors: c, mode } = useTheme();
  const { t } = useTranslation();
  const getCourseProgress = useProgressStore((state) => state.getCourseProgress);
  const getOverallProgress = useProgressStore((state) => state.getOverallProgress);

  const htmlProgress = getCourseProgress('html');
  const cssProgress = getCourseProgress('css');
  const jsProgress = getCourseProgress('javascript');
  const overallProgress = getOverallProgress();

  // SVG Circular progress ring calculations (Radius: 36, Stroke: 8)
  const circleRadius = 36;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * circleRadius;
  const progressPercent = overallProgress / 100;
  const strokeDashoffset = circumference * (1 - progressPercent);

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
        
        {/* 1. TOP APP BAR */}
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

          {/* Right: Notification Bell */}
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => {}}
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
            <Bell color={c.primary} size={20} />
          </Pressable>
        </View>

        {/* 2. PAGE HEADER */}
        <View
          style={{
            marginTop: spacing[4],
            paddingHorizontal: spacing[5],
          }}>
          <AppText
            color={c.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 26,
              lineHeight: 34,
            }}>
            {t('upgradeSkills')}
          </AppText>
          <AppText
            color={c.onSurfaceVariant}
            style={{
              fontSize: 15,
              lineHeight: 22,
              marginTop: spacing[1],
            }}>
            {t('continueOrStart')}
          </AppText>
        </View>

        {/* 3. LEARNING COURSE CARDS (Vertical Stack) */}
        <View style={{ gap: spacing[5], marginTop: spacing[5], paddingHorizontal: spacing[5] }}>

          {/* COURSE 1: HTML Foundation */}
          <View
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderColor: c.outlineVariant,
              borderLeftColor: c.secondary,
              borderLeftWidth: 4,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              padding: spacing[5],
              shadowColor: c.secondary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }}>
            {/* Header row: Badge + Difficulty */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing[3],
              }}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.secondaryFixed,
                  borderRadius: radius.lg,
                  flexDirection: 'row',
                  gap: spacing[1],
                  paddingHorizontal: spacing[2],
                  paddingVertical: spacing[1],
                }}>
                <Globe color={c.secondary} size={16} />
                <AppText
                  color={c.secondary}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  HTML
                </AppText>
              </View>
              <View
                style={{
                  backgroundColor: c.secondaryFixed,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                }}>
                <AppText
                  color={c.secondary}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                  {t('beginner')}
                </AppText>
              </View>
            </View>

            {/* Course Title & Description */}
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              HTML Foundation
            </AppText>
            <AppText
              color={c.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginTop: spacing[1],
              }}>
              {t('htmlFoundationDesc')}
            </AppText>

            {/* Progress Info Row */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: spacing[4],
              }}>
              <AppText
                color={c.secondary}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}>
                {htmlProgress}% {t('completed')}
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                }}>
                {htmlProgress === 100 ? `2/2 ${t('modules')}` : htmlProgress > 0 ? `1/2 ${t('modules')}` : `0/2 ${t('modules')}`}
              </AppText>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                backgroundColor: c.secondaryFixed,
                borderRadius: radius.full,
                height: 10,
                marginTop: spacing[2],
                overflow: 'hidden',
                width: '100%',
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

            {/* Continue / Start Button */}
            <Pressable
              accessibilityLabel="Start Learning HTML Foundation"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/html-course')}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? c.secondaryPressed
                  : c.secondary,
                borderRadius: radius.xl,
                flexDirection: 'row',
                gap: spacing[2],
                justifyContent: 'center',
                minHeight: 48,
                marginTop: spacing[4],
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
                opacity: pressed ? 0.9 : 1,
              })}>
              <AppText
                color="#ffffff"
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 15,
                }}>
                {htmlProgress > 0 ? t('continueLearning') : t('startLearning')}
              </AppText>
              <Play color="#ffffff" size={16} fill="#ffffff" />
            </Pressable>
          </View>


          {/* COURSE 2: Advanced CSS */}
          <View
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderColor: c.outlineVariant,
              borderLeftColor: '#00629d',
              borderLeftWidth: 4,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              padding: spacing[5],
              shadowColor: '#00629d',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }}>
            {/* Header row: Badge + Difficulty */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing[3],
              }}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.tertiaryFixed,
                  borderRadius: radius.lg,
                  flexDirection: 'row',
                  gap: spacing[1],
                  paddingHorizontal: spacing[2],
                  paddingVertical: spacing[1],
                }}>
                <Palette color="#00629d" size={16} />
                <AppText
                  color="#00629d"
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  CSS
                </AppText>
              </View>
              <View
                style={{
                  backgroundColor: c.tertiaryFixed,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                }}>
                <AppText
                  color="#00629d"
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                  Menengah
                </AppText>
              </View>
            </View>

            {/* Course Title & Description */}
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              Advanced CSS
            </AppText>
            <AppText
              color={c.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginTop: spacing[1],
              }}>
              Flexbox, Grid, dan animasi modern untuk tampilan UI menarik.
            </AppText>

            {/* Progress Info Row */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: spacing[4],
              }}>
              <AppText
                color="#00629d"
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}>
                {cssProgress}% Selesai
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                }}>
                0/2 Modul
              </AppText>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                backgroundColor: c.tertiaryFixed,
                borderRadius: radius.full,
                height: 10,
                marginTop: spacing[2],
                overflow: 'hidden',
                width: '100%',
              }}>
              <View
                style={{
                  backgroundColor: '#00629d',
                  borderRadius: radius.full,
                  height: '100%',
                  width: `${cssProgress}%`,
                }}
              />
            </View>

            {/* Continue / Start Button */}
            <Pressable
              accessibilityLabel="Start Learning Advanced CSS"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/css-course')}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed ? '#004c7d' : '#00629d',
                borderRadius: radius.xl,
                flexDirection: 'row',
                gap: spacing[2],
                justifyContent: 'center',
                minHeight: 48,
                marginTop: spacing[4],
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
                opacity: pressed ? 0.9 : 1,
              })}>
              <AppText
                color="#ffffff"
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 15,
                }}>
                {cssProgress > 0 ? t('continueLearning') : t('startLearning')}
              </AppText>
              <Play color="#ffffff" size={16} fill="#ffffff" />
            </Pressable>
          </View>


          {/* COURSE 3: JS Logic & APIs */}
          <View
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderColor: c.outlineVariant,
              borderLeftColor: c.primary,
              borderLeftWidth: 4,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              padding: spacing[5],
              shadowColor: c.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }}>
            {/* Header row: Badge + Difficulty */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: spacing[3],
              }}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.primaryFixed,
                  borderRadius: radius.lg,
                  flexDirection: 'row',
                  gap: spacing[1],
                  paddingHorizontal: spacing[2],
                  paddingVertical: spacing[1],
                }}>
                <Terminal color={c.primary} size={16} />
                <AppText
                  color={c.primary}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  JS
                </AppText>
              </View>
              <View
                style={{
                  backgroundColor: c.primaryFixed,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                }}>
                <AppText
                  color={c.primary}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                  Lanjutan
                </AppText>
              </View>
            </View>

            {/* Course Title & Description */}
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              JS Logic & APIs
            </AppText>
            <AppText
              color={c.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginTop: spacing[1],
              }}>
              Otak pemograman web. Manipulasi DOM, async, dan state.
            </AppText>

            {/* Progress Info Row */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: spacing[4],
              }}>
              <AppText
                color={c.primary}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}>
                {jsProgress}% Selesai
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                }}>
                0/2 Modul
              </AppText>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                backgroundColor: c.primaryFixed,
                borderRadius: radius.full,
                height: 10,
                marginTop: spacing[2],
                overflow: 'hidden',
                width: '100%',
              }}>
              <View
                style={{
                  backgroundColor: c.primary,
                  borderRadius: radius.full,
                  height: '100%',
                  width: `${jsProgress}%`,
                }}
              />
            </View>

            {/* Continue / Start Button */}
            <Pressable
              accessibilityLabel="Start Learning JS Logic & APIs"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/course-detail?courseId=javascript')}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? c.primaryPressed
                  : c.primary,
                borderRadius: radius.xl,
                flexDirection: 'row',
                gap: spacing[2],
                justifyContent: 'center',
                minHeight: 48,
                marginTop: spacing[4],
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
                opacity: pressed ? 0.9 : 1,
              })}>
              <AppText
                color="#ffffff"
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 15,
                }}>
                {jsProgress > 0 ? t('continueLearning') : t('startLearning')}
              </AppText>
              <Play color="#ffffff" size={16} fill="#ffffff" />
            </Pressable>
          </View>
        </View>


        {/* 4. WEEKLY PROGRESS SUMMARY & GOAL */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: c.surfaceContainerLowest,
              borderColor: c.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              padding: spacing[6],
              shadowColor: c.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }}>
            
            {/* SVG Circular Progress Ring */}
            <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Svg height={90} width={90} viewBox="0 0 90 90">
                <G transform="rotate(-90 45 45)">
                  {/* Background Track Circle */}
                  <Circle
                    cx="45"
                    cy="45"
                    r={circleRadius}
                    stroke={c.primaryFixed}
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Active Progress Circle Arc */}
                  <Circle
                    cx="45"
                    cy="45"
                    r={circleRadius}
                    stroke={c.primary}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                  />
                </G>
              </Svg>

              {/* Center Text inside Circle */}
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                }}>
                <AppText
                  color={c.text}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 22,
                    lineHeight: 26,
                  }}>
                  75
                </AppText>
                <AppText
                  color={c.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 10,
                    fontWeight: 'bold',
                    marginTop: -2,
                  }}>
                  XP
                </AppText>
              </View>
            </View>

            {/* Daily Goal Text */}
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 18,
                lineHeight: 24,
                marginTop: spacing[4],
                textAlign: 'center',
              }}>
              Target Harian: 75% Selesai
            </AppText>
            <AppText
              color={c.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginTop: spacing[1],
                textAlign: 'center',
              }}>
              Hebat! Selesaikan 1 modul lagi untuk mencapai target XP harianmu.
            </AppText>

            {/* Weekly Activity Graph (5 vertical bars) */}
            <View
              style={{
                alignItems: 'flex-end',
                flexDirection: 'row',
                gap: spacing[3],
                height: 60,
                justifyContent: 'center',
                marginTop: spacing[5],
              }}>
              {/* Bar 1 (Active) */}
              <View
                style={{
                  backgroundColor: c.primary,
                  borderRadius: radius.sm,
                  height: 42,
                  width: 18,
                }}
              />
              {/* Bar 2 (Active) */}
              <View
                style={{
                  backgroundColor: c.primary,
                  borderRadius: radius.sm,
                  height: 56,
                  width: 18,
                }}
              />
              {/* Bar 3 (Active) */}
              <View
                style={{
                  backgroundColor: c.primary,
                  borderRadius: radius.sm,
                  height: 60,
                  width: 18,
                }}
              />
              {/* Bar 4 (Inactive) */}
              <View
                style={{
                  backgroundColor: c.surfaceContainerLow,
                  borderRadius: radius.sm,
                  height: 18,
                  width: 18,
                }}
              />
              {/* Bar 5 (Inactive) */}
              <View
                style={{
                  backgroundColor: c.surfaceContainerLow,
                  borderRadius: radius.sm,
                  height: 24,
                  width: 18,
                }}
              />
            </View>
          </View>
        </View>

        {/* 5. QUICK DRILLS SECTION */}
        <View style={{ marginTop: spacing[6], marginBottom: spacing[4] }}>
          <AppText
            color={c.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              lineHeight: 28,
              marginBottom: spacing[3],
              paddingHorizontal: spacing[5],
            }}>
            Latihan Cepat
          </AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing[4], paddingHorizontal: spacing[5] }}>
            
            {/* Drill 1: Quiz: Divs */}
            <Pressable
              accessibilityLabel="Quiz: Divs Drill"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? c.surfaceContainer
                  : c.surfaceContainerLowest,
                borderColor: c.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 130,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.secondaryFixed,
                  borderRadius: radius.full,
                  height: 48,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 48,
                }}>
                <Zap color={c.secondary} size={24} />
              </View>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: 'center',
                }}>
                Quiz: Divs
              </AppText>
            </Pressable>

            {/* Drill 2: Flexbox Mini */}
            <Pressable
              accessibilityLabel="Flexbox Mini Drill"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? c.surfaceContainer
                  : c.surfaceContainerLowest,
                borderColor: c.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 130,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.tertiaryFixed,
                  borderRadius: radius.full,
                  height: 48,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 48,
                }}>
                <Palette color="#00629d" size={24} />
              </View>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: 'center',
                }}>
                Flexbox Mini
              </AppText>
            </Pressable>

            {/* Drill 3: Arrows Logic */}
            <Pressable
              accessibilityLabel="Arrows Logic Drill"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? c.surfaceContainer
                  : c.surfaceContainerLowest,
                borderColor: c.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 130,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.primaryFixed,
                  borderRadius: radius.full,
                  height: 48,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 48,
                }}>
                <Code2 color={c.primary} size={24} />
              </View>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: 'center',
                }}>
                Arrows Logic
              </AppText>
            </Pressable>

            {/* Drill 4: Bug Hunt */}
            <Pressable
              accessibilityLabel="Bug Hunt Drill"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? c.surfaceContainer
                  : c.surfaceContainerLowest,
                borderColor: c.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 130,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: mode === 'dark' ? '#5c1d1d' : '#ffdad6',
                  borderRadius: radius.full,
                  height: 48,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 48,
                }}>
                <Bug color={c.danger} size={24} />
              </View>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 14,
                  lineHeight: 20,
                  textAlign: 'center',
                }}>
                Bug Hunt
              </AppText>
            </Pressable>

          </ScrollView>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
