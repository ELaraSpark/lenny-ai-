import React, { useState, useMemo } from 'react'; // Added useMemo
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Added CardFooter
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link2, Settings2, Search, Mail, CalendarDays, Database, MessageSquare, HardDrive, CheckCircle, Slack, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Example data structure
interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  category: 'EHR' | 'Calendar' | 'Storage' | 'Communication' | 'Other';
  connected: boolean;
  icon: React.ElementType;
  logoUrl?: string; // Optional: For actual brand logos
}

// Updated example data
const exampleIntegrations: IntegrationItem[] = [
  { id: 'epic', name: 'Epic', description: 'Sync patient data, appointments, and notes.', category: 'EHR', connected: false, icon: Database },
  { id: 'cerner', name: 'Cerner', description: 'Connect to your Cerner instance.', category: 'EHR', connected: false, icon: Database },
  { id: 'gcal', name: 'Google Calendar', description: 'Sync tasks and follow-ups.', category: 'Calendar', connected: true, icon: CalendarDays },
  { id: 'outlookcal', name: 'Outlook Calendar', description: 'Connect your Outlook/Microsoft 365 calendar.', category: 'Calendar', connected: false, icon: CalendarIcon },
  { id: 'gdrive', name: 'Google Drive', description: 'Access and save documents.', category: 'Storage', connected: false, icon: HardDrive },
  { id: 'dropbox', name: 'Dropbox', description: 'Connect your Dropbox account.', category: 'Storage', connected: false, icon: HardDrive },
  { id: 'slack', name: 'Slack', description: 'Send notifications and summaries to Slack channels.', category: 'Communication', connected: false, icon: Slack },
  { id: 'msteams', name: 'Microsoft Teams', description: 'Integrate with your Teams workspace.', category: 'Communication', connected: false, icon: MessageSquare },
];

const Integrations = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter integrations based on search term
  const filteredIntegrations = useMemo(() => {
     return exampleIntegrations.filter(integration =>
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.category.toLowerCase().includes(searchTerm.toLowerCase())
     );
  }, [searchTerm]);


  // Placeholder action handlers
  const handleConnect = (integrationId: string) => { alert(`Connect integration ${integrationId}? (Not implemented)`); };
  const handleManage = (integrationId: string) => { alert(`Manage integration ${integrationId}? (Not implemented)`); };
  const handleRequestIntegration = () => { alert('Request new integration form/modal (Not implemented)'); };

  return (
    <AppLayout>
      <TooltipProvider>
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
               <h1 className="text-3xl font-bold text-gray-900">Apps and Software Integrations</h1>
               <Button variant="outline" onClick={handleRequestIntegration}>Request Integration</Button>
             </div>
             <p className="text-sm text-muted-foreground">
                Showing {filteredIntegrations.length} of {exampleIntegrations.length} available integrations.
             </p>
          </div>

           {/* Search Bar */}
          <div className="relative mb-8 max-w-lg"> {/* Increased width */}
            <Search size={20} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search integrations by name, category..."
              className="pl-11 h-11 text-base" // Increased padding and height
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Integrations Grid - No Category Grouping */}
          {filteredIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredIntegrations.map((integration) => (
                <Card key={integration.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-start gap-4 p-4">
                     {/* Icon/Logo */}
                     <div className="p-2 bg-muted rounded-md mt-1">
                        <integration.icon className="h-8 w-8 text-muted-foreground" />
                     </div>
                     {/* Name */}
                     <div className="flex-1">
                        <CardTitle className="text-base font-semibold">{integration.name}</CardTitle>
                     </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-1">
                     {/* Description */}
                     <CardDescription className="text-xs line-clamp-2">{integration.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-3 border-t bg-muted/30">
                     {/* Status/Action */}
                     {integration.connected ? (
                         <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100/80 border border-green-200 text-xs font-medium">
                            <CheckCircle size={12} className="mr-1" /> Connected
                         </Badge>
                     ) : (
                         <Button size="sm" variant="outline" onClick={() => handleConnect(integration.id)}>
                            Connect
                         </Button>
                     )}
                     {/* Optional Manage Button for connected apps */}
                     {integration.connected && (
                         <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => handleManage(integration.id)}>
                            Manage
                         </Button>
                     )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <div className="mt-10 border border-dashed border-gray-300 rounded-lg p-12 text-center">
               <Link2 size={48} className="mx-auto text-gray-400 mb-4" />
               <h3 className="text-lg font-medium text-gray-900">No Matching Integrations Found</h3>
               <p className="mt-1 text-sm text-gray-500">
                 Try adjusting your search or request a new integration.
               </p>
             </div>
          )}
        </div>
      </TooltipProvider>
    </AppLayout>
  );
};

export default Integrations;
