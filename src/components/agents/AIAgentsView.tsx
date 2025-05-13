
// Component: AIAgentsView
// Purpose: Provides a view to explore and interact with AI medical assistants.
// Used in: Pages that display AI agents (e.g., /agents).

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { agents } from "./data/agentsData";
import { Agent } from "./types/agentTypes";
import AgentCard from "./AgentCard";
import ChatInterface from "./ChatInterface";
import AgentConsultationForm from "./consultation/AgentConsultationForm";

const AIAgentsView = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);

  // Function to handle selecting an agent
  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setActiveTab("chat");
  };

  // Function to open consultation form
  const handleOpenConsultationForm = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsConsultationFormOpen(true);
  };

  return (
    // Apply consistent panel styling
    <div className="bg-white border border-gray-400 rounded-xl shadow-xl p-6 space-y-6"> 
      <header className="space-y-2">
        <motion.h1 
          className="text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          AI Medical Assistants
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Interactive AI specialists to assist with medical decision-making
        </motion.p>
      </header>

      <Tabs 
        defaultValue="explore" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <TabsList className="grid grid-cols-2 md:w-[500px] p-1">
            <TabsTrigger value="explore" className="text-lg py-3">Explore Agents</TabsTrigger>
            <TabsTrigger value="chat" disabled={!selectedAgent} className="text-lg py-3">
              Chat {selectedAgent && `with ${selectedAgent.name}`}
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="explore" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl overflow-hidden shadow-md border border-border ${agent.animationStyle ? `animate-${agent.animationStyle}` : ''}`}
              >
                {/* Full-Width Avatar Background Header */}
                <div className="relative h-32 overflow-hidden">
                  {/* Background Image */}
                  <div className={`absolute inset-0 ${agent.gradientColors ? `bg-gradient-to-br ${agent.gradientColors}` : 'bg-gradient-to-br from-primary/30 to-primary/10'}`}>
                    {agent.imageUrl && !agent.imageUrl.includes('placeholder') && (
                      <div className="absolute inset-0 opacity-20">
                        <img
                          src={agent.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                  
                  {/* Avatar and Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-lg">
                      <img
                        src={agent.imageUrl || '/placeholder.svg'}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{agent.name}</h3>
                      <p className="text-base text-muted-foreground">{agent.specialty}</p>
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-5 bg-card">
                  {agent.personality && (
                    <div className="mb-3 text-base text-gray-500 italic">
                      {agent.personality.split(',')[0]}
                    </div>
                  )}
                  
                  <p className="text-lg text-muted-foreground mb-5 line-clamp-2">{agent.description}</p>
                  
                  <div className="flex justify-between mt-auto">
                    <button 
                      onClick={() => handleSelectAgent(agent)}
                      className="text-lg font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Chat
                    </button>
                    <button 
                      onClick={() => handleOpenConsultationForm(agent)}
                      className="text-lg font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Consult
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-4">
          {selectedAgent && (
            <div className="relative">
              {/* Full-Width Avatar Background Header */}
              <div className="relative h-40 overflow-hidden rounded-t-xl">
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10">
                  {selectedAgent.imageUrl && !selectedAgent.imageUrl.includes('placeholder') && (
                    <div className="absolute inset-0 opacity-20">
                      <img
                        src={selectedAgent.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                
                {/* Avatar and Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
                  <motion.div 
                    className="w-20 h-20 rounded-full overflow-hidden border-4 border-background shadow-lg"
                    initial={{ scale: 0.8, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <img
                      src={selectedAgent.imageUrl || '/placeholder.svg'}
                      alt={selectedAgent.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <motion.div 
                    className="flex-1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold">{selectedAgent.name}</h2>
                    <p className="text-lg text-muted-foreground mt-1">{selectedAgent.specialty}</p>
                  </motion.div>
                </div>
              </div>
              
              {/* Chat Interface */}
              <ChatInterface selectedAgent={selectedAgent} />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Consultation Form Dialog */}
      {selectedAgent && (
        <AgentConsultationForm
          agent={selectedAgent}
          isOpen={isConsultationFormOpen}
          onClose={() => setIsConsultationFormOpen(false)}
        />
      )}
    </div>
  );
};

export default AIAgentsView;
