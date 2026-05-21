'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Newspaper, MessageSquare, Mail } from 'lucide-react';

const TABS = [
  { href: '/feed', label: 'Feed', icon: Newspaper },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/inbox', label: 'Inbox', icon: Mail },
] as const;

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphism background */}
      <div className="bg-surface-0/80 backdrop-blur-xl border-t border-white/[0.06] safe-bottom">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-colors"
              >
                {/* Active indicator glow */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon
                  size={20}
                  className={`transition-colors ${
                    isActive ? 'text-brand-400' : 'text-white/30'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
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
