import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Bell, Key } from 'lucide-react';

const SecurityTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security preferences and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch />
            </div>
          </div>
          
          {/* Session Management */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Active Sessions</Label>
                <p className="text-sm text-muted-foreground">
                  Manage your active login sessions
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>
          </div>
          
          {/* Login Notifications */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Login Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for new login attempts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          
          {/* Password Requirements */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="space-y-0.5">
              <Label className="text-base">Password Requirements</Label>
              <p className="text-sm text-muted-foreground">
                Enforce stronger password policies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Label>Minimum 8 characters</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Label>Require uppercase letters</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Label>Require numbers</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <Label>Require special characters</Label>
              </div>
            </div>
          </div>
          
          {/* Password Expiration */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Password Expiration</Label>
                <p className="text-sm text-muted-foreground">
                  Require password changes periodically
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control how your information is used and shared.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Sharing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data Analytics Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anonymous usage data to improve our services
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          
          {/* Profile Visibility */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Control who can see your profile information
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option>Colleagues only</option>
                  <option>All verified users</option>
                  <option>Private</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
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
    </div>
  );
};

export default SecurityTab;
