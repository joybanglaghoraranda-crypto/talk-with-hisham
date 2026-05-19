'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Info, Rss, MessageSquare, Mail, Shield, User, LogIn, LogOut,
  Menu, X, Bell, ChevronDown, Settings, CheckCheck, Trash2,
  Heart, MessageCircle, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import AuthModal from '@/components/auth/AuthModal';
import { cn, formatRelativeTime } from '@/lib/utils';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  const pathname = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Scroll-based opacity
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  const NAV_ITEMS = [
    { href: '/', icon: Home, label: 'Home', auth: false },
    { href: '/about', icon: Info, label: 'About', auth: false },
    ...(user ? [
      { href: '/feed', icon: Rss, label: 'Feed', auth: true },
      { href: '/chat', icon: MessageSquare, label: 'Chat', auth: true },
      { href: '/inbox', icon: Mail, label: 'Inbox', auth: true },
    ] : []),
    ...(isAdmin ? [
      { href: '/admin', icon: Shield, label: 'Admin', auth: true },
    ] : []),
  ];

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'message_reply': return <MessageSquare size={13} className="text-brand-400" />;
      case 'new_reaction': return <Heart size={13} className="text-accent-400" />;
      case 'new_comment': return <MessageCircle size={13} className="text-blue-400" />;
      default: return <Sparkles size={13} className="text-purple-400" />;
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 transition-all duration-300',
          scrolled
            ? 'bg-surface-0/80 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20'
            : 'bg-transparent'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
            H
          </div>
          <span className="font-heading font-bold text-base text-white hidden sm:inline tracking-tight">
            Talk with Hisham
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'text-brand-400'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon size={15} />
              <span>{item.label}</span>
              {isActive(item.href) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-1.5">
          {/* Notification Bell */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-white/50 hover:text-white"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-brand-500 to-accent-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-lg shadow-brand-500/30"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 max-h-[420px] bg-surface-100/98 backdrop-blur-2xl border border-white/8 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                      <h3 className="text-sm font-heading font-bold text-white">Notifications</h3>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Mark all read">
                            <CheckCheck size={14} />
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button onClick={clearAll} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-accent-400 transition-colors" title="Clear all">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-[350px] custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <Bell className="mx-auto text-white/10 mb-3" size={28} />
                          <p className="text-white/25 text-xs">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 20).map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={cn(
                              'w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0',
                              !notif.read && 'bg-brand-500/5'
                            )}
                          >
                            <div className="mt-0.5 w-7 h-7 rounded-full bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                              {getNotifIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                                {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />}
                              </div>
                              <p className="text-[11px] text-white/40 truncate mt-0.5">{notif.body}</p>
                              <p className="text-[10px] text-white/20 mt-1">{formatRelativeTime(notif.created_at)}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Profile Dropdown / Sign In */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-[11px] font-bold text-white">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <ChevronDown size={14} className={cn('transition-transform', profileOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-surface-100/98 backdrop-blur-2xl border border-white/8 rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{isAdmin ? 'Administrator' : 'Member'}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        <User size={15} /> Profile
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        <Settings size={15} /> Settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent-400/80 hover:text-accent-400 hover:bg-accent-500/5 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <LogIn size={15} />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Right */}
        <div className="flex md:hidden items-center gap-1">
          {user && (
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-white/5 text-white/50"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-brand-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 bottom-0 left-0 z-40 bg-surface-0/95 backdrop-blur-2xl p-6 flex flex-col gap-2 overflow-y-auto"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all',
                  isActive(item.href)
                    ? 'text-brand-400 bg-brand-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}

            <div className="border-t border-white/8 pt-4 mt-4">
              {user ? (
                <div className="flex flex-col gap-1">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5">
                    <User size={20} /> Profile
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5">
                    <Settings size={20} /> Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-accent-400 hover:bg-accent-500/10"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold py-3.5 rounded-xl"
                >
                  <LogIn size={18} /> Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
