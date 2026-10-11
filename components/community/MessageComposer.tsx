import { Image as ImageIcon, SendHorizontal } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { PendingMediaPreview } from '@/components/community/PendingMediaPreview';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useMediaPicker, type PendingMedia } from '@/hooks/use-media-picker';

export type { PendingMedia };

type MessageComposerProps = {
  autoFocus?: boolean;
  disabled?: boolean;
  isSending?: boolean;
  /** Dipanggil saat tombol kirim ditekan. Kembalikan `true` bila berhasil terkirim. */
  onSend: (text: string, media: PendingMedia | null) => Promise<boolean>;
  placeholder: string;
  /** Label kecil di atas input, mis. "Membalas @lutfi". */
  replyToLabel?: string | null;
};

/**
 * Kolom pesan komunitas: teks + lampiran foto/video, dipakai untuk mengirim
 * pesan baru maupun membalas pesan. Pengunggahan media dilakukan pemanggil
 * (`onSend`) supaya pesan error tampil di layar yang tepat.
 */
export function MessageComposer({
  autoFocus = false,
  disabled = false,
  isSending = false,
  onSend,
  placeholder,
  replyToLabel = null,
}: MessageComposerProps) {
  const { colors: c } = useTheme();
  const { choose, clear, media } = useMediaPicker();
  const [text, setText] = useState('');

  const canSend = (text.trim().length > 0 || media !== null) && !isSending && !disabled;

  const handleSend = async () => {
    if (!canSend) return;
    const sent = await onSend(text.trim(), media);
    if (sent) {
      setText('');
      clear();
    }
  };

  return (
    <View
      style={{
        backgroundColor: c.surfaceContainerLowest,
        borderColor: c.outlineVariant,
        borderRadius: radius['2xl'],
        borderWidth: 1,
        gap: spacing[2],
        padding: spacing[3],
      }}>
      {replyToLabel ? (
        <AppText
          color={c.primary}
          style={{
            fontFamily: typography.family.sansSemibold,
            fontSize: 12,
            paddingHorizontal: spacing[1],
          }}>
          {replyToLabel}
        </AppText>
      ) : null}

      {media ? <PendingMediaPreview media={media} onRemove={clear} /> : null}

      <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: spacing[2] }}>
        <TextInput
          autoFocus={autoFocus}
          editable={!disabled}
          multiline
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={c.outline}
          style={{
            backgroundColor: c.surfaceContainerLow,
            borderRadius: radius.lg,
            color: c.text,
            flex: 1,
            fontFamily: typography.family.sans,
            fontSize: 15,
            maxHeight: 120,
            minHeight: 44,
            paddingHorizontal: spacing[4],
            paddingVertical: spacing[3],
            textAlignVertical: 'top',
          }}
          value={text}
        />

        <Pressable
          accessibilityLabel="Lampirkan foto atau video"
          accessibilityRole="button"
          disabled={disabled}
          hitSlop={6}
          onPress={choose}
          style={{
            alignItems: 'center',
            backgroundColor: c.surfaceContainerLow,
            borderRadius: radius.full,
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}>
          <ImageIcon color={c.onSurfaceVariant} size={20} />
        </Pressable>

        <Pressable
          accessibilityLabel="Kirim pesan"
          accessibilityRole="button"
          disabled={!canSend}
          hitSlop={6}
          onPress={() => void handleSend()}
          style={{
            alignItems: 'center',
            backgroundColor: canSend ? c.primary : c.disabled,
            borderRadius: radius.full,
            height: 44,
            justifyContent: 'center',
            width: 44,
          }}>
          <SendHorizontal color="#ffffff" size={20} />
        </Pressable>
      </View>

      {isSending ? (
        <AppText color={c.onSurfaceVariant} style={{ fontSize: 12, paddingHorizontal: spacing[1] }}>
          Mengunggah media lalu mengirim…
        </AppText>
      ) : null}
    </View>
  );
}
