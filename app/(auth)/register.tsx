import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Contact,
  Lock,
  Mail,
  RotateCcw,
  ShieldCheck,
  Smile,
  UserPlus,
  Users,
} from 'lucide-react-native';
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
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export default function RegisterScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = () => {
    // UI only - no backend registration per requirement
  };

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" backgroundColor={colors.light.background} />

      {/* Decorative Background Shapes */}
      <View
        aria-hidden
        className="absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full"
        pointerEvents="none"
        style={{ backgroundColor: colors.light.primaryFixed, opacity: 0.45 }}
      />
      <View
        aria-hidden
        className="absolute -bottom-24 -right-24 h-[340px] w-[340px] rounded-full"
        pointerEvents="none"
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
          
          {/* Top Bar Header */}
          <View className="mb-4 flex-row items-center">
            <Pressable
              accessibilityLabel="Back"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.back()}
              style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
              <ArrowLeft color={colors.light.primary} size={20} />
              <AppText
                color={colors.light.primary}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 26,
                }}>
                Pemula Code
              </AppText>
            </Pressable>
          </View>

          {/* Main Card Container */}
          <View className="mx-auto w-full max-w-[430px]">
            {/* Header section with Icon */}
            <View className="items-center" style={{ marginBottom: spacing[5] }}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.light.primary,
                  borderRadius: radius.xl,
                  height: 64,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 64,
                }}>
                <UserPlus color={colors.light.primaryForeground} size={32} />
              </View>
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 28,
                  lineHeight: 36,
                  textAlign: 'center',
                }}>
                Join the Journey
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                numberOfLines={2}
                style={{
                  fontSize: 15,
                  lineHeight: 22,
                  marginTop: spacing[1],
                  textAlign: 'center',
                }}>
                Master programming with the encouraging mentor.
              </AppText>
            </View>

            {/* Registration Form Card */}
            <View
              className="w-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.light.outlineVariant,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                elevation: 10,
                paddingHorizontal: spacing[6],
                paddingVertical: spacing[6],
                shadowColor: colors.light.primary,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
              }}>
              <View className="w-full" style={{ gap: spacing[4] }}>
                {/* 1. Full Name */}
                <AppInput
                  accessibilityLabel="Full Name"
                  autoCapitalize="words"
                  autoComplete="name"
                  label="Full Name"
                  leftIcon={<Contact color={colors.light.outline} size={20} />}
                  onChangeText={setFullName}
                  placeholder="Enter your legal name"
                  value={fullName}
                />

                {/* 2. Nickname */}
                <AppInput
                  accessibilityLabel="Nickname"
                  autoCapitalize="words"
                  autoComplete="nickname"
                  label="Nickname"
                  leftIcon={<Smile color={colors.light.outline} size={20} />}
                  onChangeText={setNickname}
                  placeholder="How should we call you?"
                  value={nickname}
                />

                {/* 3. Email Address */}
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

                {/* 4. Password */}
                <PasswordInput
                  accessibilityLabel="Password"
                  autoComplete="new-password"
                  label="Password"
                  leftIcon={<Lock color={colors.light.outline} size={20} />}
                  onChangeText={setPassword}
                  placeholder="Min. 8 characters"
                  value={password}
                />

                {/* 5. Confirm Password */}
                <PasswordInput
                  accessibilityLabel="Confirm Password"
                  autoComplete="new-password"
                  label="Confirm Password"
                  leftIcon={<RotateCcw color={colors.light.outline} size={20} />}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                />

                {/* Create Account Button */}
                <PrimaryButton
                  accessibilityLabel="Create Account"
                  accessibilityRole="button"
                  onPress={handleCreateAccount}
                  rightIcon={<ArrowRight color={colors.light.primaryForeground} size={20} />}
                  style={({ pressed }) => ({
                    backgroundColor: pressed
                      ? colors.light.primaryPressed
                      : colors.light.primary,
                    borderRadius: radius.full,
                    elevation: 6,
                    minHeight: 52,
                    marginTop: spacing[2],
                    shadowColor: colors.light.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                  })}
                  title="Create Account"
                />

                {/* Bottom Action */}
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: spacing[1],
                    justifyContent: 'center',
                    marginTop: spacing[2],
                  }}>
                  <AppText color={colors.light.onSurfaceVariant} style={{ fontSize: 15 }}>
                    Already have an account?
                  </AppText>
                  <Pressable
                    accessibilityLabel="Log In"
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => router.push('/(auth)/login')}>
                    <AppText
                      color={colors.light.primary}
                      style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                      Log In
                    </AppText>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Decorative Social Proof */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: spacing[4],
                justifyContent: 'center',
                marginTop: spacing[6],
              }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
                <ShieldCheck color={colors.light.outline} size={14} />
                <AppText
                  color={colors.light.outline}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  }}>
                  SECURE DATA
                </AppText>
              </View>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
                <Code2 color={colors.light.outline} size={14} />
                <AppText
                  color={colors.light.outline}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  }}>
                  CLEAN CODE
                </AppText>
              </View>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
                <Users color={colors.light.outline} size={14} />
                <AppText
                  color={colors.light.outline}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  }}>
                  10K+ PEERS
                </AppText>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
