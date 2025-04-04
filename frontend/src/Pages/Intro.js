import React, { useState } from "react";
import Chatbot from "../components/Chatbot";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import "../css/cover.css";

const Intro = () => {
  const navigate = useNavigate();

  const [isChatbotOpen, setChatbotOpen] = useState(false);

  const openChatbot = () => setChatbotOpen(true);
  const closeChatbot = () => setChatbotOpen(false);

  return (
    <Layout>

      <h1>Pagina Principală</h1>
      <button onClick={openChatbot}>Deschide Chatbot</button>

      <Chatbot isOpen={isChatbotOpen} onClose={closeChatbot} />

    </Layout>
  );
};

export default Intro;