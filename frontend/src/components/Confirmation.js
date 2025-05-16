import React, { useState, useEffect } from "react";

const Confirmation = ({ username = "utilizator", activationLink = "#" }) => {
  const [link, setLink] = useState(activationLink);
  const [name, setName] = useState(username);

  useEffect(() => {
    if (!activationLink) setLink("#");
    if (!username) setName("utilizator");
  }, [activationLink, username]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Confirmare cont</h2>
      <p>Salut <strong>{name}</strong>,</p>
      <p>Apasă pe linkul de mai jos pentru a-ți confirma contul:</p>
      <p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          Confirmă contul
        </a>
      </p>
      <p>Mulțumim!</p>
    </div>
  );
};

export default Confirmation;
