import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquareText, ArrowRight } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';
import GlassWrapper from '../layout/GlassWrapper';
import StatsCounter from './StatsCounter';
import FeaturesSection from './FeaturesSection';
import CTASection from './CTASection';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-0">
      {/* Main Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
        <div className="order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-400 font-mono tracking-widest uppercase mb-2"
          >
            Welcome to my digital space
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter"
          >
            Talk with <span className="bg-gradient-to-r from-orange-400 to-rose-600 bg-clip-text text-transparent italic">Hisham.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 max-w-xl mb-8 leading-relaxed"
          >
            A space for deep conversations, real-time opinions, and cross-platform connection.
            Join the conversation and let's rethink the digital social landscape.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => navigate('/chat')}
              className="group bg-gradient-to-r from-orange-500 to-rose-500 hover:scale-105 active:scale-95 transition-all text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <MessageSquareText size={20} />
              Join the Conversation
              <ArrowRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </button>

            <div className="flex gap-3 items-center">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-110 hover:border-orange-500/30"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center lg:justify-end pr-4 md:pr-12">
          <GlassWrapper className="p-3 border-orange-500/40 overflow-hidden group relative shadow-[0_0_50px_rgba(249,115,22,0.1)]">
            <div className="w-64 h-64 md:w-96 md:h-96 rounded-xl overflow-hidden relative z-10 border border-white/10">
              <img
                src="/images/hisham.png"
                alt="Muhibbullah Hisham"
                className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100 brightness-90 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-all duration-700" />
          </GlassWrapper>
        </div>
      </div>

      {/* Stats Counter */}
      <StatsCounter />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default Hero;
