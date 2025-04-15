import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
// Removed PublicLayout and PicassoBackground imports
import { PicassoIllustration } from "@/components/illustrations/PicassoIllustration"; // Keep for header icon

const Login = () => {
  return (
    // Main container: Full height, flex, stacks vertically on mobile, row layout on medium+ screens
    // Using a background color similar to the provided image
    <div className="flex flex-col md:flex-row h-screen bg-[#FDFBF5]"> 
      
      {/* Left Column: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 order-2 md:order-1"> 
        {/* Form Content Container */}
        <div className="w-full max-w-sm"> 
          {/* Welcome header */}
          <div className="mb-6 text-center">
            {/* Use primary color */}
            <PicassoIllustration 
              name="healing" 
              size="md" 
              className="text-primary mx-auto mb-4"
            />
            {/* Apply handwritten font to title - Use primary color */}
            <h1 className="text-3xl font-bold tracking-tight font-handwritten text-primary">Welcome back</h1> 
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your account to continue
            </p>
          </div>

          <LoginForm />

          {/* Keep register link */}
          <div className="mt-6 text-center"> {/* Increased margin top */}
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Create an account
              </Link>
            </p>
          </div>

          {/* Add legal text */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to Leny.ai's{" "}
            <Link to="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right Column: Image */}
      {/* Hidden on small screens, flex centered on medium+ */}
      <div className="w-full md:w-1/2 hidden md:flex items-center justify-center p-8 md:p-12 order-1 md:order-2"> 
        <img 
          src="/illustrations/login-abstract.webp" // Updated file extension
          alt="Abstract illustration" 
          className="max-w-full h-auto max-h-[70vh] object-contain" // Control image size
        />
      </div>
    </div>
  );
};

export default Login;
