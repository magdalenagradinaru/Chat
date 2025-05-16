// src/pages/AboutPage.js

import React from 'react';
import Layout from '../components/Layout'; // dacă ai un Layout general

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="mb-4">Despre Platformă</h1>
        <p>
          Această platformă oferă o interfață inteligentă de comunicare între utilizatori și un chatbot hibrid,
          care combină reguli predefinite cu inteligență artificială generativă.
        </p>
        <p>
          Utilizatorii pot crea conturi, își pot gestiona profilul, iar companiile pot interacționa cu potențiali
          candidați sau clienți prin intermediul sistemului conversațional.
        </p>
        <p>
          Platforma este construită folosind tehnologii moderne precum Django, React și PyTorch, având în centru un
          sistem conversațional adaptat nevoilor utilizatorilor.
        </p>
        <p>
          Scopul nostru este să oferim o experiență de utilizare intuitivă, rapidă și eficientă, susținută de cele
          mai noi tehnologii din domeniul procesării limbajului natural.
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;
