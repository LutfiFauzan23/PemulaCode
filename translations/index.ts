import { useSettingsStore } from '@/stores/settings-store';
import { interpolate, type InterpolationParams } from '@/utils/interpolate';
import { id, TranslationKeys } from './id';
import { en } from './en';

const translations = { id, en };

/**
 * Hook that returns a translation function `t(key, params?)`.
 * Reads the current language from the global Zustand settings store.
 * Falls back to English if a key is missing.
 *
 * `params` mengisi placeholder seperti `{name}` di teks terjemahan, mis.
 * `t('helloName', { name: nickname })`.
 */
export function useTranslation() {
  const language = useSettingsStore((state) => state.language);

  const t = (key: TranslationKeys, params?: InterpolationParams): string => {
    const dict = translations[language] ?? translations.en;
    return interpolate(dict[key] ?? en[key] ?? key, params);
  };

  return { t, language };
}

export type { TranslationKeys };
