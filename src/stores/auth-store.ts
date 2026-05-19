'use client';

import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';
import { ADMIN_EMAIL } from '@/lib/constants';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string, fullName?: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;

    const supabase = getSupabaseClient();

    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;

    set({
      session,
      user,
      isAdmin: user?.email === ADMIN_EMAIL,
      loading: false,
      initialized: true,
    });

    if (user) ensureProfile(user);

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      set({
        session,
        user,
        isAdmin: user?.email === ADMIN_EMAIL,
      });
      if (user) ensureProfile(user);
    });
  },

  signIn: async (email, password) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  signUp: async (email, password, username, fullName) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

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
      } catch (err) {
        console.log('Profile creation during signup:', err);
      }
    }

    return { error };
  },

  signInWithOAuth: async (provider) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  },

  signInWithMagicLink: async (email) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  },

  signOut: async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    set({ user: null, session: null, isAdmin: false });
  },
}));

// Helper: Auto-create profile row for new users
async function ensureProfile(user: User) {
  const supabase = getSupabaseClient();

  try {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!data) {
      const emailPrefix = user.email?.split('@')[0] || 'user';
      const username = emailPrefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

      await supabase.from('profiles').insert({
        id: user.id,
        username: username + '_' + Math.random().toString(36).slice(2, 6),
        full_name: user.user_metadata?.full_name || emailPrefix,
        bio: '',
        avatar_url: user.user_metadata?.avatar_url || '',
      });
    }
  } catch (err) {
    console.log('Profile check:', err);
  }
}
