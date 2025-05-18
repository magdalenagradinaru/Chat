import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileForm = ({ setUserProfile }) => {
  const [profile, setProfile] = useState({
    phone_number: "",
    address: "",
    profile_picture: null,
    education: "",
    work_experience: "",
    biography: "",
  });

  const [message, setMessage] = useState("");

  /* ───────────── Handlers ───────────── */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      setProfile((prev) => ({ ...prev, profile_picture: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    if (!token) {
      setMessage("Trebuie să fii autentificat.");
      return;
    }

    const allowed = [
      "phone_number",
      "address",
      "profile_picture",
      "education",
      "work_experience",
      "biography",
    ];
    const fd = new FormData();
    allowed.forEach((k) => profile[k] && fd.append(k, profile[k]));

    try {
      const { data } = await axios.put(
        "http://127.0.0.1:8000/api/profile/",
        fd,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      setUserProfile(data);
      setMessage("Profil actualizat cu succes!");
    } catch (err) {
      console.error(err);
      setMessage("A apărut o eroare la salvare.");
    }
  };

  /* ───────────── Fetch existing profile ───────────── */

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("access");
      if (!token) return;
      try {
        const { data } = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
        setMessage("Nu s-a putut încărca profilul.");
      }
    })();
  }, []);

  /* ───────────── UI ───────────── */

  return (
    <form className="card shadow-sm p-4" onSubmit={handleSubmit}>
      {message && (
        <div className={`alert ${message.includes("succes") ? "alert-success" : "alert-danger"} mb-4`}>
          {message}
        </div>
      )}

      {/* Row 1 */}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Număr de telefon</label>
          <input
            type="text"
            className="form-control"
            name="phone_number"
            value={profile.phone_number}
            onChange={handleInputChange}
            placeholder="+373 699 000 000"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Adresă</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={profile.address}
            onChange={handleInputChange}
            placeholder="Str. Exemplar 10, Chișinău"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <label className="form-label">Fotografie de profil</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Link către lucrări / portofoliu</label>
          <input
            type="url"
            className="form-control"
            name="biography"
            value={profile.biography}
            onChange={handleInputChange}
            placeholder="https://exemplu.com/despre-mine"
          />
        </div>
      </div>

      {/* Row 3 – textareas */}
      <div className="row g-3 mt-3">
        <div className="col-12">
          <label className="form-label">Educație</label>
          <textarea
            className="form-control"
            rows="2"
            name="education"
            value={profile.education}
            onChange={handleInputChange}
            placeholder="Facultatea de Informatică, UTM (2021-2025)"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Experiență de lucru</label>
          <textarea
            className="form-control"
            rows="2"
            name="work_experience"
            value={profile.work_experience}
            onChange={handleInputChange}
            placeholder="Intern programator 1C, ULTRA (2024-prezent)"
          />
        </div>
      </div>

      <div className="text-end mt-4">
        <button type="submit" className="btn btn-primary px-4">
          Salvează
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
