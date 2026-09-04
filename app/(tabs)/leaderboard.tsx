import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  ChevronUp,
  Crown,
  Flame,
  Medal,
  Trophy,
} from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { TAB_BAR_CLEARANCE } from './_layout';

// ======================================================
// TYPES & MOCK DATA
// ======================================================

type Period = 'Weekly' | 'Monthly' | 'AllTime';

interface LeaderUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

const LEADERS: Record<Period, LeaderUser[]> = {
  Weekly: [
    { id: 'u1', name: 'Dev_Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', xp: 2450, streak: 14 },
    { id: 'u2', name: 'Master_Coda', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', xp: 2180, streak: 9 },
    { id: 'u3', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', xp: 1990, streak: 21 },
    { id: 'u4', name: 'Nadia K.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', xp: 1720, streak: 6 },
    { id: 'u5', name: 'You', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150', xp: 1580, streak: 12, isCurrentUser: true },
    { id: 'u6', name: 'Rian P.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', xp: 1340, streak: 3 },
    { id: 'u7', name: 'Sasha L.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', xp: 1120, streak: 8 },
  ],
  Monthly: [
    { id: 'u2', name: 'Master_Coda', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', xp: 9840, streak: 30 },
    { id: 'u1', name: 'Dev_Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', xp: 9210, streak: 22 },
    { id: 'u5', name: 'You', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150', xp: 8430, streak: 12, isCurrentUser: true },
    { id: 'u3', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', xp: 7650, streak: 21 },
    { id: 'u4', name: 'Nadia K.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', xp: 6120, streak: 6 },
    { id: 'u6', name: 'Rian P.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', xp: 5230, streak: 3 },
  ],
  AllTime: [
    { id: 'u2', name: 'Master_Coda', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', xp: 84200, streak: 30 },
    { id: 'u3', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', xp: 76800, streak: 21 },
    { id: 'u1', name: 'Dev_Mia', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', xp: 71230, streak: 22 },
    { id: 'u4', name: 'Nadia K.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', xp: 58900, streak: 6 },
    { id: 'u5', name: 'You', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150', xp: 42310, streak: 12, isCurrentUser: true },
    { id: 'u6', name: 'Rian P.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', xp: 33100, streak: 3 },
  ],
};

const PODIUM_COLORS = ['#FFD166', '#C0C0C0', '#CD7F32']; // gold, silver, bronze

// ======================================================
// LEADERBOARD SCREEN
// ======================================================

export default function LeaderboardScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('Weekly');

  const leaders = LEADERS[period];
  const podium = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const currentUser = leaders.find((u) => u.isCurrentUser);
  const currentUserRank = currentUser ? leaders.indexOf(currentUser) + 1 : null;

  const formatXp = (xp: number) => (xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : `${xp}`);

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" />

      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
        showsVerticalScrollIndicator={false}>
        {/* Top App Bar */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.light.background,
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
                borderColor: colors.light.primary,
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
              color={colors.light.primary}
              style={{ fontFamily: typography.family.sansBold, fontSize: 20, lineHeight: 28 }}>
              Leaderboard
            </AppText>
          </Pressable>

          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => {}}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed
                ? colors.light.surfaceContainerHigh
                : colors.light.surfaceContainerLow,
              borderRadius: radius.full,
              height: 40,
              justifyContent: 'center',
              width: 40,
            })}>
            <Bell color={colors.light.text} size={20} />
          </Pressable>
        </View>

        {/* Period Tabs */}
        <View
          style={{
            flexDirection: 'row',
            gap: spacing[2],
            marginTop: spacing[4],
            paddingHorizontal: spacing[5],
          }}>
          {(['Weekly', 'Monthly', 'AllTime'] as Period[]).map((p) => {
            const isActive = period === p;
            const label = p === 'AllTime' ? 'All-Time' : p;
            return (
              <Pressable
                key={p}
                accessibilityLabel={`${label} Ranking`}
                accessibilityRole="button"
                onPress={() => setPeriod(p)}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor: isActive
                    ? colors.light.primary
                    : colors.light.surfaceContainerLow,
                  borderColor: isActive ? colors.light.primary : colors.light.outlineVariant,
                  borderRadius: radius.full,
                  borderWidth: 1,
                  flex: 1,
                  opacity: pressed ? 0.85 : 1,
                  paddingVertical: spacing[3],
                })}>
                <AppText
                  color={isActive ? '#ffffff' : colors.light.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 13,
                  }}>
                  {label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {/* Podium - Top 3 */}
        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            gap: spacing[3],
            justifyContent: 'center',
            marginTop: spacing[6],
            paddingHorizontal: spacing[5],
          }}>
          {/* 2nd place */}
          {podium[1] && (
            <PodiumSlot user={podium[1]} rank={2} height={104} formatXp={formatXp} />
          )}
          {/* 1st place */}
          {podium[0] && (
            <PodiumSlot user={podium[0]} rank={1} height={132} formatXp={formatXp} />
          )}
          {/* 3rd place */}
          {podium[2] && (
            <PodiumSlot user={podium[2]} rank={3} height={84} formatXp={formatXp} />
          )}
        </View>

        {/* Ranked List */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <AppText
            color={colors.light.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 18,
              lineHeight: 26,
              marginBottom: spacing[3],
            }}>
            Rankings
          </AppText>

          <View
            style={{
              backgroundColor: colors.light.surfaceContainerLowest,
              borderColor: colors.light.outlineVariant,
              borderRadius: radius.xl,
              borderWidth: 1,
              overflow: 'hidden',
            }}>
            {rest.map((user, index) => {
              const rank = index + 4;
              return (
                <RankRow
                  key={user.id}
                  user={user}
                  rank={rank}
                  formatXp={formatXp}
                  isLast={index === rest.length - 1}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Current-User Rank Bar */}
      {currentUser && currentUserRank && currentUserRank > 3 && (
        <View
          style={{
            bottom: Platform_bottom(),
            left: 12,
            position: 'absolute',
            right: 12,
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.light.primary,
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
                Your Rank
              </AppText>
              <AppText
                color="rgba(255,255,255,0.85)"
                style={{ fontFamily: typography.family.mono, fontSize: 12, marginTop: 1 }}>
                Keep climbing!
              </AppText>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <AppText
                color="#ffffff"
                style={{ fontFamily: typography.family.sansBold, fontSize: 16 }}>
                {formatXp(currentUser.xp)} XP
              </AppText>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 2, marginTop: 1 }}>
                <ChevronUp color="#ffffff" size={12} />
                <AppText color="rgba(255,255,255,0.85)" style={{ fontSize: 11 }}>
                  2 spots
                </AppText>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

function Platform_bottom() {
  // matches _layout.tsx bottom navbar offset so the sticky bar sits just above it
  return 92;
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
          borderColor: accent,
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
        color={colors.light.text}
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
        color={colors.light.onSurfaceVariant}
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
        <AppText
          color="#ffffff"
          style={{ fontFamily: typography.family.sansBold, fontSize: 20 }}>
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
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: user.isCurrentUser
          ? colors.light.primaryFixed
          : colors.light.surfaceContainerLowest,
        borderBottomColor: colors.light.outlineVariant,
        borderBottomWidth: isLast ? 0 : 1,
        flexDirection: 'row',
        gap: spacing[3],
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
      }}>
      <View style={{ alignItems: 'center', width: 24 }}>
        <AppText
          color={user.isCurrentUser ? colors.light.primary : colors.light.onSurfaceVariant}
          style={{ fontFamily: typography.family.sansBold, fontSize: 14 }}>
          {rank}
        </AppText>
      </View>

      <View
        style={{
          borderColor: colors.light.outlineVariant,
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
          color={colors.light.text}
          numberOfLines={1}
          style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
          {user.isCurrentUser ? 'You' : user.name}
        </AppText>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 1 }}>
          <Flame color={colors.light.secondary} size={12} fill={colors.light.secondary} />
          <AppText color={colors.light.onSurfaceVariant} style={{ fontSize: 12 }}>
            {user.streak} day streak
          </AppText>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.light.surfaceContainerLow,
          borderRadius: radius.full,
          flexDirection: 'row',
          gap: spacing[1],
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[1],
        }}>
        <Trophy color={colors.light.onSurfaceVariant} size={12} />
        <AppText
          color={colors.light.text}
          style={{ fontFamily: typography.family.sansBold, fontSize: 13 }}>
          {formatXp(user.xp)}
        </AppText>
      </View>
    </View>
  );
}