'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Copy, Check, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { SOCIAL_LINKS, SITE_CONFIG } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth-store';
import AuthModal from '@/components/auth/AuthModal';
import { toast } from 'sonner';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import DailyWisdom from '@/components/widgets/DailyWisdom';
import AudioReflectionPlayer from '@/components/widgets/AudioReflectionPlayer';

export default function HomePage() {
  const { user } = useAuthStore();
  const { locale } = useLanguageStore();
  const EXPERTISE = [
    t('exp.teaching', locale),
    t('exp.research', locale),
    t('exp.curriculum', locale),
    t('exp.mentoring', locale),
    t('exp.dawah', locale),
    t('exp.community', locale),
  ];
  const [authOpen, setAuthOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleJoin = () => {
    if (user) { window.location.href = '/chat'; }
    else { setAuthOpen(true); }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopied(true);
      toast.success(t('home.email_copied', locale));
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error(t('home.copy_fail', locale)); }
  };

  return (
    <>
      {/* Hero — Minimalist, Akash Tyagi style */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-10 py-10 md:py-12 overflow-hidden">
        
        {/* Giant brand mark — MH monogram, stroke-only (like the smiley) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 md:top-16 left-6 md:left-10 select-none pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-[clamp(120px,28vw,220px)] h-[clamp(120px,28vw,220px)]"
            fill="none"
            stroke="url(#mh-grad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="mh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
            </defs>
            {/* M */}
            <line x1="30" y1="50" x2="30" y2="150" />
            <line x1="30" y1="50" x2="65" y2="100" />
            <line x1="65" y1="100" x2="100" y2="50" />
            <line x1="100" y1="50" x2="100" y2="150" />
            {/* H */}
            <line x1="120" y1="50" x2="120" y2="150" />
            <line x1="120" y1="100" x2="170" y2="100" />
            <line x1="170" y1="50" x2="170" y2="150" />
          </svg>
        </motion.div>

        {/* Middle — nothing (negative space) */}
        <div />

        {/* Bottom — Name + Role (Akash Tyagi: name bottom-left, copyright bottom-right) */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Name — large, mono-style for tech/nature hybrid feel */}
            <h1 className="font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[0.08em] uppercase text-white leading-[1.1] mb-3">
              Muhibbullah<br />
              <span className="gradient-text">Hisham</span>
            </h1>

            {/* Role line */}
            <p className="text-brand-400/80 font-mono text-xs md:text-sm tracking-[0.25em] uppercase mb-6">
              Educator · Researcher · Mentor
            </p>

            {/* Subtle CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleJoin}
                className="flex items-center gap-2 text-white/60 hover:text-brand-400 font-mono text-xs tracking-wider uppercase transition-colors group"
              >
                <span>{t('home.start_convo', locale)}</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-white/15 font-mono">/</span>
              <Link
                href="/about"
                className="flex items-center gap-2 text-white/40 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors group"
              >
                <span>{t('nav.about', locale)}</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <span className="text-white/15 font-mono">/</span>
              <button
                onClick={copyEmail}
                className="flex items-center gap-2 text-white/40 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors"
              >
                <span>{copied ? 'Copied!' : 'Email'}</span>
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={11} />}
              </button>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-9 h-9 rounded-full border border-white/[0.06] hover:border-brand-500/20 flex items-center justify-center text-white/25 hover:text-brand-400 transition-all hover:scale-110"
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Copyright — bottom-right (like Akash Tyagi) */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-mono text-[10px] md:text-xs text-white/15 tracking-wider uppercase md:text-right"
          >
            © {new Date().getFullYear()} Muhibbullah Hisham
          </motion.p>
        </div>
      </section>

      {/* Expertise Tags (below the fold) */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 px-6 md:px-10 max-w-5xl mx-auto pb-20"
      >
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-400/50 mb-5">
          Expertise
        </p>
        <div className="flex flex-wrap gap-2">
          {EXPERTISE.map((item) => (
            <span
              key={item}
              className="px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-full text-xs text-white/45 hover:text-white hover:bg-white/[0.05] hover:border-brand-500/15 transition-colors cursor-default font-mono tracking-wide"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Daily Reflections & Audio Note Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-12">
          <DailyWisdom />
          <AudioReflectionPlayer />
        </div>

        {/* CTA banner */}
        <div className="mt-16 relative overflow-hidden rounded-3xl bg-surface-200/40 border border-white/[0.04] p-8 md:p-12 text-center">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-brand-500/[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-accent-500/[0.02] rounded-full blur-3xl" />
          <p className="relative z-10 font-mono text-[10px] tracking-[0.2em] uppercase text-brand-400/50 mb-4">
            {t('home.get_in_touch', locale)}
          </p>
          <h2 className="relative z-10 text-xl md:text-3xl font-heading font-bold text-white tracking-tight mb-3">
            Let&apos;s have a{' '}
            <span className="gradient-text">meaningful conversation</span>
          </h2>
          <p className="relative z-10 text-white/25 text-sm mb-8 max-w-md mx-auto">
            Whether it&apos;s education, research, collaboration, or simply a discussion.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleJoin}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-semibold py-3 px-7 rounded-full transition-all hover:scale-[1.02] shadow-lg shadow-brand-500/20"
            >
              Join the Community
              <ArrowRight size={14} />
            </button>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/60 hover:text-white font-medium py-3 px-7 rounded-full transition-all"
            >
              <Mail size={14} />
              Email Directly
            </a>
          </div>
        </div>
      </motion.section>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
