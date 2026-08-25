/**
 * Onboarding Screen 1 — "Practice with Interactive Coding"
 *
 * NEW FILE: does not modify any existing screen, component, or constant.
 * Routing: already declared in app/_layout.tsx (<Stack.Screen name="onboarding" />)
 *          and already triggered by welcome.tsx (router.push('/onboarding')).
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

// ─── Colour aliases (onboarding-specific, not modifying constants/colors.ts) ───
const C = {
  bg: colors.light.background,          // #F7F9FB
  primary: colors.light.primary,        // #4648D4
  primaryFg: colors.light.onPrimary,    // #FFFFFF
  primaryPressed: colors.light.primaryPressed,
  text: colors.light.onSurface,
  textMuted: colors.light.onSurfaceVariant,
  orange: '#FF914E',
  editorBg: '#1A1F2E',
  editorPane: '#141824',
  dotRed: '#FF5F57',
  dotYellow: '#FEBC2E',
  dotGreen: '#28C840',
  codeKeyword: '#C792EA',
  codeConst: '#82AAFF',
  codeString: '#C3E88D',
  codeFn: '#82AAFF',
  codeParam: '#FFCB6B',
  codePunct: '#89DDFF',
  codeComment: '#546E7A',
  codeDefault: '#EEFFFF',
} as const;

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

// ─── Floating (bob) animation hook ──────────────────────────────────────────
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

// ─── Code Editor Illustration ────────────────────────────────────────────────
function CodeEditorCard() {
  const cursorOpacity = useBlinkingCursor();
  const floatY = useFloatAnimation();

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatY }],
        // Lay out relative so the console badge can overlap
        position: 'relative',
        marginBottom: 24,  // extra space so the floating badge isn't clipped
      }}>
      {/* ── Main editor card ── */}
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
          {/* Window controls */}
          <View style={{ flexDirection: 'row', gap: 6, marginRight: 4 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.dotRed }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.dotYellow }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.dotGreen }} />
          </View>

          {/* Filename tab */}
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
            {/* JS icon */}
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
          {/* function welcomeLearner() { */}
          <CodeLine
            spans={[
              { text: 'function ', color: C.codeKeyword },
              { text: 'welcomeLearner', color: C.codeFn },
              { text: '() {', color: C.codePunct },
            ]}
          />

          {/* const status = "Coding..."; */}
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

          {/* console.log(`Ready to play?`); */}
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

          {/* return true; */}
          <CodeLine
            indent={1}
            spans={[
              { text: 'return ', color: C.codeKeyword },
              { text: 'true', color: C.codeConst },
              { text: ';', color: C.codePunct },
            ]}
          />

          {/* } */}
          <CodeLine spans={[{ text: '}', color: C.codePunct }]} />

          {/* blank line */}
          <CodeLine spans={[{ text: ' ', color: C.codeDefault }]} />

          {/* welcomeLearner(); + blinking cursor */}
          <Text style={{ fontFamily: typography.family.mono, fontSize: 12, lineHeight: 20 }}>
            <Text style={{ color: C.codeFn }}>welcomeLearner</Text>
            <Text style={{ color: C.codePunct }}>{'();'}</Text>
            <Animated.Text
              style={{
                opacity: cursorOpacity,
                color: C.primary,
                fontFamily: typography.family.mono,
                fontSize: 14,
              }}>
              {'█'}
            </Animated.Text>
          </Text>
        </View>
      </View>

      {/* ── Console Output floating badge ── */}
      <View
        style={{
          position: 'absolute',
          bottom: -20,
          right: 12,
          backgroundColor: '#FFFFFF',
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
        {/* Orange play icon */}
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: C.orange,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Triangle play shape via text */}
          <Text style={{ color: '#FFFFFF', fontSize: 11, lineHeight: 12, marginLeft: 2 }}>{'▶'}</Text>
        </View>

        <View>
          <Text
            style={{
              fontFamily: typography.family.sansSemibold,
              fontSize: 11,
              color: C.text,
              lineHeight: 16,
            }}>
            Console Output
          </Text>
          <Text
            style={{
              fontFamily: typography.family.mono,
              fontSize: 11,
              color: C.orange,
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
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 8,
            width: i === active ? 24 : 8,
            borderRadius: 4,
            backgroundColor: i === active ? C.primary : colors.light.outlineVariant,
          }}
        />
      ))}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    // Navigate to Onboarding 2 (placeholder exists at app/onboarding2.tsx)
    router.push('/onboarding2');
  };

  const handleSkip = () => {
    // TODO: connect to post-onboarding destination once the auth/home flow is finalised.
    // Do NOT change existing navigation or auth flow here.
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

          <Pressable
            accessibilityLabel="Skip onboarding"
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleSkip}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Text
              style={{
                fontFamily: typography.family.sansMedium,
                fontSize: 15,
                color: C.textMuted,
                lineHeight: 22,
              }}>
              Skip
            </Text>
          </Pressable>
        </View>

        {/* ── Illustration + content ── */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing[5],
            paddingTop: spacing[4],
            gap: spacing[6],
          }}>

          {/* Code editor illustration */}
          <CodeEditorCard />

          {/* Title */}
          <View style={{ alignItems: 'center', paddingTop: spacing[3] }}>
            <Text
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 26,
                lineHeight: 34,
                color: C.text,
                textAlign: 'center',
              }}>
              {'Practice with '}
              <Text style={{ color: C.primary }}>Interactive Coding</Text>
            </Text>
          </View>

          {/* Description */}
          <Text
            style={{
              fontFamily: typography.family.sans,
              fontSize: 15,
              lineHeight: 24,
              color: C.textMuted,
              textAlign: 'center',
              paddingHorizontal: spacing[2],
            }}>
            No need for complex setups. Write, run, and debug code directly in our built-in
            playground designed for mobile-first learners.
          </Text>

          {/* Progress dots — 3 total, first dot active (Onboarding 1 of 3) */}
          <ProgressDots total={3} active={0} />
        </View>

        {/* ── Next button ── */}
        <View
          style={{
            paddingHorizontal: spacing[5],
            paddingTop: spacing[6],
            paddingBottom: spacing[2],
          }}>
          <Pressable
            accessibilityLabel="Next — go to onboarding step 2"
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
        </View>
      </ScrollView>
    </View>
  );
}