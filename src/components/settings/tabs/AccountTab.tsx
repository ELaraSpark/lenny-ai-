import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from '@/stores/authStore'; // Import the Zustand store

const AccountTab = () => {
  const { user } = useAuthStore(); // Use Zustand store
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your account details and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={user?.email || ''} 
              disabled 
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Your email address is used for login and notifications.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              placeholder="Enter your display name"
              defaultValue={user?.name || user?.email?.split('@')[0] || ''} // Prefer user.name
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialty">Medical Specialty</Label>
            <Input 
              id="specialty" 
              placeholder="E.g., Cardiology, Neurology, General Practice" 
            />
            <p className="text-xs text-muted-foreground">
              Your specialty helps us personalize AI responses.
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button className="mr-2">
              Save Changes
            </Button>
            <Button variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <Button className="mr-2">
              Update Password
            </Button>
            <Button variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;
