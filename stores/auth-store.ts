import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { isSupabaseConfigured, supabase, supabaseConfigIssue } from '@/config/supabase';
import { friendlyAuthError } from '@/utils/auth-errors';
import { SUPABASE_NOT_CONFIGURED_MESSAGE } from '@/utils/supabase-url';

export interface Profile {
  avatar_url: string | null;
  created_at: string;
  full_name: string | null;
  id: string;
  updated_at: string;
  username: string;
}

export interface AuthResult {
  /** true ketika email sudah dipakai akun lain. */
  alreadyRegistered?: boolean;
  error: string | null;
  /** true ketika sign-up berhasil tapi user harus konfirmasi email dulu. */
  needsEmailConfirmation?: boolean;
}

export interface SignUpInput {
  email: string;
  fullName: string;
  password: string;
  username: string;
}

interface AuthState {
  busy: boolean;
  initialized: boolean;
  profile: Profile | null;
  session: Session | null;
  user: User | null;
  initialize: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  signUp: (input: SignUpInput) => Promise<AuthResult>;
}

/** Pesan masalah konfigurasi, kalau ada yang perlu diperbaiki lebih dulu. */
function configErrorMessage(): string | null {
  if (!isSupabaseConfigured) return SUPABASE_NOT_CONFIGURED_MESSAGE;
  return supabaseConfigIssue;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  busy: false,
  initialized: false,
  profile: null,
  session: null,
  user: null,

  initialize: async () => {
    if (get().initialized) return;
    set({ initialized: true });

    if (!isSupabaseConfigured) return;

    const { data } = await supabase.auth.getSession();
    set({ session: data.session, user: data.session?.user ?? null });
    if (data.session?.user) {
      await get().refreshProfile();
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        void get().refreshProfile();
      } else {
        set({ profile: null });
      }
    });
  },

  refreshProfile: async () => {
    const user = get().user;
    if (!user || !isSupabaseConfigured) {
      set({ profile: null });
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    set({ profile: error ? null : ((data as Profile | null) ?? null) });
  },

  signIn: async (email, password) => {
    const configError = configErrorMessage();
    if (configError) return { error: configError };

    set({ busy: true });
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    set({ busy: false });

    return { error: error ? friendlyAuthError(error.message) : null };
  },

  signUp: async ({ email, fullName, password, username }) => {
    const configError = configErrorMessage();
    if (configError) return { error: configError };

    set({ busy: true });
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName, username },
      },
    });
    set({ busy: false });

    if (error) {
      // Ketika "Confirm email" dimatikan, Supabase mengembalikan error eksplisit.
      const alreadyRegistered = /already registered|already exists/i.test(error.message);
      return { alreadyRegistered, error: friendlyAuthError(error.message) };
    }

    // Ketika "Confirm email" aktif, Supabase menyamarkan email yang sudah
    // dipakai dengan mengembalikan user tanpa `identities`.
    const alreadyRegistered =
      Array.isArray(data.user?.identities) && data.user.identities.length === 0;

    // Tanpa session berarti Supabase masih menunggu konfirmasi email.
    return { alreadyRegistered, error: null, needsEmailConfirmation: !data.session };
  },

  signOut: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    set({ profile: null, session: null, user: null });
  },
}));
