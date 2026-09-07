import { View } from 'react-native';

import { appConfig } from '@/constants/app';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/context/ThemeContext';

export function AppVersion() {
  const version = appConfig.version ?? '1.0.0';
  const { colors: c } = useTheme();

  return (
    <View className="flex-row items-center justify-center" style={{ gap: spacing[2], opacity: 0.62 }}>
      <View style={{ backgroundColor: c.outlineVariant, height: 1, width: 32 }} />
      <AppText
        color={c.onSurfaceVariant}
        numberOfLines={1}
        style={{ fontFamily: typography.family.mono, fontSize: 14, lineHeight: 20 }}>
        Version {version}
      </AppText>
      <View style={{ backgroundColor: c.outlineVariant, height: 1, width: 32 }} />
    </View>
  );
}
