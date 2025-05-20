import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileForm = ({ setUserProfile }) => {
  const [profile, setProfile] = useState({
    phone_number: "",
    address: "",
    profile_picture: null,       // fișier încărcat nou
    profile_picture_url: "",     // url-ul pozei curente (string)
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
    allowed.forEach((k) => {
      if (k === "profile_picture") {
        // trimite poza doar dacă e un fișier (File), nu URL string sau null
        if (profile.profile_picture instanceof File) {
          fd.append(k, profile.profile_picture);
        }
      } else {
        if (profile[k]) {
          fd.append(k, profile[k]);
        }
      }
    });

    try {
      const { data } = await axios.put(
        "http://127.0.0.1:8000/api/profile/",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserProfile(data);
      // Actualizăm local state — să resetăm profile_picture (fișierul)
      setProfile((prev) => ({
        ...prev,
        profile_picture: null,
        profile_picture_url: data.profile_picture || prev.profile_picture_url,
      }));
      setMessage("Profil actualizat cu succes!");
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        const errors = err.response.data;
        let errorMessages = [];

        if (typeof errors === "object" && !Array.isArray(errors)) {
          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              errorMessages.push(`${key}: ${errors[key].join(", ")}`);
            } else {
              errorMessages.push(`${key}: ${errors[key]}`);
            }
          }
        } else {
          errorMessages.push(errors.toString());
        }

        setMessage(`Eroare la salvare: ${errorMessages.join(" | ")}`);
      } else {
        setMessage("A apărut o eroare la salvare.");
      }
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
        setProfile((prev) => ({
          ...prev,
          phone_number: data.phone_number || "",
          address: data.address || "",
          education: data.education || "",
          work_experience: data.work_experience || "",
          biography: data.biography || "",
          profile_picture: null,               // resetăm fișierul încărcat
          profile_picture_url: data.profile_picture || "", // URL poza curentă
        }));
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
        <div
          className={`alert ${
            message.includes("succes") ? "alert-success" : "alert-danger"
          } mb-4`}
        >
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
          <label className="form-label">Adresă fizică</label>
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
          {/* Afișăm poza curentă dacă există */}
          {profile.profile_picture_url && (
            <div className="mb-2">
              <img
                src={profile.profile_picture_url}
                alt="Profil"
                style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "cover" }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Portofoliu / Website</label>
          <input
            type="url"
            className="form-control"
            name="biography"
            value={profile.biography}
            onChange={handleInputChange}
            placeholder="https://exemplu.com/"
          />
        </div>
      </div>

      {/* Row 3 – textareas */}
      <div className="row g-3 mt-3">
        <div className="col-12">
          <label className="form-label">Educație / Descriere</label>
          <textarea
            className="form-control"
            rows="2"
            name="education"
            value={profile.education}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Experiență de lucru/ Oportunități oferite</label>
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
