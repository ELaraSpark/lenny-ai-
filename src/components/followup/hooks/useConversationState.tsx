
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConversationMessage } from "../types/callTypes";

// This hook handles all the conversation state management logic
export const useConversationState = (activeCall: {
  patientName: string;
  agentName: string;
} | null) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(true);
  const [isTakingOver, setIsTakingOver] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [modifiedQuestion, setModifiedQuestion] = useState("");

  // Mock conversation for demo purposes
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      id: "1",
      sender: "agent",
      content: `Hello ${activeCall?.patientName || "there"}! This is ${activeCall?.agentName || "AI Assistant"} checking in for your follow-up. How have you been feeling since our last appointment?`,
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: "2",
      sender: "patient",
      content: "I've been feeling better, but I still have some concerns about the medication side effects.",
      timestamp: new Date(Date.now() - 90000)
    },
    {
      id: "3",
      sender: "agent",
      content: "I understand your concerns. Can you tell me more specifically what side effects you're experiencing?",
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: "4",
      sender: "patient",
      content: "I've been having mild headaches and sometimes feel a bit dizzy in the morning after taking the medication.",
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: "5",
      sender: "agent",
      content: "Thank you for sharing that. Those can indeed be side effects of the medication. Let me ask some follow-up questions to better understand your situation.",
      timestamp: new Date(Date.now() - 15000)
    }
  ]);

  // Format time (HH:MM)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Send doctor's message
  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'doctor',
      content: message,
      timestamp: new Date()
    };
    
    setConversation([...conversation, newMessage]);
    setMessage("");

    toast({
      title: "Message sent",
      description: isTakingOver ? 
        "Your message has been sent directly to the patient" : 
        "Your message has been forwarded to the AI agent"
    });
  };

  // Toggle listening to the call
  const toggleListening = () => {
    setIsListening(!isListening);
    
    toast({
      title: isListening ? "Audio muted" : "Audio unmuted",
      description: isListening ? 
        "You will no longer hear the conversation" : 
        "You will now hear the conversation"
    });
  };

  // Toggle doctor takeover mode
  const toggleTakeover = () => {
    setIsTakingOver(!isTakingOver);
    
    toast({
      title: isTakingOver ? "Returned control to AI" : "Taking over conversation",
      description: isTakingOver ? 
        "The AI agent is now responding to the patient" : 
        "You are now directly communicating with the patient"
    });
  };

  // Start editing a question
  const startEditQuestion = (questionId: string) => {
    const question = conversation.find(msg => msg.id === questionId);
    if (question && question.sender === 'agent') {
      setEditingQuestion(questionId);
      setModifiedQuestion(question.content);
    }
  };

  // Save edited question
  const saveEditedQuestion = () => {
    if (!editingQuestion || !modifiedQuestion.trim()) return;
    
    setConversation(conversation.map(msg => 
      msg.id === editingQuestion 
        ? { ...msg, content: modifiedQuestion, isEdited: true } 
        : msg
    ));
    
    setEditingQuestion(null);
    setModifiedQuestion("");
    
    toast({
      title: "Question modified",
      description: "The AI agent will use your modified question"
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingQuestion(null);
    setModifiedQuestion("");
  };

  return {
    message,
    setMessage,
    isListening,
    isTakingOver,
    conversation,
    editingQuestion,
    modifiedQuestion,
    setModifiedQuestion,
    sendMessage,
    toggleListening,
    toggleTakeover,
    startEditQuestion,
    saveEditedQuestion,
    cancelEditing,
    formatTime
  };
};
