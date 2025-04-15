
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
  }>;
  signInWithGoogle: () => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      navigate("/chat"); // Redirect to /chat to be consistent with RootHandler
      return { error: null, success: true };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: error as Error, success: false };
    }
  };

  const signInWithGoogle = async () => {
    try {
       const { error } = await supabase.auth.signInWithOAuth({
         provider: 'google',
         options: {
           redirectTo: window.location.origin + "/chat", // Redirect to /chat to be consistent with RootHandler
         },
       });
      
      if (error) {
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/chat", // Redirect to /chat to be consistent with RootHandler
        },
      });
      
      if (error) {
        throw error;
      }
      
      return { error: null, success: true };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error: error as Error, success: false };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
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
