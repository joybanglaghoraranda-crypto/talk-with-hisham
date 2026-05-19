'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import AuthModal from '@/components/auth/AuthModal';

export default function CTASection() {
  const { user } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);

  const handleAction = (path: string) => {
    if (user) {
      window.location.href = path;
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      <section className="py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/8 via-accent-500/4 to-brand-500/8 rounded-[3rem] blur-3xl" />

          <div className="relative glass-card p-8 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-500/4 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/4 rounded-full blur-3xl" />

            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/30"
            >
              <Sparkles size={24} className="text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight mb-4 relative z-10">
              Ready to join the <br className="hidden md:block" />
              <span className="gradient-text">conversation?</span>
            </h2>
            <p className="text-white/35 max-w-lg mx-auto text-sm md:text-base leading-relaxed mb-8 relative z-10">
              Be part of a community that values intellectual discourse, personal growth, and meaningful connections.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button
                onClick={() => handleAction('/chat')}
                className="group flex items-center gap-3 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-105 active:scale-95"
              >
                <MessageSquare size={18} />
                Start Chatting
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleAction('/feed')}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/8 text-white font-medium py-3.5 px-8 rounded-xl transition-all hover:scale-105"
              >
                Explore the Feed
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
