import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { Divider } from '@/components/ui/Divider';
import { GoogleIcon } from '@/components/ui/GoogleIcon';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SocialButton } from '@/components/ui/SocialButton';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function LoginScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // Temporary navigation to main tab app per requirement
    router.replace('/(tabs)');
  };

  const handleGoogleLogin = () => {
    // TODO: Google Authentication
  };

  const handleForgotPassword = () => {
    // TODO: Forgot Password navigation
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" backgroundColor={colors.light.background} />

      {/* Background Decorative Circles */}
      <View
        className="absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full"
        style={{ backgroundColor: colors.light.primaryFixed, opacity: 0.45 }}
      />
      <View
        className="absolute -bottom-24 -right-24 h-[340px] w-[340px] rounded-full"
        style={{ backgroundColor: colors.light.secondaryFixed, opacity: 0.4 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            minHeight: height,
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[6],
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Top Brand Header */}
          <View className="absolute left-6 top-6">
            <AppText
              color={colors.light.primary}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              Pemula Code
            </AppText>
          </View>

          {/* Main Card Container */}
          <View className="mx-auto w-full max-w-[430px]">
            <View
              className="w-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.light.outlineVariant,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                elevation: 10,
                paddingHorizontal: spacing[6],
                paddingVertical: spacing[8],
                shadowColor: colors.light.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
              }}>
              {/* Title & Subtitle */}
              <View className="items-center text-center" style={{ marginBottom: spacing[8] }}>
                <AppText
                  color={colors.light.text}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 28,
                    lineHeight: 36,
                  }}>
                  Welcome Back
                </AppText>
                <AppText
                  className="mt-2 text-center"
                  color={colors.light.onSurfaceVariant}
                  numberOfLines={2}
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                  }}>
                  Log in to continue your coding journey
                </AppText>
              </View>

              {/* Form Inputs Container */}
              <View className="w-full" style={{ gap: spacing[5] }}>
                {/* Email Input */}
                <AppInput
                  accessibilityLabel="Email Address"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  label="Email Address"
                  leftIcon={<Mail color={colors.light.outline} size={20} />}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  value={email}
                />

                {/* Password Input & Forgot Password Link */}
                <View className="w-full">
                  <PasswordInput
                    accessibilityLabel="Password"
                    autoComplete="password"
                    label="Password"
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    value={password}
                  />
                  <View style={{ alignItems: 'flex-end', marginTop: spacing[2] }}>
                    <Pressable
                      accessibilityLabel="Forgot Password"
                      accessibilityRole="button"
                      hitSlop={8}
                      onPress={handleForgotPassword}>
                      <AppText
                        color={colors.light.primary}
                        style={{
                          fontFamily: typography.family.mono,
                          fontSize: 13,
                          lineHeight: 18,
                        }}>
                        Forgot Password?
                      </AppText>
                    </Pressable>
                  </View>
                </View>

                {/* Remember Me Checkbox Row */}
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
                  <Pressable
                    accessibilityLabel="Remember Me"
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: rememberMe }}
                    className="h-5 w-5 items-center justify-center rounded"
                    onPress={() => setRememberMe((prev) => !prev)}
                    style={{
                      backgroundColor: rememberMe
                        ? colors.light.primary
                        : colors.light.surfaceContainerLow,
                      borderColor: rememberMe
                        ? colors.light.primary
                        : colors.light.outlineVariant,
                      borderWidth: 1,
                    }}>
                    {rememberMe ? (
                      <AppText
                        color={colors.light.onPrimary}
                        style={{ fontSize: 12, fontWeight: 'bold' }}>
                        ✓
                      </AppText>
                    ) : null}
                  </Pressable>
                  <AppText
                    color={colors.light.text}
                    style={{ fontSize: 14, lineHeight: 20 }}>
                    Remember Me
                  </AppText>
                </View>

                {/* Login Button */}
                <PrimaryButton
                  accessibilityLabel="Login"
                  accessibilityRole="button"
                  onPress={handleLogin}
                  style={({ pressed }) => ({
                    backgroundColor: pressed
                      ? colors.light.primaryPressed
                      : colors.light.primary,
                    borderRadius: radius.lg,
                    elevation: 6,
                    minHeight: 52,
                    shadowColor: colors.light.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                  })}
                  title="Login"
                />

                {/* Divider */}
                <Divider text="OR" />

                {/* Google Login Button */}
                <SocialButton
                  accessibilityLabel="Continue with Google"
                  accessibilityRole="button"
                  icon={<GoogleIcon size={20} />}
                  onPress={handleGoogleLogin}
                  title="Continue with Google"
                />

                {/* Register Link */}
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: spacing[1],
                    justifyContent: 'center',
                    marginTop: spacing[2],
                  }}>
                  <AppText color={colors.light.onSurfaceVariant} style={{ fontSize: 15 }}>
                    Don't have an account?
                  </AppText>
                  <Pressable
                    accessibilityLabel="Register"
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={handleRegister}>
                    <AppText
                      color={colors.light.primary}
                      style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                      Register
                    </AppText>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
