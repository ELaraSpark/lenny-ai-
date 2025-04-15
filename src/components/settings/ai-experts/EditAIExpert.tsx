
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { agents } from "@/components/agents/data/agentsData";
import { Agent } from "@/components/agents/types/agentTypes";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getAgentDocumentation, 
  AgentDocument
} from "@/components/agents/services/documentationService";
import { ArrowLeft } from "lucide-react";

// Import tab components
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import CapabilitiesTab from "./tabs/CapabilitiesTab";
import DocumentationTab from "./tabs/DocumentationTab";

const expertFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialty: z.string().min(1, "Specialty is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  color: z.string().min(1, "Color is required"),
  capabilities: z.array(z.string()).min(1, "At least one capability is required")
});

type ExpertFormValues = z.infer<typeof expertFormSchema>;

const EditAIExpert = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("general");
  const [documentation, setDocumentation] = useState<AgentDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Find the agent
  const agent = agents.find(a => a.id === id);

  useEffect(() => {
    if (id) {
      // Fetch agent documentation
      const fetchDocumentation = async () => {
        try {
          const docs = await getAgentDocumentation(id);
          setDocumentation(docs);
        } catch (error) {
          console.error("Failed to fetch documentation:", error);
          toast({
            title: "Error",
            description: "Failed to fetch agent documentation.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };

      fetchDocumentation();
    }
  }, [id, toast]);

  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(expertFormSchema),
    defaultValues: agent ? {
      name: agent.name,
      specialty: agent.specialty,
      description: agent.description,
      color: agent.color,
      capabilities: agent.capabilities
    } : {
      name: "",
      specialty: "",
      description: "",
      color: "aida-500",
      capabilities: []
    }
  });

  if (!agent && id !== "new") {
    navigate("/settings/ai-experts");
    return null;
  }

  const handleSaveExpert = (values: ExpertFormValues) => {
    console.log("Saving expert:", values);
    
    // Here you would update your agent data
    toast({
      title: "Expert Saved",
      description: "The AI expert has been updated successfully.",
    });
    
    // Navigate back to the experts settings
    navigate("/settings/ai-experts");
  };

  const handleDocumentSaved = (document: AgentDocument) => {
    // Update the documentation list
    setDocumentation(prevDocs => {
      const index = prevDocs.findIndex(doc => doc.id === document.id);
      if (index >= 0) {
        // Update existing document
        const newDocs = [...prevDocs];
        newDocs[index] = document;
        return newDocs;
      } else {
        // Add new document
        return [...prevDocs, document];
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/settings/ai-experts")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {id === "new" ? "Create New Expert" : `Edit ${agent?.name}`}
        </h2>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <GeneralInfoTab form={form} />
        </TabsContent>
        
        <TabsContent value="capabilities" className="space-y-4 mt-4">
          <CapabilitiesTab form={form} />
        </TabsContent>
        
        <TabsContent value="documentation" className="mt-4">
          <DocumentationTab 
            isLoading={loading}
            documentation={documentation}
            agentId={id}
            onDocumentSaved={handleDocumentSaved}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate("/settings/ai-experts")}>
          Cancel
        </Button>
        <Button onClick={form.handleSubmit(handleSaveExpert)}>
          Save Expert
        </Button>
      </div>
    </div>
  );
};

export default EditAIExpert;
