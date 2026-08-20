'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, KeyRound, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const { locale } = useLanguageStore();
  const { user } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Wait a brief moment to ensure auth state is loaded
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t('reset.signed_in', locale));
      return;
    }
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
      // Redirect to profile
      router.push('/profile');
    } catch (err: any) {
      toast.error(err.message || t('settings.pw_failed', locale));
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="animate-spin text-brand-400" size={32} />
        <p className="text-white/40 text-sm mt-3">{t('reset.verifying', locale)}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="glass-card p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mx-auto text-accent-400">
            <KeyRound size={24} />
          </div>
          <h1 className="text-xl font-heading font-bold text-white">{t('reset.invalid', locale)}</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            {t('reset.invalid_desc', locale)}
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/8 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          >
            {t('reset.go_home', locale)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-accent-500/20 to-brand-500/20 rounded-[1.5rem] blur-xl opacity-60" />

        <div className="relative bg-surface-100/95 backdrop-blur-2xl rounded-2xl border border-white/8 shadow-2xl p-6 space-y-6">
          <div className="h-0.5 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 absolute top-0 left-0 right-0 rounded-t-2xl" />

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center mx-auto font-bold text-white text-lg shadow-lg shadow-brand-500/30">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-heading font-bold text-white mt-3">{t('reset.title', locale)}</h1>
            <p className="text-white/45 text-sm">{t('reset.subtitle', locale)}</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
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
                required
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
                placeholder={t("reset.confirm_ph", locale)}
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-accent-500 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-brand-500/10"
            >
              {updatingPassword ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span className="flex items-center gap-1.5 text-white">
                  {t('settings.update_password', locale)} <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
