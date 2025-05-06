
import React from "react";
import { predefinedQuestions } from "../utils/predefinedData";
import MultiSelectCombobox from "./MultiSelectCombobox";

interface QuestionsSelectorProps {
  selectedQuestions: string[];
  onQuestionsSelect: (questions: string[]) => void;
}

const QuestionsSelector: React.FC<QuestionsSelectorProps> = ({
  selectedQuestions,
  onQuestionsSelect,
}) => {
  return (
    <MultiSelectCombobox
      items={predefinedQuestions}
      selectedItems={selectedQuestions}
      onItemsSelect={onQuestionsSelect}
      label="Standard Questions"
      placeholder="Select questions..."
      searchPlaceholder="Search questions..."
      emptyMessage="No question found."
      groupLabel="Standard Questions"
      getDisplayText={(question) => question.question}
      getBadgeLabel={(question) => question.question}
      maxBadgeTextLength={20}
    />
  );
};

export default QuestionsSelector;
