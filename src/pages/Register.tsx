import { Link } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import { PicassoIllustration } from "@/components/illustrations/PicassoIllustration";

const Register = () => {
  // Using the light cream/beige color from the screenshot
  const bgColor = "#FDFBF5";
  
  return (
    <div className="flex flex-col md:flex-row h-screen" style={{ backgroundColor: bgColor }}>

      {/* Left Column: Registration Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 order-2 md:order-1" style={{ backgroundColor: bgColor }}>
        {/* Form Content Container */}
        <div className="w-full max-w-sm">
          {/* Welcome header */}
          <div className="mb-6 text-center">
            {/* Use primary color */}
            <PicassoIllustration
              name="doctor"
              size="md"
              className="text-primary mx-auto mb-4"
            />
          </div>

          <RegisterForm />

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
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
      <div className="w-full md:w-1/2 hidden md:flex items-center justify-center p-8 md:p-12 order-1 md:order-2" style={{ backgroundColor: bgColor }}> 
        <img
          src="/illustrations/login-abstract.webp"
          alt="Abstract illustration"
          className="max-w-full h-auto max-h-[70vh] object-contain"
          style={{ backgroundColor: bgColor }}
        />
      </div>
    </div>
  );
};

export default Register;
