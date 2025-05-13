
// Component: SymptomsSelector
// Purpose: Allows selecting predefined symptoms using a multi-select combobox.
// Used in: DropdownSelectors.

import React from "react";
import { predefinedSymptoms } from "../utils/predefinedData";
import MultiSelectCombobox from "./MultiSelectCombobox";

interface SymptomsSelectorProps {
  selectedSymptoms: string[];
  onSymptomsSelect: (symptoms: string[]) => void;
}

const SymptomsSelector: React.FC<SymptomsSelectorProps> = ({
  selectedSymptoms,
  onSymptomsSelect,
}) => {
  return (
    <MultiSelectCombobox
      items={predefinedSymptoms}
      selectedItems={selectedSymptoms}
      onItemsSelect={onSymptomsSelect}
      label="Symptoms"
      placeholder="Select symptoms..."
      searchPlaceholder="Search symptoms..."
      emptyMessage="No symptom found."
      groupLabel="Symptoms"
      getDisplayText={(symptom) => symptom.label}
      getSecondaryText={(symptom) => symptom.description}
      getBadgeLabel={(symptom) => symptom.label}
    />
  );
};

export default SymptomsSelector;
