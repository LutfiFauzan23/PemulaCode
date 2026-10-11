// Catatan lokasi: test tidak boleh ditaruh di dalam `app/` karena expo-router
// menganggap setiap file di sana sebagai route.
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { CommunityMediaView } from '@/components/community/CommunityMediaView';
import { MessageComposer } from '@/components/community/MessageComposer';
import { ThemeProvider } from '@/context/ThemeContext';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Supabase tidak dipakai di test ini, dan mengimpornya menyeret polyfill
// expo-sqlite yang tidak jalan di Jest.
jest.mock('@/config/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: {},
  supabaseConfigIssue: null,
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ granted: true })),
}));

// Ikon lucide dikirim sebagai ESM `.mjs` yang tidak ditransformasi Jest; ikon
// hanya dekoratif, jadi diganti komponen kosong.
jest.mock('lucide-react-native', () => {
  const NullIcon = () => null;
  return new Proxy({}, { get: () => NullIcon });
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ImagePicker = require('expo-image-picker') as {
  launchImageLibraryAsync: jest.Mock;
};

type Screen = Awaited<ReturnType<typeof render>>;

const renderWithTheme = async (ui: React.ReactElement): Promise<Screen> =>
  await render(<ThemeProvider>{ui}</ThemeProvider>);

/**
 * RNTL v14 mengirim event secara async dan membungkusnya dengan `act`
 * sendiri, jadi setiap `fireEvent` HARUS di-await. Memanggilnya tanpa
 * `await` membuat scope `act` tumpang tindih ("overlapping act() calls")
 * dan render berikutnya kosong.
 */
describe('<MessageComposer />', () => {
  it('sends the trimmed message', async () => {
    const onSend = jest.fn(async () => true);
    const screen = await renderWithTheme(
      <MessageComposer onSend={onSend} placeholder="Tulis pesan…" />,
    );

    await fireEvent.changeText(screen.getByPlaceholderText('Tulis pesan…'), '  halo semua  ');
    await fireEvent.press(screen.getByLabelText('Kirim pesan'));

    await waitFor(() => expect(onSend).toHaveBeenCalledWith('halo semua', null));
  });

  it('keeps the text when sending failed', async () => {
    const failing = jest.fn(async () => false);
    const screen = await renderWithTheme(<MessageComposer onSend={failing} placeholder="Pesan" />);

    await fireEvent.changeText(screen.getByPlaceholderText('Pesan'), 'gagal terkirim');
    await fireEvent.press(screen.getByLabelText('Kirim pesan'));

    await waitFor(() => expect(failing).toHaveBeenCalled());
    expect(screen.getByPlaceholderText('Pesan').props.value).toBe('gagal terkirim');
  });

  it('clears the text after a successful send', async () => {
    const screen = await renderWithTheme(
      <MessageComposer onSend={jest.fn(async () => true)} placeholder="Pesan" />,
    );

    await fireEvent.changeText(screen.getByPlaceholderText('Pesan'), 'terkirim');
    await fireEvent.press(screen.getByLabelText('Kirim pesan'));

    await waitFor(() => expect(screen.getByPlaceholderText('Pesan').props.value).toBe(''));
  });

  it('attaches a photo from the gallery and sends it with the caption', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ fileName: 'foto.jpg', fileSize: 1024, uri: 'file:///tmp/foto.jpg' }],
    });

    const onSend = jest.fn(async () => true);
    const screen = await renderWithTheme(<MessageComposer onSend={onSend} placeholder="Pesan" />);

    const alertSpy = jest.spyOn(Alert, 'alert');
    await fireEvent.press(screen.getByLabelText('Lampirkan foto atau video'));
    await waitFor(() => expect(alertSpy).toHaveBeenCalled());

    // Jalankan tombol "Foto" pada Alert; `pick` async jadi tunggu picker-nya.
    await act(async () => {
      const buttons = (alertSpy.mock.calls.at(-1)?.[2] ?? []) as {
        onPress?: () => void;
        text?: string;
      }[];
      buttons.find((button) => button.text === 'Foto')?.onPress?.();
    });
    await waitFor(() => expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Foto siap dikirim')).toBeTruthy());

    await fireEvent.changeText(screen.getByPlaceholderText('Pesan'), 'lihat ini');
    await fireEvent.press(screen.getByLabelText('Kirim pesan'));

    await waitFor(() =>
      expect(onSend).toHaveBeenCalledWith('lihat ini', {
        fileName: 'foto.jpg',
        sizeBytes: 1024,
        type: 'image',
        uri: 'file:///tmp/foto.jpg',
      }),
    );
    alertSpy.mockRestore();
  });

  it('can send an attachment without any text', async () => {
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ fileName: 'klip.mp4', fileSize: 2048, uri: 'file:///tmp/klip.mp4' }],
    });

    const onSend = jest.fn(async () => true);
    const screen = await renderWithTheme(<MessageComposer onSend={onSend} placeholder="Pesan" />);

    const alertSpy = jest.spyOn(Alert, 'alert');
    await fireEvent.press(screen.getByLabelText('Lampirkan foto atau video'));
    await waitFor(() => expect(alertSpy).toHaveBeenCalled());

    await act(async () => {
      const buttons = (alertSpy.mock.calls.at(-1)?.[2] ?? []) as {
        onPress?: () => void;
        text?: string;
      }[];
      buttons.find((button) => button.text === 'Video')?.onPress?.();
    });
    await waitFor(() => expect(screen.getByText('Video siap dikirim')).toBeTruthy());

    await fireEvent.press(screen.getByLabelText('Kirim pesan'));

    await waitFor(() =>
      expect(onSend).toHaveBeenCalledWith('', expect.objectContaining({ type: 'video' })),
    );
    alertSpy.mockRestore();
  });

  it('shows the reply target label while replying', async () => {
    const screen = await renderWithTheme(
      <MessageComposer
        onSend={jest.fn(async () => true)}
        placeholder="Pesan"
        replyToLabel="Membalas @lutfi"
      />,
    );

    expect(screen.getByText('Membalas @lutfi')).toBeTruthy();
  });
});

describe('<CommunityMediaView />', () => {
  it('renders a photo inline', async () => {
    const screen = await renderWithTheme(
      <CommunityMediaView media={{ type: 'image', url: 'https://x/a.jpg' }} />,
    );

    expect(screen.getByTestId('community-media-image')).toBeTruthy();
    expect(screen.getByLabelText('Foto lampiran')).toBeTruthy();
  });

  it('renders a video as an openable player card', async () => {
    const screen = await renderWithTheme(
      <CommunityMediaView media={{ type: 'video', url: 'https://x/clip.mp4' }} />,
    );

    expect(screen.getByText('Ketuk untuk memutar video')).toBeTruthy();
    expect(screen.getByLabelText('Putar video lampiran')).toBeTruthy();
  });
});
