import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Rss, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: React.FC<{ size?: number; className?: string }>;
  color: string;
}

const AnimatedCounter: React.FC<{ target: number; suffix?: string }> = ({ target, suffix = '' }) => {
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
            // Ease out cubic
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
};

const StatsCounter: React.FC = () => {
  const { isConfigured } = useAuth();
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Active Users', value: 0, suffix: '+', icon: Users, color: 'from-orange-500 to-amber-500' },
    { label: 'Messages Sent', value: 0, suffix: '+', icon: MessageSquare, color: 'from-rose-500 to-pink-500' },
    { label: 'Feed Posts', value: 0, suffix: '', icon: Rss, color: 'from-violet-500 to-purple-500' },
    { label: 'Countries', value: 5, suffix: '+', icon: Globe, color: 'from-emerald-500 to-teal-500' },
  ]);

  useEffect(() => {
    fetchStats();
  }, [isConfigured]);

  const fetchStats = async () => {
    if (!isConfigured) {
      setStats(prev => prev.map((s, i) => ({
        ...s,
        value: [25, 150, 12, 5][i]
      })));
      return;
    }

    try {
      const [profilesRes, messagesRes, postsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
      ]);

      setStats(prev => [
        { ...prev[0], value: profilesRes.count || 0 },
        { ...prev[1], value: messagesRes.count || 0 },
        { ...prev[2], value: postsRes.count || 0 },
        { ...prev[3], value: 5 },
      ]);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-12"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          className="group relative overflow-hidden"
        >
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 hover:bg-white/8 hover:border-white/15 transition-all duration-300 cursor-default">
            {/* Gradient glow */}
            <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
            
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <stat.icon size={16} className="text-white" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCounter;
