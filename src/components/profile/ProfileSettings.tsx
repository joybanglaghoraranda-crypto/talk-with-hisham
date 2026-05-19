'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Camera, User, Mail, FileText, AtSign } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { uploadFile, getInitials } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProfileSettings() {
  const { user, signOut } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const supabase = getSupabaseClient();

  useEffect(() => { if (user) fetchProfile(); }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      if (data) { setUsername(data.username || ''); setFullName(data.full_name || ''); setBio(data.bio || ''); setAvatarUrl(data.avatar_url || ''); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({ username: username.trim().toLowerCase(), full_name: fullName.trim(), bio: bio.trim(), avatar_url: avatarUrl, updated_at: new Date().toISOString() }).eq('id', user.id);
      if (error) throw error;
      toast.success('Profile updated!');
    } catch (err: any) { toast.error(err.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Max 2MB'); return; }
    try {
      const url = await uploadFile(supabase as any, 'avatars', `avatars/${user.id}_${Date.now()}`, file);
      setAvatarUrl(url);
      toast.success('Avatar uploaded');
    } catch { toast.error('Upload failed'); }
  };

  if (!user) return (<div className="flex flex-col items-center justify-center min-h-[50vh] text-center"><User className="text-white/10 mb-4" size={48} /><h2 className="text-xl font-heading font-bold text-white mb-2">Sign in Required</h2></div>);
  if (loading) return (<div className="max-w-2xl mx-auto py-8"><div className="glass-card p-8 space-y-4">{[1,2,3,4].map(i=><div key={i} className="h-12 skeleton rounded-xl"/>)}</div></div>);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-6">
      <div className="mb-6"><h1 className="text-2xl font-heading font-bold text-white tracking-tight">Settings</h1><p className="text-white/30 text-sm">Manage your profile.</p></div>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-surface-300 flex items-center justify-center text-2xl font-heading font-bold text-brand-400 overflow-hidden border border-white/8">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : getInitials(fullName || username)}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"><Camera size={20} className="text-white" /><input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" aria-label="Upload avatar" /></label>
          </div>
          <div><p className="text-sm font-semibold text-white">{fullName || username}</p><p className="text-xs text-white/30">{user.email}</p></div>
        </div>
        <div className="glass-card p-6 space-y-4">
          <div className="space-y-1.5"><label htmlFor="username" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5"><AtSign size={10}/> Username</label><input id="username" type="text" value={username} onChange={e=>setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,''))} className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none" maxLength={20}/></div>
          <div className="space-y-1.5"><label htmlFor="fullName" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5"><User size={10}/> Full Name</label><input id="fullName" type="text" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none"/></div>
          <div className="space-y-1.5"><label htmlFor="email" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5"><Mail size={10}/> Email</label><input id="email" type="email" value={user.email||''} disabled className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-white/30 cursor-not-allowed"/></div>
          <div className="space-y-1.5"><label htmlFor="bio" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5"><FileText size={10}/> Bio</label><textarea id="bio" value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell us about yourself..." rows={4} maxLength={500} className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none resize-none"/><p className="text-[10px] text-white/15 text-right">{bio.length}/500</p></div>
        </div>
        <div className="flex items-center justify-between">
          <button type="button" onClick={()=>signOut()} className="text-accent-400/70 hover:text-accent-400 text-sm font-medium transition-colors">Sign Out</button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-brand-500/15 disabled:opacity-50 transition-all hover:scale-105 active:scale-95">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}
