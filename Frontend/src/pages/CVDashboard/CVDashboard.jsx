import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Example icon for social proof
import './CVDashboard.css'; // <--- CRITICAL: Ensure this import is present and correct
import cvPreviewImage from '../../assets/img/cvDashbordBackgroundImg.jpeg'; 

// Placeholder images - ensure these paths are correct or provide actual images
import uneedLogoPlaceholder from '../../assets/img/placeholder-uneed.jpg'; 
import productHuntLogoPlaceholder from '../../assets/img/placeholder-producthunt.jpg';
import starterSkyLogoPlaceholder from '../../assets/img/placeholder-startersky.jpg';
// import rocketIcon from '../../assets/img/rocket-icon.svg'; // Optional

const CVDashboard = () => {
  const navigate = useNavigate();

 const handleBuildResumeClick = () => {
    console.log('Navigating to CV builder (personal info)...');
    // MODIFIED LINE BELOW: Navigate to the first step (Cv.jsx)
    navigate('/cv-builder/personal-info');
  };

  const handleCheckATSScoreClick = () => {
    alert("ATS Score Checker coming soon!");
  };

  const socialProofUsers = [
    { id: 1, alt: 'User 1' }, { id: 2, alt: 'User 2' },
    { id: 3, alt: 'User 3' }, { id: 4, alt: 'User 4' },
  ];

  return (
    // Class names here MUST match selectors in CVDashboard.css
    <div className="cv-dashboard-page"> {/* Matches .cv-dashboard-page in CSS */}
      <section className="cv-hero-section"> {/* Matches .cv-hero-section */}
        <div className="cv-hero-container"> {/* Matches .cv-hero-container */}
          <div className="cv-hero-content-left"> {/* Matches .cv-hero-content-left */}
            <h1 className="cv-hero-title"> {/* Matches .cv-hero-title */}
              Craft Your <span className="highlight-text">Career Story</span> with AI Resume Builder
            </h1>
            <p className="cv-hero-subtitle"> {/* Matches .cv-hero-subtitle */}
              Transform your job search with AI that makes you 3x more likely to land interviews. From AI resume creation to job tracking, LinkedIn optimization, and interview preparation - we're your complete career toolkit.
            </p>
            <div className="cv-hero-actions"> {/* Matches .cv-hero-actions */}
              <button 
                className="btn-cv-primary" // Matches .btn-cv-primary
                onClick={handleBuildResumeClick}
              >
                Build Resume with AI
              </button>
              <button 
                className="btn-cv-secondary" // Matches .btn-cv-secondary
                onClick={handleCheckATSScoreClick}
              >
                Check ATS Score
              </button>
            </div>
            <p className="cv-hero-stats-text"> {/* Matches .cv-hero-stats-text */}
              95% of candidates land interviews with tailored resumes
            </p>
            <div className="cv-social-proof"> {/* Matches .cv-social-proof */}
              <div className="social-proof-avatars"> {/* Matches .social-proof-avatars */}
                {socialProofUsers.map(user => (
                  <span key={user.id} className="avatar-placeholder"><FaUserCircle /></span> 
                ))}
              </div>
              <div className="social-proof-text"> {/* Matches .social-proof-text */}
                <span className="stars">★★★★★</span>
                Trusted by <strong>40,000+</strong> successfully hired professionals
              </div>
            </div>
          </div>
          <div className="cv-hero-content-right"> {/* Matches .cv-hero-content-right */}
            <div className="cv-image-wrapper"> {/* Matches .cv-image-wrapper */}
              <img src={cvPreviewImage} alt="AI Resume Builder Preview" className="cv-preview-image" /> {/* Matches .cv-preview-image */}
              {/* <img src={rocketIcon} alt="Rocket" className="rocket-icon" /> */}
            </div>
          </div>
        </div>
      </section>

      <section className="trusted-by-section"> {/* Matches .trusted-by-section */}
        <h2 className="trusted-by-title">Trusted By Innovation Leaders <span role="img" aria-label="heart">🖤</span></h2> {/* Matches .trusted-by-title */}
        <div className="trusted-by-logos"> {/* Matches .trusted-by-logos */}
          <div className="trusted-logo-item"> {/* Matches .trusted-logo-item */}
            <img src={uneedLogoPlaceholder} alt="UNEED Yearly Winner" />
          </div>
          <div className="trusted-logo-item product-hunt"> {/* Matches .trusted-logo-item.product-hunt */}
            <img src={productHuntLogoPlaceholder} alt="Product Hunt #1 Product of the day" />
          </div>
          <div className="trusted-logo-item"> {/* Matches .trusted-logo-item */}
            <img src={starterSkyLogoPlaceholder} alt="StarterSky" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CVDashboard;