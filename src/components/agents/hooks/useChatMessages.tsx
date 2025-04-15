
import { useState } from "react";
import { Message, Agent } from "../types/agentTypes";
import { generateAIResponse } from "../services/agentService";
import { useToast } from "@/hooks/use-toast";

export const useChatMessages = (selectedAgent: Agent) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello, I'm ${selectedAgent.name}, your AI assistant specializing in ${selectedAgent.specialty}. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (chatInput: string) => {
    if (!chatInput.trim() || !selectedAgent) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Call the Gemini API through our edge function
      const response = await generateAIResponse(chatInput, selectedAgent);
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again or check if the API connection is working correctly.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "API Error",
        description: "Failed to generate AI response. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Hello, I'm ${selectedAgent.name}, your AI assistant specializing in ${selectedAgent.specialty}. How can I help you today?`,
        timestamp: new Date()
      }
    ]);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
};
