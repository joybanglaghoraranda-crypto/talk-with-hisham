'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/stores/language-store';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

export default function LanguageInit() {
  const { locale } = useLanguageStore();

  useEffect(() => {
    const dir = LOCALES.find(l => l.code === locale)?.dir ?? 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}
