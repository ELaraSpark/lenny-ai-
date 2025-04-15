
export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  lastVisit: string;
  status: string;
  doctor: string;
}

export const patients: PatientData[] = [
  {
    id: "p1",
    name: "Maria Garcia",
    age: 57,
    gender: "Female",
    condition: "Hypertension, Diabetes Type 2",
    lastVisit: "2023-05-12",
    status: "Critical",
    doctor: "Dr. Chen",
  },
  {
    id: "p2",
    name: "John Smith",
    age: 68,
    gender: "Male",
    condition: "Coronary Artery Disease, Hyperlipidemia",
    lastVisit: "2023-04-28",
    status: "Stable",
    doctor: "Dr. Chen",
  },
  {
    id: "p3",
    name: "Emma Williams",
    age: 72,
    gender: "Female",
    condition: "Arrhythmia, Pacemaker",
    lastVisit: "2023-05-01",
    status: "Improving",
    doctor: "Dr. Chen",
  },
  {
    id: "p4",
    name: "Robert Johnson",
    age: 64,
    gender: "Male",
    condition: "Heart Valve Disease, Hypertension",
    lastVisit: "2023-05-10",
    status: "Follow-up",
    doctor: "Dr. Chen",
  },
  {
    id: "p5",
    name: "Susan Miller",
    age: 59,
    gender: "Female",
    condition: "Heart Failure, Fluid Retention",
    lastVisit: "2023-05-08",
    status: "Critical",
    doctor: "Dr. Chen",
  },
];
