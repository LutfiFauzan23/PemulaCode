import { View, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { AppText } from './AppText';

export type DividerProps = {
  style?: ViewStyle;
  text?: string;
};

export function Divider({ style, text }: DividerProps) {
  return (
    <View className="w-full flex-row items-center py-2" style={style}>
      <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.light.surfaceContainerHigh }} />
      {text ? (
        <AppText
          color={colors.light.outline}
          style={{
            fontFamily: typography.family.mono,
            fontSize: 12,
            lineHeight: 16,
            paddingHorizontal: spacing[3],
          }}>
          {text}
        </AppText>
      ) : null}
      <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.light.surfaceContainerHigh }} />
    </View>
  );
}
