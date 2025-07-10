import { useCV } from '../../contexts/CVContext';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

const Navigation = () => {
  const { setResumeData } = useCV();
  const navigate = useNavigate();

  const handleCVClick = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Initialize empty CV data
      setResumeData({
        personalInfo: {},
        education: [],
        experience: [],
        skills: [],
        references: [],
        summary: ''
      });

      // Start with the first CV page
      navigate('/cv');
    } catch (error) {
      console.error('Error initializing CV:', error);
    }
  };

  return (
    <nav>
      {/* ...existing navigation items... */}
      <button onClick={handleCVClick}>CV Builder</button>
      {/* ...existing navigation items... */}
    </nav>
  );
};

export default Navigation;