import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { agents } from "@/components/agents/data/agentsData";
import { Button } from "@/components/ui/button";
import { Agent } from "@/components/agents/types/agentTypes";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentDocument } from "@/components/agents/services/documentationService";
const AIExpertsSettings = () => {
  const [activeTab, setActiveTab] = useState<string>("experts");
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleEditAgent = (agentId: string) => {
    navigate(`/settings/ai-experts/edit/${agentId}`);
  };
  const handleViewDocumentation = (agentId: string) => {
    navigate(`/agents?agent=${agentId}&tab=documentation`);
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">AI Experts Settings</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Expert
        </Button>
      </div>

      <Tabs defaultValue="experts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="global-settings">Global Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="experts" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            {agents.map(agent => <AgentSettingsCard key={agent.id} agent={agent} onEdit={() => handleEditAgent(agent.id)} onViewDocumentation={() => handleViewDocumentation(agent.id)} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="global-settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Global AI Expert Settings</CardTitle>
              <CardDescription>Configure settings that apply to all AI experts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">API Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure the API settings for the AI experts
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Response Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure the response settings for the AI experts
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure security settings for the AI experts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
interface AgentSettingsCardProps {
  agent: Agent;
  onEdit: () => void;
  onViewDocumentation: () => void;
}
const AgentSettingsCard = ({
  agent,
  onEdit,
  onViewDocumentation
}: AgentSettingsCardProps) => {
  return <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${agent.color}/10`}>
              <agent.icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>{agent.name}</CardTitle>
              <CardDescription>{agent.specialty}</CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{agent.description}</p>
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Capabilities:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {agent.capabilities.map((capability, i) => <li key={i} className="flex items-center">
                <span className="h-1 w-1 rounded-full bg-aida-500 mr-2" />
                {capability}
              </li>)}
          </ul>
        </div>
      </CardContent>
    </Card>;
};
export default AIExpertsSettings;