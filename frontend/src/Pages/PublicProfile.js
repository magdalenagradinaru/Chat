import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function ProfileDetail({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: "10px" }}>
      <strong>{label}:</strong> {value}
    </div>
  );
}

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/profile/${username}/`
        );
        setProfile(data);
      } catch (err) {
        setError("Profilul nu a putut fi găsit.");
      }
    })();
  }, [username]);

  if (error) return <Layout><p className="text-danger">{error}</p></Layout>;
  if (!profile) return <Layout><p>Se încarcă…</p></Layout>;

  return (
    <Layout>
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="card p-4 shadow-sm">
          <div className="text-center mb-3">
            <img
              src={
                profile.profile_picture
                  ? `http://localhost:8000${profile.profile_picture}`
                  : "https://bootdey.com/img/Content/avatar/avatar7.png"
              }
              alt="avatar"
              className="rounded-circle mb-2"
              width="140"
              height="140"
            />
            <h3 className="fw-bold">{profile.full_name || profile.username}</h3>
          </div>

          <ProfileDetail label="Email" value={profile.email} />
          <ProfileDetail label="Telefon" value={profile.phone_number} />
          <ProfileDetail label="Adresă" value={profile.address} />
          <ProfileDetail label="Educație" value={profile.education} />
          <ProfileDetail label="Experiență" value={profile.work_experience} />
          <ProfileDetail
            label="Link lucrări"
            value={
              profile.biography ? (
                <a href={profile.biography} target="_blank" rel="noopener noreferrer">
                  {profile.biography}
                </a>
              ) : null
            }
          />
        </div>
      </div>
    </Layout>
  );
}
