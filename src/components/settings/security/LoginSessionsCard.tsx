
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type LoginSessionsCardProps = {
  onSessionEvent: (log: { message: string, level: string }) => void;
};

export const LoginSessionsCard = ({ onSessionEvent }: LoginSessionsCardProps) => {
  const { toast } = useToast();
  
  const handleLogoutDevice = (deviceName: string) => {
    toast({
      title: "Device logged out",
      description: `${deviceName} has been logged out.`
    });
    
    onSessionEvent({
      message: `Device logged out: ${deviceName}`,
      level: "info"
    });
  };
  
  const handleLogoutAllDevices = () => {
    toast({
      title: "All devices logged out",
      description: "You have been logged out from all devices except this one."
    });
    
    onSessionEvent({
      message: "Logged out from all devices",
      level: "warning"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Sessions</CardTitle>
        <CardDescription>
          Manage your active login sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">MacBook Pro - San Francisco</h4>
              </div>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
            <Button variant="ghost" size="sm">This device</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">iPhone 13 - San Francisco</h4>
              </div>
              <p className="text-xs text-muted-foreground">Last active 2 hours ago</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleLogoutDevice("iPhone 13")}
            >
              Log out
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Chrome - Windows PC</h4>
              </div>
              <p className="text-xs text-muted-foreground">Last active 5 days ago</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleLogoutDevice("Chrome - Windows PC")}
            >
              Log out
            </Button>
          </div>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Log Out All Sessions</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will log you out from all devices except this one. You'll need to sign in again on those devices.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogoutAllDevices}>
                Log Out All Devices
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
