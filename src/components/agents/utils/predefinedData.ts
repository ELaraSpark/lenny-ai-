
// Utility: predefinedData
// Purpose: Provides predefined data for symptoms, questions, and mock patients used in the agents components.
// Used in: SymptomsSelector, QuestionsSelector, PatientSelector, useSelectionToChat.

export const predefinedSymptoms = [
  { id: "chest-pain", label: "Chest Pain", description: "Pain or discomfort in the chest area" },
  { id: "shortness-breath", label: "Shortness of Breath", description: "Difficulty breathing or dyspnea" },
  { id: "dizziness", label: "Dizziness", description: "Feeling lightheaded or unsteady" },
  { id: "fatigue", label: "Fatigue", description: "Persistent tiredness or exhaustion" },
  { id: "palpitations", label: "Palpitations", description: "Rapid or irregular heartbeats" },
  { id: "swelling", label: "Swelling", description: "Edema in legs, ankles, or feet" },
  { id: "nausea", label: "Nausea", description: "Feeling of sickness with an urge to vomit" },
  { id: "headache", label: "Headache", description: "Pain in the head or upper neck" },
  { id: "fever", label: "Fever", description: "Elevated body temperature" },
  { id: "cough", label: "Cough", description: "Sudden expulsion of air from the lungs" },
];

export const predefinedQuestions = [
  { id: "symptom-duration", question: "How long have you been experiencing these symptoms?" },
  { id: "symptom-severity", question: "On a scale of 1-10, how severe are your symptoms?" },
  { id: "medication", question: "Are you currently taking any medications?" },
  { id: "medical-history", question: "Do you have any relevant medical history?" },
  { id: "allergies", question: "Do you have any known allergies?" },
  { id: "family-history", question: "Is there a family history of similar conditions?" },
  { id: "lifestyle", question: "Can you describe your lifestyle (exercise, diet, smoking, alcohol)?" },
  { id: "previous-treatment", question: "Have you sought treatment for this before?" },
  { id: "trigger-factors", question: "Have you noticed any factors that trigger or worsen your symptoms?" },
  { id: "improvement-factors", question: "Is there anything that relieves your symptoms?" },
];

export const mockPatients = [
  { id: "pat-001", name: "John Smith", age: 45, gender: "Male" },
  { id: "pat-002", name: "Sarah Johnson", age: 62, gender: "Female" },
  { id: "pat-003", name: "Michael Brown", age: 38, gender: "Male" },
  { id: "pat-004", name: "Emily Davis", age: 29, gender: "Female" },
  { id: "pat-005", name: "Robert Wilson", age: 56, gender: "Male" },
  { id: "pat-006", name: "Jennifer Martinez", age: 41, gender: "Female" },
  { id: "pat-007", name: "David Anderson", age: 50, gender: "Male" },
  { id: "pat-008", name: "Lisa Thomas", age: 35, gender: "Female" },
];
