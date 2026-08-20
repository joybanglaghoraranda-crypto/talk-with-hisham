'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SOCIAL_LINKS, SITE_CONFIG } from '@/lib/constants';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';

export default function Footer() {
  const pathname = usePathname();
  const { locale } = useLanguageStore();
  const hideFooter = pathname.startsWith('/chat') || pathname.startsWith('/feed') || pathname.startsWith('/inbox');

  if (hideFooter) return null;

  return (
    <footer className="relative z-10 border-t border-white/5 bg-surface-50/80 backdrop-blur-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Compact row: brand + socials + legal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              MH
            </div>
            <span className="font-heading font-bold text-sm text-white/80">{SITE_CONFIG.name}</span>
            <span className="hidden sm:inline text-white/15 text-xs">&middot;</span>
            <span className="hidden sm:inline text-white/25 text-xs">
              &copy; {new Date().getFullYear()}
            </span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.label}
                className="w-8 h-8 rounded-lg border border-white/8 bg-white/3 hover:bg-white/8 flex items-center justify-center text-white/30 hover:text-white transition-all hover:scale-110 hover:border-brand-500/30"
              >
                <social.icon size={14} />
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4 text-white/25 text-xs">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">{t('footer.privacy', locale)}</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">{t('footer.terms', locale)}</Link>
            <span className="sm:hidden">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
