'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, KeyRound, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
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
      toast.error('You must be signed in to reset your password.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmNewPassword('');
      // Redirect to profile
      router.push('/profile');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="animate-spin text-brand-400" size={32} />
        <p className="text-white/40 text-sm mt-3">Verifying session...</p>
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
          <h1 className="text-xl font-heading font-bold text-white">Invalid or Expired Link</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            You must be logged in to reset your password. If you requested a reset email, please ensure you clicked the link correctly.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/8 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          >
            Go to Home
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
            <h1 className="text-xl font-heading font-bold text-white mt-3">Reset Password</h1>
            <p className="text-white/45 text-sm">Please set your new password below.</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={10} /> New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-500/30 outline-none"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmNewPassword" className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={10} /> Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm your new password"
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
                  Update Password <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
