import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css"; // Import external CSS
import { AiOutlineClose } from "react-icons/ai";
import { saveToken } from '../../utils/auth';
import loginImage from '../../assets/img/logo_img.jpeg';
import axios from "axios";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Hide if modal is not open

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for redirection

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
        // Send login request
        const res = await axios.post("http://localhost:5001/api/register/login", { email, password });

        // Save the token using saveToken utility function
        saveToken(res.data.token);

        console.log("Login successful!", res.data);

        // Reset form fields
        setEmail("");
        setPassword("");

        // Close modal after successful login
        onClose();

        // Navigate to the home page
        navigate("/");
    } catch (error) {
        // Handle errors
        const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
        console.error("Login failed:", errorMessage);

        // Set error state to display in the UI
        setError(errorMessage);
    }
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

              {/* Email Input */}
              <input
                type="email"
                placeholder="Email"
                className={styles.modalInput}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              {/* Password Input (Fixed security issue) */}
              <input
                type="password"
                placeholder="Password"
                className={styles.modalInput}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />

              {/* Sign In Button */}
              <button type="submit" className={styles.magicLinkBtn}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
