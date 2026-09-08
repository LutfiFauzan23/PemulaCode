import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Bell,
  Code,
  Palette,
  Terminal,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import {
  CourseModuleCard,
  type CourseModule,
} from '@/components/course/CourseModuleCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';

// ─────────────────────────────────────────────
// Local JSON data imports
// ─────────────────────────────────────────────

import htmlData from '@/data/courses/html.json';
import cssData from '@/data/courses/css.json';
import jsData from '@/data/courses/js.json';
import { useProgressStore } from '@/stores/progress-store';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type CourseData = {
  id: string;
  title: string;
  category: string;
  description: string;
  accentColor: string;
  accentFixed: string;
  progress: number;
  modules: CourseModule[];
};

// ─────────────────────────────────────────────
// Course ID → Hero watermark icon
// ─────────────────────────────────────────────

function HeroIcon({
  courseId,
  size,
}: {
  courseId: string;
  size: number;
}) {
  const props = { color: '#ffffff', size };
  if (courseId === 'css') return <Palette {...props} />;
  if (courseId === 'javascript') return <Terminal {...props} />;
  return <Code {...props} />;
}

// ─────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────

export default function CourseDetailScreen() {
  const router = useRouter();
  const { colors: c, mode } = useTheme();
  const { t } = useTranslation();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();

  const storeModules = useProgressStore((state) => state.modules);
  const getCourseProgress = useProgressStore((state) => state.getCourseProgress);

  // ── Load course data from local JSON ──────
  const baseCourse: CourseData | null = useMemo(() => {
    if (courseId === 'html') return htmlData as CourseData;
    if (courseId === 'css') return cssData as CourseData;
    if (courseId === 'javascript') return jsData as CourseData;
    return null;
  }, [courseId]);

  // Fallback if invalid courseId
  if (!baseCourse) {
    return (
      <ScreenContainer style={{ backgroundColor: c.background }}>
        <AppText color={c.text}>Course not found.</AppText>
      </ScreenContainer>
    );
  }

  const { accentColor, accentFixed } = baseCourse;
  const progress = getCourseProgress(baseCourse.id);

  const modules = baseCourse.modules.map((mod) => {
    const liveMod = storeModules[mod.id];
    return liveMod
      ? {
          ...mod,
          status: liveMod.status,
          moduleProgress: liveMod.progress,
        }
      : mod;
  });

  return (
    <ScreenContainer
      padded={false}
      style={{ backgroundColor: c.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════
            1. TOP APP BAR
        ═══════════════════════════════════════ */}
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

          {/* Left: Back arrow + Pemula Code branding */}
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => {
                router.replace('/(tabs)/learn');
              }}
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
              <ArrowLeft color={c.text} size={20} />
            </Pressable>

            <Pressable
              accessibilityLabel="Profile Avatar"
              accessibilityRole="button"
              style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
              <View
                style={{
                  borderColor: accentColor,
                  borderRadius: radius.full,
                  borderWidth: 2,
                  height: 36,
                  overflow: 'hidden',
                  width: 36,
                }}>
                <Image
                  source={require('@/assets/images/welcome-hero.png')}
                  style={{ height: '100%', width: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <AppText
                color={accentColor}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 20,
                  lineHeight: 28,
                }}>
                Pemula Code
              </AppText>
            </Pressable>
          </View>

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
            <Bell color={accentColor} size={20} />
          </Pressable>
        </View>

        {/* ═══════════════════════════════════════
            2. COURSE HERO SECTION
        ═══════════════════════════════════════ */}
        <View style={{ marginTop: spacing[4], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              backgroundColor: accentColor,
              borderRadius: radius['2xl'],
              elevation: 8,
              overflow: 'hidden',
              padding: spacing[6],
              position: 'relative',
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
            }}>

            {/* Watermark icon (bottom-right) */}
            <View
              aria-hidden
              pointerEvents="none"
              style={{
                bottom: -15,
                opacity: 0.15,
                position: 'absolute',
                right: -15,
              }}>
              <HeroIcon courseId={baseCourse.id} size={120} />
            </View>

            {/* Category label */}
            <AppText
              color="rgba(255, 255, 255, 0.85)"
              style={{
                fontFamily: typography.family.mono,
                fontSize: 12,
                fontWeight: 'bold',
                letterSpacing: 1.5,
              }}>
              {baseCourse.category}
            </AppText>

            {/* Course title */}
            <AppText
              color="#ffffff"
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 26,
                lineHeight: 34,
                marginTop: spacing[2],
              }}>
              {baseCourse.title}
            </AppText>

            {/* Course description */}
            <AppText
              color="rgba(255, 255, 255, 0.9)"
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: spacing[2],
              }}>
              {baseCourse.description}
            </AppText>

            {/* Progress card */}
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: radius.xl,
                marginTop: spacing[5],
                padding: spacing[4],
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <AppText
                  color="#ffffff"
                  style={{ fontFamily: typography.family.mono, fontSize: 13 }}>
                  {t('totalProgress')}
                </AppText>
                <AppText
                  color="#ffffff"
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 15,
                  }}>
                  {progress}%
                </AppText>
              </View>

              {/* Progress bar */}
              <View
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: radius.full,
                  height: 8,
                  marginTop: spacing[2],
                  overflow: 'hidden',
                  width: '100%',
                }}>
                <View
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: radius.full,
                    height: '100%',
                    width: `${progress}%`,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            3. CURRICULUM MODULES
        ═══════════════════════════════════════ */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <AppText
            color={c.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              lineHeight: 28,
              marginBottom: spacing[4],
            }}>
            {t('curriculumModules')}
          </AppText>

          <View style={{ gap: spacing[4] }}>
            {modules.map((mod) => (
              <CourseModuleCard
                key={mod.id}
                module={mod}
                accentColor={accentColor}
                accentFixed={accentFixed}
                onPress={() => {
                  if (mod.status === 'available' || mod.status === 'in_progress' || mod.status === 'completed') {
                    router.push(
                      `/(tabs)/lesson-detail?courseId=${baseCourse.id}&moduleId=${mod.id}`,
                    );
                  }
                }}
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}
