import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Bug,
  Code,
  Code2,
  Globe,
  Palette,
  Play,
  Terminal,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function LearnScreen() {
  const router = useRouter();

  // SVG Circular progress ring calculations (Radius: 36, Stroke: 8)
  const circleRadius = 36;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * circleRadius;
  const progressPercent = 0.75;
  const strokeDashoffset = circumference * (1 - progressPercent);

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" backgroundColor={colors.light.background} />

      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: spacing[8],
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
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
          {/* Left: Avatar + App Title */}
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

        {/* 2. PAGE HEADER */}
        <View
          style={{
            marginTop: spacing[4],
            paddingHorizontal: spacing[5],
          }}>
          <AppText
            color={colors.light.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 26,
              lineHeight: 34,
            }}>
            Level Up Your Skills
          </AppText>
          <AppText
            color={colors.light.onSurfaceVariant}
            style={{
              fontSize: 15,
              lineHeight: 22,
              marginTop: spacing[1],
            }}>
            Pick up where you left off or start a new journey.
          </AppText>
        </View>

        {/* 3. LEARNING COURSE CARDS (Vertical Stack) */}
        <View style={{ gap: spacing[5], marginTop: spacing[5], paddingHorizontal: spacing[5] }}>

          {/* COURSE 1: HTML Foundation */}
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: colors.light.outlineVariant,
              borderLeftColor: colors.light.secondary,
              borderLeftWidth: 4,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              padding: spacing[5],
              shadowColor: colors.light.secondary,
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
                  backgroundColor: colors.light.secondaryFixed,
                  borderRadius: radius.lg,
                  flexDirection: 'row',
                  gap: spacing[1],
                  paddingHorizontal: spacing[2],
                  paddingVertical: spacing[1],
                }}>
                <Globe color={colors.light.secondary} size={16} />
                <AppText
                  color={colors.light.secondary}
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
                  backgroundColor: colors.light.secondaryFixed,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                }}>
                <AppText
                  color={colors.light.secondary}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                  Easy
                </AppText>
              </View>
            </View>

            {/* Course Title & Description */}
            <AppText
              color={colors.light.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              HTML Foundation
            </AppText>
            <AppText
              color={colors.light.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginTop: spacing[1],
              }}>
              Master the bones of the web. Semantic tags and accessibility.
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
                color={colors.light.secondary}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}>
                65% Complete
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                }}>
                12/18 Lessons
              </AppText>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                backgroundColor: colors.light.secondaryFixed,
                borderRadius: radius.full,
                height: 10,
                marginTop: spacing[2],
                overflow: 'hidden',
                width: '100%',
              }}>
              <View
                style={{
                  backgroundColor: colors.light.secondary,
                  borderRadius: radius.full,
                  height: '100%',
                  width: '65%',
                }}
              />
            </View>

            {/* Continue Button */}
            <Pressable
              accessibilityLabel="Continue HTML Foundation"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/html-course')}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.light.secondaryPressed
                  : colors.light.secondary,
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
                Continue
              </AppText>
              <Play color="#ffffff" size={16} fill="#ffffff" />
            </Pressable>
          </View>


          {/* COURSE 2: Advanced CSS */}
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: colors.light.outlineVariant,
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
                  backgroundColor: colors.light.tertiaryFixed,
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
                  backgroundColor: colors.light.tertiaryFixed,
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
                  Medium
                </AppText>
              </View>
            </View>

            {/* Course Title & Description */}
            <AppText
              color={colors.light.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              Advanced CSS
            </AppText>
            <AppText
              color={colors.light.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginTop: spacing[1],
              }}>
              Flexbox, Grid, and beautiful animations for modern UIs.
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
                40% Complete
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                }}>
                8/20 Lessons
              </AppText>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                backgroundColor: colors.light.tertiaryFixed,
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
                  width: '40%',
                }}
              />
            </View>

            {/* Continue Button */}
            <Pressable
              accessibilityLabel="Continue Advanced CSS"
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
                Continue
              </AppText>
              <Play color="#ffffff" size={16} fill="#ffffff" />
            </Pressable>
          </View>


          {/* COURSE 3: JS Logic & APIs */}
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: colors.light.outlineVariant,
              borderLeftColor: colors.light.primary,
              borderLeftWidth: 4,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              padding: spacing[5],
              shadowColor: colors.light.primary,
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
                  backgroundColor: colors.light.primaryFixed,
                  borderRadius: radius.lg,
                  flexDirection: 'row',
                  gap: spacing[1],
                  paddingHorizontal: spacing[2],
                  paddingVertical: spacing[1],
                }}>
                <Terminal color={colors.light.primary} size={16} />
                <AppText
                  color={colors.light.primary}
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
                  backgroundColor: colors.light.primaryFixed,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[1],
                }}>
                <AppText
                  color={colors.light.primary}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                  Hard
                </AppText>
              </View>
            </View>

            {/* Course Title & Description */}
            <AppText
              color={colors.light.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              JS Logic & APIs
            </AppText>
            <AppText
              color={colors.light.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginTop: spacing[1],
              }}>
              The brain of the web. DOM manipulation, async, and state.
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
                color={colors.light.primary}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                  fontWeight: 'bold',
                }}>
                15% Complete
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 13,
                }}>
                3/22 Lessons
              </AppText>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                backgroundColor: colors.light.primaryFixed,
                borderRadius: radius.full,
                height: 10,
                marginTop: spacing[2],
                overflow: 'hidden',
                width: '100%',
              }}>
              <View
                style={{
                  backgroundColor: colors.light.primary,
                  borderRadius: radius.full,
                  height: '100%',
                  width: '15%',
                }}
              />
            </View>

            {/* Continue Button */}
            <Pressable
              accessibilityLabel="Continue JS Logic & APIs"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.light.primaryPressed
                  : colors.light.primary,
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
                Continue
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
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: colors.light.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 4,
              padding: spacing[6],
              shadowColor: colors.light.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            }}>
            
            {/* SVG Circular Progress Ring */}
            <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Svg height={90} width={90} viewBox="0 0 90 90">
                <G rotation="-90" origin="45, 45">
                  {/* Background Track Circle */}
                  <Circle
                    cx="45"
                    cy="45"
                    r={circleRadius}
                    stroke={colors.light.primaryFixed}
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Active Progress Circle Arc */}
                  <Circle
                    cx="45"
                    cy="45"
                    r={circleRadius}
                    stroke={colors.light.primary}
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
                  color={colors.light.text}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 22,
                    lineHeight: 26,
                  }}>
                  75
                </AppText>
                <AppText
                  color={colors.light.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 10,
                    fontWeight: 'bold',
                    marginTop: -2,
                  }}>
                  EXP
                </AppText>
              </View>
            </View>

            {/* Daily Goal Text */}
            <AppText
              color={colors.light.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 18,
                lineHeight: 24,
                marginTop: spacing[4],
                textAlign: 'center',
              }}>
              Daily Goal: 75% Complete
            </AppText>
            <AppText
              color={colors.light.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginTop: spacing[1],
                textAlign: 'center',
              }}>
              You're doing great! Complete one more JS lesson to reach your daily XP target.
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
                  backgroundColor: colors.light.primary,
                  borderRadius: radius.sm,
                  height: 42,
                  width: 18,
                }}
              />
              {/* Bar 2 (Active) */}
              <View
                style={{
                  backgroundColor: colors.light.primary,
                  borderRadius: radius.sm,
                  height: 56,
                  width: 18,
                }}
              />
              {/* Bar 3 (Active) */}
              <View
                style={{
                  backgroundColor: colors.light.primary,
                  borderRadius: radius.sm,
                  height: 60,
                  width: 18,
                }}
              />
              {/* Bar 4 (Inactive) */}
              <View
                style={{
                  backgroundColor: colors.light.surfaceContainerLow,
                  borderRadius: radius.sm,
                  height: 18,
                  width: 18,
                }}
              />
              {/* Bar 5 (Inactive) */}
              <View
                style={{
                  backgroundColor: colors.light.surfaceContainerLow,
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
            color={colors.light.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              lineHeight: 28,
              marginBottom: spacing[3],
              paddingHorizontal: spacing[5],
            }}>
            Quick Drills
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
                  ? colors.light.surfaceContainer
                  : colors.light.surfaceContainerLowest,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 130,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.light.secondaryFixed,
                  borderRadius: radius.full,
                  height: 48,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 48,
                }}>
                <Zap color={colors.light.secondary} size={24} />
              </View>
              <AppText
                color={colors.light.text}
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
                  ? colors.light.surfaceContainer
                  : colors.light.surfaceContainerLowest,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 130,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.light.tertiaryFixed,
                  borderRadius: radius.full,
                  height: 48,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 48,
                }}>
                <Palette color="#00629d" size={24} />
              </View>
              <AppText
                color={colors.light.text}
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
                  ? colors.light.surfaceContainer
                  : colors.light.surfaceContainerLowest,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 130,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.light.primaryFixed,
                  borderRadius: radius.full,
                  height: 48,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 48,
                }}>
                <Code2 color={colors.light.primary} size={24} />
              </View>
              <AppText
                color={colors.light.text}
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
                  ? colors.light.surfaceContainer
                  : colors.light.surfaceContainerLowest,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 130,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#ffdad6',
                  borderRadius: radius.full,
                  height: 48,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 48,
                }}>
                <Bug color={colors.light.danger} size={24} />
              </View>
              <AppText
                color={colors.light.text}
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
