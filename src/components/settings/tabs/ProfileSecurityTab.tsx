
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@/components/ui/switch"; // Added Switch import
import { Separator } from "@/components/ui/separator"; // Added Separator import
import { Label } from "@/components/ui/label"; // Added Label import

const accountFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  specialty: z.string().optional(),
  hospital: z.string().optional(),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }).optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Renaming component to reflect combined content
const ProfileSecurityTab = () => {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false); // Added state from SecurityTab

  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "Dr. Sarah Chen",
      email: "sarah.chen@medical.org",
      specialty: "Cardiology",
      hospital: "Central Medical Center",
      bio: "Experienced cardiologist specializing in preventive care and heart failure management.",
    },
  });

  function onAccountSubmit(data: AccountFormValues) {
    toast({
      title: "Account settings updated",
      description: "Your account information has been saved.",
    });
  }

  // Added handlers from SecurityTab
  const handleChangePassword = () => {
    console.log("Change password clicked");
    // Add logic to open a modal or navigate to a password change form
    toast({ title: "Password Change", description: "Password change modal/form not implemented." });
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(prev => !prev);
    // Add logic to initiate 2FA setup or disable it
    console.log("2FA toggled:", !twoFactorEnabled);
    toast({ title: "Two-Factor Authentication", description: `2FA ${!twoFactorEnabled ? 'enabled' : 'disabled'} (logic not implemented).` });
  };

  return (
    <div className="space-y-6"> {/* Increased spacing */}
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle> {/* Updated title */}
          <CardDescription>
            Update your public profile details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...accountForm}>
            <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={accountForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="doctor@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input placeholder="Cardiology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="hospital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital/Clinic</FormLabel>
                      <FormControl>
                        <Input placeholder="Central Medical Center" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={accountForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us a bit about yourself" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit">Update Account</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* Removed extra closing </Card> tag */}

      {/* Profile Picture Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Change your profile photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 rounded-full overflow-hidden border border-input">
              <img 
                src="/avatar-placeholder.jpg" 
                alt="Current profile" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <Input type="file" id="picture" className="max-w-sm" />
              <p className="text-xs text-muted-foreground">
                JPG, GIF or PNG. 1MB max.
              </p>
            </div>
          </div>
          <Button variant="outline">Upload New Image</Button>
        </CardContent>
      </Card>

      {/* Security Settings Card */}
      <Card>
         <CardHeader>
           <CardTitle>Security Settings</CardTitle>
           <CardDescription>
             Manage your password and account security.
           </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
           {/* Password Section from SecurityTab */}
           <div className="space-y-4">
             <h3 className="text-lg font-medium">Password</h3>
             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
               <div>
                 <Label>Change Password</Label>
                 <p className="text-sm text-muted-foreground">
                   Update your account password regularly for better security.
                 </p>
               </div>
               <Button variant="outline" onClick={handleChangePassword}>Change Password</Button>
             </div>
           </div>

           <Separator />

           {/* 2FA Section from SecurityTab */}
           <div className="space-y-4">
             <h3 className="text-lg font-medium">Two-Factor Authentication (2FA)</h3>
             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
               <Label htmlFor="two-factor-switch" className="flex flex-col space-y-1">
                 <span>Enable 2FA</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                   Add an extra layer of security to your account using an authenticator app.
                 </span>
               </Label>
               <Switch
                 id="two-factor-switch"
                 checked={twoFactorEnabled}
                 onCheckedChange={handleToggleTwoFactor}
               />
             </div>
             {twoFactorEnabled && (
               <div className="pl-4 text-sm text-muted-foreground">
                 {/* Placeholder for 2FA setup instructions or status */}
                 <p>Two-factor authentication is currently enabled.</p>
                 <Button variant="link" className="p-0 h-auto text-primary">Manage 2FA Settings</Button>
               </div>
             )}
           </div>
           {/* Note: Active Sessions section is omitted for simplicity as requested */}
         </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSecurityTab; // Renamed export
