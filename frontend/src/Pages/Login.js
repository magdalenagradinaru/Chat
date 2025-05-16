import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import BackButton from '../components/BackButton';
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
  const csrfToken = localStorage.getItem('csrfToken');
const response = await axios.post('http://127.0.0.1:8000/api/login/', {
    username,
    password,
}, {
    headers: {
        'X-CSRFToken': csrfToken
    }
});

    const { access, refresh, user } = response.data;

    if (!access || !refresh) {
      throw new Error("Token lipsă din răspuns.");
    }

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("Token salvat în localStorage:", access);
    navigate("/intro");

  } catch (error) {
    console.error("Eroare autentificare:", error);
    if (error.response && error.response.data) {
      setError(error.response.data.error || "Username sau parolă incorectă");
    } else {
      setError("A apărut o problemă. Te rugăm să încerci mai târziu.");
    }
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div>
      <BackButton to="/welcome" />
      <div style={{ backgroundImage: `url('/path/catre/poza.png')` }}>
        {error && (
          <div className="error-msg">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="register-form">
          <h2 className="register-title">Login</h2>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button type="submit">Login</button>
          <div className="footer-text">
            <span>Nu ai cont?</span>
            <button type="button" onClick={() => navigate('/register')}>
              Înregistrează-te
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
