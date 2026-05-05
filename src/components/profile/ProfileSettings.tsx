import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Camera, Save, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassWrapper from '../layout/GlassWrapper';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ProfileSettings: React.FC = () => {
  const { user, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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
        setProfile({ username: 'guest', full_name: 'Guest User', bio: '', avatar_url: '' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Fetch profile error:', error);
      }

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
      // First try to update existing profile
      const { data: existing, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Profile check error:', checkError);
      }

      let error;
      if (existing) {
        // Profile exists — update it
        const result = await supabase
          .from('profiles')
          .update({
            username: profile.username,
            full_name: profile.full_name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
        error = result.error;
      } else {
        // Profile doesn't exist — insert it
        const result = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: profile.username,
            full_name: profile.full_name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            updated_at: new Date().toISOString(),
          });
        error = result.error;
      }

      if (error) {
        console.error('Profile save error:', error.message, error.details, error.hint, error.code);
        if (error.code === '23505') {
          toast.error('Username already taken. Please choose a different one.');
        } else if (error.code === '42501') {
          toast.error('Permission denied. Check profiles RLS policies in Supabase.');
        } else {
          toast.error(error.message || 'Failed to update profile');
        }
        return;
      }

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Unexpected error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar must be under 2MB');
      return;
    }

    if (!isConfigured || !user) {
      setProfile(prev => ({ ...prev, avatar_url: URL.createObjectURL(file) }));
      toast.info('Demo mode — avatar preview only');
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Avatar updated!');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      if (error.message?.includes('bucket') || error.statusCode === '404') {
        toast.error('Storage bucket not set up. Please run storage_setup.sql in Supabase.');
      } else {
        toast.error(error.message || 'Failed to upload avatar');
      }
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function removeAvatar() {
    if (!user || !isConfigured) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: '', updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      setProfile(prev => ({ ...prev, avatar_url: '' }));
      toast.success('Avatar removed');
    } catch (error) {
      toast.error('Failed to remove avatar');
    }
  }

  if (loading) return (
    <div className="flex justify-center p-12">
      <Loader2 className="animate-spin text-orange-500" size={28} />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8"
    >
      <Button
        variant="ghost"
        onClick={() => navigate('/profile')}
        className="text-white/60 hover:text-white mb-6"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back to Profile
      </Button>

      <GlassWrapper className="border-white/10">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <User className="text-orange-400" />
          Profile Settings
        </h2>

        {!isConfigured && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-orange-300 text-xs leading-relaxed mb-6">
            <strong>Demo Mode:</strong> Supabase is not configured. Changes won't be persisted.
          </div>
        )}

        <form onSubmit={updateProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full opacity-40 group-hover:opacity-60 transition-opacity blur-sm" />
              <Avatar className="relative w-28 h-28 border-4 border-neutral-950 shadow-2xl">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-neutral-800 text-3xl font-bold text-orange-400">
                  {profile.full_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
              >
                {uploadingAvatar
                  ? <Loader2 className="animate-spin text-white" size={24} />
                  : <Camera className="text-white" size={24} />
                }
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-white/40">Click to update avatar (max 2MB)</p>
              {profile.avatar_url && (
                <button type="button" onClick={removeAvatar} aria-label="Remove avatar" className="text-rose-400/60 hover:text-rose-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm">@</span>
                <Input
                  value={profile.username}
                  onChange={e => setProfile({...profile, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '')})}
                  className="bg-white/5 border-white/10 pl-8 h-11 focus-visible:ring-orange-500"
                  placeholder="hisham"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Full Name</label>
              <Input
                value={profile.full_name}
                onChange={e => setProfile({...profile, full_name: e.target.value})}
                className="bg-white/5 border-white/10 h-11 focus-visible:ring-orange-500"
                placeholder="Muhibbullah Hisham"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Bio</label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[120px] text-sm text-white/90 focus:ring-1 focus:ring-orange-500 outline-none resize-none placeholder:text-white/20"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="text-right text-[10px] text-white/20">{profile.bio.length}/500</p>
          </div>

          <Button
            disabled={updating}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 font-bold h-12 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {updating ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
            Save Changes
          </Button>
        </form>
      </GlassWrapper>
    </motion.div>
  );
};

export default ProfileSettings;
