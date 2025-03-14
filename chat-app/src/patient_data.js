const patientProfile = {
    patientInfo: {
      name: "John Doe",
      mrn: "1234567",
      dob: "05/15/1956 (68 y/o)",
      gender: "Male",
      language: "English",
      contact: "555-123-4567",
      emergencyContact: "Jane Doe (Wife) 555-987-6543",
    },
    chiefComplaint:
      "Severe chest pain radiating to left arm, shortness of breath, increased swelling in legs, recent weight gain",
    vitalSigns: {
      height: "5'10\" (178 cm)",
      weight: "220 lbs (100 kg) – recent weight gain of 6 lbs (2.7 kg)",
      bp: "160/100 mmHg",
      hr: "110 bpm (irregular)",
      rr: "24 breaths/min",
      temp: "98.6°F (37.0°C)",
      o2Sat: "90% on room air",
      painScore: "7/10",
    },
    triageAcuity: {
      esiLevel: "2",
      timeToProvider: "Immediate",
    },
    primaryAssessment: {
      airway: "Patent",
      breathing: "Labored, bilateral crackles at lung bases",
      circulation: "Pulses regular but weak, skin pale, diaphoretic, +2 pitting edema",
      disability: "Alert and oriented x4",
      exposure: "No visible trauma, no rash or burns",
    },
    history: {
      onset: "45 minutes ago while resting",
      quality: '"Tight, squeezing, pressure-like"',
      radiation: "Radiates to left jaw and left arm",
      severity: "7/10",
    },
    drugAllergies: ["Penicillin: Rash"],
    medications: [
      "Metformin: 1000mg BID",
      "Lisinopril: 20mg daily",
      "Furosemide (Lasix): 40mg BID",
      "Aspirin: 81mg daily (OTC)",
      "Carvedilol: 12.5mg BID",
    ],
    medicalHistory: [
      "Congestive Heart Failure: Diagnosed 2022",
      "Type 2 Diabetes: Diagnosed 2020",
      "Hypertension: Diagnosed 2019",
      "Hyperlipidemia: Diagnosed 2021",
      "Atrial Fibrillation: Diagnosed 2023",
      "Family History: Father had MI at age 58",
    ],
    Notes:
      "Patient presents with symptoms consistent with CHF exacerbation and possible ACS. ESI level 2 assigned. Patient to be taken directly to treatment area for immediate provider evaluation.",
  };
  
const initialAssessment = {
    assessmentAndPlan:
      "68-year-old male with a history of CHF, A-fib, HTN, DM, HLD, presented with acute chest pain, SOB, and weight gain, now improved with diuretics and rate control therapy.",
    PrimaryDiagnosis: "CHF exacerbation with atrial fibrillation RVR, now controlled. ACS ruled out (troponins negative, ECG unremarkable).",
    course: [
      "Symptoms improved with diuresis (Lasix 40 mg IV) and rate control.",
      "No further ischemic signs or need for hospital admission.",
    ],
    dischargePlan: [
      "Medications adjusted for CHF, A-fib, and diabetes management.",
      "Patient educated on fluid restriction, sodium intake, and weight monitoring.",
      "Follow-up with cardiology in 3-5 days and PCP in 1-2 weeks.",
      "Patient instructed to return if experiencing worsening symptoms.",
    ],
    conditionAtDischarge: [
      "Stable, ambulatory, tolerating oral intake, vital signs within acceptable range.",
      "Understands medication and follow-up instructions.",
    ],
    dischargeTo: "Discharged to: Home via own transportation.",
  };
  
  export { patientProfile, initialAssessment };
  