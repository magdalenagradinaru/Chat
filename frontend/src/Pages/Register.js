import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Parolele nu coincid!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        email,
        password,
        confirm_password: confirmPassword,
        category
      });

      if (response.status === 201) {
        setSuccessMessage("Înregistrare reușită! Verifică email-ul pentru confirmare.");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCategory("");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Înregistrare eșuată!");
      } else if (error.request) {
        setError("Serverul nu răspunde. Te rugăm să încerci mai târziu.");
      } else {
        setError("A apărut o problemă. Te rugăm să încerci mai târziu.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2 className="register-title">Înregistrare</h2>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        className="register-input"
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
        className="register-input"
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Parolă"
        required
        className="register-input"
      />

      <input
        placeholder="Confirmă Parola"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="register-input"
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)} required className="register-input">
        <option value="">Selectează categoria</option>
        <option value="consumator">Consumator</option>
        <option value="companie">Companie</option>
      </select>

      <div className="mt-3">
        <button className="btn btn-secondary w-50 my-2" onClick={() => navigate("/login")}>Ai deja un cont? Autentifică-te</button>
        <button type="submit" className="register-button">Înregistrează-te</button>
        <button className="btn btn-link" onClick={() => navigate("/")}>Mergi la Welcome</button>
      </div>
    </form>
  );
};

export default Register;
