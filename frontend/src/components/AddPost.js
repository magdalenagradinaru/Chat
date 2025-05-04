import React, { useState } from "react";
import axios from "axios";

const AddPost = ({ onPostAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [company, setCompany] = useState('company');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifică dacă există un token în localStorage
    const token = localStorage.getItem("access");

    if (!token) {
      setErrorMessage("Eroare: Nu ești autentificat!");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('company', company);
    formData.append('image', image); // Adaugă imaginea (dacă există)

    try {
      // Trimite cererea POST cu tokenul de autentificare în header
      const response = await axios.post(
        "http://localhost:8000/posts/add/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` // Adaugă tokenul în header
          }
        }
      );

      // Adaugă postarea în starea locală
      onPostAdded(response.data);

      // Resetează formularul
      setTitle("");
      setContent("");
      setCompany("company");
      setImage(null);
      setErrorMessage(""); // Reset error message
    } catch (error) {
      setErrorMessage("Eroare la adăugarea postării. Verifică datele și încearcă din nou.");
      console.error("Eroare la adăugarea postării:", error);
    }
  };

  return (
    <div>
      <h2>Adaugă o Postare</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titlu</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Conținut</label>
          <textarea
            id="content"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="company">Companie</label>
          <select
            id="company"
            className="form-control"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            <option value="company">Companie</option>
            <option value="consumer">Consumator</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Imagine</label>
          <input
            type="file"
            id="image"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">Adaugă Postarea</button>
      </form>
    </div>
  );
};

export default AddPost;
