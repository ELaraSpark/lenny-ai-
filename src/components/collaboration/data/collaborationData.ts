
export const colleagues = [
  {
    id: "c1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    hospital: "Central Medical Center",
    status: "Available",
    avatar: null
  },
  {
    id: "c2",
    name: "Dr. Michael Lee",
    specialty: "Neurology",
    hospital: "Central Medical Center",
    status: "In a meeting",
    avatar: null
  },
  {
    id: "c3",
    name: "Dr. Jessica Parker",
    specialty: "Oncology",
    hospital: "Memorial Hospital",
    status: "Available",
    avatar: null
  },
  {
    id: "c4",
    name: "Dr. Robert Wilson",
    specialty: "Radiology",
    hospital: "Central Medical Center",
    status: "Away",
    avatar: null
  },
];

export const meetings = [
  {
    id: "m1",
    title: "Weekly Cardiology Department Meeting",
    date: "2023-05-15T10:00:00",
    duration: 60,
    participants: ["Dr. Sarah Johnson", "Dr. Chen", "Dr. Michael Lee"],
    location: "Conference Room 3",
    virtual: false
  },
  {
    id: "m2",
    title: "Patient Case Review: John Smith",
    date: "2023-05-16T14:30:00",
    duration: 45,
    participants: ["Dr. Chen", "Dr. Jessica Parker"],
    location: "Zoom",
    virtual: true
  },
  {
    id: "m3",
    title: "Emergency Protocol Review",
    date: "2023-05-18T09:00:00",
    duration: 90,
    participants: ["Dr. Chen", "Dr. Sarah Johnson", "Dr. Michael Lee", "Dr. Jessica Parker"],
    location: "Auditorium",
    virtual: false
  }
];

export const sharedCases = [
  {
    id: "sc1",
    patientName: "Maria Garcia",
    condition: "Chest Pain, Hypertension",
    sharedBy: "Dr. Sarah Johnson",
    sharedOn: "2023-05-10T08:45:00",
    status: "Critical",
    notes: "Patient showing signs of unstable angina. ECG results attached."
  },
  {
    id: "sc2",
    patientName: "John Smith",
    condition: "Coronary Artery Disease",
    sharedBy: "Dr. Chen",
    sharedOn: "2023-05-11T14:20:00",
    status: "Stable",
    notes: "Post-op recovery progressing well. Latest labs indicate improvement."
  }
];
