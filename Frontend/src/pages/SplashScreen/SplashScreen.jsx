
import React, { useEffect, useState } from "react";
// import "../styles/SplashScreen.css"; 
import "../../pages/SplashScreen/splashScreen.module.css"; // Import the CSS file for styling
import logo from "../../assets/img/logo.png"; // Ensure the correct path to the logo image

const SplashScreen = ({ onFinish }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOutLogo, setFadeOutLogo] = useState(false);
  const [showSmallLogo, setShowSmallLogo] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 500);
    const fadeOutTimer = setTimeout(() => setFadeOutLogo(true), 2000);
    const smallLogoTimer = setTimeout(() => setShowSmallLogo(true), 2500);
    const textTimer = setTimeout(() => setShowText(true), 2700);
    const finishTimer = setTimeout(onFinish, 4000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(smallLogoTimer);
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="splash-screen">
      {!fadeOutLogo && showLogo && (
       <img src={logo} alt="Logo" className="splash-logo fade-in" />

      )}
      {showSmallLogo && (
        <img src={logo} alt="Small Logo" className="splash-logo small-logo fade-in" />
      )}
      {showText && <h1 className="splash-text">JobPortal Web Application</h1>}
    </div>
  );
};

export default SplashScreen;
