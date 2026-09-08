import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';

// ─── Floating animation hook ─────────────
function useFloatAnimation(amplitude = 8, duration = 2400, phase = 0) {
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
  const { colors } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: targetPercent / 100,
      duration: 900,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, targetPercent, delay]);

  return (
    <View
      style={{
        height: 6,
        backgroundColor: colors.surfaceContainerHigh,
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

// ─── Community Card ────────────────────────────────────────
function CommunityCard() {
  const { colors } = useTheme();
  const floatY = useFloatAnimation(7, 2600, 0);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatY }],
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: colors.surfaceContainerLowest,
          borderRadius: radius.lg,
          borderLeftWidth: 3,
          borderLeftColor: colors.primary,
          paddingHorizontal: 12,
          paddingVertical: 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.13,
          shadowRadius: 12,
          gap: 10,
        }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.primaryFixed,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.surfaceContainerLowest,
            }}>
            <Text style={{ fontSize: 11, fontFamily: typography.family.sansBold, color: colors.primary }}>A</Text>
          </View>

          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.secondaryFixed,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.surfaceContainerLowest,
              marginLeft: -10,
            }}>
            <Text style={{ fontSize: 11, fontFamily: typography.family.sansBold, color: colors.secondary }}>B</Text>
          </View>

          <View
            style={{
              backgroundColor: colors.primaryFixed,
              borderRadius: radius.full,
              paddingHorizontal: 6,
              paddingVertical: 2,
              marginLeft: -6,
            }}>
            <Text
              style={{
                fontSize: 9,
                fontFamily: typography.family.sansBold,
                color: colors.primary,
                lineHeight: 13,
              }}>
              +12
            </Text>
          </View>
        </View>

        <AnimatedProgressBar targetPercent={68} color={colors.primary} delay={400} />

        <Text
          style={{
            fontFamily: typography.family.sansSemibold,
            fontSize: 11,
            color: colors.text,
            lineHeight: 16,
          }}>
          Community Forum
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 8, color: colors.onPrimary, lineHeight: 10 }}>💬</Text>
          </View>
          <Text
            style={{
              fontFamily: typography.family.sansMedium,
              fontSize: 10,
              color: colors.onSurfaceVariant,
              lineHeight: 14,
            }}>
            New Message
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Journey / Progress Card ────────────────
function JourneyCard() {
  const { colors } = useTheme();
  const floatY = useFloatAnimation(6, 2800, 400);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatY }],
        flex: 1,
      }}>
      <View
        style={{
          backgroundColor: colors.surfaceContainerLowest,
          borderRadius: radius.lg,
          borderLeftWidth: 3,
          borderLeftColor: colors.secondary,
          paddingHorizontal: 12,
          paddingVertical: 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.13,
          shadowRadius: 12,
          gap: 10,
        }}>

        <Text
          style={{
            fontFamily: typography.family.sansBold,
            fontSize: 12,
            color: colors.text,
            lineHeight: 18,
          }}>
          Your Journey
        </Text>

        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: typography.family.mono,
                fontSize: 9,
                color: colors.secondary,
                letterSpacing: 0.5,
              }}>
              JAVASCRIPT
            </Text>
            <Text
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 9,
                color: colors.text,
              }}>
              85%
            </Text>
          </View>
          <AnimatedProgressBar targetPercent={85} color={colors.secondary} delay={300} />
        </View>

        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: typography.family.mono,
                fontSize: 9,
                color: colors.primary,
                letterSpacing: 0.5,
              }}>
              REACT BASICS
            </Text>
            <Text
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 9,
                color: colors.text,
              }}>
              42%
            </Text>
          </View>
          <AnimatedProgressBar targetPercent={42} color={colors.primary} delay={500} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.secondaryFixed,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 10, lineHeight: 13 }}>⭐</Text>
          </View>
          <Text
            style={{
              fontFamily: typography.family.sansSemibold,
              fontSize: 10,
              color: colors.secondary,
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
  const { colors } = useTheme();
  const floatY = useFloatAnimation(5, 2200, 200);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatY }],
        alignSelf: 'center',
        position: 'absolute',
        top: '30%',
        zIndex: 10,
      }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.surfaceContainerLowest,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 16,
          shadowColor: colors.secondary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.28,
          shadowRadius: 16,
        }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.secondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 24, lineHeight: 30 }}>👥</Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Illustration section ─────────────────────────────────────────────────────
function Illustration() {
  const { colors } = useTheme();

  return (
    <View style={{ position: 'relative', minHeight: 200 }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: -24,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: colors.primaryFixed,
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
          backgroundColor: colors.secondaryFixed,
          opacity: 0.55,
        }}
      />

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

      <CenterBadge />
    </View>
  );
}

// ─── Progress Dots ────────────────────────────────────
function ProgressDots() {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => {
        const isActive = i === 1;
        return (
          <View
            key={i}
            style={{
              height: 8,
              width: isActive ? 24 : 8,
              borderRadius: 4,
              backgroundColor: isActive ? colors.primary : colors.outlineVariant,
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
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    router.push('/onboarding3');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Math.max(insets.bottom, spacing[5]),
          paddingTop: Math.max(insets.top, spacing[2]),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

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
              color: colors.primary,
              lineHeight: 24,
            }}>
            Pemula Code
          </Text>

          <View />
        </View>

        <View style={{ paddingHorizontal: spacing[5] }}>
          <Illustration />
        </View>

        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing[5],
            paddingTop: spacing[4],
            gap: spacing[5],
          }}>
          <Text
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 26,
              lineHeight: 34,
              color: colors.text,
              textAlign: 'center',
            }}>
            {t('joinCommunityTrack')}
          </Text>

          <Text
            style={{
              fontFamily: typography.family.sans,
              fontSize: 15,
              lineHeight: 24,
              color: colors.onSurfaceVariant,
              textAlign: 'center',
              paddingHorizontal: spacing[2],
            }}>
            {t('dontLearnAlone')}
          </Text>

          <ProgressDots />
        </View>

        <View
          style={{
            paddingHorizontal: spacing[5],
            paddingTop: spacing[6],
            gap: spacing[3],
            paddingBottom: spacing[2],
          }}>
          <Pressable
            accessibilityLabel={t('goToOnboardingStep3')}
            accessibilityRole="button"
            onPress={handleNext}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed ? colors.primaryPressed : colors.primary,
              borderRadius: radius.full,
              elevation: 8,
              flexDirection: 'row',
              gap: spacing[2],
              justifyContent: 'center',
              minHeight: 56,
              paddingHorizontal: spacing[6],
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.28,
              shadowRadius: 16,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}>
            <Text
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 16,
                color: colors.onPrimary,
                lineHeight: 24,
                letterSpacing: 0.3,
              }}>
              {t('next')}
            </Text>
          </Pressable>

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
                color: colors.primary,
                lineHeight: 22,
              }}>
              {t('back')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
