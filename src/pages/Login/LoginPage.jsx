import React from "react";
import styles from "./LoginPage.module.css"; // Import external CSS
import { AiOutlineClose } from "react-icons/ai";
import loginImage from '../../assets/img/logo_img.jpeg';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Hide if modal is not open

  const handleSignIn = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Handle register logic here
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>
          <AiOutlineClose size={24} />
        </button>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Left Side Image */}
          <div className={styles.modalImage}>
            <img src={loginImage} alt="Login Illustration" />
          </div>

          {/* Right Side Login Form */}
          <div className={styles.modalForm}>
          
            <form onSubmit={handleSignIn}>
              <h2 className={styles.modalTitle}>Sign in</h2>
              <p className={styles.modalSubtitle}>Welcome back! Sign in to continue</p>
              <input type="text" placeholder="Username" className={styles.modalInput} required />
              <input type="text" placeholder="Password" className={styles.modalInput} required />
           
              <button type="submit" className={styles.magicLinkBtn}>Sign in</button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;