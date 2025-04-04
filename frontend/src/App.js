// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./Pages/Intro";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Welcome from "./Pages/Welcome";
import Profile from "./Pages/Profile";
import Chatbot from "./components/Chatbot";
import "./css/global.css";
import "./css/cover.css";




import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/intro" element={ <Intro /> } />
        <Route path="/welcome" element={ <Welcome /> } />
        <Route path="/profile" element={ <Profile /> } />
      </Routes>
    </Router>
  );
}

export default App;
