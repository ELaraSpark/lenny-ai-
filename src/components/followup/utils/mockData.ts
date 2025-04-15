
// Mock data for patients and agents
// In a real app, these would be fetched from a backend

export const patients = [
  { id: "p1", name: "Jane Doe" },
  { id: "p2", name: "John Smith" },
  { id: "p3", name: "Maria Garcia" },
  { id: "p4", name: "Robert Chen" },
];

export const agents = [
  { id: "cardio", name: "CardioAssist", specialty: "Cardiology" },
  { id: "neuro", name: "NeuroLogic", specialty: "Neurology" },
  { id: "gen", name: "GeneralMD", specialty: "General Practice" },
  { id: "path", name: "PathInsight", specialty: "Pathology" },
];

// Mock patient data for the follow-up scheduler
export const mockPatients = [
  { id: "p1", name: "Jane Doe", age: 45, gender: "Female" },
  { id: "p2", name: "John Smith", age: 62, gender: "Male" },
  { id: "p3", name: "Maria Garcia", age: 35, gender: "Female" },
  { id: "p4", name: "Robert Johnson", age: 58, gender: "Male" },
  { id: "p5", name: "Aisha Patel", age: 29, gender: "Female" },
];

// Mock AI agent data for the follow-up scheduler
export const mockAgents = [
  { id: "cardio", name: "CardioAssist", specialty: "Cardiology" },
  { id: "neuro", name: "NeuroLogic", specialty: "Neurology" },
  { id: "gen", name: "GeneralMD", specialty: "General Practice" },
  { id: "endo", name: "EndoHelper", specialty: "Endocrinology" },
  { id: "ortho", name: "OrthoBot", specialty: "Orthopedics" },
];

// Helper function to get the specialty for an agent ID
export const getSpecialtyForAgent = (agentId: string): string => {
  // First check in mockAgents (which has more entries)
  const mockAgent = mockAgents.find(a => a.id === agentId);
  if (mockAgent) return mockAgent.specialty;
  
  // Fallback to checking in the original agents array
  const agent = agents.find(a => a.id === agentId);
  return agent?.specialty || "";
};

// Helper function to get patient name by ID
export const getPatientNameById = (patientId: string): string => {
  const patient = mockPatients.find(p => p.id === patientId);
  return patient?.name || "Unknown Patient";
};

// Helper function to get agent name by ID
export const getAgentNameById = (agentId: string): string => {
  const agent = mockAgents.find(a => a.id === agentId);
  return agent?.name || "Unknown Agent";
};
