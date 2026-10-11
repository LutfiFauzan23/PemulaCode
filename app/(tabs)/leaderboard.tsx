import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, Crown, Flame, Medal, Trophy } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslation } from '@/translations';

import { TAB_BAR_CLEARANCE } from './_layout';

// ======================================================
// TYPES
// ======================================================

interface LeaderUser {
  avatar: string;
  id: string;
  isCurrentUser: boolean;
  name: string;
  streak: number;
  xp: number;
}

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

const PODIUM_COLORS = ['#FFD166', '#C0C0C0', '#CD7F32']; // gold, silver, bronze

/**
 * Posisi bar peringkat pengguna yang menempel: 12 (offset navbar) + 68
 * (tinggi navbar) + 12 (jarak) — tepat di atas tab bar, konsisten dengan
 * bottomContainer di `./_layout`.
 */
const STICKY_BAR_BOTTOM = 92;

// ======================================================
// LEADERBOARD SCREEN
// ======================================================

export default function LeaderboardScreen() {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { t } = useTranslation();

  const authUser = useAuthStore((state) => state.user);
  const { entries, error, isLoading } = useLeaderboard();

  // Peringkat dari data pengguna asli (profiles.xp), bukan contoh.
  const leaders: LeaderUser[] = useMemo(
    () =>
      entries.map((entry) => ({
        avatar: entry.avatarUrl ?? FALLBACK_AVATAR,
        id: entry.id,
        isCurrentUser: entry.id === authUser?.id,
        name: entry.fullName?.trim() || entry.username,
        streak: entry.streakCount,
        xp: entry.xp,
      })),
    [authUser?.id, entries],
  );

  const podium = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const currentUser = leaders.find((user) => user.isCurrentUser);
  const currentUserRank = currentUser ? leaders.indexOf(currentUser) + 1 : null;

  const formatXp = (xp: number) => (xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : `${xp}`);

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
        showsVerticalScrollIndicator={false}>
        {/* Top App Bar */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.background,
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            paddingHorizontal: spacing[5],
            paddingTop: spacing[2],
          }}>
          <Pressable
            accessibilityLabel="Profile Avatar"
            accessibilityRole="button"
            style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
            <View
              style={{
                borderColor: colors.primary,
                borderRadius: radius.full,
                borderWidth: 2,
                height: 40,
                overflow: 'hidden',
                width: 40,
              }}>
              <Image
                source={require('@/assets/images/welcome-hero.png')}
                style={{ height: '100%', width: '100%' }}
                resizeMode="cover"
              />
            </View>
            <AppText
              color={colors.primary}
              style={{ fontFamily: typography.family.sansBold, fontSize: 20, lineHeight: 28 }}>
              {t('leaderboard')}
            </AppText>
          </Pressable>

          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed
                ? colors.surfaceContainerHigh
                : colors.surfaceContainerLow,
              borderRadius: radius.full,
              height: 40,
              justifyContent: 'center',
              width: 40,
            })}>
            <Bell color={colors.text} size={20} />
          </Pressable>
        </View>

        {/* Keterangan sumber data */}
        <View style={{ marginTop: spacing[4], paddingHorizontal: spacing[5] }}>
          <AppText color={colors.onSurfaceVariant} style={{ fontSize: 13 }}>
            {t('leaderboardSubtitle')}
          </AppText>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing[6] }} />
        ) : null}

        {!isLoading && error ? (
          <AppText
            color={colors.onSurfaceVariant}
            style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
            {error}
          </AppText>
        ) : null}

        {!isLoading && !error && leaders.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.surfaceContainerLowest,
              borderColor: colors.outlineVariant,
              borderRadius: radius.xl,
              borderWidth: 1,
              marginHorizontal: spacing[5],
              marginTop: spacing[5],
              padding: spacing[6],
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: colors.primaryFixed,
                borderRadius: radius.full,
                height: 56,
                justifyContent: 'center',
                marginBottom: spacing[4],
                width: 56,
              }}>
              <Trophy color={colors.primary} size={26} />
            </View>
            <AppText
              color={colors.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 16,
                textAlign: 'center',
              }}>
              {t('leaderboardEmptyTitle')}
            </AppText>
            <AppText
              color={colors.onSurfaceVariant}
              style={{
                fontSize: 13,
                lineHeight: 20,
                marginTop: spacing[2],
                textAlign: 'center',
              }}>
              {t('leaderboardEmptyBody')}
            </AppText>
          </View>
        ) : null}

        {/* Podium - Top 3 */}
        {podium.length > 0 ? (
          <View
            style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              gap: spacing[3],
              justifyContent: 'center',
              marginTop: spacing[6],
              paddingHorizontal: spacing[5],
            }}>
            {podium[1] ? <PodiumSlot user={podium[1]} rank={2} height={104} formatXp={formatXp} /> : null}
            {podium[0] ? <PodiumSlot user={podium[0]} rank={1} height={132} formatXp={formatXp} /> : null}
            {podium[2] ? <PodiumSlot user={podium[2]} rank={3} height={84} formatXp={formatXp} /> : null}
          </View>
        ) : null}

        {/* Ranked List */}
        {rest.length > 0 ? (
          <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
            <AppText
              color={colors.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 18,
                lineHeight: 26,
                marginBottom: spacing[3],
              }}>
              {t('fullRanking')}
            </AppText>

            <View
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                borderColor: colors.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                overflow: 'hidden',
              }}>
              {rest.map((user, index) => (
                <RankRow
                  key={user.id}
                  user={user}
                  rank={index + 4}
                  formatXp={formatXp}
                  isLast={index === rest.length - 1}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky Current-User Rank Bar */}
      {currentUser && currentUserRank && currentUserRank > 3 ? (
        <View
          style={{
            bottom: STICKY_BAR_BOTTOM,
            left: 12,
            position: 'absolute',
            right: 12,
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.primary,
              borderRadius: radius.xl,
              elevation: 8,
              flexDirection: 'row',
              gap: spacing[3],
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: radius.full,
                height: 32,
                justifyContent: 'center',
                width: 32,
              }}>
              <AppText
                color="#ffffff"
                style={{ fontFamily: typography.family.sansBold, fontSize: 14 }}>
                {currentUserRank}
              </AppText>
            </View>

            <View
              style={{
                borderColor: '#ffffff',
                borderRadius: radius.full,
                borderWidth: 2,
                height: 36,
                overflow: 'hidden',
                width: 36,
              }}>
              <Image
                source={{ uri: currentUser.avatar }}
                style={{ height: '100%', width: '100%' }}
                resizeMode="cover"
              />
            </View>

            <View style={{ flex: 1 }}>
              <AppText
                color="#ffffff"
                style={{ fontFamily: typography.family.sansBold, fontSize: 14 }}>
                {t('yourRank')}
              </AppText>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 1 }}>
                <Flame color="#ffffff" size={12} fill="#ffffff" />
                <AppText
                  color="rgba(255,255,255,0.85)"
                  style={{ fontFamily: typography.family.mono, fontSize: 12 }}>
                  {currentUser.streak} {t('dayStreak')}
                </AppText>
              </View>
            </View>

            <AppText color="#ffffff" style={{ fontFamily: typography.family.sansBold, fontSize: 16 }}>
              {formatXp(currentUser.xp)} XP
            </AppText>
          </View>
        </View>
      ) : null}
    </ScreenContainer>
  );
}

