import { create } from 'zustand';

export type Language = 'id' | 'en';
export type ThemeMode = 'light' | 'dark';

type SettingsState = {
  language: Language;
  theme: ThemeMode;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  language: 'en',
  theme: 'light',
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
}));
