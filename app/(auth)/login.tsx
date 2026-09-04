import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Lock, Mail } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { GoogleIcon } from '@/components/ui/GoogleIcon';
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
  icon,
}: {
  backgroundColor: string;
  disabled?: boolean;
  icon?: React.ReactNode;
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
            flexDirection: 'row',
            gap: spacing[2],
            justifyContent: 'center',
            marginBottom: 4,
            paddingVertical: spacing[4],
            transform: [{ translateY }],
          }}>
          {icon}
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
// SIMPLE BOT MASCOT
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
// LOGIN SCREEN
// ======================================================

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Perhatian', 'Email dan password tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'test@example.com' && password === '123456') {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Login Gagal',
          'Gunakan akun dummy berikut untuk masuk:\n\nEmail: test@example.com\nPassword: 123456'
        );
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1200);
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
                Selamat Datang Kembali!
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: spacing[1],
                  textAlign: 'center',
                }}>
                Lanjutkan progress belajarmu hari ini.
              </AppText>

              <View style={{ gap: spacing[4], marginTop: spacing[6] }}>
                <AppInput
                  accessibilityLabel="Email Address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                  keyboardType="email-address"
                  label="Email"
                  leftIcon={<Mail color={colors.light.outline} size={20} />}
                  onChangeText={setEmail}
                  placeholder="test@example.com"
                  value={email}
                />

                <PasswordInput
                  accessibilityLabel="Password"
                  autoComplete="password"
                  editable={!isLoading}
                  label="Password"
                  leftIcon={<Lock color={colors.light.outline} size={20} />}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  value={password}
                />

                <Pressable accessibilityLabel="Forgot Password" accessibilityRole="button" hitSlop={8}>
                  <AppText
                    color={colors.light.primary}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 13,
                      textAlign: 'right',
                    }}>
                    Lupa Password?
                  </AppText>
                </Pressable>

                <DuoButton
                  backgroundColor={colors.light.primary}
                  disabled={isLoading}
                  onPress={handleLogin}
                  shadowColor={colors.light.primaryPressed}
                  title={isLoading ? 'Memproses...' : 'Masuk'}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
                  <View style={{ backgroundColor: colors.light.outlineVariant, flex: 1, height: 1 }} />
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{ fontFamily: typography.family.sansBold, fontSize: 12 }}>
                    ATAU
                  </AppText>
                  <View style={{ backgroundColor: colors.light.outlineVariant, flex: 1, height: 1 }} />
                </View>

                <DuoButton
                  backgroundColor="#ffffff"
                  disabled={isLoading}
                  icon={<GoogleIcon size={20} />}
                  onPress={handleGoogleLogin}
                  shadowColor={colors.light.outlineVariant}
                  textColor={colors.light.text}
                  title="Lanjutkan dengan Google"
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
                  Belum punya akun?
                </AppText>
                <Pressable
                  accessibilityLabel="Register"
                  accessibilityRole="button"
                  disabled={isLoading}
                  hitSlop={8}
                  onPress={() => router.push('/(auth)/register')}>
                  <AppText
                    color={colors.light.primary}
                    style={{ fontFamily: typography.family.sansBold, fontSize: 14 }}>
                    Daftar
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