// ======================================================
// PODIUM SLOT
// ======================================================

function PodiumSlot({
  user,
  rank,
  height,
  formatXp,
}: {
  formatXp: (xp: number) => string;
  height: number;
  rank: 1 | 2 | 3;
  user: LeaderUser;
}) {
  const { colors } = useTheme();
  const accent = PODIUM_COLORS[rank - 1];

  return (
    <View style={{ alignItems: 'center', width: 92 }}>
      <View style={{ marginBottom: spacing[2] }}>
        {rank === 1 ? (
          <Crown color={accent} size={22} fill={accent} />
        ) : (
          <Medal color={accent} size={20} fill={accent} />
        )}
      </View>

      <View
        style={{
          borderColor: user.isCurrentUser ? colors.primary : accent,
          borderRadius: radius.full,
          borderWidth: 3,
          height: rank === 1 ? 64 : 52,
          overflow: 'hidden',
          width: rank === 1 ? 64 : 52,
        }}>
        <Image
          source={{ uri: user.avatar }}
          style={{ height: '100%', width: '100%' }}
          resizeMode="cover"
        />
      </View>

      <AppText
        color={colors.text}
        numberOfLines={1}
        style={{
          fontFamily: typography.family.sansBold,
          fontSize: 13,
          marginTop: spacing[2],
          maxWidth: 88,
          textAlign: 'center',
        }}>
        {user.name}
      </AppText>
      <AppText
        color={colors.onSurfaceVariant}
        style={{ fontFamily: typography.family.mono, fontSize: 11, marginTop: 1 }}>
        {formatXp(user.xp)} XP
      </AppText>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: accent,
          borderRadius: radius.lg,
          height,
          justifyContent: 'flex-start',
          marginTop: spacing[3],
          paddingTop: spacing[2],
          width: '100%',
        }}>
        <AppText color="#ffffff" style={{ fontFamily: typography.family.sansBold, fontSize: 20 }}>
          {rank}
        </AppText>
      </View>
    </View>
  );
}

// ======================================================
// RANK ROW
// ======================================================

function RankRow({
  formatXp,
  isLast,
  rank,
  user,
}: {
  formatXp: (xp: number) => string;
  isLast: boolean;
  rank: number;
  user: LeaderUser;
}) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: user.isCurrentUser
          ? colors.primaryFixed
          : colors.surfaceContainerLowest,
        borderBottomColor: colors.outlineVariant,
        borderBottomWidth: isLast ? 0 : 1,
        flexDirection: 'row',
        gap: spacing[3],
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
      }}>
      <View style={{ alignItems: 'center', width: 24 }}>
        <AppText
          color={user.isCurrentUser ? colors.primary : colors.onSurfaceVariant}
          style={{ fontFamily: typography.family.sansBold, fontSize: 14 }}>
          {rank}
        </AppText>
      </View>

      <View
        style={{
          borderColor: colors.outlineVariant,
          borderRadius: radius.full,
          borderWidth: 1,
          height: 40,
          overflow: 'hidden',
          width: 40,
        }}>
        <Image
          source={{ uri: user.avatar }}
          style={{ height: '100%', width: '100%' }}
          resizeMode="cover"
        />
      </View>

      <View style={{ flex: 1 }}>
        <AppText
          color={colors.text}
          numberOfLines={1}
          style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
          {user.isCurrentUser ? t('you') : user.name}
        </AppText>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 1 }}>
          <Flame color={colors.secondary} size={12} fill={colors.secondary} />
          <AppText color={colors.onSurfaceVariant} style={{ fontSize: 12 }}>
            {user.streak} {t('dayStreak')}
          </AppText>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: radius.full,
          flexDirection: 'row',
          gap: spacing[1],
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
        }}>
        <Trophy color={colors.onSurfaceVariant} size={12} />
        <AppText color={colors.text} style={{ fontFamily: typography.family.sansBold, fontSize: 13 }}>
          {formatXp(user.xp)}
        </AppText>
      </View>
    </View>
  );
}
