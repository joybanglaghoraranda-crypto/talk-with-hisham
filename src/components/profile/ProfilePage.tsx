import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Calendar, Settings, BookOpen, MessageCircle, Award, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '@/lib/constants';
import GlassWrapper from '../layout/GlassWrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
}

// Default profile for display when not authenticated
const DEFAULT_PROFILE: Profile = {
  id: 'hisham',
  username: 'hisham',
  full_name: 'Muhibbullah Hisham',
  bio: 'Educator, researcher, and lifelong learner. Integrating classical Islamic scholarship with modern thought. Passionate about mentoring youth, curriculum development, and intellectual discourse.',
  avatar_url: '/images/hisham.png',
};

const STATS = [
  { label: 'Posts', value: '24', icon: BookOpen },
  { label: 'Conversations', value: '156', icon: MessageCircle },
  { label: 'Contributions', value: '89', icon: Award },
];

const ProfilePage: React.FC<{ userId?: string }> = ({ userId }) => {
  const { user, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId, user]);

  const fetchProfile = async () => {
    try {
      if (isConfigured && user) {
        const targetId = userId || user.id;
        setIsOwnProfile(user.id === targetId);

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetId)
          .single();

        if (data) {
          setProfile(data);
          setLoading(false);
          return;
        }
      }

      // Fallback: show default Hisham profile
      setProfile(DEFAULT_PROFILE);
      setIsOwnProfile(false);
    } catch (err) {
      console.error(err);
      setProfile(DEFAULT_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <GlassWrapper className="p-0 overflow-hidden">
          <div className="h-56 bg-gradient-to-r from-orange-600/10 to-rose-600/10 animate-pulse" />
          <div className="px-8 pb-8 flex gap-6 items-end -mt-20">
            <div className="w-36 h-36 rounded-2xl bg-neutral-800 animate-pulse border-4 border-neutral-950" />
            <div className="flex-1 space-y-3 mb-4">
              <div className="h-8 w-48 bg-white/10 rounded-xl animate-pulse" />
              <div className="h-4 w-32 bg-white/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </GlassWrapper>
      </div>
    );
  }

  if (!profile) return <div className="text-center p-12 opacity-50">Profile not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Profile Header Card */}
      <div className="relative">
        {/* Background glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/10 via-rose-500/5 to-orange-500/10 rounded-[2.5rem] blur-2xl opacity-50" />

        <GlassWrapper className="relative p-0 overflow-hidden border-white/10">
          {/* Cover Banner */}
          <div className="h-52 md:h-60 bg-gradient-to-br from-orange-600/25 via-rose-600/15 to-neutral-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/hisham.png')] bg-cover bg-center opacity-15 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

            {/* Floating decorations */}
            <div className="absolute top-6 right-8 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-12 left-12 w-16 h-16 bg-rose-500/10 rounded-full blur-2xl" />
          </div>

          {/* Profile Info */}
          <div className="px-6 md:px-10 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-20 relative z-10">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl opacity-60 group-hover:opacity-80 transition-opacity blur-sm" />
                <Avatar className="relative w-32 h-32 md:w-36 md:h-36 border-4 border-neutral-950 shadow-2xl rounded-2xl">
                  <AvatarImage src={profile.avatar_url} className="rounded-2xl object-cover" />
                  <AvatarFallback className="bg-neutral-800 text-4xl font-bold rounded-2xl text-orange-400">
                    {profile.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name & Username */}
              <div className="flex-1 space-y-1 mb-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {profile.full_name || profile.username}
                  </h1>
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0" title="Verified">
                    <Sparkles size={10} className="text-white" />
                  </div>
                </div>
                <p className="text-orange-400 font-medium">@{profile.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-1 self-start md:self-end">
                {isOwnProfile ? (
                  <Button
                    onClick={() => navigate('/settings')}
                    className="bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-full px-6 transition-all hover:scale-105"
                  >
                    <Settings className="mr-2" size={16} />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.label}
                        className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/40 hover:text-orange-400 transition-all hover:scale-110 hover:border-orange-500/30"
                      >
                        <social.icon size={16} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 space-y-4">
              <p className="text-white/70 max-w-2xl leading-relaxed">
                {profile.bio || "No bio yet."}
              </p>

              <div className="flex flex-wrap gap-4 text-white/35 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>Bangladesh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Joined May 2026</span>
                </div>
                <a href="https://t.me/twhisham" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                  <ExternalLink size={14} />
                  <span>t.me/twhisham</span>
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors group cursor-default"
                >
                  <stat.icon size={18} className="mx-auto text-white/20 group-hover:text-orange-400 transition-colors mb-2" />
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassWrapper>
      </div>

      {/* Profile Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl mb-6 w-full grid grid-cols-3">
          <TabsTrigger value="posts" className="rounded-lg data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Posts</TabsTrigger>
          <TabsTrigger value="conversations" className="rounded-lg data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Conversations</TabsTrigger>
          <TabsTrigger value="replies" className="rounded-lg data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Replies</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                content: "The future of social media isn't algorithm-driven feeds, it's synchronous communication. We need to talk more, not just scroll more.",
                time: '2h ago',
                likes: 42,
              },
              {
                content: 'Education is not merely the transfer of knowledge — it is the cultivation of the human soul.',
                time: '5h ago',
                likes: 38,
              },
              {
                content: "True mentorship is not about creating followers — it's about empowering independent thinkers.",
                time: '1d ago',
                likes: 56,
              },
            ].map((post, i) => (
              <GlassWrapper key={i} className="border-white/5 hover:border-white/10 transition-all group">
                <p className="text-white/75 leading-relaxed">{post.content}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <span className="text-white/25 text-xs">{post.time}</span>
                  <span className="text-white/20 text-xs">❤️ {post.likes}</span>
                </div>
              </GlassWrapper>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <GlassWrapper className="border-white/5">
            <div className="py-8 text-center space-y-3">
              <MessageCircle className="mx-auto text-white/10" size={40} />
              <p className="text-white/25 text-sm">No conversations to show yet.</p>
            </div>
          </GlassWrapper>
        </TabsContent>

        <TabsContent value="replies">
          <GlassWrapper className="border-white/5">
            <div className="py-8 text-center space-y-3">
              <MessageCircle className="mx-auto text-white/10" size={40} />
              <p className="text-white/25 text-sm">No replies to show yet.</p>
            </div>
          </GlassWrapper>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfilePage;
