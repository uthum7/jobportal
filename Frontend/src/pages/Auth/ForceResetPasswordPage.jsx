// src/pages/Auth/ForceResetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './ForceResetPassword.module.css';
import logoPath from "../../assets/img/logo.png";
import axios from 'axios';

const ForceResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    // This state will hold the token we read from the URL.
    const [token, setToken] = useState(null);
    
    // useSearchParams is the correct hook for reading URL query parameters like "?token=..."
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // This effect runs once when the component loads to get the token from the URL.
    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            setError("Activation token not found in URL. Please use the link provided in your email.");
        }
    }, [searchParams]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError("A valid activation token is required. Please follow the link from your email again.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            // The API call now sends the token in the BODY of the request.
            // There is no Authorization header needed for this public route.
            const response = await axios.post(
                'http://localhost:5001/api/register/force-reset-password', 
                { newPassword, token } // Send both the new password and the token from the URL
            );
            
            setSuccessMessage(response.data.message + " Redirecting to the login page...");

            setTimeout(() => {
                navigate('/login');
            }, 3500);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set password. The link may be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.formCard}>
                <div className={styles.logoContainer}>
                    <img src={logoPath} alt="JobPortal Logo" className={styles.logoImg} />
                </div>
                
                <h1 className={styles.formTitle}>Activate Your Account</h1>
                <p className={styles.formSubtitle}>Welcome! Please create a secure password to activate your account.</p>
                
                {error && <div className={styles.errorMessage}>{error}</div>}
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                {/* The form will only be displayed if a token was successfully extracted from the URL */}
                {token && !successMessage && (
                    <form onSubmit={handlePasswordReset} noValidate>
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className={styles.inputField}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter your new password"
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className={styles.inputField}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your new password"
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? "Activating..." : "Set Password and Activate Account"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForceResetPasswordPage;