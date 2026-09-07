import {
  CheckCircle2,
  ChevronRight,
  Lock,
  Play,
} from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ModuleStatus = 'available' | 'in_progress' | 'locked' | 'completed' | 'coming_soon' | 'upcoming';

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  status: ModuleStatus;
  moduleProgress: number;
  unlockRequirement: string | null;
};

type Props = {
  module: CourseModule;
  accentColor: string;
  accentFixed: string;
  onPress?: () => void;
};

// ─────────────────────────────────────────────
// Difficulty badge color map
// ─────────────────────────────────────────────

function getDifficultyStyle(
  difficulty: string,
  accentColor: string,
  accentFixed: string,
  isDisabled: boolean,
  outlineColor: string,
  surfaceHighColor: string,
): { bg: string; text: string } {
  if (isDisabled) {
    return {
      bg: surfaceHighColor,
      text: outlineColor,
    };
  }
  return { bg: accentFixed, text: accentColor };
}

// ─────────────────────────────────────────────
// Status indicator (top-right corner)
// ─────────────────────────────────────────────

function StatusIndicator({
  status,
  accentColor,
  accentFixed,
  outlineColor,
}: {
  status: ModuleStatus;
  accentColor: string;
  accentFixed: string;
  outlineColor: string;
}) {
  if (status === 'completed') {
    return (
      <CheckCircle2
        color={accentColor}
        size={22}
        fill={accentFixed}
      />
    );
  }
  if (status === 'in_progress') {
    return (
      <View
        style={{
          borderColor: accentFixed,
          borderRightColor: accentColor,
          borderRadius: radius.full,
          borderWidth: 3,
          height: 22,
          width: 22,
        }}
      />
    );
  }
  if (status === 'available') {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: accentFixed,
          borderRadius: radius.full,
          height: 22,
          justifyContent: 'center',
          width: 22,
        }}>
        <Play color={accentColor} size={12} fill={accentColor} />
      </View>
    );
  }
  if (status === 'locked' || status === 'coming_soon' || status === 'upcoming') {
    return <Lock color={outlineColor} size={20} />;
  }
  return null;
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export function CourseModuleCard({ module, accentColor, accentFixed, onPress }: Props) {
  const { colors: c } = useTheme();
  const { t } = useTranslation();

  const isCompleted = module.status === 'completed';
  const isInProgress = module.status === 'in_progress';
  const isAvailable = module.status === 'available';
  const isLocked = module.status === 'locked';
  const isComingSoon = module.status === 'coming_soon' || module.status === 'upcoming';

  const isDisabled = isLocked || isComingSoon;

  const diffStyle = getDifficultyStyle(
    module.difficulty,
    accentColor,
    accentFixed,
    isDisabled,
    c.outline,
    c.surfaceContainerHigh,
  );

  const cardContent = (
    <>
      {/* ── Header row: difficulty badge + duration + status icon ── */}
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: spacing[3],
        }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
          {/* Difficulty badge */}
          <View
            style={{
              backgroundColor: diffStyle.bg,
              borderRadius: radius.full,
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[1],
            }}>
            <AppText
              color={diffStyle.text}
              style={{
                fontFamily: typography.family.mono,
                fontSize: 12,
                fontWeight: '600',
              }}>
              {module.difficulty}
            </AppText>
          </View>

          {/* Duration */}
          <AppText
            color={isDisabled ? c.outline : c.onSurfaceVariant}
            style={{ fontFamily: typography.family.mono, fontSize: 12 }}>
            {module.duration}
          </AppText>
        </View>

        {/* Status icon */}
        <StatusIndicator
          status={module.status}
          accentColor={accentColor}
          accentFixed={accentFixed}
          outlineColor={c.outline}
        />
      </View>

      {/* ── Title ── */}
      <AppText
        color={isDisabled ? c.textMuted : c.text}
        style={{
          fontFamily: typography.family.sansBold,
          fontSize: 18,
          lineHeight: 25,
        }}>
        {module.title}
      </AppText>

      {/* ── Description ── */}
      <AppText
        color={isDisabled ? c.outline : c.onSurfaceVariant}
        style={{ fontSize: 14, lineHeight: 20, marginTop: spacing[1] }}>
        {module.description}
      </AppText>

      {/* ── COMPLETED: learner avatars + Review Lesson ── */}
      {isCompleted && (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing[4],
            paddingTop: spacing[2],
          }}>
          {/* Stacked learner avatars */}
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
              style={{
                borderColor: c.surfaceContainerLowest,
                borderRadius: radius.full,
                borderWidth: 2,
                height: 24,
                width: 24,
              }}
            />
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }}
              style={{
                borderColor: c.surfaceContainerLowest,
                borderRadius: radius.full,
                borderWidth: 2,
                height: 24,
                marginLeft: -8,
                width: 24,
              }}
            />
            <AppText
              color={c.onSurfaceVariant}
              style={{
                fontFamily: typography.family.mono,
                fontSize: 11,
                marginLeft: spacing[2],
              }}>
              +12
            </AppText>
          </View>

          {/* Review Lesson link */}
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
            <AppText
              color={accentColor}
              style={{ fontFamily: typography.family.sansBold, fontSize: 14 }}>
              {t('reviewLesson')}
            </AppText>
            <ChevronRight color={accentColor} size={16} />
          </View>
        </View>
      )}

      {/* ── AVAILABLE: Start Learning button ── */}
      {isAvailable && (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: accentColor,
            borderRadius: radius.xl,
            flexDirection: 'row',
            gap: spacing[2],
            justifyContent: 'center',
            marginTop: spacing[4],
            minHeight: 48,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
          }}>
          <AppText
            color="#ffffff"
            style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
            {t('startLearning')}
          </AppText>
          <Play color="#ffffff" size={16} fill="#ffffff" />
        </View>
      )}

      {/* ── IN PROGRESS: progress bar + Continue Learning button ── */}
      {isInProgress && (
        <>
          {/* Module progress bar */}
          <View
            style={{
              backgroundColor: accentFixed,
              borderRadius: radius.full,
              height: 8,
              marginTop: spacing[4],
              overflow: 'hidden',
              width: '100%',
            }}>
            <View
              style={{
                backgroundColor: accentColor,
                borderRadius: radius.full,
                height: '100%',
                width: `${module.moduleProgress}%`,
              }}
            />
          </View>

          {/* Continue Learning button visual element */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: accentColor,
              borderRadius: radius.xl,
              flexDirection: 'row',
              gap: spacing[2],
              justifyContent: 'center',
              marginTop: spacing[4],
              minHeight: 48,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
            }}>
            <AppText
              color="#ffffff"
              style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
              {t('continueLearning')}
            </AppText>
            <Play color="#ffffff" size={16} fill="#ffffff" />
          </View>
        </>
      )}

      {/* ── LOCKED: unlock requirement hint ── */}
      {isLocked && (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: spacing[2],
            marginTop: spacing[4],
            paddingTop: spacing[2],
          }}>
          <Lock color={c.outline} size={14} />
          <AppText
            color={c.outline}
            style={{ fontFamily: typography.family.mono, fontSize: 12 }}>
            {module.unlockRequirement ?? t('completeQuizToUnlock')}
          </AppText>
        </View>
      )}

      {/* ── COMING SOON: badge hint ── */}
      {isComingSoon && (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: spacing[2],
            marginTop: spacing[4],
            paddingTop: spacing[2],
          }}>
          <Lock color={c.outline} size={14} />
          <AppText
            color={c.outline}
            style={{ fontFamily: typography.family.mono, fontSize: 12, fontWeight: 'bold' }}>
            {t('comingSoon')}
          </AppText>
        </View>
      )}
    </>
  );

  // Disabled modules (locked / coming_soon) use a plain View (not pressable)
  if (isDisabled) {
    return (
      <View
        style={{
          backgroundColor: c.surfaceContainerLow,
          borderColor: c.outlineVariant,
          borderRadius: radius['2xl'],
          borderWidth: 1,
          opacity: isComingSoon ? 0.55 : 0.7,
          padding: spacing[5],
        }}>
        {cardContent}
      </View>
    );
  }

  // Active modules (available / completed / in_progress) are pressable
  return (
    <Pressable
      accessibilityLabel={`Module: ${module.title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: c.surfaceContainerLowest,
        borderColor: c.outlineVariant,
        borderLeftColor: accentColor,
        borderLeftWidth: 4,
        borderRadius: radius['2xl'],
        borderWidth: 1,
        elevation: 4,
        opacity: pressed ? 0.92 : 1,
        padding: spacing[5],
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      })}>
      {cardContent}
    </Pressable>
  );
}
