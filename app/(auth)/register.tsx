import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Contact, Lock, Mail, RotateCcw, Smile } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

// ======================================================
// DUO-STYLE 3D PRESS BUTTON
// ======================================================

function DuoButton({
  title,
  onPress,
  backgroundColor,
  shadowColor,
  textColor = '#ffffff',
  disabled,
}: {
  backgroundColor: string;
  disabled?: boolean;
  onPress: () => void;
  shadowColor: string;
  textColor?: string;
  title: string;
}) {
  const translateY = useRef(new Animated.Value(0)).current;

  const pressIn = () => {
    Animated.timing(translateY, { duration: 80, toValue: 4, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.timing(translateY, { duration: 80, toValue: 0, useNativeDriver: true }).start();
  };

  return (
    <View style={{ backgroundColor: shadowColor, borderRadius: radius.lg }}>
      <Pressable
        accessibilityLabel={title}
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}>
        <Animated.View
          style={{
            alignItems: 'center',
            backgroundColor: disabled ? colors.light.outline : backgroundColor,
            borderRadius: radius.lg,
            justifyContent: 'center',
            marginBottom: 4,
            paddingVertical: spacing[4],
            transform: [{ translateY }],
          }}>
          <AppText
            color={textColor}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 15,
              letterSpacing: 0.6,
            }}>
            {title.toUpperCase()}
          </AppText>
        </Animated.View>
      </Pressable>
    </View>
  );
}

// ======================================================
// SIMPLE BOT MASCOT (with graduation touch for sign-up)
// ======================================================

function BotMascot() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: spacing[2] }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 5,
          height: 10,
          marginBottom: -2,
          width: 4,
        }}
      />
      <View
        style={{
          backgroundColor: '#FFD166',
          borderRadius: 6,
          height: 12,
          marginBottom: 4,
          width: 12,
        }}
      />
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: radius.xl,
          height: 88,
          justifyContent: 'center',
          width: 96,
        }}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.light.text,
              borderRadius: 11,
              height: 22,
              justifyContent: 'center',
              width: 18,
            }}>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 3, height: 6, width: 6 }} />
          </View>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.light.text,
              borderRadius: 11,
              height: 22,
              justifyContent: 'center',
              width: 18,
            }}>
            <View style={{ backgroundColor: '#ffffff', borderRadius: 3, height: 6, width: 6 }} />
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.light.secondary,
            borderRadius: 4,
            height: 6,
            marginTop: spacing[2],
            width: 24,
          }}
        />
      </View>
    </View>
  );
}

// ======================================================
// REGISTER SCREEN
// ======================================================

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCreateAccount = () => {
    // UI only - no backend registration per requirement
  };

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="light" />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView bounces={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Header banner */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.light.primary,
              borderBottomLeftRadius: radius['2xl'],
              borderBottomRightRadius: radius['2xl'],
              paddingBottom: spacing[6],
              paddingTop: spacing[8],
            }}>
            <BotMascot />
            <AppText
              color="#ffffff"
              style={{
                fontFamily: typography.family.sansExtraBold,
                fontSize: 22,
                marginTop: spacing[3],
              }}>
              Pemula Code
            </AppText>
          </View>

          {/* Content */}
          <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[6] }}>
            <View style={{ alignSelf: 'center', maxWidth: 430, width: '100%' }}>
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansExtraBold,
                  fontSize: 24,
                  lineHeight: 32,
                  textAlign: 'center',
                }}>
                Buat Akun Baru
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                  textAlign: 'center',
                }}>
                Gratis, dan cuma butuh 1 menit.
              </AppText>

              <View style={{ gap: spacing[4], marginTop: spacing[6] }}>
                <AppInput
                  accessibilityLabel="Full Name"
                  autoCapitalize="words"
                  autoComplete="name"
                  label="Nama Lengkap"
                  leftIcon={<Contact color={colors.light.outline} size={20} />}
                  onChangeText={setFullName}
                  placeholder="Nama lengkap"
                  value={fullName}
                />

                <AppInput
                  accessibilityLabel="Nickname"
                  autoCapitalize="words"
                  autoComplete="nickname"
                  label="Nama Panggilan"
                  leftIcon={<Smile color={colors.light.outline} size={20} />}
                  onChangeText={setNickname}
                  placeholder="Mau dipanggil apa?"
                  value={nickname}
                />

                <AppInput
                  accessibilityLabel="Email Address"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  label="Email"
                  leftIcon={<Mail color={colors.light.outline} size={20} />}
                  onChangeText={setEmail}
                  placeholder="nama@email.com"
                  value={email}
                />

                <PasswordInput
                  accessibilityLabel="Password"
                  autoComplete="new-password"
                  label="Password"
                  leftIcon={<Lock color={colors.light.outline} size={20} />}
                  onChangeText={setPassword}
                  placeholder="Minimal 8 karakter"
                  value={password}
                />

                <PasswordInput
                  accessibilityLabel="Confirm Password"
                  autoComplete="new-password"
                  label="Konfirmasi Password"
                  leftIcon={<RotateCcw color={colors.light.outline} size={20} />}
                  onChangeText={setConfirmPassword}
                  placeholder="Ulangi password"
                  value={confirmPassword}
                />

                <Pressable
                  accessibilityLabel="Agree to Terms"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: agreeTerms }}
                  onPress={() => setAgreeTerms((prev) => !prev)}
                  style={{ alignItems: 'flex-start', flexDirection: 'row', gap: spacing[2] }}>
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: agreeTerms
                        ? colors.light.primary
                        : colors.light.surfaceContainerLow,
                      borderColor: agreeTerms ? colors.light.primary : colors.light.outlineVariant,
                      borderRadius: radius.sm,
                      borderWidth: 1,
                      height: 20,
                      justifyContent: 'center',
                      marginTop: 1,
                      width: 20,
                    }}>
                    {agreeTerms ? (
                      <AppText color={colors.light.onPrimary} style={{ fontSize: 12, fontWeight: 'bold' }}>
                        ✓
                      </AppText>
                    ) : null}
                  </View>
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{ flexShrink: 1, fontSize: 13, lineHeight: 19 }}>
                    Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi.
                  </AppText>
                </Pressable>

                <DuoButton
                  backgroundColor={colors.light.primary}
                  onPress={handleCreateAccount}
                  shadowColor={colors.light.primaryPressed}
                  title="Buat Akun"
                />
              </View>

              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: spacing[1],
                  justifyContent: 'center',
                  marginTop: spacing[6],
                  paddingBottom: spacing[8],
                }}>
                <AppText color={colors.light.onSurfaceVariant} style={{ fontSize: 14 }}>
                  Sudah punya akun?
                </AppText>
                <Pressable
                  accessibilityLabel="Log In"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => router.push('/(auth)/login')}>
                  <AppText
                    color={colors.light.primary}
                    style={{ fontFamily: typography.family.sansBold, fontSize: 14 }}>
                    Masuk
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}