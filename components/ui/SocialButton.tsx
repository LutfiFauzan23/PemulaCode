import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { AppText } from './AppText';

export type SocialButtonProps = Omit<PressableProps, 'children'> & {
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  style?: PressableProps['style'];
  title: string;
};

export function SocialButton({
  accessibilityLabel,
  className,
  disabled = false,
  icon,
  loading = false,
  onPress,
  style,
  title,
  ...props
}: SocialButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      className={className}
      disabled={isDisabled}
      onPress={onPress}
      style={(state) => [
        {
          alignItems: 'center',
          backgroundColor: state.pressed
            ? colors.light.surfaceContainer
            : colors.light.surfaceContainerLow,
          borderColor: colors.light.outlineVariant,
          borderRadius: radius.lg,
          borderWidth: 1,
          flexDirection: 'row',
          gap: spacing[3],
          justifyContent: 'center',
          minHeight: 52,
          opacity: isDisabled ? 0.7 : 1,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={colors.light.primary} />
      ) : (
        icon
      )}
      <AppText
        color={colors.light.text}
        numberOfLines={1}
        style={{ fontFamily: typography.family.sansSemibold, fontSize: 16, lineHeight: 24 }}>
        {title}
      </AppText>
    </Pressable>
  );
}
