'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Settings, BookOpen, MessageCircle, Award, ExternalLink, Sparkles, Heart } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SOCIAL_LINKS } from '@/lib/constants';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import Link from 'next/link';
import type { Profile } from '@/lib/types';

const DEFAULT_PROFILE: Profile = {
  id: 'hisham',
  username: 'hisham',
  full_name: 'Muhibbullah Hisham',
  bio: 'Educator, researcher, and lifelong learner. Integrating classical Islamic scholarship with modern thought.',
  avatar_url: '/images/hisham.png',
};

export default function ProfilePage({ userId }: { userId?: string }) {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<{ id: string; content: string; likes_count: number; created_at: string }[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const supabase = getSupabaseClient();

  useEffect(() => {
    fetchProfile();
  }, [userId, user]);

  const fetchProfile = async () => {
    try {
      if (user) {
        const targetId = userId || user.id;
        setIsOwnProfile(user.id === targetId);

        const { data } = await supabase.from('profiles').select('*').eq('id', targetId).single();
        if (data) {
          setProfile(data);
          fetchPosts(targetId);
          setLoading(false);
          return;
        }
      }
      setProfile(DEFAULT_PROFILE);
      setIsOwnProfile(false);
    } catch {
      setProfile(DEFAULT_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (profileId: string) => {
    const { data } = await supabase
      .from('posts')
      .select('id, content, likes_count, created_at')
      .eq('author_id', profileId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setPosts(data);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-0 overflow-hidden">
          <div className="h-52 bg-gradient-to-r from-brand-600/10 to-accent-600/10 skeleton" />
          <div className="px-8 pb-8 flex gap-6 items-end -mt-16">
            <div className="w-32 h-32 rounded-2xl skeleton border-4 border-surface-0" />
            <div className="flex-1 space-y-3 mb-4">
              <div className="h-8 w-48 skeleton rounded-xl" />
              <div className="h-4 w-32 skeleton rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center p-12 text-white/30">Profile not found.</div>;

  const TABS = ['posts', 'conversations', 'replies'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-brand-500/10 rounded-[2.5rem] blur-2xl opacity-50" />

        <div className="relative glass-card p-0 overflow-hidden">
          <div className="h-48 md:h-56 bg-gradient-to-br from-brand-600/20 via-accent-600/10 to-surface-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/hisham.png')] bg-cover bg-center opacity-10 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-transparent to-transparent" />
          </div>

          <div className="px-6 md:px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-5 items-start md:items-end -mt-16 relative z-10">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl opacity-60 blur-sm" />
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-surface-300 border-4 border-surface-0 flex items-center justify-center text-4xl font-heading font-bold text-brand-400 overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(profile.full_name || profile.username)
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">{profile.full_name || profile.username}</h1>
                  {!isOwnProfile && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center" title="Verified">
                      <Sparkles size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-brand-400 text-sm font-medium">@{profile.username}</p>
              </div>

              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Link href="/settings" className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/8 text-white text-sm px-5 py-2 rounded-xl transition-all hover:scale-105">
                    <Settings size={14} /> Edit Profile
                  </Link>
                ) : (
                  <div className="flex gap-2">
                    {SOCIAL_LINKS.map((social) => (
                      <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" title={social.label}
                        className="w-9 h-9 rounded-lg border border-white/8 bg-white/3 hover:bg-white/8 flex items-center justify-center text-white/40 hover:text-brand-400 transition-all hover:scale-110">
                        <social.icon size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-white/60 max-w-2xl leading-relaxed text-sm">{profile.bio || 'No bio yet.'}</p>
              <div className="flex flex-wrap gap-4 text-white/25 text-xs">
                <div className="flex items-center gap-1.5"><MapPin size={12} /> Bangladesh</div>
                <div className="flex items-center gap-1.5"><Calendar size={12} /> Joined May 2026</div>
                {!isOwnProfile && (
                  <a href="https://t.me/twhisham" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
                    <ExternalLink size={12} /> t.me/twhisham
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: 'Posts', value: posts.length, icon: BookOpen },
                { label: 'Conversations', value: '—', icon: MessageCircle },
                { label: 'Contributions', value: '—', icon: Award },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/3 border border-white/5 rounded-xl p-3 text-center hover:bg-white/5 transition-colors cursor-default group">
                  <stat.icon size={16} className="mx-auto text-white/15 group-hover:text-brand-400 transition-colors mb-1.5" />
                  <p className="text-lg font-heading font-bold text-white">{stat.value}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/25 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="flex bg-white/3 border border-white/8 rounded-xl p-1 mb-5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-brand-500/20 text-brand-400' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'posts' && (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="glass-card py-12 text-center">
                <BookOpen className="mx-auto text-white/10 mb-3" size={36} />
                <p className="text-white/20 text-sm">No posts yet.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="glass-card glass-card-hover p-5">
                  <p className="text-white/65 leading-relaxed text-[14px]">{post.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-white/20 text-xs">{formatRelativeTime(post.created_at)}</span>
                    <span className="text-white/25 text-xs flex items-center gap-1">
                      <Heart size={12} className="text-accent-400" /> {post.likes_count}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab !== 'posts' && (
          <div className="glass-card py-12 text-center">
            <MessageCircle className="mx-auto text-white/10 mb-3" size={36} />
            <p className="text-white/20 text-sm">No {activeTab} to show yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
