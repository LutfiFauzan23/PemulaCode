import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { colors } from '@/constants/colors';
import { useSettingsStore, ThemeMode } from '@/stores/settings-store';

// ======================================================
// TYPES
// ======================================================

export type ThemeColors = Record<keyof typeof colors.light, string>;

interface ThemeContextValue {
  colors: ThemeColors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const toggleThemeStore = useSettingsStore((state) => state.toggleTheme);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setTheme(next);
    },
    [setTheme],
  );

  const toggleTheme = useCallback(() => {
    toggleThemeStore();
  }, [toggleThemeStore]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: colors[theme],
      mode: theme,
      setMode,
      toggleTheme,
    }),
    [theme, setMode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ======================================================
// HOOK
// ======================================================

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}