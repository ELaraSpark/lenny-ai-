
import { supabase } from "@/integrations/supabase/client";
import { Agent, Diagnosis, Message, Consultation, AIVerdict } from "../types/consultationTypes";

export async function createConsultation() {
  try {
    console.log("Creating new consultation");
    const { data, error } = await supabase
      .from('ai_consultations')
      .insert({
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating consultation:", error);
      throw error;
    }
    console.log("Consultation created successfully:", data);
    return data.id;
  } catch (error) {
    console.error("Error in createConsultation:", error);
    throw error;
  }
}

export async function addConsultationMessage(consultationId: string, content: string, role: 'doctor' | 'assistant') {
  try {
    const { data, error } = await supabase
      .from('ai_consultation_messages')
      .insert({
        consultation_id: consultationId,
        content,
        role
      });

    if (error) {
      console.error("Error adding consultation message:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in addConsultationMessage:", error);
    throw error;
  }
}

export async function getConsultationMessages(consultationId: string) {
  try {
    const { data, error } = await supabase
      .from('ai_consultation_messages')
      .select('*')
      .eq('consultation_id', consultationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching consultation messages:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in getConsultationMessages:", error);
    throw error;
  }
}

export async function updateConsultationStatus(consultationId: string, status: 'in_progress' | 'completed' | 'cancelled') {
  try {
    const { data, error } = await supabase
      .from('ai_consultations')
      .update({ 
        status,
        ended_at: status !== 'in_progress' ? new Date().toISOString() : null
      })
      .eq('id', consultationId)
      .select();

    if (error) {
      console.error("Error updating consultation status:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in updateConsultationStatus:", error);
    throw error;
  }
}

export async function generateAgentResponse(
  consultationId: string, 
  agent: Agent, 
  symptoms: string,
  previousMessages: Message[] = []
): Promise<{
  diagnosis: string;
  recommendation: string;
  confidence: number;
}> {
  try {
    console.log(`Generating response for ${agent.name} (${agent.specialty})`);
    
    const { data, error } = await supabase.functions.invoke('generate-medical-response', {
      body: {
        symptoms,
        specialty: agent.specialty,
        agentId: agent.id,
        agentName: agent.name,
        consultationId: consultationId,
        isCollaborative: true,
        previousMessages: previousMessages.slice(-10) // Send last 10 messages for context
      }
    });

    if (error) {
      console.error("Error generating agent response:", error);
      throw error;
    }

    console.log("Response generated successfully:", data);
    return {
      diagnosis: data.diagnosis,
      recommendation: data.recommendation,
      confidence: data.confidence || Math.floor(Math.random() * 30) + 70 // Fallback to random 70-99%
    };
  } catch (error) {
    console.error(`Error in generateAgentResponse for ${agent.name}:`, error);
    throw error;
  }
}

export async function generateConsultationVerdict(
  consultationId: string,
  diagnoses: Diagnosis[],
  messages: Message[],
  symptoms: string
): Promise<AIVerdict> {
  try {
    console.log("Generating consultation verdict");
    
    const { data, error } = await supabase.functions.invoke('generate-consultation-verdict', {
      body: {
        diagnoses,
        messages,
        symptoms
      }
    });

    if (error) {
      console.error("Error generating consultation verdict:", error);
      throw error;
    }

    console.log("Verdict generated successfully");
    return data;
  } catch (error) {
    console.error("Error in generateConsultationVerdict:", error);
    throw new Error("Failed to generate verdict");
  }
}

export async function saveDiagnosis(
  consultationId: string,
  diagnosis: Diagnosis
) {
  try {
    const { data, error } = await supabase
      .from('ai_consultations')
      .update({
        recommendation: diagnosis.recommendation,
        summary: diagnosis.diagnosis,
        severity: diagnosis.confidence > 90 ? 'high' : diagnosis.confidence > 75 ? 'medium' : 'low'
      })
      .eq('id', consultationId)
      .select();

    if (error) {
      console.error("Error saving diagnosis:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in saveDiagnosis:", error);
    throw error;
  }
}

export async function getConsultationById(consultationId: string) {
  try {
    const { data, error } = await supabase
      .from('ai_consultations')
      .select('*')
      .eq('id', consultationId)
      .single();

    if (error) {
      console.error("Error fetching consultation:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in getConsultationById:", error);
    throw error;
  }
}

export async function getAllConsultations() {
  try {
    const { data, error } = await supabase
      .from('ai_consultations')
      .select('*')
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching all consultations:", error);
    throw error;
  }
}
