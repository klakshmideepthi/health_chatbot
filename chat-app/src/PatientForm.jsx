import React from 'react';
import { medicalConditions, ageRanges, chiefComplaints } from './patient_data';

const PatientForm = ({ patientData, setPatientData }) => {
  const handleInputChange = (category, field, value) => {
    if (category) {
      setPatientData(prev => ({
        ...prev,
        [category]: { ...prev[category], [field]: value }
      }));
    } else {
      setPatientData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleConditionToggle = (condition) => {
    setPatientData(prev => ({
      ...prev,
      selectedConditions: prev.selectedConditions.includes(condition)
        ? prev.selectedConditions.filter(c => c !== condition)
        : [...prev.selectedConditions, condition]
    }));
  };

  return (
    <div className="patient-form">
      <h3>Patient Information</h3>
      <div className="form-section">
        <div className="form-group">
          <label>Gender:</label>
          <select
            value={patientData.patientInfo.gender}
            onChange={(e) => handleInputChange('patientInfo', 'gender', e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Age Range:</label>
          <select
            value={patientData.patientInfo.ageRange}
            onChange={(e) => handleInputChange('patientInfo', 'ageRange', e.target.value)}
          >
            <option value="">Select Age Range</option>
            {ageRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Chief Complaint:</label>
        <select
          value={patientData.chiefComplaint}
          onChange={(e) => handleInputChange(null, 'chiefComplaint', e.target.value)}
          required
        >
          <option value="">Select Primary Concern</option>
          {chiefComplaints.map(complaint => (
            <option key={complaint} value={complaint}>{complaint}</option>
          ))}
        </select>
        {patientData.chiefComplaint === "Other (please specify)" && (
          <textarea
            value={patientData.otherComplaint || ""}
            onChange={(e) => handleInputChange(null, 'otherComplaint', e.target.value)}
            placeholder="Please describe your concern"
            rows="3"
            className="mt-2"
          />
        )}
      </div>

      <h3>Medical Conditions</h3>
      <div className="conditions-section">
        {medicalConditions.map(condition => (
          <label key={condition} className="condition-checkbox">
            <input
              type="checkbox"
              checked={patientData.selectedConditions.includes(condition)}
              onChange={() => handleConditionToggle(condition)}
            />
            {condition}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PatientForm;