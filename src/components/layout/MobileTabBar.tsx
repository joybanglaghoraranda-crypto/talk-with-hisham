'use client';

import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Newspaper, MessageSquare, Mail, User } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/feed', label: 'Feed', icon: Newspaper },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/inbox', label: 'Inbox', icon: Mail },
  { href: '/profile', label: 'Profile', icon: User },
] as const;

export default function MobileTabBar() {
  const { locale } = useLanguageStore();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Solid app-style background (WhatsApp/Telegram feel) */}
      <div className="bg-surface-50/95 backdrop-blur-xl border-t border-white/[0.06] safe-bottom shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
        <div className="flex items-stretch justify-around h-[58px] max-w-lg mx-auto px-1">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href + '/'));
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center gap-1 flex-1 rounded-xl transition-colors"
              >
                {/* iOS-style active pill */}
                {isActive && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-x-1.5 inset-y-0.5 bg-brand-500/15 border border-brand-500/25 rounded-xl shadow-[0_0_12px_rgba(34,197,94,0.15)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon
                  size={23}
                  className={`relative transition-all ${
                    isActive ? 'text-brand-400' : 'text-white/30'
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
                <span
                  className={`relative text-[10px] font-semibold transition-colors ${
                    isActive ? 'text-brand-400' : 'text-white/30'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
