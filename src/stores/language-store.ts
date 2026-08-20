import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '@/lib/i18n';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  direction: 'ltr' | 'rtl';
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      direction: 'ltr',
      setLocale: (locale: Locale) => {
        const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'ltr';
        if (typeof document !== 'undefined') {
          document.documentElement.lang = locale;
          document.documentElement.dir = dir;
        }
        set({ locale, direction: dir });
      },
    }),
    {
      name: 'twh-language',
    }
  )
);

// Initialize direction on load
if (typeof window !== 'undefined') {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('twh-language') ?? '{}'); } catch { return {}; } })();
  const locale = (saved?.state?.locale as Locale) ?? DEFAULT_LOCALE;
  const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'ltr';
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
}
