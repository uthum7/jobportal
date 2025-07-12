// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveAuthData } from '../../utils/auth'; // <<<< CORRECT: Import saveAuthData
import styles from "./login.module.css";
import logoPath from "../../assets/img/logo.png";
import AuthSplash from "../../components/AuthSplash/AuthSplash";

const LoginPage = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    username: '', // Assuming this is email
    password: ''
  });
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginData = {
        email: formData.username.trim(),
        password: formData.password,
        role: role
      };

      const response = await fetch('http://localhost:5001/api/register/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json(); // Expects { token, role, userId (or _id), email, name etc. }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials and role.');
      }

      // --- IMPORTANT AUTHENTICATION DATA HANDLING ---
      if (data.token && data.role && (data.userId || data._id)) {
        const currentUserId = data.userId || data._id; // Prefer userId, fallback to _id

        // Create the user object to be saved and passed to App's context
        const userObjectToSave = {
          token: data.token,
          role: data.role.toUpperCase(), // Standardize role to uppercase
          userId: currentUserId,
          email: data.email, // Assuming backend sends email
          name: data.name,   // Assuming backend sends name
          // Add any other relevant user details your app needs from `data`
        };

        saveAuthData(userObjectToSave); // <<<< CORRECT: Use saveAuthData from auth.js

        onLogin(userObjectToSave); // This calls App.jsx's handleLogin, passing the same complete object
        // App.jsx's useEffect will handle navigation to the correct dashboard.

      } else {
        // This error means your backend login response is not sending all required fields.
        // Check your backend to ensure it returns: token, role, and (userId or _id).
        // Also, make sure it sends other details like email and name if you need them.
        console.error("Login API response missing essential data:", data);
        throw new Error("Login response missing essential data (token, role, or user identifier). Please contact support.");
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSplash) {
    return <AuthSplash type="login" onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginFormCard}>
        <div className={styles.logoContainer}>
          <img src={logoPath} alt="JobPortal Logo" className={styles.logoImg} />
        </div>

        <h1 className={styles.formTitle}>Welcome Back!</h1>
        <p className={styles.formSubtitle}>Please sign in to continue.</p>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className={styles.inputField}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="e.g., you@example.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={styles.inputField}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Login as</label>
            <select
              id="role"
              name="role"
              className={styles.selectField}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="" disabled>Select your role</option>
              <option value="MENTEE">Mentee</option>
              <option value="MENTOR">Mentor</option>
              <option value="JOBSEEKER">Job Seeker</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className={styles.formOptions}>
            <Link to="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${styles.btnPrimary}`}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className={styles.alternativeAction}>
          Don't have an account?{" "}
          <span
            className={styles.linkStyled}
            onClick={() => {
              if (onClose) onClose();
              navigate("/register");
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate("/register"); }}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;