
import { supabase } from '@/integrations/supabase/client';

interface FunctionOptions {
  body: any;
  functionName: string;
}

/**
 * A generic API client for invoking Supabase Edge Functions
 */
export const apiClient = {
  /**
   * Invoke a Supabase Edge Function
   */
  invoke: async <T>({ functionName, body }: FunctionOptions): Promise<T> => {
    console.log(`Invoking Edge Function: ${functionName}`, body);
    
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body
      });

      if (error) {
        console.error(`Error invoking ${functionName}:`, error);
        throw error;
      }

      return data as T;
    } catch (error) {
      console.error(`Error in apiClient.invoke (${functionName}):`, error);
      throw error;
    }
  },
  
  /**
   * Generate a medical response from an AI agent
   */
  generateMedicalResponse: async (params: any) => {
    return apiClient.invoke({
      functionName: 'generate-medical-response',
      body: params
    });
  },
  
  /**
   * Generate follow-up questions based on a medical condition
   */
  generateFollowupQuestions: async (condition: string, specialty: string) => {
    return apiClient.invoke<string[]>({
      functionName: 'generate-followup-questions',
      body: { condition, specialty }
    });
  },
  
  /**
   * Generate a consultation verdict based on multiple specialist opinions
   */
  generateConsultationVerdict: async (params: any) => {
    return apiClient.invoke({
      functionName: 'generate-consultation-verdict',
      body: params
    });
  }
};
