import React, { useState } from "react";
import { Navbar, Nav, Container, Form } from "react-bootstrap";
import "../css/cover.css";
import { FaHome, FaUser, FaEnvelope, FaComments, FaInbox } from "react-icons/fa"; // Importăm iconița pentru Inbox
import LogoutButton from "../components/LogoutButton";
import Chatbot from "../components/Chatbot";

const Layout = ({ children }) => {
  const [isChatbotOpen, setChatbotOpen] = useState(false);

  const toggleChatbot = () => setChatbotOpen(prev => !prev);

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar-ul vertical */}
      <div className="sidebar">
        <Nav className="flex-column">
          <Nav.Link href="/intro" className="nav-link"><FaHome /></Nav.Link>
          <Nav.Link href="/profile" className="nav-link"><FaUser /></Nav.Link>
          <Nav.Link href="/chatbot" className="nav-link"><FaComments /></Nav.Link>
          <Nav.Link href="/inbox" className="nav-link"><FaInbox /> </Nav.Link>
          <Nav.Link href="/about" className="nav-link"><FaEnvelope /></Nav.Link>
        </Nav>
      </div>

     {/* Conținutul paginii */}
      <div className="flex-grow-1 d-flex flex-column">
        <header className="appbar">
          {/* brand */}
          <a href="/intro" className="brand">
            <img
              src="/mylogo.png"
              alt="Logo"
              style={{ height: 40, marginRight: 8 }}
            />
            IT Community
          </a>

          {/* Logout pe dreapta */}
          <div className="logout-wrapper">
            <LogoutButton />
          </div>
        </header>

        {/* Main Content */}
        <main role="main" className="inner cover flex-grow-1 p-1">
          {children}

          {/* Afișăm Chatbot-ul in cazul popup */}
          {isChatbotOpen && (
            <div className="chatbot-container">
              <Chatbot closeChatbot={toggleChatbot} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mastfoot bg-dark text-white text-center p-3">
          <div className="inner">
            <p>
              Cover template for <a href="https://getbootstrap.com/" className="text-white">Bootstrap</a>, by{" "}
              <a href="https://twitter.com/mdo" className="text-white">@mdo</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
