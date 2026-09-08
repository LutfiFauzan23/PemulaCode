import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Language = 'id' | 'en';
export type ThemeMode = 'light' | 'dark';

type SettingsState = {
  language: Language;
  theme: ThemeMode;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: 'id',
      theme: 'light',
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    {
      name: 'pemulacode-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);
