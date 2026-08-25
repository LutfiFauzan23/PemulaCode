/**
 * Onboarding Screen 2 — "Join the Community & Track Progress"
 *
 * REPLACES the placeholder. Only this file is modified.
 * Routing: automatically picked up by Expo Router from app/onboarding2.tsx.
 *          No changes to _layout.tsx needed (headerShown: false via screenOptions).
 *
 * Navigation:
 *   Back      → router.back()   → Onboarding 1
 *   Get Started → router.replace('/(tabs)') → existing Home / tab navigator
 */

import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

// ─── Local colour aliases (mirrors Onboarding 1 pattern — no changes to constants) ───
const C = {
  bg: colors.light.background,           // #F7F9FB
  primary: colors.light.primary,         // #4648D4
  primaryFg: colors.light.onPrimary,     // #FFFFFF
  primaryPressed: colors.light.primaryPressed,
  primaryFixed: colors.light.primaryFixed, // #E1E0FF
  text: colors.light.onSurface,
  textMuted: colors.light.onSurfaceVariant,
  outlineVariant: colors.light.outlineVariant,
  orange: '#FF914E',
  orangeLight: '#FFF0E6',
  card: '#FFFFFF',
  cardShadow: '#000000',
  // Avatar placeholder colours
  avatar1Bg: '#E1E0FF',
  avatar1Text: '#4648D4',
  avatar2Bg: '#FFD8C0',
  avatar2Text: '#9B4500',
  avatar3Bg: '#CFE5FF',
  avatar3Text: '#1A5FA8',
} as const;

// ─── Floating animation hook (identical pattern to Onboarding 1) ─────────────
function useFloatAnimation(amplitude = 8, duration = 2400, phase = 0) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Delay start slightly so cards don't bob in perfect sync
    const timeout = setTimeout(() => {
      const float = Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -amplitude,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      float.start();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (translateY as any).__float = float;
    }, phase);

    return () => {
      clearTimeout(timeout);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (translateY as any).__float?.stop();
    };
  }, [translateY, amplitude, duration, phase]);

  return translateY;
}

// ─── Animated progress bar ────────────────────────────────────────────────────
function AnimatedProgressBar({
  targetPercent,
  color,
  delay = 0,
}: {
  targetPercent: number;
  color: string;
  delay?: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: targetPercent / 100,
      duration: 900,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width cannot use native driver
    });
    anim.start();
    return () => anim.stop();
  }, [progress, targetPercent, delay]);

  return (
    <View
      style={{
        height: 6,
        backgroundColor: color === C.orange ? C.orangeLight : C.primaryFixed,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
      <Animated.View
        style={{
          height: '100%',
          borderRadius: 3,
          backgroundColor: color,
          width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </View>
  );
}

// ─── Community Card (left-indigo-border, glass white) ────────────────────────
function CommunityCard() {
  const floatY = useFloatAnimation(7, 2600, 0);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatY }],
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: C.card,
          borderRadius: radius.lg,
          borderLeftWidth: 3,
          borderLeftColor: C.primary,
          paddingHorizontal: 12,
          paddingVertical: 12,
          elevation: 8,
          shadowColor: C.cardShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.13,
          shadowRadius: 12,
          gap: 10,
        }}>

        {/* Header row: avatars + member count */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* Avatar 1 */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: C.avatar1Bg,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: C.card,
            }}>
            <Text style={{ fontSize: 11, fontFamily: typography.family.sansBold, color: C.avatar1Text }}>A</Text>
          </View>

          {/* Avatar 2 — overlaps slightly */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: C.avatar2Bg,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: C.card,
              marginLeft: -10,
            }}>
            <Text style={{ fontSize: 11, fontFamily: typography.family.sansBold, color: C.avatar2Text }}>B</Text>
          </View>

          {/* +12 count badge */}
          <View
            style={{
              backgroundColor: C.primaryFixed,
              borderRadius: radius.full,
              paddingHorizontal: 6,
              paddingVertical: 2,
              marginLeft: -6,
            }}>
            <Text
              style={{
                fontSize: 9,
                fontFamily: typography.family.sansBold,
                color: C.primary,
                lineHeight: 13,
              }}>
              +12
            </Text>
          </View>
        </View>

        {/* Small progress bar */}
        <AnimatedProgressBar targetPercent={68} color={C.primary} delay={400} />

        {/* Forum label */}
        <Text
          style={{
            fontFamily: typography.family.sansSemibold,
            fontSize: 11,
            color: C.text,
            lineHeight: 16,
          }}>
          Community Forum
        </Text>

        {/* New Message indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          {/* Chat icon — simple circles */}
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: C.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 8, color: C.primaryFg, lineHeight: 10 }}>💬</Text>
          </View>
          <Text
            style={{
              fontFamily: typography.family.sansMedium,
              fontSize: 10,
              color: C.textMuted,
              lineHeight: 14,
            }}>
            New Message
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Journey / Progress Card (left-orange-border, glass white) ────────────────
function JourneyCard() {
  const floatY = useFloatAnimation(6, 2800, 400);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatY }],
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: C.card,
          borderRadius: radius.lg,
          borderLeftWidth: 3,
          borderLeftColor: C.orange,
          paddingHorizontal: 12,
          paddingVertical: 12,
          elevation: 8,
          shadowColor: C.cardShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.13,
          shadowRadius: 12,
          gap: 10,
        }}>

        {/* Title */}
        <Text
          style={{
            fontFamily: typography.family.sansBold,
            fontSize: 12,
            color: C.text,
            lineHeight: 18,
          }}>
          Your Journey
        </Text>

        {/* Progress item 1: JavaScript 85% */}
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: typography.family.mono,
                fontSize: 9,
                color: C.orange,
                letterSpacing: 0.5,
              }}>
              JAVASCRIPT
            </Text>
            <Text
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 9,
                color: C.text,
              }}>
              85%
            </Text>
          </View>
          <AnimatedProgressBar targetPercent={85} color={C.orange} delay={300} />
        </View>

        {/* Progress item 2: React Basics 42% */}
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: typography.family.mono,
                fontSize: 9,
                color: C.primary,
                letterSpacing: 0.5,
              }}>
              REACT BASICS
            </Text>
            <Text
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 9,
                color: C.text,
              }}>
              42%
            </Text>
          </View>
          <AnimatedProgressBar targetPercent={42} color={C.primary} delay={500} />
        </View>

        {/* Achievement badge row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: C.orangeLight,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 10, lineHeight: 13 }}>⭐</Text>
          </View>
          <Text
            style={{
              fontFamily: typography.family.sansSemibold,
              fontSize: 10,
              color: C.orange,
              lineHeight: 14,
            }}>
            Level 4 Mentor
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Center Achievement Badge ─────────────────────────────────────────────────
function CenterBadge() {
  const floatY = useFloatAnimation(5, 2200, 200);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatY }],
        alignSelf: 'center',
        position: 'absolute',
        top: '30%',
        // horizontally centred by alignSelf
        zIndex: 10,
      }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: C.card,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 16,
          shadowColor: C.orange,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.28,
          shadowRadius: 16,
        }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: C.orange,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Groups / community icon via emoji — avoids adding icons deps */}
          <Text style={{ fontSize: 24, lineHeight: 30 }}>👥</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Illustration section ─────────────────────────────────────────────────────
