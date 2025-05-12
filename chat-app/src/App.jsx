import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import PatientForm from "./PatientForm";
import { initialPatientState } from "./patient_data";

export default function App() {
  const [sessionId, setSessionId] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState(initialPatientState);
  const [showPatientForm, setShowPatientForm] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Generate a unique session ID when the component mounts
    setSessionId(Date.now().toString());
  }, []);

  const startChat = async (type) => {
    if (!patientData.patientInfo.gender || !patientData.patientInfo.ageRange) {
      alert("Please fill in at least the gender and age range before starting the chat.");
      return;
    }
    setSessionType(type);
    setMessages([]);
    setChatActive(true);
    setShowPatientForm(false);
  };

  const endChat = async () => {
    try {
      await axios.post(`${API_URL}/end-session`, { session_id: sessionId });
      setChatActive(false);
      setShowPatientForm(true);
      setSessionId(Date.now().toString()); // Generate new session ID for next chat
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        session_id: sessionId,
        session_type: sessionType,
        message: userMessage.content,
        patient_data: patientData
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
          <h1>AI Chat with Patient</h1>
          <PatientForm patientData={patientData} setPatientData={setPatientData} />
          <div className="button-container">
            <button 
              className="start-button initial" 
              onClick={() => startChat("initial")}
              disabled={!patientData.patientInfo.gender || !patientData.patientInfo.ageRange}
            >
              Start Initial Visit
            </button>
            <button 
              className="start-button follow-up" 
              onClick={() => startChat("follow-up")}
              disabled={!patientData.patientInfo.gender || !patientData.patientInfo.ageRange}
            >
              Start Follow-up Visit
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-box-container">
          <div className="chat-box">
            <div className="chat-header">
              <button className="back-button" onClick={() => {
                setChatActive(false);
                setShowPatientForm(true);
              }}>
                ← Back
              </button>
              <button 
                className="toggle-form-button"
                onClick={() => setShowPatientForm(!showPatientForm)}
              >
                {showPatientForm ? 'Hide Patient Data' : 'Show Patient Data'}
              </button>
            </div>

            <div className="main-content">
              {showPatientForm && (
                <div className="patient-form-sidebar">
                  <PatientForm patientData={patientData} setPatientData={setPatientData} />
                </div>
              )}

              <div className={`chat-content ${showPatientForm ? 'with-sidebar' : ''}`}>
                <div className="messages-container">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                      <strong>{msg.role === "user" ? "You" : "Patient"}:</strong> {msg.content}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
