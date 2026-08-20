'use client';

import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Lightbulb, Users, Globe2, HeartHandshake } from 'lucide-react';
import { useLanguageStore } from '@/stores/language-store';
import { t, type Locale } from '@/lib/i18n';

const FEATURES = (locale: Locale) => [
  { icon: GraduationCap, title: t('exp.teaching', locale), description: t('feat.teaching_desc', locale), color: 'from-brand-500 to-brand-300', delay: 0 },
  { icon: BookOpen, title: t('exp.research', locale), description: t('feat.research_desc', locale), color: 'from-accent-500 to-accent-400', delay: 0.1 },
  { icon: Lightbulb, title: t('exp.curriculum', locale), description: t('feat.curriculum_desc', locale), color: 'from-yellow-500 to-brand-500', delay: 0.2 },
  { icon: Users, title: t('exp.mentoring', locale), description: t('feat.mentoring_desc', locale), color: 'from-violet-500 to-purple-400', delay: 0.3 },
  { icon: Globe2, title: t('exp.dawah', locale), description: t('feat.dawah_desc', locale), color: 'from-emerald-500 to-teal-400', delay: 0.4 },
  { icon: HeartHandshake, title: t('exp.community', locale), description: t('feat.community_desc', locale), color: 'from-blue-500 to-cyan-400', delay: 0.5 },
];

export default function FeaturesSection() {
  const { locale } = useLanguageStore();
  return (
    <section className="py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-14"
      >
        <p className="text-brand-400 font-mono tracking-widest uppercase text-xs mb-3">{t('feat.what_i_do', locale)}</p>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight mb-4">
          {t('features.title', locale).split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('features.title', locale).split(' ').slice(-1)}</span>
        </h2>
        <p className="text-white/35 max-w-lg mx-auto text-sm leading-relaxed">
          {t('feat.subtitle', locale)}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {FEATURES(locale).map((feature) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: feature.delay, duration: 0.4 }}
            className="group"
          >
            <div className="relative h-full glass-card glass-card-hover p-6 overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-[0.06] blur-3xl transition-opacity duration-700`} />

              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <feature.icon size={20} className="text-white" />
              </div>

              <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-brand-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-white/35 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
