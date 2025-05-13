import { create } from 'zustand';
import { supabase } from '../integrations/supabase/client'; // Adjusted path
import type { User as SupabaseUser, Session as SupabaseSession, AuthError } from '@supabase/supabase-js';

// Re-defining User to match Supabase user structure or keep it simple
interface User {
  id: string;
  email?: string;
  // Add other relevant user properties from Supabase user object if needed
  // e.g., user_metadata, app_metadata
}

interface AuthState {
  user: User | null;
  session: SupabaseSession | null;
  isLoading: boolean;
  error: AuthError | string | null; // Can be Supabase AuthError or custom string
  signInWithPassword: (credentials: { email: string; password?: string }) => Promise<void>;
  signUpWithPassword: (credentials: { email: string; password?: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthState: () => Promise<void>;
  setUserAndSession: (user: SupabaseUser | null, session: SupabaseSession | null) => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,

  setUserAndSession: (supabaseUser, supabaseSession) => {
    if (supabaseUser) {
      const appUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        // Map other fields if necessary
      };
      set({ user: appUser, session: supabaseSession, isLoading: false, error: null });
    } else {
      set({ user: null, session: null, isLoading: false, error: null });
    }
  },

  signInWithPassword: async (credentials) => {
    set({ isLoading: true, error: null });
    if (!credentials.email || !credentials.password) {
      set({ isLoading: false, error: "Email and password are required." });
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) {
      set({ isLoading: false, error });
    } else if (data.user && data.session) {
      get().setUserAndSession(data.user, data.session);
    } else {
      set({ isLoading: false, error: "Sign in failed: No user or session data returned."})
    }
  },

  signUpWithPassword: async (credentials) => {
    set({ isLoading: true, error: null });
    if (!credentials.email || !credentials.password) {
      set({ isLoading: false, error: "Email and password are required for sign up." });
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) {
      set({ isLoading: false, error });
    } else if (data.user && data.session) {
      // User is created and session is active (if email confirmation is not required or auto-confirmed)
      get().setUserAndSession(data.user, data.session);
    } else if (data.user && !data.session) {
      // User is created but needs to confirm email
      set({ isLoading: false, error: null, user: {id: data.user.id, email: data.user.email } }); // User might be set to prompt for confirmation
      // Or handle this case by showing a message to the user
      console.log("User created, please check your email for confirmation.");
    }
     else {
      set({ isLoading: false, error: "Sign up failed: No user data returned." });
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback', // Ensure this matches your Supabase redirect URI
      },
    });
    if (error) {
      set({ isLoading: false, error });
    }
    // Supabase handles redirection, state will be updated by onAuthStateChange or checkAuthState on callback
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    const { error } = await supabase.auth.signOut();
    if (error) {
      set({ isLoading: false, error });
    } else {
      set({ user: null, session: null, isLoading: false, error: null });
    }
  },

  checkAuthState: async () => {
    set({ isLoading: true, error: null });
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      set({ isLoading: false, error, user: null, session: null });
    } else if (session) {
      get().setUserAndSession(session.user, session);
    } else {
      set({ user: null, session: null, isLoading: false, error: null });
    }
  },
}));

let authSubscription: { unsubscribe: () => void } | null = null;

export const initializeAuthListener = () => {
  const { setUserAndSession } = useAuthStore.getState();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    setUserAndSession(session?.user ?? null, session);
    // Optionally, handle specific events like 'SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'
    // if (_event === 'PASSWORD_RECOVERY') { /* handle password recovery */ }
  });
  // The subscription object itself is what we need to store, which has the unsubscribe method.
  // The returned object from onAuthStateChange is { data: { subscription }, error: null | AuthError }
  // So, data.subscription is the actual subscription object.
  if (data && data.subscription) {
    authSubscription = data.subscription;
  } else {
    console.error("Failed to subscribe to auth state changes.");
    // Handle the case where subscription might be null, though typically it should exist if no error.
  }

  // Initial check
  useAuthStore.getState().checkAuthState();
};

export const cleanupAuthListener = () => {
  if (authSubscription) {
    authSubscription.unsubscribe();
    authSubscription = null;
  }
};

// Automatically check auth state when the store is initialized (optional, can be done in App.tsx)
// This ensures that if the user is already logged in (e.g. from a previous session),
// their state is loaded into the store as soon as possible.
// However, it's generally better to call initializeAuthListener from App.tsx to ensure
// React context is fully set up.
// useAuthStore.getState().checkAuthState(); // Moved to initializeAuthListener

export default useAuthStore;