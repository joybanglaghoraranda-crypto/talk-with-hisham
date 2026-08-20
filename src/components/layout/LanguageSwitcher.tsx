'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import { LOCALES, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition-colors text-white/50 hover:text-white/80 text-xs"
        aria-label={t('misc.switch_lang', locale)}
      >
        <Globe size={13} />
        <span className="hidden sm:inline">{current.native}</span>
        <span className="sm:hidden">{current.code.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-xl border border-white/[0.08] bg-[#151515] shadow-xl shadow-black/40 py-1.5 z-50 overflow-hidden"
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  locale === l.code
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
                }`}
              >
                <span className="flex-1 text-left">{l.native}</span>
                <span className="text-white/20 text-xs uppercase">{l.code}</span>
                {locale === l.code && <Check size={14} className="text-brand-400 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
