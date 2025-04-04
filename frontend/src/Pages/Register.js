import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
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
      });

      if (response.status === 201) {
        navigate("/login");
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
    <div className="container-fluid" style={{ backgroundColor: 'rgba(240, 248, 255, 0.7)' }}>
      <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
        <h2 className="mb-4">Înregistrare</h2>
        {error && <p className="text-danger">{error}</p>}

        <form className="w-50" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill shadow-sm"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control form-control-lg rounded-pill shadow-sm"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg rounded-pill shadow-sm"
              placeholder="Parolă"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg rounded-pill shadow-sm"
              placeholder="Confirmă Parola"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 btn-lg rounded-pill shadow-sm">
            Înregistrează-te
          </button>
        </form>

        <div className="mt-3">
          <button className="btn btn-secondary w-50 my-2" onClick={() => navigate("/login")}>
            Ai deja un cont? Autentifică-te
          </button>

          <button className="btn btn-link" onClick={() => navigate("/")}>
            Mergi la Welcome
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
