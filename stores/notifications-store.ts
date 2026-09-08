import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type NotificationType = 'streak' | 'achievement' | 'content' | 'tip';
export type AppNotification = { 
  id: string; 
  title: string; 
  message: string; 
  timestamp: string; 
  read: boolean; 
  type: NotificationType 
};

const initialNotifications: AppNotification[] = [
  { id: 'streak-1', title: 'Jaga streak belajarmu', message: 'Belum belajar hari ini. Selesaikan satu lesson agar streak 12 harimu tetap aman.', timestamp: '10 menit lalu', read: false, type: 'streak' },
  { id: 'achievement-1', title: 'Lencana baru terbuka!', message: 'Kamu mendapatkan lencana First Steps setelah menyelesaikan modul pertamamu.', timestamp: '1 jam lalu', read: false, type: 'achievement' },
  { id: 'content-1', title: 'Materi baru tersedia', message: 'Modul Flexbox Layout sudah tersedia untuk dipelajari.', timestamp: 'Kemarin', read: false, type: 'content' },
  { id: 'tip-1', title: 'Tips coding hari ini', message: 'Gunakan nama class yang deskriptif agar kode CSS lebih mudah dipahami.', timestamp: 'Kemarin', read: true, type: 'tip' },
  { id: 'achievement-2', title: 'Progresmu meningkat', message: 'Kamu sudah menguasai 25% fondasi HTML. Terus lanjutkan!', timestamp: '2 hari lalu', read: true, type: 'achievement' },
  { id: 'content-2', title: 'Tantangan mingguan siap', message: 'Uji pemahaman JavaScript-mu dengan tantangan minggu ini.', timestamp: '3 hari lalu', read: true, type: 'content' },
];

type NotificationState = { 
  notifications: AppNotification[]; 
  markAsRead: (id: string) => void; 
  markAllAsRead: () => void; 
  remove: (id: string) => void 
};

export const useNotificationsStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: initialNotifications,
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((item) => item.id === id ? { ...item, read: true } : item),
      })),
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((item) => ({ ...item, read: true })),
      })),
      remove: (id) => set((state) => ({
        notifications: state.notifications.filter((item) => item.id !== id),
      })),
    }),
    { name: 'pemulacode-notifications', storage: createJSONStorage(() => AsyncStorage) },
  ),
);