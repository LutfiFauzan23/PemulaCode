import { StatusBar } from 'expo-status-bar';
import {
  Award,
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
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { TAB_BAR_CLEARANCE } from './_layout';

export default function ProfileScreen() {
  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" />

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
            justifyContent: 'space-between',
            paddingHorizontal: spacing[5],
            paddingTop: spacing[2],
          }}>
          <AppText
            color={colors.light.primary}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 22,
            }}>
            My Profile
          </AppText>
        </View>

        {/* 2. User Info Card */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: colors.light.outlineVariant,
            borderRadius: radius['2xl'],
            borderWidth: 1,
            elevation: 4,
            marginHorizontal: spacing[5],
            marginTop: spacing[4],
            padding: spacing[6],
            shadowColor: colors.light.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
          }}>
          <View
            style={{
              borderColor: colors.light.primary,
              borderRadius: radius.full,
              borderWidth: 3,
              height: 80,
              overflow: 'hidden',
              width: 80,
            }}>
            <Image
              source={require('@/assets/images/welcome-hero.png')}
              style={{ height: '100%', width: '100%' }}
              resizeMode="cover"
            />
          </View>

          <AppText
            color={colors.light.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              marginTop: spacing[3],
            }}>
            Pemula Developer
          </AppText>

          <AppText
            color={colors.light.onSurfaceVariant}
            style={{
              fontSize: 14,
              marginTop: 2,
            }}>
            student@pemulacode.id
          </AppText>

          {/* Quick Stats Grid */}
          <View
            style={{
              borderColor: colors.light.outlineVariant,
              borderRadius: radius.xl,
              borderWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: spacing[5],
              paddingVertical: spacing[4],
              width: '100%',
            }}>
            <View style={{ alignItems: 'center' }}>
              <Zap color={colors.light.primary} size={20} />
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  marginTop: 4,
                }}>
                320 XP
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{ fontSize: 12 }}>
                Total XP
              </AppText>
            </View>

            <View style={{ alignItems: 'center' }}>
              <BookOpen color={colors.light.secondary} size={20} />
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  marginTop: 4,
                }}>
                6 Lessons
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{ fontSize: 12 }}>
                Completed
              </AppText>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Award color="#00629d" size={20} />
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  marginTop: 4,
                }}>
                3 Badges
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{ fontSize: 12 }}>
                Earned
              </AppText>
            </View>
          </View>
        </View>

        {/* 3. Account Menu Settings */}
        <View style={{ gap: spacing[3], marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed ? colors.light.surfaceContainerHigh : colors.light.surfaceContainerLow,
              borderRadius: radius.xl,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
            })}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
              <User color={colors.light.primary} size={20} />
              <AppText color={colors.light.text} style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                Account Settings
              </AppText>
            </View>
            <ChevronRight color={colors.light.outline} size={18} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed ? colors.light.surfaceContainerHigh : colors.light.surfaceContainerLow,
              borderRadius: radius.xl,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[4],
            })}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
              <Shield color={colors.light.primary} size={20} />
              <AppText color={colors.light.text} style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                Privacy & Security
              </AppText>
            </View>
            <ChevronRight color={colors.light.outline} size={18} />
          </Pressable>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}
