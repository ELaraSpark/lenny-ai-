
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-aida-50/50 to-white p-6">
      <div className="text-center max-w-md animate-fadeIn">
        <div className="w-24 h-24 rounded-2xl bg-aida-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-aida-500 text-4xl font-bold">404</span>
        </div>
        <h1 className="h2 mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <p className="text-xs text-muted-foreground">
          If you believe this is an error, please contact system support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
