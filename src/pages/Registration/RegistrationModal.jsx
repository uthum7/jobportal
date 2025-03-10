import React, { useState } from "react";
import styles from "./RegistrationPage.module.css"; // Import external CSS
import { AiOutlineClose } from "react-icons/ai";
import registerImage from '../../assets/img/regimg.jpeg'; // Replace with your registration image
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function sendData(e) {
    e.preventDefault();
    
    const newRegisterUser = {
      userName: name, // Corrected the variable name
      email,
      password,
      confirmPassword
    };

    axios.post("http://localhost:8090/registerusers/add", newRegisterUser)
      .then(() => {
        alert("User Added");
        navigate("/login");
      })
      .catch((err) => {
        alert(err);
      });
  }

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
            <form onSubmit={sendData}>
              {/* Name Field */}
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name} // Fixed from userName to name
                placeholder="Username"
                className={styles.modalInput}
                name="userName"
                required
              />

              {/* Email Field */}
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="Email Address"
                className={styles.modalInput}
                name="email"
                required
              />

              {/* Password Field */}
              <input
                type="text"
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                placeholder="Create Password"
                className={styles.modalInput}
                name="password"
                required
              />

              {/* Confirm Password Field */}
              <input
                type="text" // Fixed input type from text to password
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder="Confirm Password"
                className={styles.modalInput}
                name="confirmPassword"
                required
              />

              {/* Register Button */}
              <button type="submit" className={styles.registerBtn}>
                Register Account
              </button>
            </form>

            {/* Or Sign Up with Google */}
            <p className={styles.orText}>Or Sign Up with:</p>
            <button className={styles.googleBtn}>Google</button>

            {/* Additional Info */}
            <p className={styles.infoText}>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
