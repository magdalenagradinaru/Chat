import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./Pages/Intro";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Welcome from "./Pages/Welcome";
import Profile from "./Pages/Profile";
import Chatbot from "./Pages/Chatbot";
import "./css/global.css";
import "./css/cover.css";
import ProtectedRoute from './components/ProtectedRoute';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Rute protejate */}
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/intro"
          element={
            <ProtectedRoute>
              <Intro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
