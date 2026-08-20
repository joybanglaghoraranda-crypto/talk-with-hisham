'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Camera, User, Mail, FileText, AtSign, Trash2, Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import { getSupabaseClient } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProfileSettings() {
  const { locale } = useLanguageStore();
  const { user, signOut } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  
  // Password Reset states
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  const supabase = getSupabaseClient();

  useEffect(() => { if (user) fetchProfile(); }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
        setCoverUrl(data.cover_url || '');
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({
        username: username.trim().toLowerCase(),
        full_name: fullName.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl,
        cover_url: coverUrl,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (error) throw error;
      toast.success(t('settings.saved', locale));
    } catch (err: any) { toast.error(err.message || t('settings.save_failed', locale)); } finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast.error(t('settings.max2mb', locale)); return; }
    try {
      const url = await uploadFile(supabase as any, 'media', `avatars/${user.id}_${Date.now()}`, file);
      setAvatarUrl(url);
      toast.success(t('settings.avatar_uploaded', locale));
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      toast.error(t('settings.upload_fail', locale));
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error(t('settings.max5mb', locale)); return; }
    try {
      const url = await uploadFile(supabase as any, 'media', `covers/${user.id}_${Date.now()}`, file);
      setCoverUrl(url);
      toast.success(t('settings.cover_up', locale));
    } catch (err: any) {
      console.error('Cover upload error:', err);
      toast.error(t('settings.upload_fail', locale));
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error(t('reset.pw_short', locale));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error(t('reset.pw_mismatch', locale));
      return;
    }
    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success(t('settings.pw_updated', locale));
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      toast.error(err.message || t('settings.pw_failed', locale));
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!user) return (<div className="flex flex-col items-center justify-center min-h-[50vh] text-center"><User className="text-white/10 mb-4" size={48} /><h2 className="text-xl font-heading font-bold text-white mb-2">Sign in Required</h2></div>);
  if (loading) return (<div className="max-w-2xl mx-auto py-8"><div className="glass-card p-8 space-y-4">{[1,2,3,4].map(i=><div key={i} className="h-12 skeleton rounded-xl"/>)}</div></div>);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-white tracking-tight">{t('settings.title', locale)}</h1>
        <p className="text-white/30 text-sm">{t('settings.subtitle', locale)}</p>
      </div>



      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Picture (Avatar) Card */}
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-surface-300 flex items-center justify-center text-2xl font-heading font-bold text-brand-400 overflow-hidden border border-white/8 relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-white/20" />
              )}
            </div>
            
            {/* Upload Hover Overlay */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
              <Camera size={20} className="text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" aria-label="Upload avatar" />
            </label>

            {/* Remove Avatar Button */}
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl('')}
                className="absolute -top-1 -right-1 bg-accent-600 hover:bg-accent-700 text-white p-1.5 rounded-full border border-white/10 transition-all hover:scale-110 shadow-md z-20"
                title={t('settings.remove_avatar', locale)}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold text-white">{fullName || username}</p>
            <p className="text-xs text-white/30">{user.email}</p>
            <div className="flex flex-wrap gap-2 items-center mt-1">
              {avatarUrl ? (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="flex items-center gap-1 text-[11px] font-medium text-accent-400 hover:text-accent-300 transition-colors"
                >
                  <Trash2 size={12} /> {t('settings.remove_avatar', locale)}
                </button>
              ) : (
                <span className="text-[10px] text-white/30">{t('settings.no_pic', locale)}</span>
              )}
              {(() => {
                const googleAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
                if (googleAvatar && avatarUrl !== googleAvatar) {
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl(googleAvatar);
                        toast.success(t('settings.google_imported', locale));
                      }}
                      className="flex items-center gap-1 text-[11px] font-medium text-brand-400 hover:text-brand-300 transition-colors border border-brand-500/30 rounded-lg px-2 py-0.5 bg-brand-500/5 hover:bg-brand-500/10"
                    >
                      <Sparkles size={11} /> {t('settings.use_google', locale)}
                    </button>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>

        {/* Cover Photo Card */}
        <div className="glass-card p-6 space-y-3">
          <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
            <Camera size={10} /> {t('settings.cover_photo', locale)}
          </label>
          <div className="relative h-32 w-full rounded-xl bg-surface-300 overflow-hidden border border-white/8 group/cover shadow-inner">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-600/20 via-accent-600/10 to-surface-200 flex items-center justify-center text-xs text-white/40 font-medium">
                {t('settings.no_cover', locale)}
              </div>
            )}
            
            {/* Cover Upload Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
              <label className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:scale-105 flex items-center gap-1.5">
                <Camera size={12} />
                <span>{t('settings.upload', locale)}</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" aria-label="Upload cover photo" />
              </label>
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => setCoverUrl('')}
                  className="bg-accent-600/80 hover:bg-accent-600 border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  <span>{t('settings.remove', locale)}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Fields Card */}
        <div className="glass-card p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <AtSign size={10}/> {t('settings.username', locale)}
            </label>
            <input id="username" type="text" value={username} onChange={e=>setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g,''))} className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none" maxLength={20}/>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <User size={10}/> {t('settings.full_name', locale)}
            </label>
            <input id="fullName" type="text" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none"/>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={10}/> {t('settings.email', locale)}
            </label>
            <input id="email" type="email" value={user.email||''} disabled className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-white/30 cursor-not-allowed"/>
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={10}/> {t('settings.bio', locale)}
            </label>
            <textarea id="bio" value={bio} onChange={e=>setBio(e.target.value)} placeholder={t("settings.bio_ph", locale)} rows={4} maxLength={500} className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none resize-none"/>
            <p className="text-[10px] text-white/15 text-right">{bio.length}/500</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={()=>signOut()} className="text-accent-400/70 hover:text-accent-400 text-sm font-medium transition-colors">
            Sign Out
          </button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-brand-500/15 disabled:opacity-50 transition-all hover:scale-105 active:scale-95">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} {t('settings.save_changes', locale)}
          </button>
        </div>
      </form>

      {/* Change Password Card */}
      <div className="glass-card p-6 mt-6 space-y-4">
        <div>
          <h2 className="text-lg font-heading font-bold text-white tracking-tight flex items-center gap-2">
            <Lock size={18} className="text-brand-400" />
            {t('settings.change_password', locale)}
          </h2>
          <p className="text-white/30 text-xs mt-0.5">{t('settings.pw_desc', locale)}</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={10} /> {t('settings.new_password', locale)}
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder={t("settings.pw_min_ph", locale)}
              className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none"
              minLength={6}
            />
          </div>
          
          <div className="space-y-1.5">
            <label htmlFor="confirmNewPassword" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
              <Lock size={10} /> {t('settings.confirm_password', locale)}
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              placeholder={t("settings.reenter_ph", locale)}
              className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none"
              minLength={6}
            />
          </div>
          
          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={updatingPassword}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/8 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {updatingPassword ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <span>{t('settings.update_password', locale)}</span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
