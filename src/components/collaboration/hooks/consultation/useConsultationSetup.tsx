
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Agent } from "../../types/consultationTypes";

export function useConsultationSetup() {
  const { toast } = useToast();
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [patientSymptoms, setPatientSymptoms] = useState("");
  
  const handleAgentSelect = (agent: Agent) => {
    // Check if agent is already selected before adding
    if (!selectedAgents.some(a => a.id === agent.id)) {
      setSelectedAgents(prev => [...prev, agent]);
    } else {
      // Remove the agent if already selected
      setSelectedAgents(prev => prev.filter(a => a.id !== agent.id));
    }
  };

  const handleSymptomsChange = (symptoms: string) => {
    setPatientSymptoms(symptoms);
  };
  
  const validateConsultation = () => {
    if (selectedAgents.length === 0) {
      toast({
        title: "No specialists selected",
        description: "Please select at least one AI specialist to collaborate with",
        variant: "destructive",
      });
      return false;
    }

    if (!patientSymptoms.trim()) {
      toast({
        title: "No patient symptoms",
        description: "Please enter the patient's symptoms",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  return {
    selectedAgents,
    patientSymptoms,
    handleAgentSelect,
    handleSymptomsChange,
    validateConsultation
  };
}
