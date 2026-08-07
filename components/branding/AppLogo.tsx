import { Terminal } from 'lucide-react-native';
import { View, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';

export type AppLogoProps = {
  iconSize?: number;
  shadow?: boolean;
  size?: number;
};

export function AppLogo({ iconSize, shadow = false, size = 80 }: AppLogoProps) {
  const logoStyle: ViewStyle = {
    alignItems: 'center',
    backgroundColor: colors.light.primary,
    borderRadius: size >= 96 ? radius.logo : radius['2xl'],
    height: size,
    justifyContent: 'center',
    width: size,
  };

  const shadowStyle: ViewStyle | undefined = shadow
    ? {
        elevation: 10,
        shadowColor: colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      }
    : undefined;

  return (
    <View style={[logoStyle, shadowStyle]}>
      <Terminal color={colors.light.onPrimary} size={iconSize ?? Math.round(size * 0.5)} strokeWidth={2.6} />
    </View>
  );
}
