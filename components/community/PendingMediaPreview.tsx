import { Video, X } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import type { PendingMedia } from '@/hooks/use-media-picker';

type PendingMediaPreviewProps = {
  media: PendingMedia;
  onRemove: () => void;
};

/** Baris pratinjau media yang belum diunggah, lengkap dengan tombol hapus. */
export function PendingMediaPreview({ media, onRemove }: PendingMediaPreviewProps) {
  const { colors: c } = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: spacing[3] }}>
      <View
        style={{
          backgroundColor: c.surfaceContainerLow,
          borderRadius: radius.lg,
          height: 64,
          overflow: 'hidden',
          width: 64,
        }}>
        {media.type === 'image' ? (
          <Image source={{ uri: media.uri }} style={{ height: '100%', width: '100%' }} />
        ) : (
          <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <Video color={c.primary} size={22} />
          </View>
        )}
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <AppText
          color={c.text}
          style={{ fontFamily: typography.family.sansSemibold, fontSize: 13 }}>
          {media.type === 'video' ? 'Video siap dikirim' : 'Foto siap dikirim'}
        </AppText>
        <AppText color={c.onSurfaceVariant} style={{ fontSize: 12, marginTop: 2 }}>
          Ketuk kirim untuk mengunggah.
        </AppText>
      </View>

      <Pressable
        accessibilityLabel="Hapus lampiran"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onRemove}
        style={{
          alignItems: 'center',
          backgroundColor: c.surfaceContainerHigh,
          borderRadius: radius.full,
          height: 28,
          justifyContent: 'center',
          width: 28,
        }}>
        <X color={c.onSurfaceVariant} size={16} />
      </Pressable>
    </View>
  );
}
