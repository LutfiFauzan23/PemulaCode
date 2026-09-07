import { useSettingsStore } from '@/stores/settings-store';
import { id, TranslationKeys } from './id';
import { en } from './en';

const translations = { id, en };

/**
 * Hook that returns a translation function `t(key)`.
 * Reads the current language from the global Zustand settings store.
 * Falls back to English if a key is missing.
 */
export function useTranslation() {
  const language = useSettingsStore((state) => state.language);

  const t = (key: TranslationKeys): string => {
    const dict = translations[language] ?? translations.en;
    return dict[key] ?? en[key] ?? key;
  };

  return { t, language };
}

export type { TranslationKeys };
