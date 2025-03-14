import { useState } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file for styles
import { patientProfile, initialAssessment } from "./patient_data";

export default function App() {
  const [sessionType, setSessionType] = useState(""); // "initial" or "follow-up"
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showAssessment, setShowAssessment] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const startChat = (type) => {
    setSessionType(type);
    setMessages([]);
    setChatActive(true);
    setShowProfile(true);
    setShowAssessment(type === "follow-up"); // Only show assessment for follow-up visits
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        session_type: sessionType,
        message: userMessage.content,
      });

      const aiMessage = { role: "assistant", content: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      {!chatActive ? (
        <div className="start-container">
          <h1>AI Chat with John Doe</h1>
          <button className="start-button initial" onClick={() => startChat("initial")}>
            Start Initial Visit
          </button>
          <button className="start-button follow-up" onClick={() => startChat("follow-up")}>
            Start Follow-up Visit
          </button>
        </div>
      ) : (
        <div className="chat-box-container">
          <div className="chat-box">
            <button className="back-button" onClick={() => setChatActive(false)}>
              ← Back
            </button>
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <strong>{msg.role === "user" ? "You" : "John Doe"}:</strong> {msg.content}
                </div>
              ))}
              {loading && <div className="typing-indicator">Typing...</div>}
            </div>

            <div className="input-container">
              <textarea
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                rows="1"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              ></textarea>
              <button className="send-button" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>

          {/* Right Sidebar for Patient Profile and Assessment Results */}
          <div className="sidebar">
            {/* Patient Profile Section */}
            <div className="collapsible-section">
              <button className="collapsible" onClick={() => setShowProfile(!showProfile)}>
                Patient Profile {showProfile ? "▲" : "▼"}
              </button>
              {showProfile && (
                <div className="content">
                  <h3>PATIENT INFORMATION</h3>
                  {Object.entries(patientProfile.patientInfo).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                  ))}

                  <h3>CHIEF COMPLAINT</h3>
                  <p>{patientProfile.chiefComplaint}</p>

                  <h3>VITAL SIGNS</h3>
                  {Object.entries(patientProfile.vitalSigns).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                  ))}

                  <h3>PRIMARY ASSESSMENT</h3>
                  {Object.entries(patientProfile.primaryAssessment).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                  ))}

                  <h3>HISTORY</h3>
                  {Object.entries(patientProfile.history).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {value}</p>
                  ))}

                  <h3>DRUG ALLERGIES</h3>
                  {patientProfile.drugAllergies.map((allergy, index) => (
                    <p key={index}>{allergy}</p>
                  ))}

                  <h3>MEDICAL HISTORY</h3>
                  {patientProfile.medicalHistory.map((condition, index) => (
                    <p key={index}>{condition}</p>
                  ))}

                  <h3>TRIAGE NOTES</h3>
                  <p>{patientProfile.Notes}</p>
                </div>
              )}
            </div>

            {/* Assessment Results Section (Only for Follow-up Visits) */}
            {sessionType === "follow-up" && (
              <div className="collapsible-section">
                <button className="collapsible" onClick={() => setShowAssessment(!showAssessment)}>
                  Assessment Results {showAssessment ? "▲" : "▼"}
                </button>
                {showAssessment && (
                  <div className="content">
                    {sessionType === "follow-up" ? (
                      <>
                        <h3>ASSESSMENT & PLAN</h3>
                        <p><strong>Summary:</strong> {initialAssessment.assessmentAndPlan}</p>
                        <p><strong>Primary Diagnosis:</strong> {initialAssessment.PrimaryDiagnosis}</p>

                        <h4>Course</h4>
                        {initialAssessment.course.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}

                        <h4>Discharge Plan</h4>
                        {initialAssessment.dischargePlan.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}

                        <h4>Condition at Discharge</h4>
                        {initialAssessment.conditionAtDischarge.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}
                      </>
                    ) : (
                      <>
                        <h3>FOLLOW-UP ASSESSMENT</h3>
                        <p><strong>Blood Pressure:</strong> 130/85 mmHg</p>
                        <p><strong>Heart Rate:</strong> 75 bpm</p>
                        <p><strong>Recent Medications:</strong> Amlodipine 5mg</p>
                      </>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
