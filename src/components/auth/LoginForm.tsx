import React from 'react';
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
import { Eye, EyeOff } from "lucide-react";
import useAuthStore from "@/stores/authStore"; // Import the Zustand store
import { Separator } from "@/components/ui/separator";
import GoogleAuthButton from "./GoogleAuthButton";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const LoginForm = () => {
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Removed: GoogleAuthButton will use store's isLoading
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithPassword, isLoading, error: authError, user } = useAuthStore(); // Use Zustand store, include user

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signInWithPassword({ email: values.email, password: values.password });
    // The useEffect below will handle toast messages based on store changes.
  }

  // useEffect to handle toast messages based on store changes
  React.useEffect(() => {
    // Only show toast if the form was submitted, to avoid showing old errors on component mount
    if (form.formState.isSubmitted) {
      if (authError && !isLoading) { // Check !isLoading to ensure the async operation has finished
        toast.error(typeof authError === 'string' ? authError : authError.message);
      } else if (user && !isLoading && !authError) { // Check for user, no loading, and no error
        toast.success("Login successful!");
        // Navigation will be handled by ProtectedRoute or RootHandler
      }
    }
  }, [authError, user, isLoading, form.formState.isSubmitted]);

  return (
    <div className="w-full"> 
      <div className="space-y-6"> 
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
                        autoComplete="current-password"
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

            <div className="flex items-center justify-between">
              <Button variant="link" size="sm" className="px-0 font-medium" asChild>
                <Link to="/register">Create account</Link>
              </Button>
              <Button variant="link" size="sm" className="px-0 font-medium">
                Forgot password?
              </Button>
            </div>

            {/* Use primary theme color for button */}
            <Button
              type="submit"
              className="w-full py-3 bg-primary text-white hover:bg-primary/90" // Adjusted padding and colors
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleAuthButton mode="signin" /> {/* isLoading prop removed */}
      </div>
    </div>
  );
};

export default LoginForm;
