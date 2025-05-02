// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Ștergem tokenurile
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    // Redirecționăm către login
    navigate('/welcome');
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
};

export default LogoutButton;
