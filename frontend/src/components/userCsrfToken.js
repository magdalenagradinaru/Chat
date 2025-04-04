import axios from "axios";

export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/get-csrf-token/", {
      withCredentials: true,
    });
    return response.data.csrfToken;
  } catch (error) {
    console.error("Eroare la obținerea CSRF token-ului:", error);
    return null;
  }
};
