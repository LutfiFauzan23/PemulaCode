import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Box,
  CheckCircle2,
  Columns,
  LayoutGrid,
  Lightbulb,
  Lock,
  Palette,
  Play,
  PlayCircle,
  Sparkles,
} from 'lucide-react-native';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function CssCourseScreen() {
  const router = useRouter();

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
          {/* Left: Avatar + Title */}
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

        {/* 2. HERO SECTION */}
        <View style={{ marginTop: spacing[4], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              backgroundColor: colors.light.primary,
              borderRadius: radius['2xl'],
              elevation: 8,
              overflow: 'hidden',
              padding: spacing[6],
              position: 'relative',
              shadowColor: colors.light.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
            }}>
            {/* Watermark Palette Icon */}
            <View
              aria-hidden
              pointerEvents="none"
              style={{ opacity: 0.15, position: 'absolute', right: -15, bottom: -15 }}>
              <Palette color="#ffffff" size={120} />
            </View>

            {/* Badge */}
            <AppText
              color="rgba(255, 255, 255, 0.85)"
              style={{
                fontFamily: typography.family.mono,
                fontSize: 12,
                letterSpacing: 1.5,
                fontWeight: 'bold',
              }}>
              TRACK: STYLING & LAYOUT
            </AppText>

            {/* Heading */}
            <AppText
              color="#ffffff"
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 26,
                lineHeight: 34,
                marginTop: spacing[2],
              }}>
              Mastering CSS Core
            </AppText>

            {/* Description */}
            <AppText
              color="rgba(255, 255, 255, 0.9)"
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: spacing[2],
              }}>
              Learn how to paint the web with precision. From the box model to advanced responsive layouts.
            </AppText>

            {/* Progress Container inside Hero */}
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
                  65%
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
                    width: '65%',
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* 3. SECTION "Learning Path" */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: spacing[2],
              marginBottom: spacing[4],
            }}>
            <Sparkles color={colors.light.primary} size={20} />
            <AppText
              color={colors.light.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              Learning Path
            </AppText>
          </View>

          <View style={{ gap: spacing[4] }}>
            
            {/* MODULE 1: Box Model Basics */}
            <Pressable
              accessibilityLabel="Module 1: Box Model Basics"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.light.outlineVariant,
                borderLeftColor: colors.light.primary,
                borderLeftWidth: 4,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                elevation: 4,
                opacity: pressed ? 0.92 : 1,
                padding: spacing[5],
                shadowColor: colors.light.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
              })}>
              {/* Header row: Badge + Metadata + Icon */}
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
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Box color={colors.light.primary} size={20} />
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
                    Core
                  </AppText>
                </View>
              </View>

              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 25,
                }}>
                Box Model Basics
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                }}>
                Understanding margins, borders, padding, and content sizing.
              </AppText>

              {/* Footer Row: Metadata + Circular Play Button */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: spacing[4],
                  paddingTop: spacing[2],
                }}>
                <AppText
                  color={colors.light.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                    letterSpacing: 0.5,
                  }}>
                  15 LESSONS
                </AppText>

                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.light.primary,
                    borderRadius: radius.full,
                    height: 36,
                    justifyContent: 'center',
                    width: 36,
                  }}>
                  <Play color="#ffffff" size={16} fill="#ffffff" />
                </View>
              </View>
            </Pressable>


            {/* MODULE 2: Flexbox Basics */}
            <Pressable
              accessibilityLabel="Module 2: Flexbox Basics"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.light.outlineVariant,
                borderLeftColor: '#00629d',
                borderLeftWidth: 4,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                elevation: 4,
                opacity: pressed ? 0.92 : 1,
                padding: spacing[5],
                shadowColor: '#00629d',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
              })}>
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
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <Columns color="#00629d" size={20} />
                </View>

                {/* Status Badge COMPLETED */}
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
                      fontWeight: 'bold',
                    }}>
                    COMPLETED
                  </AppText>
                </View>
              </View>

              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 25,
                }}>
                Flexbox Basics
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                }}>
                Modern 1D layouts made easy.
              </AppText>

              {/* Progress Bar 100% */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: spacing[4],
                }}>
                <View
                  style={{
                    backgroundColor: colors.light.tertiaryFixed,
                    borderRadius: radius.full,
                    flex: 1,
                    height: 8,
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#00629d',
                      borderRadius: radius.full,
                      height: '100%',
                      width: '100%',
                    }}
                  />
                </View>
                <CheckCircle2 color="#00629d" size={18} style={{ marginLeft: spacing[2] }} />
              </View>
            </Pressable>


            {/* MODULE 3: CSS Grid */}
            <Pressable
              accessibilityLabel="Module 3: CSS Grid"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.light.outlineVariant,
                borderLeftColor: colors.light.secondary,
                borderLeftWidth: 4,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                elevation: 4,
                opacity: pressed ? 0.92 : 1,
                padding: spacing[5],
                shadowColor: colors.light.secondary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
              })}>
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
                    borderRadius: radius.xl,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  }}>
                  <LayoutGrid color={colors.light.secondary} size={20} />
                </View>
              </View>

              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 25,
                }}>
                CSS Grid
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                }}>
                2D Master layouts.
              </AppText>

              {/* Progress section: 4/12 MODULES & Progress Bar */}
              <View
                style={{
                  backgroundColor: colors.light.secondaryFixed,
                  borderRadius: radius.full,
                  height: 8,
                  marginTop: spacing[4],
                  overflow: 'hidden',
                  width: '100%',
                }}>
                <View
                  style={{
                    backgroundColor: colors.light.secondary,
                    borderRadius: radius.full,
                    height: '100%',
                    width: '33%',
                  }}
                />
              </View>
              <AppText
                color={colors.light.secondary}
                style={{
                  fontFamily: typography.family.mono,
                  fontSize: 11,
                  fontWeight: 'bold',
                  marginTop: spacing[2],
                }}>
                4/12 MODULES
              </AppText>
            </Pressable>


            {/* MODULE 4: Colors & Fonts (LOCKED) */}
            <View
              style={{
                backgroundColor: colors.light.surfaceContainerLow,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                padding: spacing[5],
                opacity: 0.7,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: spacing[2],
                }}>
                <AppText
                  color={colors.light.textMuted}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 18,
                    lineHeight: 25,
                  }}>
                  Colors & Fonts
                </AppText>
                <Lock color={colors.light.outline} size={20} />
              </View>
              <AppText
                color={colors.light.outline}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                }}>
                Design aesthetics through CSS variables.
              </AppText>
            </View>

          </View>
        </View>

        {/* 4. PRO TIP CARD */}
        <View style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              backgroundColor: colors.light.surfaceContainerLow,
              borderColor: colors.light.primary,
              borderRadius: radius['2xl'],
              borderStyle: 'dashed',
              borderWidth: 1.5,
              padding: spacing[4],
            }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3], flex: 1 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.light.primaryFixed,
                    borderRadius: radius.full,
                    height: 36,
                    justifyContent: 'center',
                    width: 36,
                  }}>
                  <Lightbulb color={colors.light.primary} size={18} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText
                    color={colors.light.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 14,
                    }}>
                    Pro Tip: Center Divs
                  </AppText>
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 12,
                      marginTop: spacing[1],
                    }}>
                    Try: display: grid; place-items: center;
                  </AppText>
                </View>
              </View>

              <Pressable hitSlop={8} onPress={() => {}}>
                <AppText
                  color={colors.light.primary}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 12,
                    letterSpacing: 0.5,
                  }}>
                  LEARN MORE
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 5. DAILY CHALLENGE */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.light.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              lineHeight: 28,
              marginBottom: spacing[3],
            }}>
            Daily Challenge
          </AppText>

          <View
            style={{
              backgroundColor: '#0f172a',
              borderRadius: radius['2xl'],
              elevation: 8,
              padding: spacing[6],
              shadowColor: colors.light.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
            }}>
            <AppText
              color="#ffffff"
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              The Nav Bar Layout
            </AppText>

            <AppText
              color="#94a3b8"
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: spacing[2],
              }}>
              Build a responsive navigation bar using Flexbox and Media Queries. Must include a logo, 3 links, and a CTA button.
            </AppText>

            {/* Action Buttons Row */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: spacing[3],
                marginTop: spacing[5],
              }}>
              <Pressable
                accessibilityLabel="Start Coding"
                accessibilityRole="button"
                onPress={() => {}}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor: pressed
                    ? colors.light.primaryPressed
                    : colors.light.primary,
                  borderRadius: radius.xl,
                  justifyContent: 'center',
                  paddingHorizontal: spacing[5],
                  paddingVertical: spacing[3],
                })}>
                <AppText
                  color="#ffffff"
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 15,
                  }}>
                  Start Coding
                </AppText>
              </Pressable>

              <Pressable
                accessibilityLabel="Preview Goal"
                accessibilityRole="button"
                onPress={() => {}}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor: pressed
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  justifyContent: 'center',
                  paddingHorizontal: spacing[5],
                  paddingVertical: spacing[3],
                })}>
                <AppText
                  color="#ffffff"
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 15,
                  }}>
                  Preview Goal
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}
