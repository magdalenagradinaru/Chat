import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Îndepărtăm token-ul din localStorage
      localStorage.removeItem("user");

      // Navigăm la pagina de welcome
      navigate("/welcome"); 
    } catch (error) {
      console.error("Eroare la delogare:", error);
    }
  };

  return handleLogout;
};
