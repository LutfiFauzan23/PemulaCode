import { View } from 'react-native';

import { appConfig } from '@/constants/app';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { AppText } from '@/components/ui/AppText';

export function AppVersion() {
  const version = appConfig.version ?? '1.0.0';

  return (
    <View className="flex-row items-center justify-center" style={{ gap: spacing[2], opacity: 0.62 }}>
      <View style={{ backgroundColor: colors.light.outlineVariant, height: 1, width: 32 }} />
      <AppText
        color={colors.light.onSurfaceVariant}
        numberOfLines={1}
        style={{ fontFamily: typography.family.mono, fontSize: 14, lineHeight: 20 }}>
        Version {version}
      </AppText>
      <View style={{ backgroundColor: colors.light.outlineVariant, height: 1, width: 32 }} />
    </View>
  );
}
