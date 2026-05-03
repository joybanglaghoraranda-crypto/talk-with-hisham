import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, LogIn, UserPlus, Loader2, Mail, Lock } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (!isConfigured) {
      toast.error('Supabase is not configured yet. Please set up your environment variables.');
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
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success('Account created! Check your email to verify.');
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-neutral-900/95 backdrop-blur-xl rounded-3xl p-8 border border-white/15 shadow-2xl w-full max-w-md space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-rose-600 flex items-center justify-center mx-auto font-bold text-white text-xl">
            H
          </div>
          <h2 className="text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join the Conversation'}
          </h2>
          <p className="text-white/50 text-sm">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {!isConfigured && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-orange-300 text-xs leading-relaxed">
            <strong>Demo Mode:</strong> Supabase is not configured. Set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local to enable authentication.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <Mail size={14} /> Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-white/5 border-white/10 h-12"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <Lock size={14} /> Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border-white/10 h-12"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 font-bold h-12 text-base"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : mode === 'login' ? (
              <LogIn className="mr-2" size={18} />
            ) : (
              <UserPlus className="mr-2" size={18} />
            )}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
