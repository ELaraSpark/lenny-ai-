
// Service: agentService
// Purpose: Handles core AI agent interactions, including generating responses and managing chat history (mocked).
// Used in: useChatMessages.

import { Agent } from "../types/agentTypes";
import { supabase } from "@/integrations/supabase/client";
import { createMessageWithAttachments } from "@/integrations/deepseek/client";
import { processFiles, validateFile } from "@/services/documentProcessor";
import { generateMockResponse } from "@/mock/mockAIResponse";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Store chat history for each agent interaction
const agentChatHistory: Record<string, Message[]> = {};

// AI provider options
export type AIProvider = 'gemini' | 'deepseek';

// Default AI provider
export const DEFAULT_PROVIDER: AIProvider = 'gemini';

export const generateAIResponse = async (
  prompt: string, 
  agent: Agent, 
  attachments?: File[],
  provider: AIProvider = DEFAULT_PROVIDER
): Promise<string> => {
  try {
    console.log(`Generating AI response using ${provider} provider`);
    
    // Get existing chat history or initialize new
    const agentId = agent.id;
    if (!agentChatHistory[agentId]) {
      agentChatHistory[agentId] = [];
    }
    
    // Add user message to history
    agentChatHistory[agentId].push({ role: 'user', content: prompt });
    
    // Use mock implementation instead of calling Supabase edge functions
    const response = generateMockResponse(prompt, provider);
    
    // Add assistant response to history
    agentChatHistory[agentId].push({ role: 'assistant', content: response });
    
    // Limit history to last 20 messages to prevent context overflow
    if (agentChatHistory[agentId].length > 20) {
      agentChatHistory[agentId] = agentChatHistory[agentId].slice(-20);
    }
    
    return response;
  } catch (error) {
    console.error("Error generating AI response:", error);
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
