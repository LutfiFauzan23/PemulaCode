import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type AppTextVariant = 'body' | 'body-semibold' | 'title' | 'subtitle' | 'caption';

export type AppTextProps = TextProps & {
  className?: string;
  color?: string;
  variant?: AppTextVariant;
};

const variantStyles: Record<AppTextVariant, TextStyle> = {
  body: {
    fontFamily: typography.family.sans,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.regular,
  },
  'body-semibold': {
    fontFamily: typography.family.sansSemibold,
    fontSize: typography.size.md,
    lineHeight: typography.lineHeight.md,
    fontWeight: typography.weight.semibold,
  },
  title: {
    fontFamily: typography.family.sansBold,
    fontSize: typography.size['2xl'],
    lineHeight: typography.lineHeight['2xl'],
    fontWeight: typography.weight.bold,
  },
  subtitle: {
    fontFamily: typography.family.sansSemibold,
    fontSize: typography.size.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.weight.semibold,
  },
  caption: {
    fontFamily: typography.family.sans,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.weight.regular,
  },
};

export function AppText({
  className,
  color = colors.light.text,
  style,
  variant = 'body',
  ...props
}: AppTextProps) {
  return <Text className={className} style={[{ color }, variantStyles[variant], style]} {...props} />;
}
