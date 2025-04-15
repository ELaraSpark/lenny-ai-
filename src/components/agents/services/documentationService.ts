
import { supabase } from "@/integrations/supabase/client";

export interface AgentDocument {
  id: string;
  agent_id: string;
  title: string;
  content: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export async function getAgentDocumentation(agentId: string): Promise<AgentDocument[]> {
  try {
    const { data, error } = await supabase
      .from('agent_documentation')
      .select('*')
      .eq('agent_id', agentId)
      .order('category');

    if (error) {
      console.error("Error fetching agent documentation:", error);
      return []; // Return empty array on error instead of throwing
    }

    return data as AgentDocument[] || [];
  } catch (error) {
    console.error("Failed to get agent documentation:", error);
    return [];
  }
}

export async function getDocumentById(documentId: string): Promise<AgentDocument | null> {
  try {
    const { data, error } = await supabase
      .from('agent_documentation')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) {
      console.error("Error fetching document:", error);
      return null; // Return null on error instead of throwing
    }

    return data as AgentDocument;
  } catch (error) {
    console.error("Failed to get document:", error);
    return null;
  }
}

export async function saveDocument(document: AgentDocument): Promise<AgentDocument | null> {
  try {
    let response;
    
    if (document.id) {
      // Update existing document
      response = await supabase
        .from('agent_documentation')
        .update({
          title: document.title,
          content: document.content,
          category: document.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id)
        .select('*')
        .single();
    } else {
      // Create new document
      response = await supabase
        .from('agent_documentation')
        .insert({
          agent_id: document.agent_id,
          title: document.title,
          content: document.content,
          category: document.category
        })
        .select('*')
        .single();
    }

    const { data, error } = response;

    if (error) {
      console.error("Error saving document:", error);
      return null; // Return null on error instead of throwing
    }

    return data as AgentDocument;
  } catch (error) {
    console.error("Failed to save document:", error);
    return null;
  }
}
