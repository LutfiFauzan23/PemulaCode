import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { AppText } from './AppText';

export type SecondaryButtonProps = Omit<PressableProps, 'children'> & {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: PressableProps['style'];
  title: string;
};

export function SecondaryButton({
  className,
  disabled = false,
  loading = false,
  onPress,
  style,
  title,
  ...props
}: SecondaryButtonProps) {
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
          backgroundColor: state.pressed ? colors.light.secondaryPressed : colors.light.secondary,
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
      {loading ? <ActivityIndicator color={colors.light.secondaryForeground} /> : null}
      <AppText color={colors.light.secondaryForeground} variant="body-semibold">
        {title}
      </AppText>
    </Pressable>
  );
}
