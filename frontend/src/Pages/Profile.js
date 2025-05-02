import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/cover.css"; // Asigură-te că acest fișier CSS există
import Layout from "../components/Layout"; // Asigură-te că ai un Layout disponibil
import axios from 'axios';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Obține profilul utilizatorului din API
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('access');
    console.log("Token trimis:", token);

    const response = await axios.get('http://127.0.0.1:8000/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log("Profilul utilizatorului:", response.data);
    setUserProfile(response.data);
  } catch (error) {
    console.error("Nu s-au putut prelua datele de profil:", error);
    if (error.response) {
      console.error("Detalii eroare:", error.response.data);
const errorMessage = error.response?.data?.detail || error.response?.data?.error || "A apărut o eroare necunoscută.";
alert("Eroare: " + errorMessage);
    }
  }
};


    fetchUserProfile();
  }, []);

  // Verifică dacă profilele au fost încărcate
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
                    src="https://bootdey.com/img/Content/avatar/avatar7.png"
                    alt="User"
                    className="rounded-circle"
                    width="150"
                  />
                  <div className="mt-3">
                    <h4>{userProfile.full_name || "User Name"}</h4>
                    <p className="text-secondary mb-1">Category: {userProfile.category}</p>
                    <p className="text-muted font-size-sm">{userProfile.email || "No email"}</p>
                    <button className="btn btn-primary">Follow</button>
                    <button className="btn btn-outline-primary">Message</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <ProfileDetail label="Category" value={userProfile.category} />
                  <ProfileDetail label="Email" value={userProfile.email} />
                  <div className="row">
                    <div className="col-sm-12">
                      <button className="btn btn-info">Edit</button>
                    </div>
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
