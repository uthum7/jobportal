import React from "react";
import styles from "./RegistrationPage.module.css"; // Import external CSS
import { AiOutlineClose } from "react-icons/ai";
import registerImage from '../../assets/img/sign-up.png'; // Replace with your registration image

const RegistrationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Hide if modal is not open

  const handleRegister = (e) => {
    e.preventDefault();
    // Handle registration logic here
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
            <img src={registerImage} alt="Registration Illustration" />
            <p className={styles.helpText}>It’s a jungle out there. We’ll be your guide!</p>
          </div>

          {/* Right Side Registration Form */}
          <div className={styles.modalForm}>
            <h2 className={styles.modalTitle}>Register</h2>
            <form onSubmit={handleRegister}>
              {/* Given Name Field */}
              <input
                type="text"
                placeholder="Given Name"
                className={styles.modalInput}
                required
              />

              {/* Email Field */}
              <input
                type="email"
                placeholder="Email"
                className={styles.modalInput}
                required
              />

              {/* Terms & Privacy Policy Checkbox */}
              <div className={styles.termsContainer}>
                <input
                  type="checkbox"
                  id="terms"
                  className={styles.termsCheckbox}
                  required
                />
                <label htmlFor="terms" className={styles.termsText}>
                  I consent to the Terms & Privacy Policy.
                </label>
              </div>

              {/* Register Button */}
              <button type="submit" className={styles.registerBtn}>
                Register Now
              </button>
            </form>

            {/* Or Sign Up with Google */}
            <p className={styles.orText}>Or Sign Up with:</p>
            <button className={styles.googleBtn}>Google</button>

            {/* Additional Info */}
            <p className={styles.infoText}>
              A password can be set after you sign up if you prefer. Meanwhile, your information is secure and private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;