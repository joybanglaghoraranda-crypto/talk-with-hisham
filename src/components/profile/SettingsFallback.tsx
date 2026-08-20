'use client';

import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';

export default function SettingsFallback() {
  const { locale } = useLanguageStore();
  return <div className="text-white/40 text-center py-12">{t('misc.load_settings', locale)}</div>;
}
