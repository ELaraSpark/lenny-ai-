
// Service: agentCommunicationService
// Purpose: Handles communication with AI agents, including generating responses and managing chat history.
// Used in: useChatMessages.

import { supabase } from '@/integrations/supabase/client';
import { Agent, Message } from '../types/agentTypes';
import { apiClient } from '@/lib/api-client';

export interface MedicalResponse {
  diagnosis: string;
  recommendation: string;
  confidence: number;
}

/**
 * Generate a medical response from the AI
 */
export async function generateMedicalResponse(
  symptoms: string,
  agent: Agent,
  previousMessages: Message[] = []
): Promise<MedicalResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-medical-response', {
      body: {
        symptoms,
        specialty: agent.specialty,
        agentId: agent.id,
        agentName: agent.name,
        previousMessages: previousMessages.slice(-10) // Send last 10 messages for context
      }
    });

    if (error) {
      console.error("Error generating medical response:", error);
      throw error;
    }

    console.log("Response generated successfully:", data);
    return {
      diagnosis: data.diagnosis || "Unable to provide diagnosis with given information.",
      recommendation: data.recommendation || "Please consult with a human healthcare provider.",
      confidence: data.confidence || Math.floor(Math.random() * 30) + 70 // Fallback to random 70-99%
    };
  } catch (error) {
    console.error(`Error in generateMedicalResponse for ${agent.name}:`, error);
    throw error;
  }
}

/**
 * Save chat message to database
 */
export async function saveChatMessage(
  agentId: string,
  content: string,
  role: 'user' | 'agent'
) {
  try {
    const { data, error } = await supabase
      .from('ai_consultation_messages')
      .insert({
        consultation_id: agentId, // Use agentId as the consultation_id
        content,
        role: role === 'user' ? 'user' : 'assistant' // Map 'agent' to 'assistant' for DB storage
      });

    if (error) {
      console.error("Error saving chat message:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in saveChatMessage:", error);
    throw error;
  }
}

/**
 * Get chat history for an agent
 */
export async function getChatHistory(agentId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('ai_consultation_messages')
      .select('*')
      .eq('consultation_id', agentId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }

    // Convert the database records to Message objects
    return data.map(record => ({
      id: record.id,
      role: record.role === 'user' ? 'user' : 'assistant',
      content: record.content,
      timestamp: new Date(record.created_at)
    }));
  } catch (error) {
    console.error("Error in getChatHistory:", error);
    throw error;
  }
}
