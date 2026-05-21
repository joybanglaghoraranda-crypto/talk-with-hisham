'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Rss } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

interface StatItem {
  label: string;
  value: number | null;
  suffix?: string;
  icon: React.FC<{ size?: number; className?: string }>;
  color: string;
}

const CACHE_KEY = 'twh_stats_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedStats(): { values: [number, number, number]; ts: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts < CACHE_TTL) return parsed;
    return null;
  } catch {
    return null;
  }
}

function setCachedStats(values: [number, number, number]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ values, ts: Date.now() }));
  } catch { /* ignore */ }
}

function AnimatedCounter({ target, suffix = '' }: { target: number | null; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (target === null || target === 0) return;
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

  if (target === null) return <span ref={ref}>—</span>;
  if (target === 0) return <span ref={ref}>—</span>;

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsCounter() {
  const cached = getCachedStats();
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Active Users', value: cached?.values[0] ?? null, suffix: '+', icon: Users, color: 'from-brand-500 to-brand-300' },
    { label: 'Messages Sent', value: cached?.values[1] ?? null, suffix: '+', icon: MessageSquare, color: 'from-accent-500 to-accent-400' },
    { label: 'Feed Posts', value: cached?.values[2] ?? null, suffix: '', icon: Rss, color: 'from-violet-500 to-purple-400' },
  ]);
  const [fetched, setFetched] = useState(!!cached);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (attempt = 0) => {
    try {
      const supabase = getSupabaseClient();
      const [profilesRes, messagesRes, postsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
      ]);

      const values: [number, number, number] = [
        profilesRes.count || 0,
        messagesRes.count || 0,
        postsRes.count || 0,
      ];

      // Only update if we actually got real data
      if (values[0] > 0 || values[1] > 0 || values[2] > 0) {
        setCachedStats(values);
        setStats((prev) => [
          { ...prev[0], value: values[0] },
          { ...prev[1], value: values[1] },
          { ...prev[2], value: values[2] },
        ]);
      }
      setFetched(true);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Retry up to 2 times with exponential backoff
      if (attempt < 2) {
        setTimeout(() => fetchStats(attempt + 1), 1000 * Math.pow(2, attempt));
      }
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
              {!fetched && stat.value === null ? (
                <span className="inline-block w-16 h-8 skeleton rounded-lg" />
              ) : (
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              )}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
