import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, uploadFile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Camera, Save, Loader2, ArrowLeft } from 'lucide-react';
import GlassWrapper from '../layout/GlassWrapper';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ProfileSettings: React.FC = () => {
  const { user, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    getProfile();
  }, [user]);

  async function getProfile() {
    try {
      if (!isConfigured || !user) {
        // Demo mode
        setProfile({
          username: 'guest',
          full_name: 'Guest User',
          bio: '',
          avatar_url: ''
        });
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();

    if (!isConfigured || !user) {
      toast.info('Demo mode — connect Supabase to save changes.');
      return;
    }

    setUpdating(true);
    try {
      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!isConfigured || !user) {
      // Demo: show preview only
      setProfile(prev => ({ ...prev, avatar_url: URL.createObjectURL(file) }));
      toast.info('Demo mode — avatar preview only');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const publicUrl = await uploadFile('avatars', filePath, file);
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Avatar uploaded!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  }

  if (loading) return (
    <div className="flex justify-center p-12">
      <Loader2 className="animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/profile')}
        className="text-white/60 hover:text-white mb-6"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back to Profile
      </Button>

      <GlassWrapper>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <User className="text-orange-400" />
          Profile Settings
        </h2>

        {!isConfigured && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-orange-300 text-xs leading-relaxed mb-6">
            <strong>Demo Mode:</strong> Supabase is not configured. Changes won't be persisted. Set up your .env.local to enable full functionality.
          </div>
        )}

        <form onSubmit={updateProfile} className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-white/10">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-neutral-800 text-3xl">{profile.username?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
              >
                <Camera className="text-white" />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </label>
            </div>
            <p className="text-xs text-white/40 italic">Click to update avatar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">Username</label>
              <Input
                value={profile.username}
                onChange={e => setProfile({...profile, username: e.target.value})}
                className="bg-white/5 border-white/10"
                placeholder="@hisham"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">Full Name</label>
              <Input
                value={profile.full_name}
                onChange={e => setProfile({...profile, full_name: e.target.value})}
                className="bg-white/5 border-white/10"
                placeholder="Muhibbullah Hisham"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Bio</label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-md p-3 min-h-[100px] text-sm text-white/90 focus:ring-1 focus:ring-orange-500 outline-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <Button
            disabled={updating}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 font-bold h-12"
          >
            {updating ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Save Changes
          </Button>
        </form>
      </GlassWrapper>
    </div>
  );
};

export default ProfileSettings;
