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
                  <span className="text-white/20 text-xs uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/10" />
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
