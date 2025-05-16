import React, { useState } from "react";
import axios from "axios";

const SendMessageButton = ({ postId, recipientEmail, onCloseModal }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      console.error("No authentication token found.");
      setStatus("Eroare: autentificare necesară.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/send-message/",
        {
          post_id: postId,
          recipient_email: recipientEmail,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStatus("Mesajul a fost trimis cu succes!");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      setStatus("Eroare la trimiterea mesajului.");
    }
  };

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Scrie mesajul aici..."
        rows={4}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Trimite
      </button>
      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
};

export default SendMessageButton;
