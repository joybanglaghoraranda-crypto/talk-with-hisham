'use client';

import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Target, Heart, Users, Lightbulb, Award, Globe } from 'lucide-react';

const ROLES = ['Instructor', 'Educator', 'Mentor', 'Assistant Researcher', 'AI Enthusiast', 'Curious Thinker', 'Guidance Counselor', 'Curriculum Developer'];
const PASSIONS = ['Languages', 'Entrepreneurship', 'Charity', 'Social Development', 'Youth Mentoring', 'Community Engagement'];

const TIMELINE = [
  { year: 'Early Years', title: 'Memorization of the Qur\'an', desc: 'Completed alongside primary-level education in the Alia madrasa system.', icon: BookOpen },
  { year: 'Qawmi Studies', title: 'Dawra-e-Hadith (Master\'s Equivalent)', desc: 'Continued studies within the Qawmi madrasa tradition, completing from Dhaka.', icon: GraduationCap },
  { year: 'Specialization', title: 'PGD in Islamic Dawah', desc: 'Advanced specialization at As-Sunnah Dawah & Research Institute.', icon: Award },
  { year: 'Present', title: 'SSC Candidate (2027)', desc: 'Continuing academic journey within general education. Interested in Education Research & African Studies.', icon: Target },
];

export default function AboutPage() {
  return (
    <div className="relative z-10 px-4 md:px-8 max-w-5xl mx-auto pb-12 mesh-bg min-h-screen">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <p className="text-brand-400 font-mono tracking-widest uppercase text-xs mb-3">About the Mind Behind</p>
        <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-4">
          <span className="gradient-text">Muhibbullah Hisham</span>
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto text-sm leading-relaxed">
          Educator, researcher, and lifelong learner. Integrating classical Islamic scholarship
          with modern thought for meaningful impact.
        </p>
      </motion.div>

      {/* Intro Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 md:p-8 mb-8"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
            <Lightbulb size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-1">Who I Am</h2>
            <p className="text-white/35 text-xs uppercase tracking-widest">Born 2005 · Mymensingh · Raised in Jamalpur & Dhaka</p>
          </div>
        </div>
        <div className="space-y-4 text-white/60 leading-relaxed text-[15px]">
          <p>
            I am <span className="text-white font-semibold">Muhibbullah Hisham</span>, an educator, researcher, and lifelong learner with a strong foundation in Islamic studies and an evolving engagement with contemporary education and intellectual inquiry.
          </p>
          <p>
            Professionally and intellectually, I engage in teaching, training, and academic research. My approach seeks to integrate classical Islamic scholarship with modern thought, especially in curriculum development, intellectual guidance, and youth development.
          </p>
          <p>
            Beyond formal academia, I value human connection and social responsibility — interacting with people, exploring nature, and contributing to charitable and community-based initiatives.
          </p>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
          <GraduationCap size={20} className="text-brand-400" />
          Academic Journey
        </h2>
        <div className="relative">
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/30 via-white/8 to-transparent" />
          <div className="space-y-6">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start group"
              >
                <div className="w-11 h-11 rounded-xl bg-surface-200 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all relative z-10">
                  <item.icon size={16} className="text-white/40 group-hover:text-brand-400 transition-colors" />
                </div>
                <div className="glass-card glass-card-hover p-4 flex-1">
                  <p className="text-[10px] text-brand-400 font-mono uppercase tracking-widest mb-1">{item.year}</p>
                  <h3 className="text-sm font-heading font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Roles & Passions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-heading font-bold text-brand-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={14} /> Core Roles & Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <span key={role} className="px-3 py-1.5 bg-white/3 border border-white/8 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 hover:border-brand-500/20 transition-all cursor-default">
                {role}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-heading font-bold text-accent-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Heart size={14} /> Areas of Passion
          </h3>
          <div className="flex flex-wrap gap-2">
            {PASSIONS.map((passion) => (
              <span key={passion} className="px-3 py-1.5 bg-white/3 border border-white/8 rounded-lg text-xs text-accent-400/50 hover:text-accent-400 hover:bg-accent-500/5 hover:border-accent-500/20 transition-all cursor-default">
                {passion}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-6 md:p-8 text-center"
      >
        <Globe size={28} className="mx-auto text-brand-400 mb-4" />
        <h2 className="text-lg font-heading font-bold text-white mb-3">Mission</h2>
        <p className="text-white/45 text-sm leading-relaxed max-w-2xl mx-auto">
          To bridge the gap between classical Islamic scholarship and modern intellectual discourse,
          empowering youth through mentoring, curriculum development, and community engagement —
          creating spaces for meaningful conversations that transcend borders.
        </p>
      </motion.div>
    </div>
  );
}
