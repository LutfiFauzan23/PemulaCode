import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, FileText, LockKeyhole } from 'lucide-react-native';
import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const { t } = useTranslation();
  const handleChangePassword = async () => {
    // Replace this handler with the authenticated database/API request later.
    Alert.alert(t('changePassword'), t('changePasswordComingSoon'));
  };
  const item = (title: string, description: string, icon: React.ReactNode, onPress: () => void) => <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ alignItems: 'center', backgroundColor: pressed ? c.surfaceContainerHigh : c.surfaceContainerLowest, borderBottomColor: c.outlineVariant, borderBottomWidth: 1, flexDirection: 'row', padding: spacing[4] })}><View style={{ alignItems: 'center', backgroundColor: c.primaryFixed, borderRadius: radius.lg, height: 42, justifyContent: 'center', marginRight: spacing[3], width: 42 }}>{icon}</View><View style={{ flex: 1 }}><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 16 }}>{title}</AppText><AppText color={c.onSurfaceVariant} style={{ fontSize: 13, marginTop: 2 }}>{description}</AppText></View><ChevronRight color={c.outline} size={20} /></Pressable>;
  return <ScreenContainer padded={false} style={{ backgroundColor: c.background }}><ScrollView contentContainerStyle={{ padding: spacing[5], paddingBottom: 120 }}><Pressable accessibilityRole="button" accessibilityLabel={t('profile')} onPress={() => router.back()} style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1], marginBottom: spacing[6] }}><ArrowLeft color={c.primary} size={18} /><AppText color={c.primary} style={{ fontFamily: typography.family.sansBold }}>{t('profile')}</AppText></Pressable><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 26, marginBottom: spacing[6] }}>{t('privacySecurityTitle')}</AppText><AppText color={c.primary} style={{ fontFamily: typography.family.mono, fontSize: 13, fontWeight: 'bold', marginBottom: spacing[3], textTransform: 'uppercase' }}>{t('accessSecurity')}</AppText><View style={{ backgroundColor: c.surfaceContainerLowest, borderColor: c.outlineVariant, borderRadius: radius['2xl'], borderWidth: 1, overflow: 'hidden' }}>{item(t('changePassword'), t('changePasswordDesc'), <LockKeyhole color={c.primary} size={21} />, handleChangePassword)}</View><AppText color={c.primary} style={{ fontFamily: typography.family.mono, fontSize: 13, fontWeight: 'bold', marginBottom: spacing[3], marginTop: spacing[6], textTransform: 'uppercase' }}>{t('legalDocuments')}</AppText><View style={{ backgroundColor: c.surfaceContainerLowest, borderColor: c.outlineVariant, borderRadius: radius['2xl'], borderWidth: 1, overflow: 'hidden' }}>{item(t('privacyPolicy'), t('privacyPolicyDesc'), <FileText color={c.primary} size={21} />, () => Alert.alert(t('privacyPolicy'), t('documentComingSoon')))}{item(t('termsOfService'), t('termsOfServiceDesc'), <FileText color={c.primary} size={21} />, () => Alert.alert(t('termsOfService'), t('documentComingSoon')))}</View></ScrollView></ScreenContainer>;
}

