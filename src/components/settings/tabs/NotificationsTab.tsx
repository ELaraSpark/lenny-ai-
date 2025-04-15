import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const NotificationsTab = () => {
  // Placeholder state
  const [emailNotifications, setEmailNotifications] = React.useState({
    newConsultations: true,
    reportReady: true,
    followupReminders: false,
  });
  const [pushNotifications, setPushNotifications] = React.useState({
    newConsultations: false,
    reportReady: true,
  });

  // Placeholder handlers
  const handleEmailChange = (id: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const handlePushChange = (id: keyof typeof pushNotifications) => {
    setPushNotifications(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage how you receive notifications from the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="email-new-consultations" className="flex flex-col space-y-1">
                  <span>New Consultations</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive an email when a new consultation is assigned or started.
                  </span>
                </Label>
                <Switch 
                  id="email-new-consultations" 
                  checked={emailNotifications.newConsultations}
                  onCheckedChange={() => handleEmailChange('newConsultations')}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="email-report-ready" className="flex flex-col space-y-1">
                  <span>Report Ready</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get notified when a consultation report is generated.
                  </span>
                </Label>
                <Switch 
                  id="email-report-ready" 
                  checked={emailNotifications.reportReady}
                  onCheckedChange={() => handleEmailChange('reportReady')}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="email-followup-reminders" className="flex flex-col space-y-1">
                  <span>Follow-up Reminders</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive reminders for scheduled patient follow-up calls.
                  </span>
                </Label>
                <Switch 
                  id="email-followup-reminders" 
                  checked={emailNotifications.followupReminders}
                  onCheckedChange={() => handleEmailChange('followupReminders')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground">
              (Requires app installation or browser permission)
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="push-new-consultations" className="flex flex-col space-y-1">
                  <span>New Consultations</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive a push notification for new consultations.
                  </span>
                </Label>
                <Switch 
                  id="push-new-consultations" 
                  checked={pushNotifications.newConsultations}
                  onCheckedChange={() => handlePushChange('newConsultations')}
                  disabled // Placeholder
                />
              </div>
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="push-report-ready" className="flex flex-col space-y-1">
                  <span>Report Ready</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get a push notification when reports are ready.
                  </span>
                </Label>
                <Switch 
                  id="push-report-ready" 
                  checked={pushNotifications.reportReady}
                  onCheckedChange={() => handlePushChange('reportReady')}
                  disabled // Placeholder
                />
              </div>
            </div>
          </div>
           <div className="flex justify-start pt-4 border-t border-gray-200">
             <Button disabled>Save Preferences</Button> {/* Disabled for now */}
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsTab;
