import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
    data?: any;
  }>;
  signInWithGoogle: () => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
    data?: any;
  }>;
  signOut: () => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing sessions
    const checkSession = async () => {
      setLoading(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // On successful login, redirect to /chat
      navigate("/chat");
      return { error: null, success: true, data };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: error as Error, success: false };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Using signInWithOAuth to start the Google authentication flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
          queryParams: {
            // These help prevent issues with certain browser extensions
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });
      
      if (error) {
        console.error("OAuth error:", error);
        throw error;
      }
      
      return { error: null, success: true };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return { error: error as Error, success: false };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Starting signup process for:", email);
      
      // Simple redirect URL setup
      const redirectUrl = `${window.location.origin}/login?verified=true`;
      console.log("Setting redirect URL:", redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Signup successful, verification email sent to:", email);
      return { error: null, success: true, data };
    } catch (error) {
      console.error("Error in signup:", error);
      return { error: error as Error, success: false };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      return { error: null, success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { error: error as Error, success: false };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null, success: true };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error: error as Error, success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
