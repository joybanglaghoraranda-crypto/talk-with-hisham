'use client';

import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';

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
    let isAdmin = false;

    if (user) {
      const { data } = await supabase.from('admin_users').select('*').eq('id', user.id).maybeSingle();
      isAdmin = !!data;
    }

    set({
      session,
      user,
      isAdmin,
      loading: false,
      initialized: true,
    });

    if (user) ensureProfile(user);

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      let isAdmin = false;

      if (user) {
        const { data } = await supabase.from('admin_users').select('*').eq('id', user.id).maybeSingle();
        // Prevent race conditions: Ensure the user hasn't changed before setting state
        const currentSession = (await supabase.auth.getSession()).data.session;
        if (currentSession?.user?.id !== user.id) return;
        isAdmin = !!data;
      }

      set({
        session,
        user,
        isAdmin,
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
      .select('id, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (!data) {
      const emailPrefix = user.email?.split('@')[0] || 'user';
      const username = emailPrefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

      await supabase.from('profiles').insert({
        id: user.id,
        username: username + '_' + getRandomSuffix(4),
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || emailPrefix,
        bio: '',
        avatar_url: '',
      });
    }
  } catch (err) {
    console.log('Profile check:', err);
  }
}

function getRandomSuffix(length = 4): string {
  const array = new Uint32Array(1);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    globalThis.crypto.getRandomValues(array);
  } else {
    return Date.now().toString(36).slice(-length);
  }
  return array[0].toString(36).slice(0, length);
}

