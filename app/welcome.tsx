import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BookOpenCheck, Code2, Trophy } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, useWindowDimensions, View } from 'react-native';

import { AppLogo } from '@/components/branding/AppLogo';
import { AppVersion } from '@/components/common/AppVersion';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';

const CHIPS = [
  { icon: Code2, label: 'Playground' },
  { icon: BookOpenCheck, label: 'Kurikulum' },
  { icon: Trophy, label: 'Ranking' },
];

import { useTranslation } from '@/translations';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const compact = height < 760;

  const CHIPS = [
    { icon: Code2, label: t('playground') },
    { icon: BookOpenCheck, label: t('curriculum') },
    { icon: Trophy, label: t('leaderboard') },
  ];

  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fade, {
      duration: 480,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [fade]);

  const CODE_LINES: { color: string; width: `${number}%`; indent?: number }[] = [
    { color: colors.primary, width: '38%' },
    { color: colors.secondary, width: '62%', indent: 1 },
    { color: colors.outlineVariant, width: '48%', indent: 1 },
    { color: colors.outlineVariant, width: '55%', indent: 2 },
    { color: colors.primary, width: '30%' },
  ];

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          minHeight: height,
          paddingBottom: compact ? spacing[5] : spacing[8],
          paddingHorizontal: spacing[5],
          paddingTop: compact ? spacing[10] : spacing[2],
        }}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={{ alignItems: 'center', opacity: fade }}>
          {/* Brand row */}
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: spacing[3],
              marginBottom: spacing[5],
            }}>
            <AppLogo shadow size={40} />
            <AppText
              color={colors.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              Pemula Code
            </AppText>
          </View>

          {/* Code-window illustration */}
          <View
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 6,
              overflow: 'hidden',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 18,
              width: '100%',
            }}>
            {/* Title bar */}
            <View
              style={{
                alignItems: 'center',
                backgroundColor: colors.surfaceContainerLow,
                borderBottomColor: colors.outlineVariant,
                borderBottomWidth: 1,
                flexDirection: 'row',
                gap: spacing[2],
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
              }}>
              <View style={{ backgroundColor: '#EF4444', borderRadius: radius.full, height: 10, width: 10 }} />
              <View style={{ backgroundColor: '#F59E0B', borderRadius: radius.full, height: 10, width: 10 }} />
              <View style={{ backgroundColor: '#22C55E', borderRadius: radius.full, height: 10, width: 10 }} />
              <AppText
                color={colors.onSurfaceVariant}
                style={{ fontFamily: typography.family.mono, fontSize: 11, marginLeft: spacing[2] }}>
                app.js
              </AppText>
            </View>

            {/* Fake code lines */}
            <View style={{ gap: spacing[3], padding: spacing[5] }}>
              {CODE_LINES.map((line, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: line.color,
                    borderRadius: radius.sm,
                    height: 10,
                    marginLeft: (line.indent ?? 0) * spacing[4],
                    opacity: line.color === colors.outlineVariant ? 1 : 0.85,
                    width: line.width,
                  }}
                />
              ))}
            </View>

            {/* Bottom badge strip */}
            <View
              style={{
                alignItems: 'center',
                backgroundColor: colors.primaryFixed,
                borderTopColor: colors.outlineVariant,
                borderTopWidth: 1,
                flexDirection: 'row',
                gap: spacing[2],
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[3],
              }}>
              <Trophy color={colors.primary} size={16} />
              <AppText
                color={colors.primary}
                style={{ fontFamily: typography.family.sansBold, fontSize: 13 }}>
                +50 XP
              </AppText>
            </View>
          </View>

          {/* Headline */}
          <AppText
            color={colors.text}
            style={{
              fontFamily: typography.family.sansExtraBold,
              fontSize: 26,
              lineHeight: 34,
              marginTop: spacing[6],
              textAlign: 'center',
            }}>
            {t('welcomeTitle')}
          </AppText>
          <AppText
            color={colors.onSurfaceVariant}
            style={{
              fontSize: 15,
              lineHeight: 22,
              marginTop: spacing[2],
              maxWidth: 300,
              opacity: 0.85,
              textAlign: 'center',
            }}>
            {t('welcomeSubtitle')}
          </AppText>

          {/* Feature chips */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: spacing[2],
              justifyContent: 'center',
              marginTop: spacing[5],
            }}>
            {CHIPS.map(({ icon: Icon, label }) => (
              <View
                key={label}
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.surfaceContainerLow,
                  borderColor: colors.outlineVariant,
                  borderRadius: radius.full,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: spacing[2],
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[2],
                }}>
                <Icon color={colors.primary} size={15} />
                <AppText
                  color={colors.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                  }}>
                  {label}
                </AppText>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={{ gap: spacing[3], marginTop: spacing[4], width: '100%' }}>
            <PrimaryButton
              accessibilityLabel={t('getStarted')}
              accessibilityRole="button"
              onPress={() => router.push('/onboarding')}
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.primaryPressed : colors.primary,
                borderRadius: radius.full,
                elevation: 8,
                minHeight: 56,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.22,
                shadowRadius: 18,
              })}
              title={t('getStarted')}
            />

            <SecondaryButton
              accessibilityLabel={t('login')}
              accessibilityRole="button"
              onPress={() => router.push('/(auth)/login')}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? colors.surfaceContainer
                  : colors.surfaceContainerLow,
                borderColor: colors.outlineVariant,
                borderRadius: radius.full,
                borderWidth: 1,
                minHeight: 56,
              })}
              title={t('login')}
            />
          </View>

          <View style={{ marginTop: spacing[4] }}>
            <AppVersion />
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}