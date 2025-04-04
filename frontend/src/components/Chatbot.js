import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "../css/cover.css";

const Chatbot = ({ isOpen, onClose }) => {
  const [userMessages, setUserMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [userMessages, botMessages]);

  if (!isOpen) return null;

  const onSendMessage = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post("http://localhost:8000/chat/", { message });
      const botResponse = response.data.response;

      setUserMessages((prev) => [...prev, message]);
      setBotMessages((prev) => [...prev, botResponse]);
      setInputMessage("");
    } catch (error) {
      setErrorMessage("A apărut o eroare la trimiterea mesajului.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSendMessage(inputMessage);
    }
  };

  const clearChat = () => {
    setUserMessages([]);
    setBotMessages([]);
  };

  return (
    <div className="overlay">
      <div className="popup">
        <button className="closeButton" onClick={onClose}>×</button>
        <div className="card shadow-lg p-4 border-0 rounded bg-dark">
          <h3 className="text-center text-primary mb-3">Chatbot</h3>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {isLoading && <div className="text-center">Se încarcă...</div>}

          <div
            ref={chatBoxRef}
            className="chat-box"
          >
            {userMessages.map((message, index) => (
              <div key={index} className="mb-2">
                <div className="text-end">
                  <span className="badge bg-primary p-2 text-white">{message}</span>
                </div>
                {botMessages[index] && (
                  <div className="text-start mt-2">
                    <span className="badge bg-secondary p-2 text-white">{botMessages[index]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="input-group">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Scrie un mesaj..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn btn-primary rounded-pill ms-2" onClick={() => onSendMessage(inputMessage)}>
              Trimite
            </button>
            <button className="btn btn-danger rounded-pill ms-2" onClick={clearChat}>
              Șterge conversația
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Chatbot.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Chatbot;