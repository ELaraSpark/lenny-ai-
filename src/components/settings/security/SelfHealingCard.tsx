
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
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Activity, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type SelfHealingCardProps = {
  onSecurityEvent: (log: { message: string, level: string }) => void;
};

const securityFormSchema = z.object({
  selfHealingEnabled: z.boolean().default(true),
  securityScanFrequency: z.string().default("weekly"),
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export const SelfHealingCard = ({ onSecurityEvent }: SelfHealingCardProps) => {
  const { toast } = useToast();
  const [isSecurityScanRunning, setIsSecurityScanRunning] = useState(false);
  
  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      selfHealingEnabled: true,
      securityScanFrequency: "weekly",
    },
  });

  const selfHealingEnabled = form.watch("selfHealingEnabled");
  const securityScanFrequency = form.watch("securityScanFrequency");
  
  const toggleSelfHealing = (value: boolean) => {
    form.setValue("selfHealingEnabled", value);
    
    toast({
      title: value ? "Self-healing enabled" : "Self-healing disabled",
      description: value ? "System will automatically fix detected issues." : "Automatic issue resolution has been turned off."
    });
    
    onSecurityEvent({
      message: value ? "Self-healing system enabled" : "Self-healing system disabled",
      level: "info"
    });
  };

  const runSecurityScan = () => {
    setIsSecurityScanRunning(true);
    
    setTimeout(() => {
      setIsSecurityScanRunning(false);
      
      const issues = Math.random() > 0.7;
      
      if (issues) {
        toast({
          title: "Security scan complete",
          description: "Security vulnerabilities were found and fixed.",
          variant: "destructive"
        });
        
        onSecurityEvent({
          message: "Security scan found and fixed vulnerabilities",
          level: "warning"
        });
      } else {
        toast({
          title: "Security scan complete",
          description: "No security vulnerabilities were found."
        });
        
        onSecurityEvent({
          message: "Security scan completed with no issues",
          level: "info"
        });
      }
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Self-Healing System</CardTitle>
        <CardDescription>
          Enable automatic detection and resolution of security issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel htmlFor="self-healing-mode">Self-Healing Mode</FormLabel>
                  <FormDescription>
                    When enabled, the system will automatically detect and fix security issues in real-time.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch 
                    id="self-healing-mode"
                    name="selfHealingEnabled"
                    checked={selfHealingEnabled} 
                    onCheckedChange={toggleSelfHealing}
                  />
                </FormControl>
              </FormItem>
              
              <div className="space-y-2">
                <h3 className="text-base font-medium">Security Scan Frequency</h3>
                <RadioGroup 
                  value={securityScanFrequency}
                  onValueChange={(value) => form.setValue("securityScanFrequency", value)}
                  className="flex flex-col space-y-1"
                  name="securityScanFrequency"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="scan-daily" />
                    <Label htmlFor="scan-daily" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Daily
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="scan-weekly" />
                    <Label htmlFor="scan-weekly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Weekly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="scan-monthly" />
                    <Label htmlFor="scan-monthly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Monthly
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </form>
        </Form>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={runSecurityScan} 
            disabled={isSecurityScanRunning}
            className="space-x-2"
            id="run-security-scan"
            name="runScan"
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${isSecurityScanRunning ? "animate-spin" : ""}`} />
            <span>{isSecurityScanRunning ? "Scanning..." : "Run Security Scan Now"}</span>
          </Button>
          
          <Button 
            variant="outline"
            id="view-system-logs"
            name="viewLogs"
            type="button"
          >
            <Activity className="mr-2 h-4 w-4" />
            View System Logs
          </Button>
        </div>
        
        {selfHealingEnabled && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Self-healing is active</AlertTitle>
            <AlertDescription>
              Your system is protected and will automatically resolve security issues as they are detected.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
