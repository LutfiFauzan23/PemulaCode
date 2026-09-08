/**
 * Onboarding Screen 3 — "Learn HTML, CSS, and JavaScript"
 *
 * NEW FILE: the final onboarding screen. Only this file is created.
 * Routing: automatically picked up by Expo Router from app/onboarding3.tsx.
 *          No changes to _layout.tsx needed (headerShown: false via screenOptions).
 *
 * Navigation:
 *   Skip        → router.replace('/(auth)/login') → existing Login screen
 *   Login       → router.replace('/(auth)/login') → existing Login screen
 *   Back        → router.back()                   → Onboarding 2
 */

import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
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
import { useTranslation } from '@/translations';

// ─── Local colour aliases ────────────────────────────────────────────────────
const C = {
  bg: colors.light.background,            // #F7F9FB
  primary: colors.light.primary,          // #4648D4
  primaryFg: colors.light.onPrimary,      // #FFFFFF
  primaryPressed: colors.light.primaryPressed,
  primaryFixed: colors.light.primaryFixed, // #E1E0FF
  text: colors.light.onSurface,
  textMuted: colors.light.onSurfaceVariant,
  outlineVariant: colors.light.outlineVariant,
  orange: '#FF914E',
  orangeFixed: '#FFDBC9',
  tertiary: '#00629D',            // blue — used for JS / ES6+
  tertiaryFixed: '#CFE5FF',
  card: '#FFFFFF',
  illustrationBg: '#EEF0FF',
  decorLayer1: '#DDE0FF',
  decorLayer2: '#E8EAFF',
} as const;

// ─── Floating badge animation ────────────────────────────────────────────────
function useFloatAnimation(amplitude = 6, duration = 2400, phase = 0) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    }, phase);

    return () => clearTimeout(timeout);
  }, [translateY, amplitude, duration, phase]);

  return translateY;
}

// ─── Fade-up entrance animation ───────────────────────────────────────────────
function useFadeUp(delay = 0) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: 600,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, delay]);

  return {
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };
}

// ─── Floating badge pill ─────────────────────────────────────────────────────
function FloatingBadge({
  label,
  emoji,
  bgColor,
  textColor,
  floatPhase = 0,
}: {
  label: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  floatPhase?: number;
}) {
  const floatY = useFloatAnimation(5, 2000, floatPhase);
  return (
    <Animated.View style={{ transform: [{ translateY: floatY }] }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: C.card,
          borderRadius: radius.full,
          paddingHorizontal: 10,
          paddingVertical: 6,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        }}>
        {/* Coloured dot */}
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 9, lineHeight: 12 }}>{emoji}</Text>
        </View>
        <Text
          style={{
            fontFamily: typography.family.sansSemibold,
            fontSize: 11,
            color: textColor,
            lineHeight: 16,
          }}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Main illustration card ───────────────────────────────────────────────────
function IllustrationCard() {
  const floatCard = useFloatAnimation(5, 3000, 0);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatCard }],
        position: 'relative',
        alignItems: 'center',
      }}>
      {/* Rotated decorative layer 2 (back) */}
      <View
        style={{
          position: 'absolute',
          top: 8,
          left: 12,
          right: 12,
          bottom: -8,
          borderRadius: radius['2xl'],
          backgroundColor: C.decorLayer2,
          transform: [{ rotate: '-4deg' }],
          zIndex: 0,
        }}
      />
      {/* Rotated decorative layer 1 (middle) */}
      <View
        style={{
          position: 'absolute',
          top: 4,
          left: 8,
          right: 8,
          bottom: -4,
          borderRadius: radius['2xl'],
          backgroundColor: C.decorLayer1,
          transform: [{ rotate: '-2deg' }],
          zIndex: 1,
        }}
      />

      {/* Main illustration card */}
      <View
        style={{
          width: '100%',
          borderRadius: radius['2xl'],
          backgroundColor: C.illustrationBg,
          overflow: 'hidden',
          zIndex: 2,
          elevation: 12,
          shadowColor: C.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          aspectRatio: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* Reuse the project's existing welcome-hero.png which shows a coding theme */}
        <Image
          source={require('../assets/images/welcome-hero.png')}
          style={{
            width: '90%',
            height: '90%',
          }}
          resizeMode="contain"
        />

        {/* Tech icon tags scattered inside the card */}
        <View style={{ position: 'absolute', top: 14, left: 14 }}>
          <TechTag label="<html>" color={C.primary} bgColor={C.primaryFixed} />
        </View>
        <View style={{ position: 'absolute', top: 14, right: 14 }}>
          <TechTag label="{css}" color={C.orange} bgColor={C.orangeFixed} />
        </View>
        <View style={{ position: 'absolute', bottom: 14, left: 14 }}>
          <TechTag label="js()" color={C.tertiary} bgColor={C.tertiaryFixed} />
        </View>
        <View style={{ position: 'absolute', bottom: 14, right: 14 }}>
          <TechTag label="</ >" color={C.primary} bgColor={C.primaryFixed} />
        </View>
      </View>

      {/* Floating badge — top-right, above the card */}
      <View style={{ position: 'absolute', top: -10, right: -6, zIndex: 20 }}>
        <FloatingBadge
          label="Interactive"
          emoji="⚡"
          bgColor={C.primaryFixed}
          textColor={C.primary}
          floatPhase={0}
        />
      </View>

      {/* Floating badge — bottom-left, below the card */}
      <View style={{ position: 'absolute', bottom: -10, left: -6, zIndex: 20 }}>
        <FloatingBadge
          label="Gamified"
          emoji="🎮"
          bgColor={C.orangeFixed}
          textColor={C.orange}
          floatPhase={300}
        />
      </View>
    </Animated.View>
  );
}

