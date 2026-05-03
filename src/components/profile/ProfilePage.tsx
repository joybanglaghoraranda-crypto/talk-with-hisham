import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { User, MapPin, Calendar, Edit3, MessageCircle, Settings } from 'lucide-react';
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
        {/* Skeleton loader */}
        <GlassWrapper className="p-0 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-orange-600/10 to-rose-600/10 animate-pulse" />
          <div className="px-8 pb-8 flex gap-6 items-end -mt-16">
            <div className="w-32 h-32 rounded-full bg-neutral-800 animate-pulse border-4 border-black/50" />
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <GlassWrapper className="p-0 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-orange-600/30 to-rose-600/30 backdrop-blur-2xl border-b border-white/10" />
        <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-end -mt-16">
          <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-black/50 shadow-2xl relative z-20">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-neutral-800 text-4xl">{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2 mb-2">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {profile.full_name || profile.username}
            </h1>
            <p className="text-orange-400 font-medium italic">@{profile.username}</p>
          </div>

          <div className="flex gap-3 mb-2">
            {isOwnProfile ? (
              <Button
                onClick={() => navigate('/settings')}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full"
              >
                <Settings className="mr-2" size={18} />
                Account Settings
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
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-orange-400 transition-all hover:scale-110"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">
          <p className="text-white/80 max-w-2xl leading-relaxed text-lg">
            {profile.bio || "No bio yet."}
          </p>

          <div className="flex gap-6 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Joined May 2026</span>
            </div>
          </div>
        </div>
      </GlassWrapper>

      {/* Profile Content Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-full mb-8">
          <TabsTrigger value="posts" className="rounded-full px-8">Posts</TabsTrigger>
          <TabsTrigger value="conversations" className="rounded-full px-8">Conversations</TabsTrigger>
          <TabsTrigger value="replies" className="rounded-full px-8">Replies</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="grid grid-cols-1 gap-6">
            <GlassWrapper className="border-white/5">
              <p className="text-white/80 text-lg leading-relaxed">
                The future of social media isn't algorithm-driven feeds, it's synchronous communication. We need to talk more, not just scroll more.
              </p>
              <p className="text-white/30 text-xs mt-3">2h ago</p>
            </GlassWrapper>
            <GlassWrapper className="border-white/5">
              <p className="text-white/80 text-lg leading-relaxed">
                Education is not merely the transfer of knowledge — it is the cultivation of the human soul.
              </p>
              <p className="text-white/30 text-xs mt-3">5h ago</p>
            </GlassWrapper>
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 opacity-30 italic">
            No conversations to show yet.
          </div>
        </TabsContent>

        <TabsContent value="replies">
          <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 opacity-30 italic">
            No replies to show yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
