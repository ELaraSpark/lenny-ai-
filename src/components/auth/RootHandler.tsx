import React from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate
import { useAuth } from '@/contexts/AuthContext';
// import Index from '@/pages/Index'; // No longer needed as we redirect
import LandingPage from '@/pages/LandingPage'; // Public Landing Page

// This component decides whether to show the public landing page 
// or the authenticated app's main page based on auth state.
export const RootHandler = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a full-page loading indicator while checking auth state
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        {/* You can use a more sophisticated spinner/skeleton here */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-perplexity-teal"></div> 
      </div>
    );
  }

  // TEMPORARY BYPASS COMMENTED OUT: Always show the authenticated Index page for testing
  // return <Index />;

  // Original logic: RESTORED
  // If user is authenticated, redirect to the default authenticated route (e.g., /chat)
  if (user) {
    // Redirecting to /chat, which is handled by the nested layout route in App.tsx
    return <Navigate to="/chat" replace />; 
  }
  
  // If user is not authenticated, redirect to the root page
  return <Navigate to="/" replace />;
};
