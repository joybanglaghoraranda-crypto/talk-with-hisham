import React from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-600 flex items-center justify-center font-bold text-white text-sm">
                H
              </div>
              <span className="font-bold text-lg text-white">Talk with Hisham</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              A space for deep conversations, real-time opinions, and cross-platform connection.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Navigate</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Feed', href: '/feed' },
                { label: 'Chat', href: '/chat' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Connect</h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-110 hover:border-orange-500/30"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Talk with Hisham. All rights reserved.
          </p>
          <p className="text-white/20 text-[10px] tracking-widest uppercase">
            Built with purpose & passion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