function Illustration() {
  return (
    <View style={{ position: 'relative', minHeight: 200 }}>
      {/* Soft background blobs */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: -24,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: colors.light.primaryFixed,
          opacity: 0.6,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 30,
          right: -16,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.light.secondaryFixed,
          opacity: 0.55,
        }}
      />

      {/* Cards row */}
      <View
        style={{
          flexDirection: 'row',
          gap: spacing[3],
          paddingTop: spacing[4],
          paddingBottom: spacing[8],
          alignItems: 'flex-start',
        }}>
        <CommunityCard />
        <JourneyCard />
      </View>

      {/* Centre badge overlapping the two cards */}
      <CenterBadge />
    </View>
  );
}

// ─── Progress Dots (3 total, second active) ────────────────────────────────────
function ProgressDots() {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => {
        const isActive = i === 1; // middle dot is active on Onboarding 2
        return (
          <View
            key={i}
            style={{
              height: 8,
              width: isActive ? 24 : 8,
              borderRadius: 4,
              backgroundColor: isActive ? C.primary : C.outlineVariant,
            }}
          />
        );
      })}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function Onboarding2Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    // Navigate to Onboarding 3 (the final onboarding screen)
    router.push('/onboarding3');
  };

  const handleBack = () => {
    // Go back to Onboarding 1 via the stack
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Math.max(insets.bottom, spacing[5]),
          paddingTop: Math.max(insets.top, spacing[2]),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Top navigation bar ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[4],
          }}>
          <Text
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 18,
              color: C.primary,
              lineHeight: 24,
            }}>
            Pemula Code
          </Text>

          {/* Spacer — no Skip on the last onboarding screen */}
          <View />
        </View>

        {/* ── Illustration ── */}
        <View style={{ paddingHorizontal: spacing[5] }}>
          <Illustration />
        </View>

        {/* ── Text content ── */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing[5],
            paddingTop: spacing[4],
            gap: spacing[5],
          }}>

          {/* Heading */}
          <Text
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 26,
              lineHeight: 34,
              color: C.text,
              textAlign: 'center',
            }}>
            {'Join the Community\n'}
            <Text style={{ color: C.primary }}>{'& Track Progress'}</Text>
          </Text>

          {/* Body */}
          <Text
            style={{
              fontFamily: typography.family.sans,
              fontSize: 15,
              lineHeight: 24,
              color: C.textMuted,
              textAlign: 'center',
              paddingHorizontal: spacing[2],
            }}>
            {"Don't learn alone. Collaborate with thousands of fellow developers, share code, and monitor your skill growth with advanced analytics."}
          </Text>

          {/* Progress dots */}
          <ProgressDots />
        </View>

        {/* ── Buttons ── */}
        <View
          style={{
            paddingHorizontal: spacing[5],
            paddingTop: spacing[6],
            gap: spacing[3],
            paddingBottom: spacing[2],
          }}>

          {/* Primary: Next → Onboarding 3 */}
          <Pressable
            accessibilityLabel="Next — go to onboarding step 3"
            accessibilityRole="button"
            onPress={handleNext}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed ? C.primaryPressed : C.primary,
              borderRadius: radius.full,
              elevation: 8,
              flexDirection: 'row',
              gap: spacing[2],
              justifyContent: 'center',
              minHeight: 56,
              paddingHorizontal: spacing[6],
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.28,
              shadowRadius: 16,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}>
            <Text
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 16,
                color: C.primaryFg,
                lineHeight: 24,
                letterSpacing: 0.3,
              }}>
              Next  →
            </Text>
          </Pressable>

          {/* Secondary: Back */}
          <Pressable
            accessibilityLabel="Back to previous onboarding step"
            accessibilityRole="button"
            onPress={handleBack}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: 'transparent',
              borderRadius: radius.full,
              flexDirection: 'row',
              justifyContent: 'center',
              minHeight: 48,
              opacity: pressed ? 0.5 : 1,
              paddingHorizontal: spacing[6],
            })}>
            <Text
              style={{
                fontFamily: typography.family.sansSemibold,
                fontSize: 15,
                color: C.primary,
                lineHeight: 22,
              }}>
              Back
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}