import React from "react";
import styles from "./LoginPage.module.css"; // Import external CSS
import { AiOutlineClose } from "react-icons/ai";
import loginImage from '../../assets/img/sign-in.png';

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
            <p className={styles.helpText}>Help! Please sign in so we can continue.</p>
          </div>

          {/* Right Side Login Form */}
          <div className={styles.modalForm}>
            <h2 className={styles.modalTitle}>
              <button className={styles.tabButton} onClick={handleRegister}>Register</button>
              <button className={`${styles.tabButton} ${styles.activeTab}`}>Sign In</button>
            </h2>
            <form onSubmit={handleSignIn}>
              <input type="email" placeholder="Email" className={styles.modalInput} required />
              <p className={styles.infoText}>We will send you a one-time sign-in link.</p>
              <button type="submit" className={styles.magicLinkBtn}>Sign in with Magic Link</button>
            </form>
            <button className={styles.passwordBtn}>Switch to Password</button>
            <p className={styles.orText}>Or Sign In with:</p>
            <button className={styles.googleBtn}>Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;