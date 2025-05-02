import { useNavigate } from 'react-router-dom';  // Importați useNavigate din React Router
import { FaArrowLeft } from 'react-icons/fa';    // Importați iconul dorit (ex: FaArrowLeft)

const BackButton = ({ to }) => {
  const navigate = useNavigate();  // Creează funcția de navigare

  return (
    <button
      onClick={() => navigate(to)}  // Navighează la ruta personalizată
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <FaArrowLeft size={24} style={{ marginRight: '8px' }} />
      Înapoi
    </button>
  );
};

export default BackButton;
