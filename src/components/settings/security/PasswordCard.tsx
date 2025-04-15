
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { 
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type PasswordCardProps = {
  onPasswordChange: (log: { message: string, level: string }) => void;
};

const passwordSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  new: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.new === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordCard = ({ onPasswordChange }: PasswordCardProps) => {
  const { toast } = useToast();
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });
  
  const handleUpdatePassword = (values: PasswordFormValues) => {
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated."
    });
    
    onPasswordChange({
      message: "Password changed",
      level: "info"
    });
    
    form.reset();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="space-y-4">
            <FormItem>
              <FormLabel htmlFor="current-password">Current Password</FormLabel>
              <FormControl>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  {...form.register("current")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel htmlFor="new-password">New Password</FormLabel>
              <FormControl>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  {...form.register("new")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel htmlFor="confirm-password">Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  {...form.register("confirm")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <Button type="submit" id="update-password">Update Password</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
