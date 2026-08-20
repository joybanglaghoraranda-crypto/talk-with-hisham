'use client';

import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';

export default function TermsContent() {
  const { locale } = useLanguageStore();
  return (
    <div className="glass-card p-8 space-y-8 text-white/70 leading-relaxed">
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('terms.s1_t', locale)}</h2>
        <p>{t('terms.s1_b', locale)}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('terms.s2_t', locale)}</h2>
        <p>{t('terms.s2_b', locale)}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('terms.s3_t', locale)}</h2>
        <p className="mb-3">{t('terms.s3_b1', locale)}</p>
        <p>{t('terms.s3_b2', locale)}</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>{t('terms.s3_l1', locale)}</li>
          <li>{t('terms.s3_l2', locale)}</li>
          <li>{t('terms.s3_l3', locale)}</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('terms.s4_t', locale)}</h2>
        <p>{t('terms.s4_b', locale)}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('terms.s5_t', locale)}</h2>
        <p>{t('terms.s5_b', locale)}</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-white mb-3">{t('terms.s6_t', locale)}</h2>
        <p>{t('terms.s6_b', locale)}</p>
      </section>
    </div>
  );
}
