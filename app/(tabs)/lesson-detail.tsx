import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LessonSection, type SectionData } from '@/components/lesson/LessonSection';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';

import htmlLessons from '@/data/lessons/html.json';
import cssLessons from '@/data/lessons/css.json';
import jsLessons from '@/data/lessons/javascript.json';

type LessonItem = {
  id: string;
  moduleNumber: number;
  title: string;
  category: string;
  readTime: string;
  progress?: number;
  sections: SectionData[];
  objectives: string[];
  mentorTip: string;
  relatedResource: {
    title: string;
    description: string;
  };
};

type LessonDataFile = {
  courseId: string;
  lessons: LessonItem[];
};

export default function LessonDetailScreen() {
  const router = useRouter();
  const { colors: c, mode } = useTheme();
  const { t } = useTranslation();
  const { courseId, moduleId } = useLocalSearchParams<{
    courseId?: string;
    moduleId?: string;
  }>();

  // Color theme mapping based on courseId
  const theme = useMemo(() => {
    if (courseId === 'css') {
      return {
        accent: '#00629d',
        accentFixed: mode === 'dark' ? '#16324d' : '#cbe6ff',
        accentPressed: '#004c7d',
      };
    }
    if (courseId === 'javascript') {
      return {
        accent: c.primary,
        accentFixed: c.primaryFixed,
        accentPressed: c.primaryPressed,
      };
    }
    // HTML default
    return {
      accent: c.secondary,
      accentFixed: c.secondaryFixed,
      accentPressed: c.secondaryPressed,
    };
  }, [courseId, c, mode]);

  // Load lesson dataset
  const lessonFile: LessonDataFile | null = useMemo(() => {
    if (courseId === 'html') return htmlLessons as LessonDataFile;
    if (courseId === 'css') return cssLessons as LessonDataFile;
    if (courseId === 'javascript') return jsLessons as LessonDataFile;
    return htmlLessons as LessonDataFile;
  }, [courseId]);

  // Filter out coming soon modules from navigation flow
  const availableLessons = useMemo(() => {
    if (!lessonFile) return [];
    return lessonFile.lessons.filter(
      (l) => l.sections && l.sections.length > 0 && l.sections[0].content !== 'Coming Soon'
    );
  }, [lessonFile]);

  // Find target lesson and navigation indices within available lessons
  const currentLessonIndex = useMemo(() => {
    const target = (moduleId || '').toLowerCase();
    const idx = availableLessons.findIndex(
      (l) =>
        l.id.toLowerCase() === target ||
        l.moduleNumber.toString() === target ||
        target.endsWith(l.id.toLowerCase()) ||
        l.id.toLowerCase().endsWith(target.replace('module-', '0')),
    );
    return idx >= 0 ? idx : 0;
  }, [availableLessons, moduleId]);

  const lesson: LessonItem | undefined = availableLessons[currentLessonIndex];

  // Each module has exactly 1 page of lesson content — navbar is isolated per module
  const hasPrevious = false; // No cross-module Previous navigation
  const hasNext = false;     // Each lesson leads directly to its Module Quiz

  const handlePrevious = () => {
    // Not used (hasPrevious is always false)
  };

  const handleNext = () => {
    // Navigate to Quiz for THIS specific module only
    router.push(`/(tabs)/quiz-screen?courseId=${courseId}&moduleId=${lesson?.id}`);
  };

  if (!lesson) {
    return (
      <ScreenContainer style={{ backgroundColor: c.background }}>
        <AppText color={c.text}>Lesson content not found.</AppText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      padded={false}
      style={{ backgroundColor: c.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

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
        {/* Left: Back Arrow */}
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else if (courseId === 'html') {
              router.push('/(tabs)/html-course');
            } else if (courseId === 'css') {
              router.push('/(tabs)/css-course');
            } else {
              router.push(`/(tabs)/course-detail?courseId=${courseId || 'html'}`);
            }
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

        {/* Center: Lesson Title & Read Time */}
        <View style={{ alignItems: 'center', flex: 1, paddingHorizontal: spacing[3] }}>
          <AppText
            color={theme.accent}
            numberOfLines={1}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 16,
              lineHeight: 22,
              textAlign: 'center',
            }}>
            {lesson.title}
          </AppText>
          <AppText
            color={c.onSurfaceVariant}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 11,
            }}>
            {lesson.readTime}
          </AppText>
        </View>

        {/* Right: Avatar */}
        <View
          style={{
            borderColor: theme.accent,
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
      </View>

      {/* ═══════════════════════════════════════
          2. THIN PROGRESS BAR BELOW HEADER
      ═══════════════════════════════════════ */}
      <View
        style={{
          backgroundColor: theme.accentFixed,
          height: 4,
          width: '100%',
        }}>
        <View
          style={{
            backgroundColor: theme.accent,
            height: '100%',
            width: '100%',
          }}
        />
      </View>

      {/* ═══════════════════════════════════════
          3. SCROLLABLE MAIN CONTENT
      ═══════════════════════════════════════ */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing[5],
          paddingTop: spacing[4],
          paddingBottom: 90, // Clear floating bottom lesson nav
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* HERO BANNER */}
        <View
          style={{
            backgroundColor: theme.accent,
            borderRadius: radius['2xl'],
            elevation: 6,
            height: 160,
            justifyContent: 'space-between',
            marginBottom: spacing[5],
            overflow: 'hidden',
            padding: spacing[5],
            position: 'relative',
            shadowColor: theme.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
          }}>
          {/* Watermark shape */}
          <View
            style={{
              bottom: -20,
              opacity: 0.15,
              position: 'absolute',
              right: -20,
            }}>
            <Sparkles color="#ffffff" size={140} />
          </View>

          {/* Badges row */}
          <View style={{ flexDirection: 'row', gap: spacing[2] }}>
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: radius.full,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1],
              }}>
              <AppText
                color="#ffffff"
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 12,
                }}>
                Modul {lesson.moduleNumber}
              </AppText>
            </View>

            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: radius.full,
                paddingHorizontal: spacing[3],
                paddingVertical: spacing[1],
              }}>
              <AppText
                color="#ffffff"
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 12,
                }}>
                {lesson.category}
              </AppText>
            </View>
          </View>

          {/* Hero title */}
          <AppText
            color="#ffffff"
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 22,
              lineHeight: 28,
            }}>
            {lesson.title}
          </AppText>
        </View>

        {/* DYNAMIC SECTIONS */}
        {lesson.sections.map((section, idx) => (
          <LessonSection
            key={idx}
            section={section}
            accentColor={theme.accent}
            accentFixed={theme.accentFixed}
          />
        ))}

        {/* ═══════════════════════════════════════
            4. LEARNING OBJECTIVES CARD
        ═══════════════════════════════════════ */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <View
            style={{
              backgroundColor: c.surfaceContainerLowest,
              borderColor: c.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 2,
              marginTop: spacing[6],
              padding: spacing[5],
            }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: spacing[2],
                marginBottom: spacing[4],
              }}>
              <CheckCircle2 color={theme.accent} size={22} />
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                }}>
                Tujuan Pembelajaran
              </AppText>
            </View>

            <View style={{ gap: spacing[3] }}>
              {lesson.objectives.map((obj, i) => (
                <View
                  key={i}
                  style={{
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                    gap: spacing[3],
                  }}>
                  {i < 2 ? (
                    <CheckCircle2
                      color={theme.accent}
                      size={18}
                      style={{ marginTop: 2 }}
                    />
                  ) : (
                    <Circle
                      color={c.outline}
                      size={18}
                      style={{ marginTop: 2 }}
                    />
                  )}
                  <AppText
                    color={c.text}
                    style={{
                      flex: 1,
                      fontSize: 14,
                      lineHeight: 20,
                    }}>
                    {obj}
                  </AppText>
                </View>
              ))}
            </View>

            {/* MENTOR TIP (INSET CARD) */}
            {lesson.mentorTip && (
              <View
                style={{
                  backgroundColor: theme.accentFixed,
                  borderRadius: radius.xl,
                  marginTop: spacing[5],
                  padding: spacing[4],
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: spacing[2],
                    marginBottom: spacing[1],
                  }}>
                  <Lightbulb color={theme.accent} size={16} />
                  <AppText
                    color={theme.accent}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 13,
                    }}>
                    Tips Mentor
                  </AppText>
                </View>
                <AppText
                  color={c.text}
                  style={{
                    fontSize: 13,
                    lineHeight: 19,
                  }}>
                  {lesson.mentorTip}
                </AppText>
              </View>
            )}
          </View>
        )}

        {/* ═══════════════════════════════════════
            5. RELATED RESOURCE CARD
        ═══════════════════════════════════════ */}
        {lesson.relatedResource && (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: c.surfaceContainerLow,
              borderColor: c.outlineVariant,
              borderRadius: radius.xl,
              borderWidth: 1,
              flexDirection: 'row',
              gap: spacing[3],
              marginTop: spacing[4],
              padding: spacing[4],
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: theme.accentFixed,
                borderRadius: radius.lg,
                height: 40,
                justifyContent: 'center',
                width: 40,
              }}>
              <HelpCircle color={theme.accent} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 14,
                }}>
                {lesson.relatedResource.title}
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{
                  fontSize: 12,
                  lineHeight: 17,
                  marginTop: 2,
                }}>
                {lesson.relatedResource.description}
              </AppText>
            </View>
          </View>
        )}

      </ScrollView>

      {/* ═══════════════════════════════════════
          6. FLOATING BOTTOM LESSON NAVIGATION
      ═══════════════════════════════════════ */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: c.background,
          borderTopColor: c.outlineVariant,
          borderTopWidth: 1,
          bottom: 0, // Positioned flush at bottom of screen (bottom tab bar hidden)
          elevation: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          left: 0,
          paddingHorizontal: spacing[5],
          paddingVertical: spacing[3],
          position: 'absolute',
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        }}>

        {/* Previous Button */}
        <Pressable
          accessibilityLabel="Previous Lesson"
          accessibilityRole="button"
          disabled={!hasPrevious}
          onPress={handlePrevious}
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: hasPrevious
              ? pressed
                ? c.surfaceContainerHigh
                : c.surfaceContainerLow
              : c.surfaceContainerLow,
            borderRadius: radius.xl,
            flexDirection: 'row',
            gap: spacing[1],
            height: 44,
            opacity: hasPrevious ? (pressed ? 0.8 : 1) : 0.4,
            paddingHorizontal: spacing[4],
          })}>
          <ChevronLeft
            color={hasPrevious ? c.text : c.outline}
            size={18}
          />
          <AppText
            color={hasPrevious ? c.text : c.outline}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 14,
            }}>
            {t('previous')}
          </AppText>
        </Pressable>

        {/* Progress Counter indicator */}
        <AppText
          color={c.onSurfaceVariant}
          style={{
            fontFamily: typography.family.mono,
            fontSize: 13,
          }}>
          1 / 1
        </AppText>

        {/* Next Lesson / Quiz Button */}
        <Pressable
          accessibilityLabel={hasNext ? t('next') : t('startLearning')}
          accessibilityRole="button"
          onPress={handleNext}
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: pressed ? theme.accentPressed : theme.accent,
            borderRadius: radius.xl,
            flexDirection: 'row',
            gap: spacing[1],
            height: 44,
            opacity: pressed ? 0.9 : 1,
            paddingHorizontal: spacing[4],
          })}>
          <AppText
            color="#ffffff"
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 14,
            }}>
            Mulai Kuis
          </AppText>
          <ChevronRight color="#ffffff" size={18} />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
