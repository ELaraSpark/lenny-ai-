
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConsultationSetup from "./components/ConsultationSetup";
import ConsultationChat from "./components/ConsultationChat";
import DiagnosisVerdict from "./components/DiagnosisVerdict";
import { useConsultation } from "./hooks/useConsultation";
import { Agent } from "./types/consultationTypes";

interface CollaborativeConsultationProps {
  initialConsultationId?: string;
  preSelectedAgent?: Agent;
}

const CollaborativeConsultation = ({ 
  initialConsultationId, 
  preSelectedAgent 
}: CollaborativeConsultationProps = {}) => {
  const {
    selectedAgents,
    patientSymptoms,
    consultationStarted,
    messages,
    isLoading,
    diagnoses,
    activeTab,
    isTurnBasedMode,
    currentTurn,
    isRefreshingVerdict,
    handleAgentSelect,
    handleSymptomsChange,
    startConsultation,
    sendMessage,
    setActiveTab,
    toggleTurnBasedMode,
    refreshVerdict,
    setConsultationId,
    setConsultationStarted
  } = useConsultation();

  // Handle initialConsultationId and preSelectedAgent if provided
  // Add proper dependency array to prevent infinite renders
  useEffect(() => {
    if (initialConsultationId && !consultationStarted) {
      setConsultationId(initialConsultationId);
      setConsultationStarted(true);
    }
    
    if (preSelectedAgent && selectedAgents.length === 0) {
      handleAgentSelect(preSelectedAgent);
    }
  }, [
    initialConsultationId, 
    preSelectedAgent, 
    setConsultationId, 
    setConsultationStarted, 
    handleAgentSelect, 
    consultationStarted,
    selectedAgents.length
  ]);

  return (
    <div className="space-y-6">
      {!consultationStarted ? (
        <ConsultationSetup
          selectedAgents={selectedAgents}
          patientSymptoms={patientSymptoms}
          isLoading={isLoading}
          onAgentSelect={handleAgentSelect}
          onSymptomsChange={handleSymptomsChange}
          onStartConsultation={startConsultation}
          isTurnBasedMode={isTurnBasedMode}
          onToggleTurnBasedMode={toggleTurnBasedMode}
        />
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="verdict">Verdict</TabsTrigger>
            </TabsList>
            
            <TabsContent value="conversation" className="space-y-4 mt-4">
              <ConsultationChat
                messages={messages}
                agents={selectedAgents}
                onSendMessage={sendMessage}
                currentTurn={currentTurn}
                isTurnBasedMode={isTurnBasedMode}
                onToggleTurnBasedMode={toggleTurnBasedMode}
                isProcessing={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="verdict" className="space-y-4 mt-4">
              <DiagnosisVerdict 
                diagnoses={diagnoses} 
                messages={messages}
                patientSymptoms={patientSymptoms}
                refreshVerdict={refreshVerdict}
                isRefreshing={isRefreshingVerdict}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
};

export default CollaborativeConsultation;
