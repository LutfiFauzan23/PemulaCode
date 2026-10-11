import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react-native';
import { Modal, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';

export type AppAlertVariant = 'error' | 'info' | 'success' | 'warning';

export interface AppAlertAction {
  label: string;
  onPress?: () => void;
}

export interface AppAlertProps {
  message: string;
  onClose?: () => void;
  primaryAction?: AppAlertAction;
  secondaryAction?: AppAlertAction;
  title: string;
  variant?: AppAlertVariant;
  visible: boolean;
}

/**
 * Pengganti `Alert.alert` bawaan: modal bertema yang konsisten di Android, iOS,
 * dan web. Dipakai untuk memberi tahu hasil pendaftaran/login beserta aksi
 * lanjutan (mis. "Masuk" ketika email sudah terdaftar).
 */
export function AppAlert({
  message,
  onClose,
  primaryAction,
  secondaryAction,
  title,
  variant = 'info',
  visible,
}: AppAlertProps) {
  const { colors: c, mode } = useTheme();

  const accent =
    variant === 'error'
      ? c.danger
      : variant === 'success'
        ? mode === 'dark'
          ? '#4ade80'
          : '#16a34a'
        : variant === 'warning'
          ? mode === 'dark'
            ? '#fbbf24'
            : '#d97706'
          : c.primary;

  const Icon =
    variant === 'error'
      ? CircleAlert
      : variant === 'success'
        ? CircleCheck
        : variant === 'warning'
          ? TriangleAlert
          : Info;

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}>
      <Pressable
        accessibilityLabel="Tutup dialog"
        accessibilityRole="button"
        onPress={onClose}
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          flex: 1,
          justifyContent: 'center',
          padding: spacing[5],
        }}>
        {/* Pressable dalam menahan tap agar latar tidak menutup dialog. */}
        <Pressable
          accessibilityRole="alert"
          accessibilityViewIsModal
          onPress={() => {}}
          style={{
            backgroundColor: c.surfaceContainerLowest,
            borderColor: c.outlineVariant,
            borderRadius: radius['2xl'],
            borderWidth: 1,
            gap: spacing[3],
            maxWidth: 340,
            padding: spacing[6],
            width: '100%',
          }}>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: `${accent}22`,
              borderRadius: radius.full,
              height: 56,
              justifyContent: 'center',
              width: 56,
            }}>
            <Icon color={accent} size={26} strokeWidth={2.2} />
          </View>

          <AppText
            color={c.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 18,
              lineHeight: 24,
              textAlign: 'center',
            }}>
            {title}
          </AppText>

          <AppText
            color={c.onSurfaceVariant}
            style={{ fontSize: 14, lineHeight: 21, textAlign: 'center' }}>
            {message}
          </AppText>

          <View style={{ gap: spacing[2], marginTop: spacing[2] }}>
            <Pressable
              accessibilityLabel={primaryAction?.label ?? 'Mengerti'}
              accessibilityRole="button"
              onPress={primaryAction?.onPress ?? onClose}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed ? c.primaryPressed : c.primary,
                borderRadius: radius.xl,
                paddingVertical: spacing[4],
              })}>
              <AppText
                color={c.onPrimary}
                style={{ fontFamily: typography.family.sansBold, fontSize: 15 }}>
                {primaryAction?.label ?? 'Mengerti'}
              </AppText>
            </Pressable>

            {secondaryAction ? (
              <Pressable
                accessibilityLabel={secondaryAction.label}
                accessibilityRole="button"
                onPress={secondaryAction.onPress}
                style={{ alignItems: 'center', paddingVertical: spacing[3] }}>
                <AppText color={c.onSurfaceVariant} style={{ fontSize: 14 }}>
                  {secondaryAction.label}
                </AppText>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
