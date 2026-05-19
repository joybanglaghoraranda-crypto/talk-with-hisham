'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Rss, Globe } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: React.FC<{ size?: number; className?: string }>;
  color: string;
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsCounter() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Active Users', value: 0, suffix: '+', icon: Users, color: 'from-brand-500 to-brand-300' },
    { label: 'Messages Sent', value: 0, suffix: '+', icon: MessageSquare, color: 'from-accent-500 to-accent-400' },
    { label: 'Feed Posts', value: 0, suffix: '', icon: Rss, color: 'from-violet-500 to-purple-400' },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const supabase = getSupabaseClient();
      const [profilesRes, messagesRes, postsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
      ]);

      setStats((prev) => [
        { ...prev[0], value: profilesRes.count || 0 },
        { ...prev[1], value: messagesRes.count || 0 },
        { ...prev[2], value: postsRes.count || 0 },
      ]);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + index * 0.1 }}
          className="group"
        >
          <div className="relative glass-card glass-card-hover p-4 md:p-5 overflow-hidden cursor-default">
            <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full opacity-0 group-hover:opacity-[0.08] blur-2xl transition-opacity duration-500`} />

            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={16} className="text-white" />
            </div>
            <p className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
