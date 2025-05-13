
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { LoadingIllustration } from "@/components/illustrations/AnimatedIllustration"; // Import LoadingIllustration
import useAuthStore from "@/stores/authStore"; // Import the Zustand store

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuthStore(); // Use Zustand store

  if (isLoading) { // Use isLoading from Zustand store
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
