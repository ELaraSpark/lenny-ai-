
import { Agent, Message } from "../../types/consultationTypes";
import { createConsultation, addConsultationMessage } from "../../services/consultationService";
import { useAgentResponse } from "./useAgentResponse";

export function useConsultationActions(
  setConsultationId: (id: string) => void,
  setConsultationStarted: (started: boolean) => void,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: (loading: boolean) => void,
  messages: Message[],
  setDiagnoses: React.Dispatch<React.SetStateAction<any[]>>,
  setCurrentTurn: React.Dispatch<React.SetStateAction<string | null>>
) {
  const { processAgentResponse } = useAgentResponse();

  const startConsultation = async (selectedAgents: Agent[], patientSymptoms: string, isTurnBased: boolean = false) => {
    setIsLoading(true);
    
    try {
      // Create a new consultation in Supabase
      const consultId = await createConsultation();
      setConsultationId(consultId);

      // Add the patient's symptoms as the first message
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: "You (Doctor)",
        senderId: "doctor",
        content: patientSymptoms,
        timestamp: new Date(),
        isDoctor: true
      };

      setMessages([userMessage]);

      // Add initial message to Supabase
      await addConsultationMessage(consultId, patientSymptoms, 'doctor');

      // Add system message to explain the collaboration
      const systemMessage: Message = {
        id: Date.now().toString() + "-system",
        sender: "System",
        senderId: "system",
        content: `Starting collaborative consultation with ${selectedAgents.map(a => a.name).join(", ")}. Each specialist will analyze the case and provide their diagnosis.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);

      if (isTurnBased) {
        // In turn-based mode, only start with the first agent
        const firstAgent = selectedAgents[0];
        setCurrentTurn(firstAgent.id);
        
        await processAgentResponse(
          consultId, 
          firstAgent, 
          patientSymptoms, 
          [userMessage], 
          setMessages, 
          setDiagnoses
        );
        
        // Set turn back to doctor after first agent responds
        setCurrentTurn("doctor");
      } else {
        // In parallel mode, all agents respond at once
        await Promise.all(selectedAgents.map(async (agent, index) => {
          // Simulate some delay between agent responses
          await new Promise(resolve => setTimeout(resolve, 1000 * index));
          
          const agentMessage: Message = {
            id: Date.now().toString() + `-${agent.id}`,
            sender: agent.name,
            senderId: agent.id,
            content: `Analyzing the patient's symptoms from a ${agent.specialty} perspective...`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, agentMessage]);
          
          // Call the medical response function with the agent's specialty
          // Pass the user message since this is the first interaction
          await processAgentResponse(
            consultId, 
            agent, 
            patientSymptoms, 
            [userMessage], 
            setMessages, 
            setDiagnoses
          );
        }));
      }

      setConsultationStarted(true);
    } catch (error) {
      console.error("Error starting consultation:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (
    consultationId: string, 
    selectedAgents: Agent[], 
    newMessage: string, 
    isTurnBased: boolean = false
  ) => {
    if (!newMessage.trim() || !consultationId) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "You (Doctor)",
      senderId: "doctor",
      content: newMessage,
      timestamp: new Date(),
      isDoctor: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save to Supabase
    await addConsultationMessage(consultationId, newMessage, 'doctor');
    
    // Generate responses from specialists to the new message
    const followUpMessage = `The doctor adds: ${newMessage}`;
    
    if (isTurnBased) {
      // In turn-based mode, select the next specialist in the rotation
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) return;
      
      // Find the current turn
      let currentAgentIndex = 0;
      if (lastMessage.senderId !== "doctor" && lastMessage.senderId !== "system") {
        currentAgentIndex = selectedAgents.findIndex(a => a.id === lastMessage.senderId);
        // If found, move to the next agent in the list
        if (currentAgentIndex !== -1) {
          currentAgentIndex = (currentAgentIndex + 1) % selectedAgents.length;
        } else {
          // If not found, start from the beginning
          currentAgentIndex = 0;
        }
      }
      
      const nextAgent = selectedAgents[currentAgentIndex];
      setCurrentTurn(nextAgent.id);
      
      await processAgentResponse(
        consultationId, 
        nextAgent, 
        followUpMessage, 
        messages.concat(userMessage), 
        setMessages, 
        setDiagnoses
      );
      
      // Set turn back to doctor
      setCurrentTurn("doctor");
    } else {
      // In parallel mode, all agents respond
      await Promise.all(selectedAgents.map(async (agent, index) => {
        // Add slight delay between responses
        await new Promise(resolve => setTimeout(resolve, 800 * index));
        await processAgentResponse(
          consultationId, 
          agent, 
          followUpMessage, 
          messages.concat(userMessage), 
          setMessages, 
          setDiagnoses
        );
      }));
    }
  };

  return {
    startConsultation,
    sendMessage
  };
}
