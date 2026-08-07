import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, View } from 'react-native';

import { AppLogo } from '@/components/branding/AppLogo';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function SplashScreen() {
  const router = useRouter();
  const animationProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(animationProgress, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();

    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2200);

    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [animationProgress, router]);

  const logoScale = animationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const textTranslateY = animationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" backgroundColor={colors.light.background} />

      <View className="items-center justify-center px-6">
        {/* App Logo */}
        <Animated.View
          style={{
            opacity: animationProgress,
            transform: [{ scale: logoScale }],
          }}>
          <AppLogo shadow size={80} />
        </Animated.View>

        {/* Text Container */}
        <Animated.View
          className="mt-4 items-center"
          style={{
            opacity: animationProgress,
            transform: [{ translateY: textTranslateY }],
          }}>
          <AppText
            className="text-center"
            color={colors.light.onSurface}
            numberOfLines={1}
            style={{
              fontFamily: typography.family.sansExtraBold,
              fontSize: 28,
              lineHeight: 36,
            }}>
            Pemula Code
          </AppText>
          <AppText
            className="mt-1 text-center"
            color={colors.light.onSurfaceVariant}
            numberOfLines={2}
            style={{
              fontSize: 16,
              lineHeight: 24,
              opacity: 0.82,
            }}>
            Your journey to mastery starts here.
          </AppText>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

