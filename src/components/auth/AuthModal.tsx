import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { X, LogIn, UserPlus, Loader2, Mail, Lock, User, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOAuth = async (provider: 'google' | 'twitter') => {
    setLoading(true);
    try {
      const { error } = await useAuth().oauthSignIn(provider);
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || `Failed to sign in with ${provider}`);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (!isConfigured) {
      toast.error('Supabase is not configured yet. Please set up your environment variables.');
      return;
    }

    if (mode === 'signup' && !username.trim()) {
      toast.error('Please choose a username');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back!');
        onClose();
      } else {
        const { error } = await signUp(email, password, username.trim().toLowerCase());
        if (error) throw error;
        toast.success('Account created! Welcome aboard 🎉');
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
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
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-rose-500/20 to-orange-500/20 rounded-[2rem] blur-xl opacity-60" />

            <div className="relative bg-neutral-950/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header gradient bar */}
              <div className="h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500" />

              <div className="p-8 space-y-6">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X size={18} />
                </button>

                {/* Logo & Title */}
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-600 flex items-center justify-center mx-auto font-bold text-white text-2xl shadow-lg shadow-orange-500/30">
                      H
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-neutral-950 flex items-center justify-center">
                      <Sparkles size={10} className="text-white" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {mode === 'login' ? 'Welcome Back' : 'Join the Conversation'}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                      {mode === 'login'
                        ? 'Sign in to continue the discourse'
                        : 'Create your account and start sharing'}
                    </p>
                  </div>
                </div>

                {!isConfigured && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-orange-300 text-xs leading-relaxed">
                    <strong>Demo Mode:</strong> Supabase is not configured. Set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local to enable authentication.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username (signup only) */}
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pb-1">
                          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                            <User size={12} /> Username
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 font-medium text-sm">@</span>
                            <Input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                              placeholder="hisham"
                              className="bg-white/5 border-white/10 h-12 pl-8 focus-visible:ring-orange-500 focus-visible:border-orange-500/50"
                              required={mode === 'signup'}
                              maxLength={20}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                      <Mail size={12} /> Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-white/5 border-white/10 h-12 focus-visible:ring-orange-500 focus-visible:border-orange-500/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                      <Lock size={12} /> Password
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 h-12 focus-visible:ring-orange-500 focus-visible:border-orange-500/50"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-lg shadow-orange-500/20 rounded-xl transition-all hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : mode === 'login' ? (
                      <LogIn className="mr-2" size={18} />
                    ) : (
                      <UserPlus className="mr-2" size={18} />
                    )}
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/20 text-xs uppercase tracking-widest">or continue with</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Social Auth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    disabled={loading}
                    className="w-full h-11 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleOAuth('twitter')}
                    disabled={loading}
                    className="w-full h-11 bg-black hover:bg-neutral-900 text-white border border-white/20 font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X (Twitter)
                  </Button>
                </div>

                {/* Toggle mode */}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                >
                  {mode === 'login'
                    ? "Don't have an account? Create one"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
