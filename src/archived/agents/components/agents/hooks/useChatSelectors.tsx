
import { useState } from "react";
import { useSelectionToChat } from "./useSelectionToChat";

export const useChatSelectors = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const { addSelectionsToChat } = useSelectionToChat();

  const clearSelections = () => {
    setSelectedPatient(null);
    setSelectedSymptoms([]);
    setSelectedQuestions([]);
  };

  const handleAddToChat = () => {
    const success = addSelectionsToChat(
      selectedPatient,
      selectedSymptoms,
      selectedQuestions
    );
    
    if (success) {
      // Clear selections after adding to chat
      clearSelections();
    }
  };

  return {
    selectedPatient,
    setSelectedPatient,
    selectedSymptoms,
    setSelectedSymptoms,
    selectedQuestions,
    setSelectedQuestions,
    clearSelections,
    handleAddToChat
  };
};
