import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Îndepărtăm token-ul din localStorage
      localStorage.removeItem("user");

      navigate("/welcome");
    } catch (error) {
      console.error("Eroare la delogare:", error);
    }
  };

  return handleLogout;
};
