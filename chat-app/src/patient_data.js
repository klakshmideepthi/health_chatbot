// Common medical conditions for dropdown
export const medicalConditions = [
  "Congestive Heart Failure (CHF)",
  "Type 2 Diabetes",
  "Hypertension",
  "Hyperlipidemia",
  "Atrial Fibrillation",
  "Asthma",
  "COPD",
  "Depression",
  "Anxiety",
  "Arthritis"
];

// Common chief complaints for dropdown
export const chiefComplaints = [
  "Chest Pain",
  "Shortness of Breath",
  "Headache",
  "Back Pain",
  "Abdominal Pain",
  "Fever",
  "Cough",
  "Joint Pain",
  "Anxiety/Depression",
  "Other (please specify)"
];

// Initial empty patient state
export const initialPatientState = {
  patientInfo: {
    gender: "",
    ageRange: "",
    language: "English",
  },
  chiefComplaint: "",
  otherComplaint: "",
  selectedConditions: [],
  notes: ""
};

// Age ranges for dropdown
export const ageRanges = [
  "0-17",
  "18-30",
  "31-45",
  "46-60",
  "61-75",
  "76+"
];

// ESI Levels with descriptions
export const esiLevels = [
  { level: "1", description: "Immediate, life-saving intervention required" },
  { level: "2", description: "High risk situation, vital signs may be unstable" },
  { level: "3", description: "Urgent, stable vital signs" },
  { level: "4", description: "Less urgent, stable vital signs" },
  { level: "5", description: "Nonurgent" }
];
