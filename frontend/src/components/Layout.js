// src/layout/Layout.jsx
import React from "react";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/cover.css";

import {
  FaHome,
  FaUser,
  FaEnvelope,
  FaComments,
  FaInbox,
  FaRobot
} from "react-icons/fa";

import LogoutButton from "../components/LogoutButton";

const Layout = ({ children }) => {
  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="sidebar mt-5 px-2">
        <Nav className="flex-column gap-2">
          <Nav.Link
            as={Link}
            to="/intro"
            className="nav-link d-flex flex-column align-items-center"
          >
            <FaHome size={20} />
            <small>Acasă</small>
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/profile"
            className="nav-link d-flex flex-column align-items-center"
          >
            <FaUser size={20} />
            <small>Profil</small>
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/chatbot"
            className="nav-link d-flex flex-column align-items-center"
          >
            <FaRobot size={20} />
            <small>Chatbot</small>
          </Nav.Link>

         <Nav.Link
            as={Link}
            to="/inbox"
            className="nav-link d-flex flex-column align-items-center"
          >
            <FaComments size={20} />
            <small>Inbox</small>
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/about"
            className="nav-link d-flex flex-column align-items-center"
          >
            <FaEnvelope size={20} />
            <small>Despre</small>
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <header className="appbar d-flex align-items-center px-3 ps-3">
          <Link to="/intro" className="brand d-flex align-items-center gap-2">
            <img src="/mylogo.png" alt="Logo" style={{ height: 40 }} />
            <span className="fw-bold">IT Community</span>
          </Link>
          <div className="ms-auto">
            <LogoutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="inner cover flex-grow-1 p-2 mt-1">
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            backgroundColor: "#222",
            color: "#eee",
            textAlign: "center",
            padding: "1rem",
            marginTop: "auto",
          }}
        >
          <p style={{ margin: "0.2rem" }}>
            © {new Date().getFullYear()} IT Community
          </p>
          <p style={{ margin: "0.2rem", opacity: 0.75 }}>
            Str. Alexei Mateevici 10, Chișinău MD-2040
          </p>
          <div style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
            <a
              href="https://facebook.com/itcommunity"
              target="_blank"
              rel="noopener noreferrer"
              style={{ margin: "0 10px", color: "#bbb", textDecoration: "none" }}
              aria-label="Facebook"
            >
              <i className="bi bi-facebook"></i>
            </a>
            <a
              href="https://linkedin.com/company/itcommunity"
              target="_blank"
              rel="noopener noreferrer"
              style={{ margin: "0 10px", color: "#bbb", textDecoration: "none" }}
              aria-label="LinkedIn"
            >
              <i className="bi bi-linkedin"></i>
            </a>
            <a
              href="https://github.com/itcommunity"
              target="_blank"
              rel="noopener noreferrer"
              style={{ margin: "0 10px", color: "#bbb", textDecoration: "none" }}
              aria-label="GitHub"
            >
              <i className="bi bi-github"></i>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
