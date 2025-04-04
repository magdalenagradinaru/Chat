import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/cover.css";
import "../css/global.css";

import { Login } from "./Login";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <main role="main" className="main-welcome colordiv">
        <h1 className="cover-heading custom-heading"style={{ color: 'white' }}>IT Community</h1>
        <p className="lead custom-lead"style={{ color: 'white' }}>
  Bun venit în aplicația noastră dedicată Marketingului Digital și Consumului! <br />Explorează cele mai eficiente strategii de marketing pentru a-ți crește afacerea și a-ți înțelege mai bine clienții. Avem și un chatbot integrat, disponibil pentru a-ți oferi suport și răspunsuri rapide la întrebările tale. Fă primul pas către succesul digital!
</p>


        {/* Redirecționează către Login.js */}
        <p className="lead custom-lead">
          <button
            className="btn btn-lg btn-secondary custom-btn"
            onClick={() => navigate("/login")}
          >
            Accesează platforma aici
          </button>
        </p>
      </main>
    </div>
  );
};

export default Welcome;
