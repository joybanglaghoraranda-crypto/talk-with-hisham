import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Shield, Zap, Users, BookOpen, Smartphone, Globe, Lock } from 'lucide-react';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Real-Time Chat',
    description: 'Join live debates and discussions with instant message delivery and reactions.',
    color: 'from-orange-500 to-amber-500',
    delay: 0,
  },
  {
    icon: Shield,
    title: 'Private Messaging',
    description: 'Send private messages directly to Hisham. Encrypted and confidential.',
    color: 'from-rose-500 to-pink-500',
    delay: 0.1,
  },
  {
    icon: Zap,
    title: 'Instant Reactions',
    description: 'Express your thoughts with emoji reactions on posts and chat messages.',
    color: 'from-yellow-500 to-orange-500',
    delay: 0.2,
  },
  {
    icon: Users,
    title: 'Community Feed',
    description: 'Follow Hisham\'s thoughts and join the public discourse with comments.',
    color: 'from-violet-500 to-purple-500',
    delay: 0.3,
  },
  {
    icon: BookOpen,
    title: 'Knowledge Sharing',
    description: 'Educational content bridging Islamic scholarship with modern thought.',
    color: 'from-emerald-500 to-teal-500',
    delay: 0.4,
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and authentication.',
    color: 'from-blue-500 to-cyan-500',
    delay: 0.5,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-12"
      >
        <p className="text-orange-400 font-mono tracking-widest uppercase text-xs mb-3">Everything you need</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
          Platform <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Features</span>
        </h2>
        <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
          A comprehensive social and intellectual space designed for meaningful connections.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: feature.delay, duration: 0.4 }}
            className="group"
          >
            <div className="relative h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/15 transition-all duration-300 overflow-hidden">
              {/* Background glow */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-8 blur-3xl transition-opacity duration-700`} />

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <feature.icon size={22} className="text-white" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
