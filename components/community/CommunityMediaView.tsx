import { Play } from 'lucide-react-native';
import React from 'react';
import { Image, Linking, Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import type { CommunityMedia } from '@/types/community';

type CommunityMediaViewProps = {
  media: CommunityMedia;
  /** Tinggi gambar/video di feed. */
  height?: number;
};

/**
 * Foto dirender langsung di feed. Video ditampilkan sebagai kartu dengan tombol
 * putar yang membuka berkasnya di pemutar bawaan perangkat/browser — app tidak
 * perlu memuat decoder video sendiri.
 */
export function CommunityMediaView({ media, height = 200 }: CommunityMediaViewProps) {
  const { colors: c } = useTheme();

  if (media.type === 'image') {
    return (
      <Image
        accessibilityLabel="Foto lampiran"
        resizeMode="cover"
        source={{ uri: media.url }}
        testID="community-media-image"
        style={{
          backgroundColor: c.surfaceContainerLow,
          borderRadius: radius.xl,
          height,
          marginTop: spacing[3],
          width: '100%',
        }}
      />
    );
  }

  return (
    <Pressable
      accessibilityLabel="Putar video lampiran"
      accessibilityRole="button"
      onPress={() => {
        void Linking.openURL(media.url);
      }}
      testID="community-media-video"
      style={{
        alignItems: 'center',
        backgroundColor: c.surfaceContainerLow,
        borderColor: c.outlineVariant,
        borderRadius: radius.xl,
        borderWidth: 1,
        height,
        justifyContent: 'center',
        marginTop: spacing[3],
        width: '100%',
      }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: c.primary,
          borderRadius: radius.full,
          height: 56,
          justifyContent: 'center',
          width: 56,
        }}>
        <Play color="#ffffff" fill="#ffffff" size={24} />
      </View>
      <AppText
        color={c.onSurfaceVariant}
        style={{ fontFamily: typography.family.sansSemibold, fontSize: 13, marginTop: spacing[3] }}>
        Ketuk untuk memutar video
      </AppText>
    </Pressable>
  );
}
