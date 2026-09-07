import { Braces, Code2, Laptop, Sparkles, Terminal, Zap } from 'lucide-react-native';
import { View, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';

export type HeroIllustrationProps = {
  className?: string;
  style?: ViewStyle;
};

export function HeroIllustration({ className, style }: HeroIllustrationProps) {
  const { colors } = useTheme();

  return (
    <View className={`w-full items-center py-4 ${className ?? ''}`} style={style}>
      <View
        className="relative aspect-square w-[75%] max-w-[300px]"
        style={{
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.12,
          shadowRadius: 28,
        }}>
        {/* Decorative Background Blob */}
        <View
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: colors.primaryFixed, opacity: 0.45 }}
        />

        {/* Outer Card Container */}
        <View
          className="h-full w-full items-center justify-between overflow-hidden p-6"
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            borderColor: colors.outlineVariant,
            borderRadius: radius['2xl'],
            borderWidth: 1,
            elevation: 8,
          }}>
          {/* Top Floating Header Elements */}
          <View className="w-full flex-row items-center justify-between">
            <View
              className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{ backgroundColor: colors.primaryFixedDim }}>
              <Braces color={colors.primary} size={16} strokeWidth={2.4} />
              <AppText
                color={colors.primary}
                style={{ fontFamily: typography.family.mono, fontSize: 12 }}>
                {'<code />'}
              </AppText>
            </View>
            <View
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.tertiaryFixed }}>
              <Sparkles color={colors.primary} size={16} />
            </View>
          </View>

          {/* Central Coding Composition */}
          <View className="items-center justify-center py-2">
            <View
              className="relative items-center justify-center rounded-3xl"
              style={{
                backgroundColor: colors.primary,
                height: 84,
                width: 84,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.28,
                shadowRadius: 16,
              }}>
              <Laptop color={colors.onPrimary} size={42} strokeWidth={2.2} />
              <View
                className="absolute -bottom-2 -right-2 rounded-xl p-1.5"
                style={{ backgroundColor: colors.secondaryFixed }}>
                <Terminal color={colors.secondary} size={18} strokeWidth={2.5} />
              </View>
            </View>
          </View>

          {/* Card Label & Description */}
          <View className="items-center text-center">
            <View className="flex-row items-center gap-1">
              <AppText
                color={colors.primary}
                style={{
                  fontFamily: typography.family.sansExtraBold,
                  fontSize: 18,
                  letterSpacing: 0.5,
                  lineHeight: 24,
                }}>
                CODING
              </AppText>
              <AppText
                color={colors.onSurface}
                style={{
                  fontFamily: typography.family.sansExtraBold,
                  fontSize: 18,
                  letterSpacing: 0.5,
                  lineHeight: 24,
                }}>
                GENIUS
              </AppText>
            </View>
            <AppText
              className="mt-1 text-center"
              color={colors.onSurfaceVariant}
              numberOfLines={2}
              style={{ fontSize: 12, lineHeight: 16 }}>
              Empowering the next generation of developers.
            </AppText>
          </View>

          {/* Bottom Syntax Tag */}
          <View className="flex-row items-center gap-2">
            <View
              className="flex-row items-center gap-1 rounded-md px-2 py-0.5"
              style={{ backgroundColor: colors.surfaceContainerHigh }}>
              <Code2 color={colors.outline} size={14} />
              <AppText
                color={colors.outline}
                style={{ fontFamily: typography.family.mono, fontSize: 11 }}>
                import
              </AppText>
            </View>
          </View>
        </View>

        {/* Floating Feature Pill */}
        <View
          className="absolute -bottom-4 -right-3 flex-row items-center"
          style={{
            backgroundColor: colors.surfaceContainerLowest,
            borderColor: colors.outlineVariant,
            borderRadius: radius.lg,
            borderWidth: 1,
            elevation: 8,
            gap: spacing[1],
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[2],
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
          }}>
          <Zap color={colors.secondary} fill={colors.secondary} size={20} strokeWidth={2.4} />
          <AppText
            color={colors.onSurface}
            numberOfLines={1}
            style={{ fontFamily: typography.family.mono, fontSize: 14, lineHeight: 20 }}>
            Interactive Learning
          </AppText>
        </View>
      </View>
    </View>
  );
}
