'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Shield, Zap, Users, BookOpen, Lock } from 'lucide-react';

const FEATURES = [
  { icon: MessageSquare, title: 'Real-Time Chat', description: 'Join live debates and discussions with instant message delivery and reactions.', color: 'from-brand-500 to-brand-300', delay: 0 },
  { icon: Shield, title: 'Private Messaging', description: 'Send private messages directly to Hisham. Encrypted and confidential.', color: 'from-accent-500 to-accent-400', delay: 0.1 },
  { icon: Zap, title: 'Instant Reactions', description: 'Express your thoughts with emoji reactions on posts and chat messages.', color: 'from-yellow-500 to-brand-500', delay: 0.2 },
  { icon: Users, title: 'Community Feed', description: "Follow Hisham's thoughts and join the public discourse with comments.", color: 'from-violet-500 to-purple-400', delay: 0.3 },
  { icon: BookOpen, title: 'Knowledge Sharing', description: 'Educational content bridging Islamic scholarship with modern thought.', color: 'from-emerald-500 to-teal-400', delay: 0.4 },
  { icon: Lock, title: 'Secure & Private', description: 'Your data is protected with enterprise-grade security and authentication.', color: 'from-blue-500 to-cyan-400', delay: 0.5 },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-14"
      >
        <p className="text-brand-400 font-mono tracking-widest uppercase text-xs mb-3">Everything you need</p>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight mb-4">
          Platform <span className="gradient-text">Features</span>
        </h2>
        <p className="text-white/35 max-w-lg mx-auto text-sm leading-relaxed">
          A comprehensive social and intellectual space designed for meaningful connections.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: feature.delay, duration: 0.4 }}
            className="group"
          >
            <div className="relative h-full glass-card glass-card-hover p-6 overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-[0.06] blur-3xl transition-opacity duration-700`} />

              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <feature.icon size={20} className="text-white" />
              </div>

              <h3 className="text-base font-heading font-bold text-white mb-2 group-hover:text-brand-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-white/35 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
