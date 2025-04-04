import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/cover.css"; // Asigură-te că acest fișier CSS există
import Layout from "../components/Layout"; // Asigură-te că ai un Layout disponibil

const ProfilePage = () => {
  const user = {
    full_name: "Magdalena.08",
    email: "gradinaru.madalina@gmail.com",
    phone: "+252 77-9-11",
    mobile: "069227777",
    address: "Str. Gheorghe Cașu , Chișinău"
  };

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
                    <h4>{user.full_name || "User Name"}</h4>
                    <p className="text-secondary mb-1">Full Stack Developer</p>
                    <p className="text-muted font-size-sm">{user.address || "Location"}</p>
                    <button className="btn btn-primary">Follow</button>
                    <button className="btn btn-outline-primary">Message</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <ProfileDetail label="Nume complet" value={user.full_name} />
                  <ProfileDetail label="Email" value={user.email} />
                  <ProfileDetail label="Telefon Fix" value={user.phone} />
                  <ProfileDetail label="Telefon Mobil" value={user.mobile} />
                  <ProfileDetail label="Adresa" value={user.address} />
                  <div className="row">
                    <div className="col-sm-12">
                      <button className="btn btn-info">Editează</button>
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

export default ProfilePage;
