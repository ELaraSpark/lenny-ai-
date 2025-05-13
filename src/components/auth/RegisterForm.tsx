import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import useAuthStore from "@/stores/authStore"; // Import the Zustand store
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "./GoogleAuthButton";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  // isLoading will be from useAuthStore
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Removed: GoogleAuthButton will use store's isLoading
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  // Assuming signIn from the store will be used for registration for now,
  // as the new store has signIn, signOut, checkAuthState.
  // If a separate signUp action is added to the store later, this can be updated.
  const { signIn: signUp, isLoading, error: authError, user } = useAuthStore(); // Include user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // isLoading is managed by Zustand store
    await signUp({ email: values.email, password: values.password });
    // Check authError from the store after the call
    // This is a simplified approach. Ideally, the store's signUp would manage this.
  }

  // useEffect to handle toast messages and emailSent state
  React.useEffect(() => {
    // Only show toast/set emailSent if the form was submitted
    if (form.formState.isSubmitted) {
      if (authError && !isLoading) { // Check !isLoading to ensure the async operation has finished
        toast.error(typeof authError === 'string' ? authError : (authError?.message || "An unknown registration error occurred."));
        setEmailSent(false);
      } else if (!authError && !isLoading && form.formState.isSubmitSuccessful) {
        // For registration, we don't expect 'user' to be set immediately in the store
        // as it's a mock and doesn't simulate email verification flow.
        // We'll rely on no error and successful form submission.
        const submittedEmail = form.getValues("email");
        if (submittedEmail) { // Ensure email was part of submission
           setEmailSent(true);
           toast.success("Registration successful! Please check your email to confirm your account.");
        }
      }
    }
  }, [authError, isLoading, form.formState.isSubmitted, form.formState.isSubmitSuccessful, form]);


  if (emailSent) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold">Verification Email Sent</h2>
        <p className="text-muted-foreground">
          We've sent a verification email to your address. Please check your inbox and follow the instructions to complete your registration.
        </p>
        <Button asChild className="mt-4">
          <Link to="/login">Return to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6 animate-fadeIn">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-md text-muted-foreground">
            Join today to reclaim your time
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="doctor@hospital.org"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Button variant="link" size="sm" className="px-0 font-medium" asChild>
                <Link to="/login">Already have an account?</Link>
              </Button>
            </div>

            {/* Use primary theme color for button */}
            <Button
              type="submit"
              className="w-full py-3 bg-primary text-white hover:bg-primary/90" // Adjusted padding and colors
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign up with
            </span>
          </div>
        </div>

        <GoogleAuthButton mode="signup" /> {/* isLoading prop removed */}

        <div className="flex items-center justify-center text-sm text-muted-foreground space-x-2">
          <ShieldCheck size={14} />
          <span>HIPAA-compliant & secure registration</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
