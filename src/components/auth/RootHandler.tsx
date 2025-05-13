import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom'; // useNavigate is not needed if we use <Navigate />
import useAuthStore from '@/stores/authStore'; // Import the Zustand store
// PublicChat and PublicLayout are no longer needed here
// import PublicChat from '@/components/home/PublicChat';
// import PublicLayout from '@/components/layout/PublicLayout';

// This component decides whether to redirect to login or the authenticated app's main page.
export const RootHandler = () => {
  const { user, isLoading, checkAuthState } = useAuthStore(); // Use Zustand store
  // const navigate = useNavigate(); // Not needed if using <Navigate />

  useEffect(() => {
    // Ensure auth state is checked when the component mounts,
    // though App.tsx also calls this. Redundant calls are fine for checkAuthState.
    checkAuthState();
  }, [checkAuthState]);

  if (isLoading) {
    // Show a full-page loading indicator while checking auth state
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        {/* You can use a more sophisticated spinner/skeleton here */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    // If user is authenticated, redirect to the main chat page (or another default authenticated route)
    return <Navigate to="/chat" replace />;
  } else {
    // If user is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }
};
