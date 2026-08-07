import { SafeAreaView, type ViewProps, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

export type ScreenContainerProps = ViewProps & {
  className?: string;
  padded?: boolean;
};

export function ScreenContainer({
  children,
  className,
  padded = true,
  style,
  ...props
}: ScreenContainerProps) {
  const containerStyle: ViewStyle = {
    backgroundColor: colors.light.background,
    flex: 1,
    paddingHorizontal: padded ? spacing[4] : 0,
    paddingVertical: padded ? spacing[4] : 0,
  };

  return (
    <SafeAreaView className={className} style={[containerStyle, style]} {...props}>
      {children}
    </SafeAreaView>
  );
}
