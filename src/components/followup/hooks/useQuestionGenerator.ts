
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { generateFollowUpQuestions } from "@/components/agents/services/agentService";
import { ScheduleFormValues } from "../types/scheduleTypes";
import { getSpecialtyForAgent } from "../utils/mockData";

export const useQuestionGenerator = (form: UseFormReturn<ScheduleFormValues>) => {
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const { toast } = useToast();
  
  const watchCondition = form.watch("condition");
  const watchAgentId = form.watch("agentId");

  useEffect(() => {
    const condition = watchCondition;
    const agentId = watchAgentId;
    
    if (condition && condition.length > 3) {
      const specialty = getSpecialtyForAgent(agentId);
      setIsGeneratingQuestions(true);
      
      const delayDebounceFn = setTimeout(async () => {
        try {
          const questions = await generateFollowUpQuestions(condition, specialty);
          
          if (questions && questions.length > 0) {
            // Format the questions as a numbered list
            const formattedQuestions = questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
            form.setValue('questions', formattedQuestions);
            
            toast({
              title: "Questions generated",
              description: "Follow-up questions have been generated based on the condition",
            });
          }
        } catch (error) {
          console.error("Failed to generate questions:", error);
          toast({
            title: "Failed to generate questions",
            description: "An error occurred while generating questions. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsGeneratingQuestions(false);
        }
      }, 1000);
      
      return () => clearTimeout(delayDebounceFn);
    }
  }, [watchCondition, watchAgentId, form, toast]);

  return { isGeneratingQuestions };
};
