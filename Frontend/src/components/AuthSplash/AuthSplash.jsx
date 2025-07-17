import React, { useEffect, useState } from 'react';
import styles from './AuthSplash.module.css';
import logo from '../../assets/img/logo.png';

const AuthSplash = ({ onFinish, type }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 300);
    const textTimer = setTimeout(() => setShowText(true), 800);
    const finishTimer = setTimeout(onFinish, 2000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={styles.authSplash}>
      {showLogo && (
        <img 
          src={logo} 
          alt="Logo" 
          className={`${styles.splashLogo} ${styles.fadeIn}`} 
        />
      )}
      {showText && (
        <h1 className={styles.splashText}>
          {type === 'login' ? 'Welcome Back!' : 'Create Account'}
        </h1>
      )}
    </div>
  );
};

export default AuthSplash;