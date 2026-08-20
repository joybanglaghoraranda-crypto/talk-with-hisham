'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import { X, LogIn, UserPlus, Loader2, Mail, Lock, User, Sparkles, Eye, EyeOff, ShieldCheck, Github } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguageStore } from '@/stores/language-store';
import { t } from '@/lib/i18n';
import { getSupabaseClient } from '@/lib/supabase/client';


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { locale } = useLanguageStore();
  const { signIn, signUp, signInWithOAuth, signInWithMagicLink } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'signup' | 'magic' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const resetForm = () => {
    setEmail(''); setPassword(''); setConfirmPassword('');
    setUsername(''); setFirstName(''); setLastName('');
    setShowPassword(false); setAgreed(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'magic') {
      if (!email.trim()) return;
      setLoading(true);
      try {
        const { error } = await signInWithMagicLink(email);
        if (error) throw error;
        toast.success(t('auth.magic_sent', locale));
        resetForm();
        onClose();
      } catch (err: any) {
        toast.error(err.message || t('auth.failed_magic', locale));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'forgot') {
      if (!email.trim()) return;
      setLoading(true);
      try {
        const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success(t('auth.reset_sent', locale));
        resetForm();
        onClose();
      } catch (err: any) {
        toast.error(err.message || 'Failed to send reset link');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim() || !password.trim()) return;

    if (mode === 'signup') {
      if (!firstName.trim()) { toast.error(t('auth.err_firstname', locale)); return; }
      if (!username.trim()) { toast.error(t('auth.err_username', locale)); return; }
      if (password.length < 6) { toast.error(t('auth.err_pw_short', locale)); return; }
      if (password !== confirmPassword) { toast.error(t('auth.err_pw_match', locale)); return; }
      if (!agreed) { toast.error(t('auth.err_agree', locale)); return; }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success(t('auth.welcome_toast', locale));
      } else {
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        const { error } = await signUp(email, password, username.trim().toLowerCase(), fullName);
        if (error) throw error;
        toast.success(t('auth.account_created', locale));;
      }
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-accent-500/20 to-brand-500/20 rounded-[1.5rem] blur-xl opacity-60" />

            <div className="relative bg-surface-100/95 backdrop-blur-2xl rounded-2xl border border-white/8 shadow-2xl overflow-hidden">
              <div className="h-0.5 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500" />

              <div className="p-6 space-y-5">
                <button
                  onClick={onClose}
                  aria-label={t('auth.close_modal', locale)}
                  className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                >
                  <X size={16} />
                </button>

                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="relative inline-block">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center mx-auto font-bold text-white text-lg shadow-lg shadow-brand-500/30">
                      H
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-surface-100 flex items-center justify-center">
                      <Sparkles size={8} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white">
                      {mode === 'login' ? t('auth.welcome_back', locale) : mode === 'signup' ? t('auth.create_account', locale) : mode === 'magic' ? t('auth.magic_title', locale) : t('auth.reset_password', locale)}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                      {mode === 'login' ? t('auth.signin_subtitle', locale)
                        : mode === 'signup' ? t('auth.signup_subtitle', locale)
                        : mode === 'magic' ? t('auth.magic_subtitle', locale)
                        : t('auth.reset_subtitle', locale)}
                    </p>
                  </div>
                </div>

                {/* OAuth Buttons */}
                {mode !== 'magic' && mode !== 'forgot' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleOAuth('google')}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google
                    </button>
                    <button
                      onClick={() => handleOAuth('github')}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
                    >
                      <Github size={16} />
                      GitHub
                    </button>
                  </div>
                )}

                {mode !== 'magic' && mode !== 'forgot' && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-white/20 text-[10px] uppercase tracking-widest">{t('auth.or', locale)}</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'signup' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{t('auth.first_name', locale)} *</label>
                          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Muhibbullah"
                            className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all" required />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{t('auth.last_name', locale)}</label>
                          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Hisham"
                            className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                          <User size={10} /> {t('auth.username', locale)} *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 font-medium text-sm">@</span>
                          <input type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} placeholder="hisham" maxLength={20}
                            className="w-full bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all" required />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={10} /> {t('auth.email_address', locale)} *
                    </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all" required />
                  </div>

                  {mode !== 'magic' && mode !== 'forgot' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                          <Lock size={10} /> {t('auth.password_label', locale)} *
                        </label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => { setMode('forgot'); resetForm(); }}
                            className="text-[10px] text-brand-400 hover:text-brand-300 transition-colors"
                          >
                            {t('auth.forgot_pw', locale)}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.pw_hint", locale)} minLength={6}
                          className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder:text-white/20 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? t('auth.hide_pw', locale) : t('auth.show_pw', locale)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {mode === 'signup' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck size={10} /> {t('auth.confirm_label', locale)} *
                        </label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t("auth.reenter_pw", locale)} minLength={6}
                          className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 outline-none transition-all ${confirmPassword && password !== confirmPassword ? 'border-accent-500/50' : 'border-white/8'}`} required />
                        {confirmPassword && password !== confirmPassword && <p className="text-accent-400 text-[10px]">{t('auth.err_pw_match', locale)}</p>}
                      </div>
                      <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-500 focus:ring-offset-0" />
                        <span className="text-[11px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                          {t("auth.agree_terms", locale)}
                        </span>
                      </label>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 h-11 text-sm font-bold bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-1"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} />
                      : mode === 'login' ? <LogIn size={16} />
                      : mode === 'signup' ? <UserPlus size={16} />
                      : <Mail size={16} />}
                    {mode === 'login' ? t('auth.sign_in', locale) : mode === 'signup' ? t('auth.create_account', locale) : mode === 'magic' ? t('auth.send_magic', locale) : t('auth.send_reset', locale)}
                  </button>
                </form>

                {/* Mode Toggle */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (mode === 'forgot' || mode === 'magic') {
                        setMode('login');
                      } else {
                        setMode(mode === 'login' ? 'signup' : 'login');
                      }
                      resetForm();
                    }}
                    className="w-full py-2.5 rounded-xl border border-white/8 bg-white/3 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    {mode === 'login' ? t('auth.no_account', locale)
                      : mode === 'signup' ? t('auth.have_account', locale)
                      : t('auth.back_signin', locale)}
                  </button>
                  {mode !== 'magic' && mode !== 'forgot' && (
                    <button
                      onClick={() => { setMode('magic'); resetForm(); }}
                      className="text-[11px] text-white/30 hover:text-brand-400 transition-colors"
                    >
                      {t('auth.magic_alt', locale)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
