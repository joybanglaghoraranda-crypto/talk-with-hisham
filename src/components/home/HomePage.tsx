'use client';

import { motion } from 'framer-motion';
import { MessageSquareText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth-store';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatsCounter from '@/components/home/StatsCounter';
import CTASection from '@/components/home/CTASection';
import AuthModal from '@/components/auth/AuthModal';
import { useState } from 'react';

export default function HomePage() {
  const { user } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);

  const handleJoin = () => {
    if (user) {
      window.location.href = '/chat';
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      {/* Hero Background — only on homepage */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/images/hisham-backgroud.png')] bg-cover bg-center opacity-20 grayscale-[0.2]" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-0/70 via-surface-0/40 to-surface-0" />
      </div>

      <div className="relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[75vh] py-8">
          {/* Left — Content */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-brand-400 font-mono tracking-widest uppercase text-xs mb-3"
            >
              Welcome to my digital space
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 tracking-tighter leading-[0.9]"
            >
              Talk with{' '}
              <span className="gradient-text italic">Hisham.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/55 max-w-xl mb-8 leading-relaxed"
            >
              A space for deep conversations, real-time opinions, and cross-platform connection.
              Join the conversation and let&apos;s rethink the digital social landscape.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={handleJoin}
                className="group flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold py-3 px-7 rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <MessageSquareText size={18} />
                Join the Conversation
                <ArrowRight size={15} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </button>

              <div className="flex gap-2.5 items-center">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    className="w-10 h-10 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 hover:border-brand-500/30"
                  >
                    <social.icon size={17} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 20 }}
              className="relative group"
            >
              {/* Glow effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-brand-500/15 to-accent-500/15 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

              <div className="relative glass-card p-2.5 group overflow-hidden shadow-2xl">
                <div className="w-60 h-60 md:w-80 md:h-80 rounded-2xl overflow-hidden relative border border-white/8">
                  <Image
                    src="/images/hisham.png"
                    alt="Muhibbullah Hisham"
                    fill
                    className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 brightness-90 group-hover:brightness-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>

                {/* Decorative orbs */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-brand-500/8 rounded-full blur-3xl group-hover:bg-brand-500/15 transition-all duration-700" />
                <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-accent-500/8 rounded-full blur-3xl group-hover:bg-accent-500/15 transition-all duration-700" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <StatsCounter />

        {/* Features */}
        <FeaturesSection />

        {/* CTA */}
        <CTASection />
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
