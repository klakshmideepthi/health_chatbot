import { useState } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file for styles

export default function App() {
  const [sessionType, setSessionType] = useState(""); // "initial" or "follow-up"
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const startChat = (type) => {
    setSessionType(type);
    setMessages([]);
    setChatActive(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", {
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
        <div className="chat-box">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <strong>{msg.role === "user" ? "You" : "John Doe"}:</strong> {msg.content}
              </div>
            ))}
            {loading && <div className="typing-indicator">Typing...</div>}
          </div>

          <div className="input-container">
            <input
              type="text"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
