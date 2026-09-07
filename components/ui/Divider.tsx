import { View, type ViewStyle } from 'react-native';

import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { AppText } from './AppText';

export type DividerProps = {
  style?: ViewStyle;
  text?: string;
};

export function Divider({ style, text }: DividerProps) {
  const { colors } = useTheme();

  return (
    <View className="w-full flex-row items-center py-2" style={style}>
      <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.surfaceContainerHigh }} />
      {text ? (
        <AppText
          color={colors.outline}
          style={{
            fontFamily: typography.family.mono,
            fontSize: 12,
            lineHeight: 16,
            paddingHorizontal: spacing[3],
          }}>
          {text}
        </AppText>
      ) : null}
      <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.surfaceContainerHigh }} />
    </View>
  );
}
