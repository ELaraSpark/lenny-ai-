
import { Agent, Diagnosis, Message } from "../../types/consultationTypes";
import { addConsultationMessage, generateAgentResponse } from "../../services/consultationService";

export function useAgentResponse() {
  const processAgentResponse = async (
    consultId: string, 
    agent: Agent, 
    symptoms: string, 
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setDiagnoses: React.Dispatch<React.SetStateAction<Diagnosis[]>>
  ) => {
    try {
      // Gather all previous messages as context
      const relevantMessages = messages.length > 0 ? messages : [];
      
      // Call the Supabase edge function to generate a response
      const { diagnosis, recommendation, confidence } = await generateAgentResponse(
        consultId, 
        agent, 
        symptoms,
        relevantMessages
      );
      
      // Format the diagnosis message properly - removing markdown asterisks and formatting
      let formattedDiagnosis = diagnosis;
      if (diagnosis.includes('**')) {
        formattedDiagnosis = diagnosis.replace(/\*\*/g, '');
      }
      
      // Create a nicely formatted response message
      const agentResponse: Message = {
        id: Date.now().toString() + `-${agent.id}-response`,
        sender: agent.name,
        senderId: agent.id,
        content: `Based on the symptoms described, I believe the patient may be suffering from ${formattedDiagnosis}. ${recommendation} (Confidence: ${confidence}%)`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentResponse]);
      
      // Store the diagnosis
      setDiagnoses(prev => [...prev, {
        agentId: agent.id,
        agentName: agent.name,
        specialty: agent.specialty,
        diagnosis: formattedDiagnosis,
        confidence,
        recommendation
      }]);

      // Save to Supabase
      await addConsultationMessage(consultId, agentResponse.content, 'assistant');

    } catch (error) {
      console.error(`Error getting response from ${agent.name}:`, error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString() + `-${agent.id}-error`,
        sender: agent.name,
        senderId: agent.id,
        content: "I apologize, but I was unable to process this case at the moment. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return {
    processAgentResponse
  };
}