// ─── Small inline tech tag (inside illustration) ─────────────────────────────
function TechTag({
  label,
  color,
  bgColor,
}: {
  label: string;
  color: string;
  bgColor: string;
}) {
  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderRadius: radius.sm,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderLeftWidth: 2,
        borderLeftColor: color,
      }}>
      <Text
        style={{
          fontFamily: typography.family.mono,
          fontSize: 10,
          color,
          lineHeight: 14,
        }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Technology chip ─────────────────────────────────────────────────────────
function TechChip({
  label,
  color,
  bgColor,
}: {
  label: string;
  color: string;
  bgColor: string;
}) {
  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: color,
        paddingHorizontal: 14,
        paddingVertical: 6,
      }}>
      <Text
        style={{
          fontFamily: typography.family.sansSemibold,
          fontSize: 13,
          color,
          lineHeight: 18,
        }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Progress Dots (3 total, third/rightmost active) ─────────────────────────
function ProgressDots() {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => {
        const isActive = i === 2; // rightmost dot active — Onboarding 3 of 3
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
export default function Onboarding3Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // Entrance animations for content sections
  const illustrationStyle = useFadeUp(80);
  const textStyle = useFadeUp(220);
  const bottomStyle = useFadeUp(360);

  const goToLogin = () => {
    // End of onboarding — navigate to the existing Login screen
    router.replace('/(auth)/login');
  };

  const handleBack = () => {
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

          {/* Skip — finishes onboarding and enters the app */}
          <Pressable
            accessibilityLabel={t('skipOnboarding')}
            accessibilityRole="button"
            hitSlop={12}
            onPress={goToLogin}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Text
              style={{
                fontFamily: typography.family.sansMedium,
                fontSize: 15,
                color: C.textMuted,
                lineHeight: 22,
              }}>
              {t('skip')}
            </Text>
          </Pressable>
        </View>

        {/* ── Illustration ── */}
        <Animated.View
          style={[
            illustrationStyle,
            {
              paddingHorizontal: spacing[6],
              paddingBottom: spacing[6],
              paddingTop: spacing[2],
            },
          ]}>
          <IllustrationCard />
        </Animated.View>

        {/* ── Text content ── */}
        <Animated.View
          style={[
            textStyle,
            {
              flex: 1,
              paddingHorizontal: spacing[5],
              gap: spacing[4],
            },
          ]}>

          {/* Main title with colour-coded language names */}
          <Text
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 26,
              lineHeight: 34,
              color: C.text,
              textAlign: 'center',
            }}>
            {t('learnHtmlCssJavaScript')}
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              fontFamily: typography.family.sans,
              fontSize: 15,
              lineHeight: 24,
              color: C.textMuted,
              textAlign: 'center',
              paddingHorizontal: spacing[2],
            }}>
            {t('masterFrontEnd')}
          </Text>

          {/* Technology chips row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: spacing[2],
              flexWrap: 'wrap',
            }}>
            <TechChip label="HTML5" color={C.primary} bgColor={C.primaryFixed} />
            <TechChip label="CSS3" color={C.orange} bgColor={C.orangeFixed} />
            <TechChip label="ES6+" color={C.tertiary} bgColor={C.tertiaryFixed} />
          </View>
        </Animated.View>

        {/* ── Stepper + Buttons ── */}
        <Animated.View
          style={[
            bottomStyle,
            {
              paddingHorizontal: spacing[5],
              paddingTop: spacing[5],
              gap: spacing[4],
              paddingBottom: spacing[2],
            },
          ]}>

          {/* Progress dots — rightmost dot active */}
          <ProgressDots />

          {/* Primary CTA: Get Started */}
          <Pressable
            accessibilityLabel={t('login')}
            accessibilityRole="button"
            onPress={goToLogin}
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
              {t('login')}
            </Text>
          </Pressable>

          {/* Secondary: Back */}
          <Pressable
            accessibilityLabel={t('goBackToPreviousStep')}
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
              {t('back')}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
