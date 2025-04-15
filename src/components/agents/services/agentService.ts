
import { Agent } from "../types/agentTypes";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Store chat history for each agent interaction
const agentChatHistory: Record<string, Message[]> = {};

export const generateAIResponse = async (prompt: string, agent: Agent): Promise<string> => {
  try {
    // Get existing chat history or initialize new
    const agentId = agent.id;
    if (!agentChatHistory[agentId]) {
      agentChatHistory[agentId] = [];
    }
    
    // Add user message to history
    agentChatHistory[agentId].push({ role: 'user', content: prompt });
    
    // Convert chat history to message format expected by the edge function
    const previousMessages = agentChatHistory[agentId].map((msg, index) => ({
      id: `msg-${index}`,
      sender: msg.role === 'user' ? 'You (Doctor)' : agent.name,
      senderId: msg.role === 'user' ? 'doctor' : agent.id,
      content: msg.content,
      timestamp: new Date(),
      isDoctor: msg.role === 'user'
    }));
    
    const { data, error } = await supabase.functions.invoke('generate-medical-response', {
      body: {
        prompt,
        agentName: agent.name,
        specialty: agent.specialty,
        modelProvider: "gemini",
        modelName: "gemini-2.0-flash",
        previousMessages: previousMessages
      }
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`Supabase function error: ${error.message}`);
    }
    
    // Add assistant response to history
    agentChatHistory[agentId].push({ role: 'assistant', content: data.response });
    
    // Limit history to last 10 messages to prevent context overflow
    if (agentChatHistory[agentId].length > 20) {
      agentChatHistory[agentId] = agentChatHistory[agentId].slice(-20);
    }
    
    return data.response;
  } catch (error) {
    console.error("Error calling AI edge function:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again later.";
  }
};

export const generateFollowUpQuestions = async (condition: string, specialty?: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-followup-questions', {
      body: {
        condition,
        specialty,
        modelProvider: "gemini",
        modelName: "gemini-2.0-flash"
      }
    });
    
    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`Supabase function error: ${error.message}`);
    }
    
    return data.questions;
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return [
      `How have your ${condition} symptoms changed since your last visit?`,
      "Have you been following the prescribed treatment plan?",
      "Have you experienced any new symptoms or side effects?"
    ];
  }
};
