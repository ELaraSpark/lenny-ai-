import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        console.log("Auth callback processing started");
        
        // Get the URL hash and search parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const searchParams = new URLSearchParams(window.location.search);
        
        // Check for errors first
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          console.error("OAuth error:", errorParam, errorDescription);
          setError(errorDescription || errorParam);
          return;
        }

        // Handle access token in hash (common with OAuth implicit flow)
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken) {
          console.log("Found access token in URL hash, setting session manually");
          
          const { data: sessionData, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (setSessionError) {
            console.error("Error setting session:", setSessionError);
            setError(setSessionError.message);
            return;
          }
          
          if (sessionData.session) {
            console.log("Session successfully established via access token");
            navigate("/");
            return;
          }
        }

        // Handle code exchange (authorization code flow)
        const code = searchParams.get('code');
        if (code) {
          console.log("Found authorization code, exchanging for session");
          try {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            
            if (exchangeError) {
              console.error("Error exchanging code for session:", exchangeError);
              setError(exchangeError.message);
              return;
            }
            console.log("Successfully exchanged code for session");
          } catch (codeError) {
            console.error("Exception during code exchange:", codeError);
            setError("Failed to process authentication code. Please try again.");
            return;
          }
        } else if (!accessToken) {
          console.warn("No code or token found in URL");
        }

        // Final verification - get the session
        console.log("Verifying session after authentication...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          return;
        }

        if (session) {
          // Success! Redirect to landing page
          console.log("Authentication successful, user:", session.user.email);
          navigate("/"); // Redirecting to root path which shows the landing page
        } else {
          console.error("No session found after authentication");
          setError("Authentication failed - no session found. Please try logging in again.");
        }
      } catch (err) {
        console.error("Error in auth callback:", err);
        setError("An unexpected error occurred during authentication");
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-3 text-lg">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;