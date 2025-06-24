import { useState, useEffect } from "react";
import axios from "axios";

const useProfileData = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setError("Nu există token JWT în localStorage.");
          setLoading(false);
          return;
        }
        const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (err) {
        setError("Nu s-au putut prelua datele de profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { userProfile, setUserProfile, loading, error };
};

export default useProfileData;
