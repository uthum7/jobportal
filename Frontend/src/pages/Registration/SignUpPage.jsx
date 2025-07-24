import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { saveToken } from '../../utils/auth'; // Not typically needed on signup, token is for login
import { FaUser, FaEnvelope, FaLock, FaUsersCog } from "react-icons/fa"; // Changed FaUsers to FaUsersCog for role
import styles from "./SignUpPage.module.css"; // Using CSS Modules
import logoPath from "../../assets/img/logo.png";
// import backgroundPath from "../../assets/img/background.png"; // Removed as left pane is removed
import AuthSplash from "../../components/AuthSplash/AuthSplash";

const SignUpPage = ({ onClose }) => { // onClose might not be used if it's a full page
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();


  

  const ROLES = ["MENTOR", "MENTEE", "JOBSEEKER", "EMPLOYEE"]; // Ensure ADMIN is a selectable role if needed


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Clear submit error if user starts typing again
    if (errors.submit) {
        setErrors(prev => ({...prev, submit: ""}));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username.trim()) tempErrors.username = "Username is required.";
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email address is invalid.";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.role) tempErrors.role = "Please select a role.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous submit errors
    
    try {
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        roles: [formData.role.toUpperCase()] // Backend expects 'roles' as an array
      };

      const response = await fetch("http://localhost:5001/api/register/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (response.ok) {
        // Optionally, display a success message via a toast or alert
        // For now, navigating to login directly after success
        navigate("/login", { state: { message: "Registration successful! Please login." } });
      } else {
        setErrors({ submit: data.message || "Registration failed. Please check your details." });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Registration failed due to a network or server error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSplash) {
    return <AuthSplash type="signup" onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className={styles.signupPageWrapper}> {/* Full page wrapper */}
      <div className={styles.signupFormCard}>   {/* The centered card for the form */}
        <div className={styles.logoContainer}>
          <img src={logoPath} alt="JobPortal Logo" className={styles.logoImg} />
        </div>
        
        <h1 className={styles.formTitle}>Create Your Account</h1>
        <p className={styles.formSubtitle}>Join us and start your journey.</p>
        
        {errors.submit && (
          <div className={styles.errorMessage}> 
            {errors.submit}
          </div>
        )}
          
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="username">
              <FaUser className={styles.inputIcon} /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={styles.inputField}
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </div>
            
          <div className={styles.formGroup}>
            <label htmlFor="email">
              <FaEnvelope className={styles.inputIcon} /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.inputField}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g., you@example.com"
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
            
          <div className={styles.formGroup}>
            <label htmlFor="password">
              <FaLock className={styles.inputIcon} /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.inputField}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>
            
          <div className={styles.formGroup}>
            <label htmlFor="role">
              <FaUsersCog className={styles.inputIcon} /> I am a
            </label>
            <select
              id="role" // Added id for label association
              name="role"
              className={styles.selectField}
              value={formData.role}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              <option value="" disabled>Select your role</option>
              {ROLES.map((roleItem) => ( // Changed variable name to avoid conflict
                <option key={roleItem} value={roleItem}>
                  {roleItem.charAt(0).toUpperCase() + roleItem.slice(1).toLowerCase()} {/* Capitalize role */}
                </option>
              ))}
            </select>
            {errors.role && <span className={styles.errorText}>{errors.role}</span>}
          </div>
            
          <button 
            type="submit" 
            className={`${styles.submitButton} ${styles.btnPrimary}`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
          
        <div className={styles.alternativeAction}>
          Already have an account?{" "}
          <span 
            className={styles.linkStyled}
            onClick={() => navigate("/login")}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate("/login"); }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;