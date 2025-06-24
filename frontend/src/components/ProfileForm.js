import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileForm = ({ userProfile, setUserProfile }) => {
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

  useEffect(() => {
    if (userProfile) {
      setProfile({
        phone_number: userProfile.phone_number || "",
        address: userProfile.address || "",
        education: userProfile.education || "",
        work_experience: userProfile.work_experience || "",
        biography: userProfile.biography || "",
        profile_picture: null,
        profile_picture_url: userProfile.profile_picture || "",
      });
    }
  }, [userProfile]);

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
      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <label className="form-label">Fotografie de profil</label>
          {profile.profile_picture_url && (
            <div className="mb-2">
              <img
                src={profile.profile_picture_url.startsWith("http") ? profile.profile_picture_url : `http://127.0.0.1:8000${profile.profile_picture_url}`}
                alt="Profil"
                width="100"
                className="img-thumbnail"
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            name="profile_picture"
            accept="image/*"
            onChange={handleFileChange}
          />
          <small className="form-text text-muted">
            Poți încărca o nouă fotografie pentru profil.
          </small>
        </div>
        <div className="col-md-6">
          <label className="form-label">Educație / Descriere</label>
          <textarea
            className="form-control"
            name="education"
            value={profile.education}
            onChange={handleInputChange}
            rows="3"
            placeholder="Educație și alte informații relevante"
          ></textarea>
        </div>
      </div>
      <div className="row g-3 mt-3">
        <div className="col-md-6">
          <label className="form-label">Experiență de muncă / Oportunități oferite</label>
          <textarea
            className="form-control"
            name="work_experience"
            value={profile.work_experience}
            onChange={handleInputChange}
            rows="3"
            placeholder="Experiență și oferte"
          ></textarea>
        </div>
        <div className="col-md-6">
          <label className="form-label">Portofoliu / Website</label>
          <input
            type="text"
            className="form-control"
            name="biography"
            value={profile.biography}
            onChange={handleInputChange}
            placeholder="https://exemplu.com"
          />
        </div>
      </div>
      <div className="mt-4 text-end">
        <button type="submit" className="btn btn-primary">
          Salvează modificările
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
