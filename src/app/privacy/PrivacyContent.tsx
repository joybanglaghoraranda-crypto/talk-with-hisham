'use client';

import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';

export default function PrivacyContent() {
  const { locale } = useLanguageStore();
  return (
    <div className="glass-card p-8 space-y-8 text-white/70 leading-relaxed">
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('priv.s1_t', locale)}</h2>
        <p className="mb-3">{t('priv.s1_b', locale)}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t('priv.s1_l1', locale)}</li>
          <li>{t('priv.s1_l2', locale)}</li>
          <li>{t('priv.s1_l3', locale)}</li>
          <li>{t('priv.s1_l4', locale)}</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('priv.s2_t', locale)}</h2>
        <p className="mb-3">{t('priv.s2_b', locale)}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t('priv.s2_l1', locale)}</li>
          <li>{t('priv.s2_l2', locale)}</li>
          <li>{t('priv.s2_l3', locale)}</li>
          <li>{t('priv.s2_l4', locale)}</li>
          <li>{t('priv.s2_l5', locale)}</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('priv.s3_t', locale)}</h2>
        <p>{t('priv.s3_b', locale)}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('priv.s4_t', locale)}</h2>
        <p>{t('priv.s4_b', locale)}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('priv.s5_t', locale)}</h2>
        <p>{t('priv.s5_b', locale)}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('priv.s6_t', locale)}</h2>
        <p>{t('priv.s6_b', locale)}</p>
      </section>
    </div>
  );
}
