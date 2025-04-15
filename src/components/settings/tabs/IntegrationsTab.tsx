import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react'; // Import Zap icon

const IntegrationsTab = () => {
  // Placeholder data for integrations
  const integrations = [
    { id: 'ehr', name: 'EHR System', description: 'Connect to your Electronic Health Record system.', connected: false },
    { id: 'calendar', name: 'Calendar', description: 'Sync appointments with your calendar.', connected: true },
    { id: 'billing', name: 'Billing Software', description: 'Integrate with your billing provider.', connected: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect Leny.ai with your other tools and services.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
               <Zap className="h-5 w-5 text-gray-500" /> 
               <div>
                 <p className="font-medium">{integration.name}</p>
                 <p className="text-sm text-muted-foreground">{integration.description}</p>
               </div>
            </div>
            <Button variant={integration.connected ? "secondary" : "default"}>
              {integration.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        ))}
         <p className="text-sm text-muted-foreground pt-4">
            More integrations coming soon.
         </p>
      </CardContent>
    </Card>
  );
};

export default IntegrationsTab;
