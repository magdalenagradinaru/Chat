// src/components/Chatbot.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/cover.css";
import Layout from "../components/Layout";


const Chatbot = () => {
  const [userMessages, setUserMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [userMessages, botMessages]);

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
      <Layout>
    <div className="container my-5">

      {/* Butonul de întoarcere — poziționat fix sus stânga
      <button
        className="btn btn-secondary mb-3 w-10"
        style={{ position: "fixed", top: "20px", left: "20px", zIndex: 1000 }}
        onClick={() => navigate("/intro")}
      >
        Înapoi la Intro
      </button>
      */}

      <div className="d-flex justify-content-center">
        <div
          className="card shadow-lg p-4 border-0 rounded bg-dark text-white"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h3 className="text-center text-primary mb-3">Prietenul tău virtual</h3>

          {/* Div cu instrucțiuni de utilizare */}
          <div className="alert alert-info">
            <ul className="mb-0">
              <li>
                Chatbot-ul vă ajută cu orice întrebare generală sau în legătură cu această platformă, inclusiv despre joburi disponibile în companiile IT din Moldova, oferind informații actualizate. Pentru a le accesa introduceți numele companiei de care sunteți interesat.
              </li>
            </ul>
          </div>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {isLoading && <div className="text-center">Se încarcă...</div>}

          <div
            ref={chatBoxRef}
            className="chat-box mb-3"
            style={{
              height: "400px",
              overflowY: "auto",
              backgroundColor: "#333",
              padding: "10px",
              borderRadius: "10px",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {userMessages.map((message, index) => (
              <div key={index} className="mb-2">
                <div className="text-end">
                  <span
                    className="badge bg-primary p-2 text-wrap"
                    style={{ wordBreak: "break-word", maxWidth: "80%" }}
                  >
                    {message}
                  </span>
                </div>
                {botMessages[index] && (
                  <div className="text-start mt-2">
                    <span
                      className="badge bg-secondary p-2 text-wrap"
                      style={{ wordBreak: "break-word", maxWidth: "80%" }}
                    >
                      {botMessages[index]}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input + butoanele pe același rând */}
            <input
              type="text"
              className="form-control rounded-pill mb-2"
              placeholder="Scrie un mesaj..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
                      <div className="d-flex">
            <button className="btn btn-primary rounded-pill " onClick={() => onSendMessage(inputMessage)}>
              Trimite
            </button>
            <button className="btn btn-danger rounded-pill" onClick={clearChat}>
              Șterge
            </button>
          </div>

        </div>
      </div>
    </div>
        </Layout>

  );
};

export default Chatbot;
