import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { X, LogIn, UserPlus, Loader2, Mail, Lock, User, Sparkles, Eye, EyeOff, ShieldCheck } from 'lucide-react';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setFirstName('');
    setLastName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setAgreed(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (!isConfigured) {
      toast.error('Supabase is not configured yet.');
      return;
    }

    if (mode === 'signup') {
      if (!firstName.trim()) { toast.error('First name is required'); return; }
      if (!username.trim()) { toast.error('Please choose a username'); return; }
      if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
      if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
      if (!agreed) { toast.error('Please accept the terms'); return; }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back!');
        resetForm();
        onClose();
      } else {
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        const { error } = await signUp(email, password, username.trim().toLowerCase(), fullName);
        if (error) throw error;
        toast.success('Account created! Welcome aboard 🎉');
        resetForm();
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
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-rose-500/20 to-orange-500/20 rounded-[2rem] blur-xl opacity-60" />

            <div className="relative bg-neutral-950/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header gradient bar */}
              <div className="h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500" />

              <div className="p-7 space-y-5">
                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X size={18} />
                </button>

                {/* Logo & Title */}
                <div className="text-center space-y-3">
                  <div className="relative inline-block">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-600 flex items-center justify-center mx-auto font-bold text-white text-xl shadow-lg shadow-orange-500/30">
                      H
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-neutral-950 flex items-center justify-center">
                      <Sparkles size={8} className="text-white" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-white/40 text-sm mt-1">
                      {mode === 'login'
                        ? 'Sign in to continue the discourse'
                        : 'Fill in your details to get started'}
                    </p>
                  </div>
                </div>

                {!isConfigured && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-orange-300 text-xs leading-relaxed">
                    <strong>Demo Mode:</strong> Supabase is not configured.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Signup fields */}
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pb-1">
                          {/* First & Last Name */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">First Name *</label>
                              <Input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Muhibbullah"
                                className="bg-white/5 border-white/10 h-11 focus-visible:ring-orange-500 focus-visible:border-orange-500/50"
                                required={mode === 'signup'}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Last Name</label>
                              <Input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Hisham"
                                className="bg-white/5 border-white/10 h-11 focus-visible:ring-orange-500 focus-visible:border-orange-500/50"
                              />
                            </div>
                          </div>

                          {/* Username */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                              <User size={10} /> Username *
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 font-medium text-sm">@</span>
                              <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                                placeholder="hisham"
                                className="bg-white/5 border-white/10 h-11 pl-8 focus-visible:ring-orange-500 focus-visible:border-orange-500/50"
                                required={mode === 'signup'}
                                maxLength={20}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={10} /> Email Address *
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-white/5 border-white/10 h-11 focus-visible:ring-orange-500 focus-visible:border-orange-500/50"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                      <Lock size={10} /> Password *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="bg-white/5 border-white/10 h-11 pr-10 focus-visible:ring-orange-500 focus-visible:border-orange-500/50"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (signup only) */}
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1.5 pb-1">
                          <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck size={10} /> Confirm Password *
                          </label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-enter password"
                              className={`bg-white/5 border-white/10 h-11 pr-10 focus-visible:ring-orange-500 focus-visible:border-orange-500/50 ${
                                confirmPassword && password !== confirmPassword ? 'border-rose-500/50' : ''
                              }`}
                              required={mode === 'signup'}
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {confirmPassword && password !== confirmPassword && (
                            <p className="text-rose-400 text-[10px] mt-1">Passwords do not match</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Terms checkbox (signup only) */}
                  {mode === 'signup' && (
                    <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
                      />
                      <span className="text-[11px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                        I agree to the <span className="text-orange-400">Terms of Service</span> and <span className="text-orange-400">Privacy Policy</span>
                      </span>
                    </label>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 shadow-lg shadow-orange-500/20 rounded-xl transition-all hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] mt-2"
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
                  <span className="text-white/20 text-[10px] uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Toggle mode */}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); resetForm(); }}
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
