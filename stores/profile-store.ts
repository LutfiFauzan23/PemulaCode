import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ProfileState = { avatarUri: string | null; setAvatarUri: (avatarUri: string | null) => void };

export const useProfileStore = create<ProfileState>()(persist((set) => ({
  avatarUri: null,
  setAvatarUri: (avatarUri) => set({ avatarUri }),
}), { name: 'pemulacode-profile', storage: createJSONStorage(() => AsyncStorage) }));
