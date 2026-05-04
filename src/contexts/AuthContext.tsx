import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if Supabase is properly configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const isConfigured = !!(supabaseUrl && !supabaseUrl.includes('your-project'));

  const isAdmin = user?.email === 'ibnenurakondo@gmail.com';

  // Auto-create a profile row when a new user signs up or logs in
  const ensureProfile = useCallback(async (authUser: User) => {
    if (!isConfigured || !authUser) return;

    try {
      // Check if profile exists
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.id)
        .single();

      if (!data) {
        // Create profile from email
        const emailPrefix = authUser.email?.split('@')[0] || 'user';
        const username = emailPrefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        await supabase.from('profiles').insert({
          id: authUser.id,
          username: username + '_' + Math.random().toString(36).slice(2, 6),
          full_name: emailPrefix,
          bio: '',
          avatar_url: '',
        });
      }
    } catch (err) {
      // Profile might already exist — ignore duplicate key errors
      console.log('Profile check:', err);
    }
  }, [isConfigured]);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) ensureProfile(session.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) ensureProfile(session.user);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured, ensureProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string, username?: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    // If signup succeeded and we got a user, create their profile immediately
    if (!error && data.user) {
      const emailPrefix = email.split('@')[0] || 'user';
      const profileUsername = username || emailPrefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

      try {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: profileUsername,
          full_name: fullName || emailPrefix,
          bio: '',
          avatar_url: '',
        });
      } catch (profileErr) {
        console.log('Profile creation during signup:', profileErr);
      }
    }

    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, isConfigured, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
