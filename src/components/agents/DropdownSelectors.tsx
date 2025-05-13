
// Component: DropdownSelectors
// Purpose: Provides dropdowns for selecting patient, symptoms, and questions for a consultation.
// Used in: ChatInterface.

import React from "react";
import PatientSelector from "./selectors/PatientSelector";
import SymptomsSelector from "./selectors/SymptomsSelector";
import QuestionsSelector from "./selectors/QuestionsSelector";
import AddToChatButton from "./selectors/AddToChatButton";
import { useChatSelectors } from "./hooks/useChatSelectors";

interface DropdownSelectorsProps {
  onPatientSelect: (patient: any) => void;
  onSymptomsSelect: (symptoms: string[]) => void;
  onQuestionsSelect: (questions: string[]) => void;
}

const DropdownSelectors: React.FC<DropdownSelectorsProps> = ({
  onPatientSelect,
  onSymptomsSelect,
  onQuestionsSelect,
}) => {
  const {
    selectedPatient,
    setSelectedPatient,
    selectedSymptoms,
    setSelectedSymptoms,
    selectedQuestions,
    setSelectedQuestions,
    handleAddToChat
  } = useChatSelectors();

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    onPatientSelect(patient);
  };

  const handleSymptomsSelect = (symptoms: string[]) => {
    setSelectedSymptoms(symptoms);
    onSymptomsSelect(symptoms);
  };

  const handleQuestionsSelect = (questions: string[]) => {
    setSelectedQuestions(questions);
    onQuestionsSelect(questions);
  };

  return (
    <div className="space-y-4 mb-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
      <h3 className="text-lg font-medium">Consultation Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PatientSelector
          selectedPatient={selectedPatient}
          onPatientSelect={handlePatientSelect}
        />

        <SymptomsSelector
          selectedSymptoms={selectedSymptoms}
          onSymptomsSelect={handleSymptomsSelect}
        />

        <QuestionsSelector
          selectedQuestions={selectedQuestions}
          onQuestionsSelect={handleQuestionsSelect}
        />
      </div>
      
      <AddToChatButton
        selectedPatient={selectedPatient}
        selectedSymptoms={selectedSymptoms}
        selectedQuestions={selectedQuestions}
        onAddToChat={handleAddToChat}
      />
    </div>
  );
};

export default DropdownSelectors;
