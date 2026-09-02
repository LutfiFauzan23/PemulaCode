import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { colors } from '@/constants/colors';

// ======================================================
// TYPES
// ======================================================

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  colors: typeof colors.light;
  isLoading: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = '@pemula_code/theme_mode';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  // Fallback to system preference until the stored value (if any) loads.
  const [mode, setModeState] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted preference on mount.
  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!isMounted) return;

        if (stored === 'light' || stored === 'dark') {
          setModeState(stored);
        } else if (systemScheme === 'dark' || systemScheme === 'light') {
          setModeState(systemScheme);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // Only run once on mount - user's explicit choice should override
    // system changes afterwards, so systemScheme is intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Non-critical: if persistence fails, the mode still applies for this session.
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: colors[mode],
      isLoading,
      mode,
      setMode,
      toggleTheme,
    }),
    [mode, isLoading, setMode, toggleTheme]
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