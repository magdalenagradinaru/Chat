import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/cover.css";
import Layout from "../components/Layout";
import axios from 'axios';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('access');
    if (!token) {
      console.error("Nu există token JWT în localStorage.");
      return;
    }
    const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    setUserProfile(response.data);
  } catch (error) {
    console.error("Nu s-au putut prelua datele de profil:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
};


    fetchUserProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }



  return (
    <Layout>
      <div className="container">
        <div className="main-body">
          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body text-center">
                <img
  src={userProfile.profile_picture ? `http://127.0.0.1:8000${userProfile.profile_picture}` : "https://bootdey.com/img/Content/avatar/avatar7.png"}
                    alt="UserImg"
                    className="rounded-circle"
                    width="150"
                  />
                  <div className="mt-3">
                    <h4>{userProfile.username || "User Name"}</h4> {/* Afișează username-ul */}
                    <button className="btn btn-primary">Urmăriri</button>
                    <button className="btn btn-outline-primary">Mesaje</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  {/* Afișează detalii adiționale înainte de butonul de editare */}
                 <ProfileDetail label="Nume complet" value={userProfile.full_name} />
                  <ProfileDetail label="Categorie" value={userProfile.category} />
                  <ProfileDetail label="Email" value={userProfile.email} />
                  <ProfileDetail label="Număr de telefon" value={userProfile.phone_number} />
                  <ProfileDetail label="Adresă" value={userProfile.address} />
                   <ProfileDetail label="Educație" value={userProfile.education} />
                  <ProfileDetail label="Experiență de muncă" value={userProfile.work_experience} />
<ProfileDetail
  label="Biografie"
  value={
    userProfile.biography ? (
      <a href={userProfile.biography} target="_blank" rel="noopener noreferrer">
        {userProfile.biography}
      </a>
    ) : "N/A"
  }
/>
                  {/* Afișează formularul pentru editare */}
                  <div className="row">
                    <div className="col-sm-12">
                      <button className="btn btn-info" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Închide editorul" : "Editează"}
                      </button>
                    </div>
                    {showForm && (
                      <div className="mt-4">
                        <h5>Editare Profil</h5>
                        <ProfileForm setUserProfile={setUserProfile} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ProfileDetail = ({ label, value }) => (
  <>
    <div className="row">
      <div className="col-sm-3">
        <h6 className="mb-0">{label}</h6>
      </div>
      <div className="col-sm-9 text-secondary">{value || "N/A"}</div>
    </div>
    <hr />
  </>
);

export default Profile;