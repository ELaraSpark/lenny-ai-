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
        
        // Check if we have code and/or error in the URL (standard OAuth flow)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        // Handle explicit errors first
        if (errorParam) {
          console.error("OAuth error:", errorParam, errorDescription);
          setError(errorDescription || errorParam);
          return;
        }
        
        // If we have a code, this is a successful redirect from OAuth provider
        if (code) {
          // Let Supabase handle the auth exchange
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Session error:", sessionError);
            setError(sessionError.message);
          } else if (data && data.session) {
            // Success! Redirect to chat
            console.log("OAuth authentication successful");
            navigate("/chat");
          } else {
            console.log("No error but also no session - completing setup");
            // Try to complete the OAuth process manually
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            
            if (exchangeError) {
              console.error("Error exchanging code for session:", exchangeError);
              setError(exchangeError.message);
            } else {
              navigate("/chat");
            }
          }
          return;
        }
        
        // Check for hash params (implicit flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          console.log("Auth successful via access token, redirecting...");
          navigate("/chat");
          return;
        }
        
        // If we got here, there's no code, no error, and no hash params
        // Just check if we have a session anyway
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(sessionError.message);
        } else if (data && data.session) {
          navigate("/chat");
        } else {
          console.log("No authentication data found, returning to login");
          navigate("/login");
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