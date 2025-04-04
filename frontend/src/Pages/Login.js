import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");  // Folosim username în loc de email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,  // Se trimite username aici
        password,
      });

      // Înregistrez informațiile despre utilizator în localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Navighez către pagina profilului utilizatorului
      navigate("/intro");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Username sau parolă incorectă");
      } else {
        setError("A apărut o problemă. Te rugăm să încerci mai târziu.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="container-fluid bg-light vh-100 d-flex align-items-center justify-content-center">
      <div className="container text-center w-50 p-4 shadow rounded">
        <h2>Autentificare</h2>
        {error && <p className="text-danger">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control my-2"
            placeholder="Username"  // Folosim username în loc de email
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="form-control my-2"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-100">Autentificare</button>
        </form>
        <p className="mt-3">
          Nu ai cont? <a href="/register">Înregistrează-te</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
