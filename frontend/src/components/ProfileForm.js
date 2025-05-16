import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileForm = ({ setUserProfile }) => {
  const [profile, setProfile] = useState({
    phone_number: '',
    address: '',
    profile_picture: null,
    education: '',
    work_experience: '',
    biography: ''
  });
  const [message, setMessage] = useState('');
    const formData = new FormData();

formData.append('full_name', formValues.full_name);
formData.append('phone_number', formValues.phone_number);
formData.append('address', formValues.address);
formData.append('education', formValues.education);
formData.append('work_experience', formValues.work_experience);
formData.append('biography', formValues.biography);

if (formValues.profile_picture) {
  formData.append('profile_picture', formValues.profile_picture);  // Trebuie să fie un File
}


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfile(prev => ({
      ...prev,
      profile_picture: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('access');
  const formData = new FormData();

  const allowedFields = [
    'phone_number',
    'address',
    'profile_picture',
    'education',
    'work_experience',
    'biography'
  ];

  allowedFields.forEach((key) => {
    if (profile[key] !== null && profile[key] !== undefined) {
      formData.append(key, profile[key]);
    }
  });

  console.log("Form data trimis:", formData);

  try {
    const response = await axios.put('http://127.0.0.1:8000/api/profile/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    setUserProfile(response.data);
    setMessage('Profil actualizat cu succes!');
  } catch (error) {
    console.error('Eroare la actualizarea profilului:', error);
    setMessage('A apărut o eroare la salvare.');
  }
};


  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Eroare la încărcarea profilului:', error);
        setMessage('Nu s-a putut încărca profilul.');
      }
    };
    fetchProfile();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <p>{message}</p>
      <div>
        <label>Număr de telefon</label>
        <input
          type="text"
          name="phone_number"
          value={profile.phone_number}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Adresă</label>
        <input
          type="text"
          name="address"
          value={profile.address}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Fotografie de profil</label>
        <input
          type="file"
          name="profile_picture"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <label>Educație</label>
        <textarea
          name="education"
          value={profile.education}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Experiență de lucru</label>
        <textarea
          name="work_experience"
          value={profile.work_experience}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Biografie</label>
        <textarea
          name="biography"
          value={profile.biography}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Salvează</button>
    </form>
  );
};

export default ProfileForm;
