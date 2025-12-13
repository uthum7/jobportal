// LoginPage.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveAuthData } from '../../utils/auth'; // Keep your auth utility
import styles from "./login.module.css";
import logoPath from "../../assets/img/logo.png";
import AuthSplash from "../../components/AuthSplash/AuthSplash";

const LoginPage = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    username: '', // This is the email field
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

    if (!role) {
      setError("Please select a role to log in.");
      setIsLoading(false);
      return;
    }

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials and role.');
      }

      // --- START OF NEW AND UPDATED LOGIC ---

      // SCENARIO 1: The user must reset their password.
      if (data.passwordResetRequired === true) {
        if (data.tempToken) {
          // Immediately navigate to the force reset page and pass the temporary token.
          // Do NOT save auth data or call onLogin.
          navigate('/force-reset-password', { 
            state: { tempToken: data.tempToken } 
          });
        } else {
          // This would be a backend error if the tempToken is missing.
          throw new Error("Password reset is required, but no temporary token was provided.");
        }

      // SCENARIO 2: A normal, successful login.
      } else if (data.token && data.role && (data.userId || data._id)) {
        const currentUserId = data.userId || data._id;

        const userObjectToSave = {
          token: data.token,
          role: data.role.toUpperCase(),
          userId: currentUserId,
          email: data.email,
          name: data.name,
        };

        saveAuthData(userObjectToSave); // Save to localStorage or context
        onLogin(userObjectToSave);     // Update the parent component's state (e.g., App.jsx)
        
        // Navigation is likely handled by the parent component after onLogin is called.

      } else {
        // This error means the backend's NORMAL login response is missing key fields.
        console.error("Login API response missing essential data:", data);
        throw new Error("Login response from server is incomplete.");
      }

      // --- END OF NEW AND UPDATED LOGIC ---

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
              {/* Note: In a real app, you might have a separate login for Employees */}
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>

          <div className={styles.formOptions}>
            <Link to="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot Password?
            </Link>
          </div>

          {/* ✅ FIX: className must use a template literal wrapped in {} */}
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