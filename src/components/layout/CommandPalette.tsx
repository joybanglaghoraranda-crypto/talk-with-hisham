'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Home, Info, Rss, MessageSquare, Mail, Shield, User,
  Sparkles, ExternalLink, Moon, Copy, Check, X
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import { toast } from 'sonner';

interface SearchItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Social' | 'Topics';
  icon: any;
  href?: string;
  action?: () => void;
  keywords: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { user, isAdmin } = useAuthStore();
  const { locale, setLocale } = useLanguageStore();

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const searchItems: SearchItem[] = [
    {
      id: 'nav-home',
      title: t('nav.home', locale) || 'Home',
      category: 'Navigation',
      icon: Home,
      href: '/',
      keywords: ['home', 'main', 'start', 'হোম', 'নীড়'],
    },
    {
      id: 'nav-about',
      title: t('nav.about', locale) || 'About Muhibbullah Hisham',
      category: 'Navigation',
      icon: Info,
      href: '/about',
      keywords: ['about', 'bio', 'biography', 'education', 'hisham', 'সম্পর্কে', 'পরিচিতি'],
    },
    {
      id: 'nav-feed',
      title: t('nav.feed', locale) || 'Community Feed',
      category: 'Navigation',
      icon: Rss,
      href: '/feed',
      keywords: ['feed', 'posts', 'articles', 'community', 'ফিড', 'পোস্ট'],
    },
    {
      id: 'nav-chat',
      title: t('nav.chat', locale) || 'Live Chat & Debates',
      category: 'Navigation',
      icon: MessageSquare,
      href: '/chat',
      keywords: ['chat', 'live', 'debate', 'discussion', 'চ্যাট', 'আলোচনা'],
    },
    {
      id: 'nav-inbox',
      title: t('nav.inbox', locale) || 'Direct Inbox',
      category: 'Navigation',
      icon: Mail,
      href: '/inbox',
      keywords: ['inbox', 'messages', 'contact', 'ইনবক্স', 'বার্তা'],
    },
    ...(isAdmin
      ? [
          {
            id: 'nav-admin',
            title: 'Admin Dashboard',
            category: 'Navigation' as const,
            icon: Shield,
            href: '/admin',
            keywords: ['admin', 'dashboard', 'settings', 'এডমিন'],
          },
        ]
      : []),
    {
      id: 'act-copy-email',
      title: 'Copy Email Address (ibnenurakondo@gmail.com)',
      category: 'Actions',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText('ibnenurakondo@gmail.com');
        toast.success('Email copied to clipboard!');
        setIsOpen(false);
      },
      keywords: ['email', 'copy', 'contact', 'ঠিকানা', 'মেইল'],
    },
    {
      id: 'act-toggle-lang',
      title: locale === 'en' ? 'বাংলায় পরিবর্তন করুন (Switch to Bengali)' : 'Switch to English (ইংরেজি)',
      category: 'Actions',
      icon: Sparkles,
      action: () => {
        setLocale(locale === 'en' ? 'bn' : 'en');
        toast.success(locale === 'en' ? 'ভাষা বাংলায় পরিবর্তিত হয়েছে' : 'Language switched to English');
        setIsOpen(false);
      },
      keywords: ['language', 'translate', 'bengali', 'english', 'ভাষা', 'বাংলা'],
    },
    {
      id: 'soc-telegram',
      title: 'Join Telegram Channel (@twhisham)',
      category: 'Social',
      icon: ExternalLink,
      action: () => {
        window.open('https://t.me/twhisham', '_blank');
        setIsOpen(false);
      },
      keywords: ['telegram', 'social', 'group', 'টেলিগ্রাম'],
    },
    {
      id: 'soc-whatsapp',
      title: 'Join WhatsApp Community',
      category: 'Social',
      icon: ExternalLink,
      action: () => {
        window.open('https://chat.whatsapp.com/F4ceIDtHzFdG7n7q7AyetC', '_blank');
        setIsOpen(false);
      },
      keywords: ['whatsapp', 'group', 'community', 'হোয়াটসঅ্যাপ'],
    },
  ];

  const filteredItems = searchItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleSelect = (item: SearchItem) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
      setIsOpen(false);
    }
  };

  // Keyboard navigation within list
  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <>
      {/* Global Command Palette Trigger listener */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl bg-surface-100/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              {/* Search Bar */}
              <div className="flex items-center px-4 border-b border-white/8">
                <Search size={18} className="text-white/40 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDownList}
                  placeholder={locale === 'bn' ? 'অনুসন্ধান করুন (যেমন: About, Feed, Email)...' : 'Search pages, actions, topics (e.g. About, Feed, Email)...'}
                  className="w-full bg-transparent py-4 text-sm text-white placeholder-white/30 focus:outline-none font-sans"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/5 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar">
                {filteredItems.length === 0 ? (
                  <div className="py-10 text-center text-white/30 text-xs font-mono">
                    No matching results found for &quot;{query}&quot;
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                          isSelected ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20' : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-white/40'
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-medium truncate">{item.title}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 flex-shrink-0">
                          {item.category}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer Tip */}
              <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/30">
                <div className="flex items-center gap-2">
                  <span>Navigation:</span>
                  <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">↑↓</span>
                  <span>Select:</span>
                  <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">Enter</span>
                </div>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
