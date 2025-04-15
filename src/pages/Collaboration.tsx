
import { useLocation } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import CollaborationView from "@/components/collaboration/CollaborationView";
import { specialists } from "@/components/collaboration/data/specialistsData";
import { Agent } from "@/components/collaboration/types/consultationTypes";
import { MessageSquare } from "lucide-react"; // Import a default icon

interface LocationState {
  consultationId?: string;
  preSelectedAgentId?: string;
  preSelectedAgentName?: string;
  preSelectedAgentSpecialty?: string;
}

const CollaborationPage = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  // Convert the passed agent info into a full agent object
  const getPreSelectedAgent = (): Agent | undefined => {
    if (!state?.preSelectedAgentId) return undefined;
    
    // Find the complete agent data from specialists
    const agent = specialists.find(s => s.id === state.preSelectedAgentId);
    
    if (agent) return agent;
    
    // If not found in specialists data, create a minimal agent object with required properties
    if (state.preSelectedAgentName && state.preSelectedAgentSpecialty) {
      return {
        id: state.preSelectedAgentId,
        name: state.preSelectedAgentName,
        specialty: state.preSelectedAgentSpecialty,
        availability: true,
        description: `${state.preSelectedAgentSpecialty} specialist`,
        icon: MessageSquare,
        color: "text-blue-500" // Default color
      };
    }
    
    return undefined;
  };

  return (
    <AppLayout>
      <CollaborationView 
        initialConsultationId={state?.consultationId} 
        preSelectedAgent={getPreSelectedAgent()}
      />
    </AppLayout>
  );
};

export default CollaborationPage;
