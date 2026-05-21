'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Settings, MessageCircle, Award, ExternalLink, Sparkles, Heart, Camera, Trash2, User } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SOCIAL_LINKS } from '@/lib/constants';
import { formatRelativeTime, sanitizeUrl, uploadFile } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import type { Profile } from '@/lib/types';

const HISHAM_PROFILE: Profile = {
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
  const [commentCount, setCommentCount] = useState(0);
  const [activeTab, setActiveTab] = useState('comments');
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
          const isHish = data.username === 'hisham' || data.id === 'hisham';
          setActiveTab(isHish ? 'posts' : 'comments');
          fetchPosts(targetId);
          fetchCommentCount(targetId);
          setLoading(false);
          return;
        }
      }
      setProfile(HISHAM_PROFILE);
      setIsOwnProfile(false);
    } catch {
      setProfile(HISHAM_PROFILE);
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

  const fetchCommentCount = async (profileId: string) => {
    const { count } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', profileId);
    setCommentCount(count || 0);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB for cover photos'); return; }
    
    const loadingToast = toast.loading('Uploading cover photo...');
    try {
      const url = await uploadFile(supabase as any, 'media', `covers/${user.id}_${Date.now()}`, file);
      const { error } = await supabase
        .from('profiles')
        .update({ cover_url: url, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, cover_url: url } : null);
      toast.success('Cover photo updated!', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || 'Upload failed', { id: loadingToast });
    }
  };

  const handleRemoveCover = async () => {
    if (!user) return;
    const loadingToast = toast.loading('Removing cover photo...');
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ cover_url: null, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, cover_url: undefined } : null);
      toast.success('Cover photo removed!', { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove cover photo', { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-0 overflow-hidden">
          <div className="h-52 bg-gradient-to-r from-brand-600/10 to-accent-600/10 skeleton" />
          <div className="px-8 pb-8 flex gap-6 items-end -mt-16">
            <div className="w-32 h-32 rounded-full skeleton border-4 border-surface-0" />
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

  const isHisham = profile.username === 'hisham' || profile.id === 'hisham';
  const profileAvatarUrl = profile.avatar_url ? sanitizeUrl(profile.avatar_url) : '';
  const profileCoverUrl = profile.cover_url ? sanitizeUrl(profile.cover_url) : '';

  // For non-admin users, only show comments tab. For admin/hisham show posts too.
  const TABS = isHisham
    ? ['posts', 'comments', 'conversations']
    : ['comments', 'conversations'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-brand-500/10 via-accent-500/5 to-brand-500/10 rounded-[2.5rem] blur-2xl opacity-50" />

        <div className="relative glass-card p-0 overflow-hidden">
          <div className="h-48 md:h-56 bg-gradient-to-br from-brand-600/20 via-accent-600/10 to-surface-200 relative overflow-hidden group/cover">
            {profileCoverUrl ? (
              <img src={profileCoverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              isHisham && (
                <div className="absolute inset-0 bg-[url('/images/hisham.png')] bg-cover bg-center opacity-10 blur-sm" />
              )
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-transparent to-transparent" />
            
            {/* Direct Cover Edit Actions */}
            {isOwnProfile && (
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                {profileCoverUrl && (
                  <button
                    onClick={handleRemoveCover}
                    className="bg-accent-600/80 hover:bg-accent-600 backdrop-blur-md border border-white/15 text-white text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                )}
                <label className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:scale-105 flex items-center gap-1.5">
                  <Camera size={14} />
                  <span>{profileCoverUrl ? 'Change Cover' : 'Upload Cover'}</span>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" aria-label="Upload cover photo" />
                </label>
              </div>
            )}
          </div>

          <div className="px-6 md:px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-5 items-start md:items-end -mt-16 relative z-10">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full opacity-60 blur-sm" />
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-surface-300 border-4 border-surface-0 flex items-center justify-center text-4xl font-heading font-bold text-brand-400 overflow-hidden">
                  {profileAvatarUrl ? (
                    <img src={profileAvatarUrl} alt={profile.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="text-white/20 w-16 h-16" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">{profile.full_name || profile.username}</h1>
                  {isHisham && (
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
                {isHisham && (
                  <a href="https://t.me/twhisham" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-400 transition-colors">
                    <ExternalLink size={12} /> t.me/twhisham
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { label: 'Comments', value: commentCount, icon: MessageCircle },
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
                <MessageCircle className="mx-auto text-white/10 mb-3" size={36} />
                <p className="text-white/20 text-sm">No posts yet.</p>
              </div>
            ) : (
              posts.map((post) => (
                <Link key={post.id} href={`/feed/post/${post.id}`} className="block glass-card glass-card-hover p-5">
                  <p className="text-white/65 leading-relaxed text-[14px]">{post.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-white/20 text-xs">{formatRelativeTime(post.created_at)}</span>
                    <span className="text-white/25 text-xs flex items-center gap-1">
                      <Heart size={12} className="text-accent-400" /> {post.likes_count}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="glass-card py-12 text-center">
            <MessageCircle className="mx-auto text-white/10 mb-3" size={36} />
            <p className="text-white/20 text-sm">{commentCount > 0 ? `${commentCount} comments made` : 'No comments yet.'}</p>
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="glass-card py-12 text-center">
            <MessageCircle className="mx-auto text-white/10 mb-3" size={36} />
            <p className="text-white/20 text-sm">No conversations to show yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
