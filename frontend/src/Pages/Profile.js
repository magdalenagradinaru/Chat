import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/cover.css";
import Layout from "../components/Layout";
import ProfileForm from "../components/ProfileForm";
import useProfileData from "../components/useProfileData";

const Profile = () => {
  const { userProfile, setUserProfile, loading, error } = useProfileData();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!userProfile) return <div>Profilul nu a fost găsit.</div>;

  return (
    <Layout>
      <div className="container">
        <div className="main-body">
          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body text-center">
                  <img
                    src={
                      userProfile.profile_picture
                        ? `http://127.0.0.1:8000${userProfile.profile_picture}`
                        : "https://bootdey.com/img/Content/avatar/avatar7.png"
                    }
                    alt="UserImg"
                    className="rounded-circle"
                    width="150"
                  />
                  <div className="mt-3">
                    <h4>{userProfile.username || "User Name"}</h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <ProfileDetail label="Categorie" value={userProfile.category} />
                  <ProfileDetail label="Email" value={userProfile.email} />
                  <ProfileDetail label="Număr de telefon" value={userProfile.phone_number} />
                  <ProfileDetail label="Adresă fizică" value={userProfile.address} />
                  <ProfileDetail label="Educație / Descriere" value={userProfile.education} />
                  <ProfileDetail label="Experiență de muncă / Oportunități oferite" value={userProfile.work_experience} />
                  <ProfileDetail
                    label="Portofoliu / Website"
                    value={
                      userProfile.biography ? (
                        <a href={userProfile.biography} target="_blank" rel="noopener noreferrer">
                          {userProfile.biography}
                        </a>
                      ) : (
                        "N/A"
                      )
                    }
                  />
                  <div className="row">
                    <div className="col-sm-12">
                      <button className="btn btn-info" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Închide editorul" : "Editează"}
                      </button>
                    </div>
                    {showForm && (
                      <div className="mt-4">
                        <h5>Editare Profil</h5>
                        <ProfileForm userProfile={userProfile} setUserProfile={setUserProfile} />
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
