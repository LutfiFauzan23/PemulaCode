import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  Award,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Shield,
  User,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';
import { useProfileStore } from '@/stores/profile-store';
import { TAB_BAR_CLEARANCE } from './_layout';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors: c, mode } = useTheme();
  const { t } = useTranslation();
  const avatarUri = useProfileStore((state) => state.avatarUri);

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: c.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_CLEARANCE,
        }}
        showsVerticalScrollIndicator={false}>

        {/* 1. Header */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            height: 60,
            paddingHorizontal: spacing[5],
            paddingTop: spacing[2],
          }}>
          <Pressable
            accessibilityLabel={t('back')}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)/settings');
              }
            }}
            style={({ pressed }) => ({
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing[2],
            })}>
            <ArrowLeft color={c.primary} size={18} />
          </Pressable>
          <AppText
            color={c.primary}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 22,
            }}>
            {t('profile')}
          </AppText>
        </View>

        {/* 2. User Info Card */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: c.surfaceContainerLowest,
            borderColor: c.outlineVariant,
            borderRadius: radius['2xl'],
            borderWidth: 1,
            elevation: 4,
            marginHorizontal: spacing[5],
            marginTop: spacing[4],
            padding: spacing[6],
            shadowColor: c.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
          }}>
          <View
            style={{
              borderColor: c.primary,
              borderRadius: radius.full,
              borderWidth: 3,
              height: 80,
              overflow: 'hidden',
              width: 80,
            }}>
            <Image
                source={avatarUri ? { uri: avatarUri } : require('@/assets/images/welcome-hero.png')}
              style={{ height: '100%', width: '100%' }}
              resizeMode="cover"
            />
          </View>

          <AppText
            color={c.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              marginTop: spacing[3],
            }}>
            Pemula Developer
          </AppText>

          <AppText
            color={c.onSurfaceVariant}
            style={{
              fontSize: 14,
              marginTop: 2,
            }}>
            student@pemulacode.id
          </AppText>

          {/* Quick Stats Grid */}
          <View
            style={{
              borderColor: c.outlineVariant,
              borderRadius: radius.xl,
              borderWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: spacing[5],
              paddingVertical: spacing[4],
              width: '100%',
            }}>
            <View style={{ alignItems: 'center' }}>
              <Zap color={c.primary} size={20} />
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  marginTop: 4,
                }}>
                320 XP
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{ fontSize: 12 }}>
                Total XP
              </AppText>
            </View>

            <View style={{ alignItems: 'center' }}>
              <BookOpen color={c.secondary} size={20} />
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  marginTop: 4,
                }}>
                6 Modul
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{ fontSize: 12 }}>
                Selesai
              </AppText>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Award color="#00629d" size={20} />
              <AppText
                color={c.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  marginTop: 4,
                }}>
                3 Lencana
              </AppText>
              <AppText
                color={c.onSurfaceVariant}
                style={{ fontSize: 12 }}>
                Diterima
              </AppText>
            </View>
          </View>
        </View>

        {/* 3. Account Menu Settings */}
        <View style={{ gap: spacing[3], marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/settings/account')}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed ? c.surfaceContainerHigh : c.surfaceContainerLow,
              borderRadius: radius.xl,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
            })}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
              <User color={c.primary} size={20} />
              <AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                Pengaturan Akun
              </AppText>
            </View>
            <ChevronRight color={c.outline} size={18} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/settings/privacy')}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed ? c.surfaceContainerHigh : c.surfaceContainerLow,
              borderRadius: radius.xl,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
            })}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
              <Shield color={c.primary} size={20} />
              <AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                Privasi & Keamanan
              </AppText>
            </View>
            <ChevronRight color={c.outline} size={18} />
          </Pressable>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}
