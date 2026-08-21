import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Code,
  Lock,
  Play,
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

export default function HtmlCourseScreen() {
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
                  64%
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
                    width: '64%',
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
            
            {/* MODULE 1 — COMPLETED */}
            <Pressable
              accessibilityLabel="Module 1: Introduction to Tags"
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
              {/* Header row: Badge + Duration + Verification Icon */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: spacing[3],
                }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
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
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 12,
                    }}>
                    15 mins
                  </AppText>
                </View>

                {/* Completed Verification Badge */}
                <CheckCircle2 color={colors.light.secondary} size={22} fill={colors.light.secondaryFixed} />
              </View>

              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 25,
                }}>
                Introduction to Tags
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                }}>
                Learn the fundamental syntax of HTML and how to structure your first webpage using basic elements.
              </AppText>

              {/* Footer Row: Learner Avatars + Review Lesson Link */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: spacing[4],
                  paddingTop: spacing[2],
                }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
                    style={{
                      borderColor: '#ffffff',
                      borderRadius: radius.full,
                      borderWidth: 2,
                      height: 24,
                      width: 24,
                    }}
                  />
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }}
                    style={{
                      borderColor: '#ffffff',
                      borderRadius: radius.full,
                      borderWidth: 2,
                      height: 24,
                      marginLeft: -8,
                      width: 24,
                    }}
                  />
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 11,
                      marginLeft: spacing[2],
                    }}>
                    +12
                  </AppText>
                </View>

                {/* Review Lesson Link */}
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
                  <AppText
                    color={colors.light.secondary}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 14,
                    }}>
                    Review Lesson
                  </AppText>
                  <ChevronRight color={colors.light.secondary} size={16} />
                </View>
              </View>
            </Pressable>


            {/* MODULE 2 — IN PROGRESS */}
            <Pressable
              accessibilityLabel="Module 2: The DOM Tree & Hierarchy"
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
              {/* Header row: Badge + Duration + In-progress Indicator */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: spacing[3],
                }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
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
                      Medium
                    </AppText>
                  </View>
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 12,
                    }}>
                    45 mins
                  </AppText>
                </View>

                {/* In Progress Ring */}
                <View
                  style={{
                    borderColor: colors.light.secondaryFixed,
                    borderRightColor: colors.light.secondary,
                    borderRadius: radius.full,
                    borderWidth: 3,
                    height: 22,
                    width: 22,
                  }}
                />
              </View>

              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 25,
                }}>
                The DOM Tree & Hierarchy
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                }}>
                Understand parent-child relationships and how browsers interpret the nested structure of your HTML documents.
              </AppText>

              {/* Progress Bar (40%) */}
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
                    width: '40%',
                  }}
                />
              </View>

              {/* Action Button: Continue Learning */}
              <Pressable
                accessibilityLabel="Continue Learning Module 2"
                accessibilityRole="button"
                onPress={() => {}}
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
                  Continue Learning
                </AppText>
                <Play color="#ffffff" size={16} fill="#ffffff" />
              </Pressable>
            </Pressable>


            {/* MODULE 3 — LOCKED */}
            <View
              style={{
                backgroundColor: colors.light.surfaceContainerLow,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                padding: spacing[5],
                opacity: 0.7,
              }}>
              {/* Header row: Badge + Duration + Lock Icon */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: spacing[3],
                }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
                  <View
                    style={{
                      backgroundColor: colors.light.surfaceContainerHigh,
                      borderRadius: radius.full,
                      paddingHorizontal: spacing[3],
                      paddingVertical: spacing[1],
                    }}>
                    <AppText
                      color={colors.light.outline}
                      style={{
                        fontFamily: typography.family.mono,
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                      Hard
                    </AppText>
                  </View>
                  <AppText
                    color={colors.light.outline}
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 12,
                    }}>
                    60 mins
                  </AppText>
                </View>

                <Lock color={colors.light.outline} size={20} />
              </View>

              <AppText
                color={colors.light.textMuted}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 25,
                }}>
                Forms & Data Validation
              </AppText>
              <AppText
                color={colors.light.outline}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                }}>
                Master complex user inputs, form attributes, and browser-level validation techniques.
              </AppText>

              {/* Unlock Requirement Footer */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: spacing[2],
                  marginTop: spacing[4],
                  paddingTop: spacing[2],
                }}>
                <Lock color={colors.light.outline} size={14} />
                <AppText
                  color={colors.light.outline}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                  }}>
                  Complete 'DOM Tree' to unlock
                </AppText>
              </View>
            </View>


            {/* MODULE 4 — UPCOMING / LOCKED */}
            <View
              style={{
                backgroundColor: colors.light.surfaceContainerLow,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                padding: spacing[5],
                opacity: 0.7,
              }}>
              {/* Header row: Badge + Duration + Lock Icon */}
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: spacing[3],
                }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
                  <View
                    style={{
                      backgroundColor: colors.light.surfaceContainerHigh,
                      borderRadius: radius.full,
                      paddingHorizontal: spacing[3],
                      paddingVertical: spacing[1],
                    }}>
                    <AppText
                      color={colors.light.outline}
                      style={{
                        fontFamily: typography.family.mono,
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                      Medium
                    </AppText>
                  </View>
                  <AppText
                    color={colors.light.outline}
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 12,
                    }}>
                    30 mins
                  </AppText>
                </View>

                <Lock color={colors.light.outline} size={20} />
              </View>

              <AppText
                color={colors.light.textMuted}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 25,
                }}>
                Semantic HTML Mastery
              </AppText>
              <AppText
                color={colors.light.outline}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                }}>
                Go beyond generic divs. Learn how to use structural tags for SEO and Accessibility.
              </AppText>
            </View>

          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}
