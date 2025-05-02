import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PublicChat from '@/components/home/PublicChat';
import PublicLayout from '@/components/layout/PublicLayout';

// This component decides whether to show the public landing page 
// or redirect to the authenticated app's main page based on auth state.
export const RootHandler = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    // Show a full-page loading indicator while checking auth state
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        {/* You can use a more sophisticated spinner/skeleton here */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div> 
      </div>
    );
  }

  // Always show the public chat interface first, regardless of authentication status
  // This ensures that when users click on Leny AI in the header, they get the mock interface
  return (
    <PublicLayout showFooter={true}>
      <PublicChat />
    </PublicLayout>
  );
};
