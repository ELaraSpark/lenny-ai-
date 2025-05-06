
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, Plus, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Agent } from "./types/agentTypes";
import AgentDocumentation from "./documentation/AgentDocumentation";
import AgentConsultationForm from "./consultation/AgentConsultationForm";

interface AgentProfileProps {
  agent: Agent;
}

const AgentProfile = ({
  agent
}: AgentProfileProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  
  // Function to open consultation form
  const handleOpenConsultation = () => {
    setIsConsultationFormOpen(true);
  };
  
  return (
    <Card className="overflow-hidden">
      {/* Full-Width Avatar Background Header */}
      <div className="relative h-48 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={agent.imageUrl || '/placeholder.svg'}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 20%" }} /* Adjusted to show faces better */
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.svg';
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/70"></div>
        </div>
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg"
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              {agent.imageUrl ? (
                <img
                  src={agent.imageUrl}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <agent.icon className="w-12 h-12 text-primary" />
                </div>
              )}
            </motion.div>
            <motion.div 
              className="flex-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <p className="text-base text-white/90">{agent.specialty}</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <div>
              <p className="text-sm text-muted-foreground">{agent.description}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Capabilities:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {agent.capabilities.map((capability, i) => (
                  <li key={i} className="flex items-center">
                    <span className="h-1 w-1 rounded-full bg-aida-500 mr-2" />
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Personality Traits Section */}
            {agent.personality && (
              <div className="space-y-2 mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium">Personality:</p>
                <p className="text-sm text-muted-foreground">{agent.personality}</p>
              </div>
            )}
            
            {/* Communication Style Section */}
            {agent.speechPattern && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">Communication Style:</p>
                <p className="text-sm text-muted-foreground">{agent.speechPattern}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="documentation" className="mt-4">
            <AgentDocumentation 
              agent={agent} 
              onScheduleConsultation={handleOpenConsultation}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col space-y-2 pt-2 pb-6">
        <motion.button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={handleOpenConsultation}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Start Consultation
        </motion.button>
      </CardFooter>
      
      {/* Consultation Form Dialog */}
      <AgentConsultationForm
        agent={agent}
        isOpen={isConsultationFormOpen}
        onClose={() => setIsConsultationFormOpen(false)}
      />
    </Card>
  );
};

export default AgentProfile;
