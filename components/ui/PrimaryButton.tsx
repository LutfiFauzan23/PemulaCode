import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/context/ThemeContext';
import { AppText } from './AppText';

export type PrimaryButtonProps = Omit<PressableProps, 'children'> & {
  className?: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
  loading?: boolean;
  rightIcon?: ReactNode;
  style?: PressableProps['style'];
  title: string;
};

export function PrimaryButton({
  className,
  disabled = false,
  leftIcon,
  loading = false,
  onPress,
  rightIcon,
  style,
  title,
  ...props
}: PrimaryButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      className={className}
      disabled={isDisabled}
      onPress={onPress}
      style={(state) => [
        {
          alignItems: 'center',
          backgroundColor: isDisabled
            ? colors.disabled
            : state.pressed
              ? colors.primaryPressed
              : colors.primary,
          borderRadius: radius.md,
          flexDirection: 'row',
          gap: spacing[2],
          justifyContent: 'center',
          minHeight: 48,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          opacity: isDisabled ? 0.7 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      {loading ? <ActivityIndicator color={colors.primaryForeground} /> : leftIcon}
      <AppText color={colors.primaryForeground} variant="body-semibold">
        {title}
      </AppText>
      {rightIcon}
    </Pressable>
  );
}
