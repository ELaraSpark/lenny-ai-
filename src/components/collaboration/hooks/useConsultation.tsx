
import { useToast } from "@/hooks/use-toast";
import { useConsultationSetup } from "./consultation/useConsultationSetup";
import { useConsultationState } from "./consultation/useConsultationState";
import { useConsultationActions } from "./consultation/useConsultationActions";
import { generateConsultationVerdict } from "../services/consultationService";

export function useConsultation() {
  const { toast } = useToast();
  
  // Get consultation setup state and functions
  const {
    selectedAgents,
    patientSymptoms,
    handleAgentSelect,
    handleSymptomsChange,
    validateConsultation
  } = useConsultationSetup();

  // Get consultation state
  const {
    consultationStarted,
    setConsultationStarted,
    consultationId,
    setConsultationId,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    diagnoses,
    setDiagnoses,
    activeTab,
    setActiveTab,
    isTurnBasedMode,
    setIsTurnBasedMode,
    currentTurn,
    setCurrentTurn,
    aiVerdict,
    setAiVerdict,
    isRefreshingVerdict,
    setIsRefreshingVerdict
  } = useConsultationState();

  // Get consultation actions
  const { startConsultation, sendMessage } = useConsultationActions(
    setConsultationId,
    setConsultationStarted,
    setMessages,
    setIsLoading,
    messages,
    setDiagnoses,
    setCurrentTurn
  );

  // Toggle turn-based mode
  const handleToggleTurnBasedMode = (enabled: boolean) => {
    setIsTurnBasedMode(enabled);
    
    // If switching to turn-based mode in an ongoing consultation, set the current turn to doctor
    if (enabled && consultationStarted) {
      setCurrentTurn("doctor");
    } else if (!enabled) {
      setCurrentTurn(null);
    }
  };

  // Wrapper function for starting a consultation
  const handleStartConsultation = async () => {
    if (!validateConsultation()) return;
    
    try {
      await startConsultation(selectedAgents, patientSymptoms, isTurnBasedMode);
    } catch (error) {
      console.error("Error starting consultation:", error);
      toast({
        title: "Failed to start consultation",
        description: "There was an error starting the consultation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Wrapper function for sending a message
  const handleSendMessage = async (newMessage: string, turnBased: boolean = isTurnBasedMode) => {
    if (!consultationId) return;
    await sendMessage(consultationId, selectedAgents, newMessage, turnBased);
  };
  
  // Function to refresh the verdict manually
  const refreshVerdict = async () => {
    if (!consultationId || diagnoses.length === 0) return;
    
    setIsRefreshingVerdict(true);
    
    try {
      const verdict = await generateConsultationVerdict(
        consultationId, 
        diagnoses, 
        messages, 
        patientSymptoms
      );
      
      setAiVerdict(verdict);
      toast({
        title: "Verdict Updated",
        description: "The collaborative verdict has been refreshed with the latest data.",
      });
    } catch (error) {
      console.error("Error refreshing verdict:", error);
      toast({
        title: "Failed to refresh verdict",
        description: "There was an error updating the consultation verdict. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingVerdict(false);
    }
  };

  return {
    selectedAgents,
    patientSymptoms,
    consultationStarted,
    consultationId,
    messages,
    isLoading,
    diagnoses,
    activeTab,
    isTurnBasedMode,
    currentTurn,
    aiVerdict,
    isRefreshingVerdict,
    handleAgentSelect,
    handleSymptomsChange,
    startConsultation: handleStartConsultation,
    sendMessage: handleSendMessage,
    setActiveTab,
    toggleTurnBasedMode: handleToggleTurnBasedMode,
    refreshVerdict,
    // Export these state setters for external use
    setConsultationId,
    setConsultationStarted
  };
}
