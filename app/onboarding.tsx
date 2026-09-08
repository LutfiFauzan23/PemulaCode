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

// ─── Syntax-highlighted code line helper ────────────────────────────────────
type CodeSpan = { text: string; color: string };

function CodeLine({ spans, indent = 0 }: { spans: CodeSpan[]; indent?: number }) {
  return (
    <Text style={{ fontFamily: typography.family.mono, fontSize: 12, lineHeight: 20 }}>
      {'  '.repeat(indent)}
      {spans.map((s, i) => (
        <Text key={i} style={{ color: s.color }}>
          {s.text}
        </Text>
      ))}
    </Text>
  );
}

// ─── Blinking cursor hook ────────────────────────────────────────────────────
function useBlinkingCursor() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [opacity]);

  return opacity;
}

// ─── Floating animation hook ──────────────────────────────────────────
function useFloatAnimation() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -8,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    float.start();
    return () => float.stop();
  }, [translateY]);

  return translateY;
}

// ─── Code Editor Illustration ────────────────────────────────────────────────
function CodeEditorCard() {
  const { colors } = useTheme();
  const cursorOpacity = useBlinkingCursor();
  const floatY = useFloatAnimation();

  const C = {
    editorBg: '#1A1F2E',
    editorPane: '#141824',
    dotRed: '#FF5F57',
    dotYellow: '#FEBC2E',
    dotGreen: '#28C840',
    codeKeyword: '#C792EA',
    codeConst: '#82AAFF',
    codeString: '#C3E88D',
    codeFn: '#82AAFF',
    codePunct: '#89DDFF',
    codeDefault: '#EEFFFF',
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatY }],
        position: 'relative',
        marginBottom: 24,
      }}>
      <View
        style={{
          backgroundColor: C.editorBg,
          borderRadius: radius['2xl'],
          elevation: 18,
          overflow: 'visible',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.45,
          shadowRadius: 24,
          paddingBottom: 16,
        }}>
        {/* Title bar */}
        <View
          style={{
            backgroundColor: C.editorPane,
            borderTopLeftRadius: radius['2xl'],
            borderTopRightRadius: radius['2xl'],
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
          }}>
          <View style={{ flexDirection: 'row', gap: 6, marginRight: 4 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.dotRed }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.dotYellow }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.dotGreen }} />
          </View>

          <View
            style={{
              backgroundColor: C.editorBg,
              borderRadius: radius.sm,
              paddingHorizontal: 10,
              paddingVertical: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}>
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor: '#F0DB4F',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 8, fontFamily: typography.family.sansBold, color: '#323330' }}>
                JS
              </Text>
            </View>
            <Text
              style={{
                fontFamily: typography.family.mono,
                fontSize: 12,
                color: C.codeDefault,
              }}>
              playground.js
            </Text>
          </View>
        </View>

        {/* Code area */}
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8, gap: 0 }}>
          <CodeLine
            spans={[
              { text: 'function ', color: C.codeKeyword },
              { text: 'welcomeLearner', color: C.codeFn },
              { text: '() {', color: C.codePunct },
            ]}
          />
          <CodeLine
            indent={1}
            spans={[
              { text: 'const ', color: C.codeKeyword },
              { text: 'status', color: C.codeConst },
              { text: ' = ', color: C.codePunct },
              { text: '"Coding..."', color: C.codeString },
              { text: ';', color: C.codePunct },
            ]}
          />
          <CodeLine
            indent={1}
            spans={[
              { text: 'console', color: C.codeDefault },
              { text: '.', color: C.codePunct },
              { text: 'log', color: C.codeFn },
              { text: '(', color: C.codePunct },
              { text: '`Ready to play?`', color: C.codeString },
              { text: ');', color: C.codePunct },
            ]}
          />
          <CodeLine
            indent={1}
            spans={[
              { text: 'return ', color: C.codeKeyword },
              { text: 'true', color: C.codeConst },
              { text: ';', color: C.codePunct },
            ]}
          />
          <CodeLine spans={[{ text: '}', color: C.codePunct }]} />
          <CodeLine spans={[{ text: ' ', color: C.codeDefault }]} />

          <Text style={{ fontFamily: typography.family.mono, fontSize: 12, lineHeight: 20 }}>
            <Text style={{ color: C.codeFn }}>welcomeLearner</Text>
            <Text style={{ color: C.codePunct }}>{'();'}</Text>
            <Animated.Text
              style={{
                opacity: cursorOpacity,
                color: colors.primary,
                fontFamily: typography.family.mono,
                fontSize: 14,
              }}>
              {'█'}
            </Animated.Text>
          </Text>
        </View>
      </View>

      {/* Console Output floating badge */}
      <View
        style={{
          position: 'absolute',
          bottom: -20,
          right: 12,
          backgroundColor: colors.surfaceContainerLowest,
          borderRadius: radius.lg,
          paddingHorizontal: 14,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          minWidth: 160,
        }}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: '#FF914E',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#FFFFFF', fontSize: 11, lineHeight: 12, marginLeft: 2 }}>{'▶'}</Text>
        </View>

        <View>
          <Text
            style={{
              fontFamily: typography.family.sansSemibold,
              fontSize: 11,
              color: colors.text,
              lineHeight: 16,
            }}>
            Console Output
          </Text>
          <Text
            style={{
              fontFamily: typography.family.mono,
              fontSize: 11,
              color: '#FF914E',
              lineHeight: 16,
            }}>
            "Ready to play?"
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Progress Dots ───────────────────────────────────────────────────────────
function ProgressDots({ total = 4, active = 0 }: { total?: number; active?: number }) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 8,
            width: i === active ? 24 : 8,
            borderRadius: 4,
            backgroundColor: i === active ? colors.primary : colors.outlineVariant,
          }}
        />
      ))}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    router.push('/onboarding2');
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
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

        {/* Top navigation bar */}
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

          <Pressable
            accessibilityLabel={t('skipOnboarding')}
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleSkip}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Text
              style={{
                fontFamily: typography.family.sansMedium,
                fontSize: 15,
                color: colors.onSurfaceVariant,
                lineHeight: 22,
              }}>
              {t('skip')}
            </Text>
          </Pressable>
        </View>

        {/* Illustration + content */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing[5],
            paddingTop: spacing[4],
            gap: spacing[6],
          }}>
          <CodeEditorCard />

          <View style={{ alignItems: 'center', paddingTop: spacing[3] }}>
            <Text
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 26,
                lineHeight: 34,
                color: colors.text,
                textAlign: 'center',
              }}>
              {t('practiceInteractive')}
            </Text>
          </View>

          <Text
            style={{
              fontFamily: typography.family.sans,
              fontSize: 15,
              lineHeight: 24,
              color: colors.onSurfaceVariant,
              textAlign: 'center',
              paddingHorizontal: spacing[2],
            }}>
            {t('noNeedSetup')}
          </Text>

          <ProgressDots total={3} active={0} />
        </View>

        {/* Next button */}
        <View
          style={{
            paddingHorizontal: spacing[5],
            paddingTop: spacing[6],
            paddingBottom: spacing[2],
          }}>
          <Pressable
            accessibilityLabel={t('goToOnboardingStep2')}
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
        </View>
      </ScrollView>
    </View>
  );
}
