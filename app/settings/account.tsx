import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, CheckCircle2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';
import { useProfileStore } from '@/stores/profile-store';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const { t } = useTranslation();
  const setAvatarUri = useProfileStore((state) => state.setAvatarUri);
  const [name, setName] = useState('Pemula Developer');
  const [username, setUsername] = useState('pemuladeveloper');
  const [email, setEmail] = useState('student@pemulacode.id');
  const [phone, setPhone] = useState('0812 3456 7890');

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert('Izin foto diperlukan', 'Izinkan akses galeri untuk memilih foto profil.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (!result.canceled && result.assets[0]?.uri) setAvatarUri(result.assets[0].uri);
  };

  const field = (label: string, value: string, onChangeText: (value: string) => void, keyboardType?: 'default' | 'email-address' | 'phone-pad') => <View style={{ marginBottom: spacing[4] }}><AppText color={c.onSurfaceVariant} style={{ fontFamily: typography.family.sansBold, fontSize: 13, marginBottom: spacing[2] }}>{label}</AppText><TextInput accessibilityLabel={label} keyboardType={keyboardType} onChangeText={onChangeText} placeholderTextColor={c.outline} style={{ backgroundColor: c.surfaceContainerLow, borderColor: c.outlineVariant, borderRadius: radius.lg, borderWidth: 1, color: c.text, fontFamily: typography.family.sans, fontSize: 15, minHeight: 50, paddingHorizontal: spacing[4] }} value={value} /></View>;

  return <ScreenContainer padded={false} style={{ backgroundColor: c.background }}><ScrollView contentContainerStyle={{ padding: spacing[5], paddingBottom: 120 }}><Pressable accessibilityRole="button" accessibilityLabel={t('profile')} onPress={() => router.back()} style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1], marginBottom: spacing[6] }}><ArrowLeft color={c.primary} size={18} /><AppText color={c.primary} style={{ fontFamily: typography.family.sansBold }}>{t('profile')}</AppText></Pressable><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 26, marginBottom: spacing[6] }}>{t('accountSettingsTitle')}</AppText>
    <AppText color={c.primary} style={{ fontFamily: typography.family.mono, fontSize: 13, fontWeight: 'bold', marginBottom: spacing[3], textTransform: 'uppercase' }}>{t('editProfile')}</AppText><View style={{ backgroundColor: c.surfaceContainerLowest, borderColor: c.outlineVariant, borderRadius: radius['2xl'], borderWidth: 1, padding: spacing[5] }}>{field(t('fullName'), name, setName)}{field(t('username'), username, setUsername)}<Pressable accessibilityRole="button" onPress={choosePhoto} style={{ alignItems: 'center', backgroundColor: c.primaryFixed, borderRadius: radius.lg, flexDirection: 'row', gap: spacing[2], justifyContent: 'center', padding: spacing[3] }}><Camera color={c.primary} size={18} /><AppText color={c.primary} style={{ fontFamily: typography.family.sansBold }}>{t('changeProfilePhoto')}</AppText></Pressable></View>
    <AppText color={c.primary} style={{ fontFamily: typography.family.mono, fontSize: 13, fontWeight: 'bold', marginBottom: spacing[3], marginTop: spacing[6], textTransform: 'uppercase' }}>{t('contactInformation')}</AppText><View style={{ backgroundColor: c.surfaceContainerLowest, borderColor: c.outlineVariant, borderRadius: radius['2xl'], borderWidth: 1, padding: spacing[5] }}>{field(t('emailAddress'), email, setEmail, 'email-address')}<View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: spacing[4], marginTop: -spacing[2] }}><CheckCircle2 color="#16a34a" size={15} /><AppText color="#16a34a" style={{ fontSize: 12, marginLeft: spacing[1] }}>{t('verified')}</AppText></View>{field(t('phoneNumber'), phone, setPhone, 'phone-pad')}</View>
    <Pressable accessibilityRole="button" onPress={() => Alert.alert(t('changesSaved'), t('changesSavedMessage'))} style={{ alignItems: 'center', backgroundColor: c.primary, borderRadius: radius.xl, marginTop: spacing[6], paddingVertical: spacing[4] }}><AppText color="#ffffff" style={{ fontFamily: typography.family.sansBold }}>{t('saveChanges')}</AppText></Pressable>
  </ScrollView></ScreenContainer>;
}

