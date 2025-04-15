
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type TwoFactorCardProps = {
  onTwoFactorChange: (log: { message: string, level: string }) => void;
};

export const TwoFactorCard = ({ onTwoFactorChange }: TwoFactorCardProps) => {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    
    toast({
      title: !twoFactorEnabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
      description: !twoFactorEnabled ? "Your account is now more secure." : "Two-factor authentication has been turned off."
    });
    
    onTwoFactorChange({
      message: !twoFactorEnabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
      level: "info"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account by requiring more than just a password to sign in.
            </p>
          </div>
          <Switch 
            checked={twoFactorEnabled}
            onCheckedChange={handleToggleTwoFactor}
          />
        </div>
      </CardContent>
    </Card>
  );
};
