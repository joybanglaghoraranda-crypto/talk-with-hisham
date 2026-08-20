'use client';

import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Target, Heart, Users, Lightbulb, Award, Globe, BadgeCheck } from 'lucide-react';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatsCounter from '@/components/home/StatsCounter';
import CTASection from '@/components/home/CTASection';

export default function AboutPage() {
  const { locale } = useLanguageStore();

  const ROLES = [
    t('role.instructor', locale), t('role.educator', locale), t('role.mentor', locale),
    t('role.researcher', locale), t('role.ai', locale), t('role.thinker', locale),
    t('role.counselor', locale), t('role.curriculum', locale),
  ];
  const PASSIONS = [
    t('passion.languages', locale), t('passion.entrepreneurship', locale), t('passion.charity', locale),
    t('passion.social', locale), t('passion.youth', locale), t('passion.community', locale),
  ];

  const TIMELINE = [
    { year: t('tl.early_year', locale), title: t('tl.early_title', locale), desc: t('tl.early_desc', locale), icon: BookOpen },
    { year: t('tl.qawmi_year', locale), title: t('tl.qawmi_title', locale), desc: t('tl.qawmi_desc', locale), icon: GraduationCap },
    { year: t('tl.spec_year', locale), title: t('tl.spec_title', locale), desc: t('tl.spec_desc', locale), icon: Award },
    { year: t('tl.present_year', locale), title: t('tl.present_title', locale), desc: t('tl.present_desc', locale), icon: Target },
  ];

  const CREDENTIALS = [
    { icon: BookOpen, label: t('cred.quran', locale) },
    { icon: GraduationCap, label: t('cred.dawra', locale) },
    { icon: Award, label: t('cred.pgd', locale) },
    { icon: BadgeCheck, label: t('cred.educator', locale) },
  ];

  return (
    <div className="relative z-10 px-4 md:px-8 max-w-5xl mx-auto pb-12 mesh-bg min-h-screen">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <p className="text-brand-400 font-mono tracking-widest uppercase text-xs mb-3">{t('about.hero_label', locale)}</p>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-4">
          <span className="gradient-text">Muhibbullah Hisham</span>
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto text-sm leading-relaxed">{t('about.hero_desc', locale)}</p>
      </motion.div>

      {/* Intro Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 md:p-8 mb-8"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
            <Lightbulb size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-1">{t('about.who_i_am', locale)}</h2>
            <p className="text-white/35 text-xs uppercase tracking-widest">{t('about.born', locale)}</p>
          </div>
        </div>
        <div className="space-y-4 text-white/60 leading-relaxed text-[15px]">
          <p dangerouslySetInnerHTML={{ __html: t('about.bio_p1', locale) }} />
          <p>{t('about.bio_p2', locale)}</p>
          <p>{t('about.bio_p3', locale)}</p>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
          <GraduationCap size={20} className="text-brand-400" />
          {t('about.academic', locale)}
        </h2>
        <div className="relative">
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/30 via-white/8 to-transparent" />
          <div className="space-y-6">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start group"
              >
                <div className="w-11 h-11 rounded-xl bg-surface-200 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all relative z-10">
                  <item.icon size={16} className="text-white/40 group-hover:text-brand-400 transition-colors" />
                </div>
                <div className="glass-card glass-card-hover p-4 flex-1">
                  <p className="text-[10px] text-brand-400 font-mono uppercase tracking-widest mb-1">{item.year}</p>
                  <h3 className="text-sm font-heading font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Roles & Passions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6">
          <h3 className="text-sm font-heading font-bold text-brand-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={14} /> {t('about.roles', locale)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <span key={role} className="px-3 py-1.5 bg-white/3 border border-white/8 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 hover:border-brand-500/20 transition-all cursor-default">{role}</span>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-sm font-heading font-bold text-accent-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Heart size={14} /> {t('about.passions', locale)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {PASSIONS.map((passion) => (
              <span key={passion} className="px-3 py-1.5 bg-white/3 border border-white/8 rounded-lg text-xs text-accent-400/50 hover:text-accent-400 hover:bg-accent-500/5 hover:border-accent-500/20 transition-all cursor-default">{passion}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mission */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6 md:p-8 text-center">
        <Globe size={28} className="mx-auto text-brand-400 mb-4" />
        <h2 className="text-lg font-heading font-bold text-white mb-3">{t('about.mission', locale)}</h2>
        <p className="text-white/45 text-sm leading-relaxed max-w-2xl mx-auto">{t('about.mission_text', locale)}</p>
      </motion.div>

      {/* Credentials */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CREDENTIALS.map((cred) => (
          <div key={cred.label} className="flex items-center gap-3 glass-card px-4 py-3">
            <cred.icon size={16} className="text-brand-400 flex-shrink-0" />
            <span className="text-xs text-white/50 leading-snug">{cred.label}</span>
          </div>
        ))}
      </motion.div>

      <StatsCounter />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
