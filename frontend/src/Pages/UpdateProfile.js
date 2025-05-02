import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const [role, setRole] = useState('');
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Aici poți încărca profilul utilizatorului dacă este necesar
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/update-profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role, email_confirmed: emailConfirmed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        alert("Actualizare eșuată: " + JSON.stringify(errorData));
        return;
      }

      console.log('Profil actualizat cu succes!');
      navigate('/profile');  // sau altă pagină după actualizare
    } catch (error) {
      console.error('Eroare rețea:', error);
      alert("Eroare rețea la actualizare");
    }
  };

  return (
    <form onSubmit={handleUpdateProfile}>
      <h2>Actualizează Profilul</h2>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="">Selectează rolul</option>
        <option value="consumer">Consumator</option>
        <option value="company">Companie</option>
      </select>

      <input
        type="checkbox"
        checked={emailConfirmed}
        onChange={(e) => setEmailConfirmed(e.target.checked)}
      />
      <label>Confirmă email</label>

      <button type="submit">Actualizează Profilul</button>
    </form>
  );
};

export default UpdateProfile;
