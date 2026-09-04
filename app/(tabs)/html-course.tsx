import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Bell, Code } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { CourseModuleCard, type CourseModule } from '@/components/course/CourseModuleCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import htmlCourseData from '@/data/courses/html.json';
import { useProgressStore } from '@/stores/progress-store';

export default function HtmlCourseScreen() {
  const router = useRouter();
  const storeModules = useProgressStore((state) => state.modules);
  const getCourseProgress = useProgressStore((state) => state.getCourseProgress);

  const progress = getCourseProgress('html');

  const modules: CourseModule[] = htmlCourseData.modules.map((mod) => {
    const liveMod = storeModules[mod.id];
    return {
      ...mod,
      status: (liveMod ? liveMod.status : mod.status) as CourseModule['status'],
      moduleProgress: liveMod ? liveMod.progress : mod.moduleProgress,
    };
  });

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 40,
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
          {/* Left: Back Arrow + Avatar + Title */}
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
                  ? colors.light.surfaceContainerHigh
                  : colors.light.surfaceContainerLow,
                borderRadius: radius.full,
                height: 40,
                justifyContent: 'center',
                width: 40,
              })}>
              <ArrowLeft color={colors.light.text} size={20} />
            </Pressable>

            <Pressable
              accessibilityLabel="Profile Avatar"
              accessibilityRole="button"
              style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
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
              <AppText
                color={colors.light.primary}
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
                ? colors.light.surfaceContainerHigh
                : colors.light.surfaceContainerLow,
              borderRadius: radius.full,
              height: 40,
              justifyContent: 'center',
              width: 40,
            })}>
            <Bell color={colors.light.primary} size={20} />
          </Pressable>
        </View>

        {/* 2. COURSE HERO SECTION */}
        <View style={{ marginTop: spacing[4], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              backgroundColor: colors.light.secondary,
              borderRadius: radius['2xl'],
              elevation: 8,
              overflow: 'hidden',
              padding: spacing[6],
              position: 'relative',
              shadowColor: colors.light.secondary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
            }}>
            {/* Watermark HTML Code Icon */}
            <View
              aria-hidden
              pointerEvents="none"
              style={{ opacity: 0.15, position: 'absolute', right: -15, bottom: -15 }}>
              <Code color="#ffffff" size={120} />
            </View>

            {/* Tag */}
            <AppText
              color="rgba(255, 255, 255, 0.85)"
              style={{
                fontFamily: typography.family.mono,
                fontSize: 12,
                letterSpacing: 1.5,
                fontWeight: 'bold',
              }}>
              CERTIFICATION TRACK
            </AppText>

            {/* Course Title */}
            <AppText
              color="#ffffff"
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 26,
                lineHeight: 34,
                marginTop: spacing[2],
              }}>
              HTML Essentials
            </AppText>

            {/* Course Subtitle */}
            <AppText
              color="rgba(255, 255, 255, 0.9)"
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: spacing[2],
              }}>
              Master the skeletal structure of the web with our industry-aligned curriculum.
            </AppText>

            {/* Progress Card Inside Hero */}
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
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 13,
                  }}>
                  Total Progress
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

              {/* Progress Bar */}
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

        {/* 3. CURRICULUM MODULES */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.light.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              lineHeight: 28,
              marginBottom: spacing[4],
            }}>
            Curriculum Modules
          </AppText>

          <View style={{ gap: spacing[4] }}>
            {modules.map((mod) => (
              <CourseModuleCard
                key={mod.id}
                module={mod}
                accentColor={colors.light.secondary}
                accentFixed={colors.light.secondaryFixed}
                onPress={() => {
                  if (mod.status === 'available' || mod.status === 'in_progress' || mod.status === 'completed') {
                    router.push(
                      `/(tabs)/lesson-detail?courseId=html&moduleId=${mod.id}`,
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
