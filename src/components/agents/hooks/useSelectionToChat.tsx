
// Hook: useSelectionToChat
// Purpose: Provides a function to format and dispatch selected patient, symptoms, and questions to the chat input.
// Used in: useChatSelectors.

import { useState } from 'react';
import { predefinedSymptoms, predefinedQuestions } from '../utils/predefinedData';

export const useSelectionToChat = () => {
  const formatSelectionsForChat = (
    selectedPatient: any, 
    selectedSymptoms: string[], 
    selectedQuestions: string[]
  ) => {
    let message = "";
    
    // Add patient info if selected
    if (selectedPatient) {
      message += `Patient: ${selectedPatient.name}, ${selectedPatient.age}, ${selectedPatient.gender}\n\n`;
    }
    
    // Add symptoms if selected
    if (selectedSymptoms.length > 0) {
      message += "Symptoms:\n";
      selectedSymptoms.forEach(id => {
        const symptom = predefinedSymptoms.find(s => s.id === id);
        if (symptom) {
          message += `- ${symptom.label}\n`;
        }
      });
      message += "\n";
    }
    
    // Add questions if selected
    if (selectedQuestions.length > 0) {
      message += "Questions:\n";
      selectedQuestions.forEach(id => {
        const question = predefinedQuestions.find(q => q.id === id);
        if (question) {
          message += `- ${question.question}\n`;
        }
      });
    }
    
    return message.trim();
  };

  const addSelectionsToChat = (
    selectedPatient: any,
    selectedSymptoms: string[],
    selectedQuestions: string[]
  ) => {
    const message = formatSelectionsForChat(
      selectedPatient,
      selectedSymptoms,
      selectedQuestions
    );
    
    if (message) {
      const event = new CustomEvent('addToChat', { 
        detail: { message }
      });
      window.dispatchEvent(event);
      return true; // Successfully added to chat
    }
    
    return false; // Nothing to add
  };

  return {
    addSelectionsToChat
  };
};
