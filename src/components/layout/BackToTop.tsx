'use client';

import { useEffect, useState } from 'react';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const { locale } = useLanguageStore();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollTop > 400);
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const size = 44;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          onClick={scrollToTop}
          aria-label={t('misc.back_top', locale)}
          className="fixed z-50 right-4 bottom-24 md:bottom-6 flex items-center justify-center rounded-full shadow-xl shadow-black/40 hover:scale-105 active:scale-95 transition-transform bg-surface-800/90 backdrop-blur border border-white/10"
          style={{ width: size, height: size }}
        >
          <svg width={size} height={size} className="absolute inset-0 -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="3"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#btp-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              className="transition-[stroke-dashoffset] duration-100"
            />
            <defs>
              <linearGradient id="btp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp size={18} className="text-white relative" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
