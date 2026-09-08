import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpenCheck, Code2, Users } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { appConfig } from '@/constants/app';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';

export default function AboutApplicationScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const { t } = useTranslation();
  const feature = (Icon: typeof Code2, text: string) => <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}><Icon color={c.primary} size={21} /><AppText color={c.text} style={{ flex: 1 }}>{text}</AppText></View>;
  return <ScreenContainer padded={false} style={{ backgroundColor: c.background }}><ScrollView contentContainerStyle={{ padding: spacing[5], paddingBottom: 120 }}><Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => router.back()} style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2], marginBottom: spacing[6] }}><ArrowLeft color={c.text} size={22} /><AppText color={c.text}>{t('back')}</AppText></Pressable><View style={{ alignItems: 'center', marginBottom: spacing[6] }}><View style={{ alignItems: 'center', backgroundColor: c.primaryFixed, borderRadius: radius['2xl'], height: 76, justifyContent: 'center', width: 76 }}><Code2 color={c.primary} size={38} /></View><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 26, marginTop: spacing[4] }}>Pemula Code</AppText><AppText color={c.onSurfaceVariant} style={{ marginTop: spacing[1] }}>{t('aboutTagline')}</AppText><AppText color={c.outline} style={{ fontFamily: typography.family.mono, fontSize: 12, marginTop: spacing[3] }}>{t('version')} {appConfig.version ?? '1.0.0'}</AppText></View><View style={{ backgroundColor: c.surfaceContainerLowest, borderColor: c.outlineVariant, borderRadius: radius['2xl'], borderWidth: 1, padding: spacing[5] }}><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 18 }}>{t('aboutApplication')}</AppText><AppText color={c.onSurfaceVariant} style={{ fontSize: 14, lineHeight: 22, marginTop: spacing[3] }}>{t('aboutDescription')}</AppText><View style={{ gap: spacing[4], marginTop: spacing[6] }}>{feature(BookOpenCheck, t('aboutFeatureLearning'))}{feature(Code2, t('aboutFeaturePractice'))}{feature(Users, t('aboutFeatureCommunity'))}</View></View><AppText color={c.outline} style={{ fontSize: 12, lineHeight: 18, marginTop: spacing[6], textAlign: 'center' }}>{t('aboutCopyright')}</AppText></ScrollView></ScreenContainer>;
}
