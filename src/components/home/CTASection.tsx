import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="relative"
      >
        {/* Background glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-orange-500/10 rounded-[3rem] blur-3xl" />
        
        <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
          
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30"
          >
            <Sparkles size={28} className="text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 relative z-10">
            Ready to join the <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">conversation?</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-sm md:text-base leading-relaxed mb-8 relative z-10">
            Be part of a community that values intellectual discourse, personal growth, and meaningful connections.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => navigate('/chat')}
              className="group flex items-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare size={20} />
              Start Chatting
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/feed')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium py-4 px-8 rounded-full transition-all hover:scale-105"
            >
              Explore the Feed
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
