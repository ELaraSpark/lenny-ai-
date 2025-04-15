
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";
import { LoadingIllustration } from "@/components/illustrations/AnimatedIllustration"; // Import LoadingIllustration

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Use LoadingIllustration instead of basic spinner
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingIllustration type="ai" size="lg" /> 
      </div>
    );
  }

  // Authentication check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
