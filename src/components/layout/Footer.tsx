'use client';

import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { SOCIAL_LINKS, SITE_CONFIG } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-surface-50/80 backdrop-blur-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                H
              </div>
              <span className="font-heading font-bold text-base text-white">{SITE_CONFIG.name}</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed max-w-sm">
              {SITE_CONFIG.description.split('—')[0].trim()}
            </p>
            <div className="pt-3 space-y-2">
              <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 text-white/40 hover:text-brand-400 transition-colors text-sm w-fit">
                <Mail size={14} /> {SITE_CONFIG.email}
              </a>
              <a href={SITE_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-brand-400 transition-colors text-sm w-fit">
                <Phone size={14} /> {SITE_CONFIG.phone}
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Navigate</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Feed', href: '/feed' },
                { label: 'Chat', href: '/chat' },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-white/40 hover:text-white transition-colors text-sm w-fit">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Connect</h4>
            <div className="flex gap-2 flex-wrap">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-9 h-9 rounded-lg border border-white/8 bg-white/3 hover:bg-white/8 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 hover:border-brand-500/30"
                >
                  <social.icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="text-white/25 text-xs flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <span>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-white/10">|</span>
              <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            </div>
          </div>
          <p className="text-white/15 text-[10px] tracking-widest uppercase font-medium">
            Built with purpose & passion
          </p>
        </div>
      </div>
    </footer>
  );
}
