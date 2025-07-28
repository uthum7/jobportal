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
    const [token, setToken] = useState(null);
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Effect to read the token from the URL query parameters when the component first loads.
    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            // Display an error if the URL doesn't contain a token.
            setError("Activation token not found in URL. Please use the link provided in your email.");
        }
    }, [searchParams]); // This dependency array ensures the effect only runs when the URL changes.

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

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
            const response = await axios.post(
                'http://localhost:5001/api/register/force-reset-password', 
                { newPassword, token } // Send the new password and the token to the backend
            );
            
            // On success, set a confirmation message.
            setSuccessMessage(response.data.message + " You will be redirected to the login page shortly...");

            // --- NAVIGATION LOGIC ---
            // After a short delay to allow the user to read the success message,
            // navigate them to the login page.
            setTimeout(() => {
                navigate('/login', { state: { message: "Your account is now active! Please log in." } });
            }, 3000); // Reduced delay to 3 seconds for a faster redirect.

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
                
                {/* Conditionally render a subtitle or the success message */}
                {successMessage ? (
                    <div className={styles.successMessage}>{successMessage}</div>
                ) : (
                    <p className={styles.formSubtitle}>Welcome! Please create a secure password to activate your account.</p>
                )}
                
                {error && <div className={styles.errorMessage}>{error}</div>}

                {/* The form is only displayed if a token exists and the password has not been successfully set yet. */}
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