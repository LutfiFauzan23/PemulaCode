import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { MAX_MEDIA_BYTES, MEDIA_TOO_LARGE_MESSAGE } from '@/services/communityService';
import type { CommunityMediaType } from '@/types/community';

/** Media yang sudah dipilih user tetapi belum diunggah ke Storage. */
export type PendingMedia = {
  fileName?: string | null;
  sizeBytes?: number | null;
  type: CommunityMediaType;
  uri: string;
};

/**
 * Pilih foto/video dari galeri dengan validasi ukuran.
 *
 * Dipakai bersama oleh kolom pesan, balasan, dan form post supaya aturan
 * (izin galeri, batas ukuran, durasi video) hanya ditulis sekali.
 */
export function useMediaPicker() {
  const [media, setMedia] = useState<PendingMedia | null>(null);

  const pick = useCallback(async (type: CommunityMediaType) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Izin diperlukan',
        'Beri akses galeri supaya kamu bisa melampirkan foto atau video.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' ? ['videos'] : ['images'],
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset) return;

    if (asset.fileSize && asset.fileSize > MAX_MEDIA_BYTES) {
      Alert.alert('File terlalu besar', MEDIA_TOO_LARGE_MESSAGE);
      return;
    }

    setMedia({
      fileName: asset.fileName ?? null,
      sizeBytes: asset.fileSize ?? null,
      type,
      uri: asset.uri,
    });
  }, []);

  /** Tanya dulu mau foto atau video, lalu buka galeri. */
  const choose = useCallback(() => {
    Alert.alert('Lampirkan media', 'Pilih jenis media yang ingin dikirim.', [
      { text: 'Foto', onPress: () => void pick('image') },
      { text: 'Video', onPress: () => void pick('video') },
      { text: 'Batal', style: 'cancel' },
    ]);
  }, [pick]);

  const clear = useCallback(() => setMedia(null), []);

  return { choose, clear, media, pick, setMedia };
}
