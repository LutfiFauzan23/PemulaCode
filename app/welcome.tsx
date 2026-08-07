import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, useWindowDimensions, View } from 'react-native';

import { AppLogo } from '@/components/branding/AppLogo';
import { HeroIllustration } from '@/components/branding/HeroIllustration';
import { AppVersion } from '@/components/common/AppVersion';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

function useFadeUpAnimation(delay: number) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      delay,
      duration: 720,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [36, 0],
  });

  return {
    opacity: progress,
    transform: [{ translateY }],
  };
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const brandingStyle = useFadeUpAnimation(120);
  const heroStyle = useFadeUpAnimation(300);
  const actionsStyle = useFadeUpAnimation(480);
  const compact = height < 760;

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" backgroundColor={colors.light.background} />
      <View
        className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full"
        style={{ backgroundColor: colors.light.primaryFixed, opacity: 0.55 }}
      />
      <View
        className="absolute -bottom-24 -right-28 h-[360px] w-[360px] rounded-full"
        style={{ backgroundColor: colors.light.secondaryFixed, opacity: 0.48 }}
      />
      <View
        className="absolute left-14 top-[42%] h-[260px] w-[260px] rounded-full"
        style={{ backgroundColor: colors.light.tertiaryFixedDim, opacity: 0.2 }}
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          minHeight: height,
          paddingBottom: compact ? spacing[5] : spacing[8],
          paddingHorizontal: spacing[5],
          paddingTop: compact ? spacing[4] : spacing[8],
        }}
        showsVerticalScrollIndicator={false}>
        <View className="mx-auto w-full max-w-[430px] items-center">
          <Animated.View className="items-center" style={brandingStyle}>
            <AppLogo shadow size={80} />
            <AppText
              className="mt-4 text-center"
              color={colors.light.onSurface}
              numberOfLines={1}
              style={{ fontFamily: typography.family.sansExtraBold, fontSize: 28, lineHeight: 36 }}>
              Pemula Code
            </AppText>
            <AppText
              className="mt-1 text-center"
              color={colors.light.onSurfaceVariant}
              numberOfLines={2}
              style={{ fontSize: 16, lineHeight: 24, opacity: 0.82 }}>
              Your journey to mastery starts here.
            </AppText>
          </Animated.View>

          <Animated.View className="w-full" style={heroStyle}>
            <HeroIllustration />
          </Animated.View>

          <Animated.View className="w-full" style={[actionsStyle, { gap: spacing[4] }]}>
            <PrimaryButton
              accessibilityLabel="Get Started"
              accessibilityRole="button"
              onPress={() => router.push('/onboarding')}
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.light.primaryPressed : colors.light.primary,
                borderRadius: radius.full,
                elevation: 8,
                minHeight: 56,
                shadowColor: colors.light.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.22,
                shadowRadius: 18,
              })}
              title="Get Started"
            />

            <SecondaryButton
              accessibilityLabel="Sign In"
              accessibilityRole="button"
              onPress={() => router.push('/(auth)/login')}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? colors.light.surfaceContainer
                  : colors.light.surfaceContainerLow,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius.full,
                borderWidth: 1,
                minHeight: 56,
              })}
              title="Sign In"
            />

            <View className="mt-2">
              <AppVersion />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

