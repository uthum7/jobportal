// pages/ForgotPassword/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './forgotPassword.module.css'; // We'll create this CSS file
import logoPath from "../../assets/img/logo.png";
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter token and new password
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // Handles Step 1: Requesting the reset token
    const handleRequestToken = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
            setSuccessMessage(response.data.message);
            setStep(2); // Move to the next step
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset token. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handles Step 2: Submitting the token and new password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post('http://localhost:5001/api/auth/reset-password', { token, newPassword });
            setSuccessMessage(response.data.message + " You will be redirected to the login page shortly.");
            
            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The token may be invalid or expired.');
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
                
                <h1 className={styles.formTitle}>Reset Your Password</h1>
                
                {error && <div className={styles.errorMessage}>{error}</div>}
                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                {step === 1 ? (
                    <>
                        <p className={styles.formSubtitle}>Enter your email address and we'll send you a link to reset your password.</p>
                        <form onSubmit={handleRequestToken} noValidate>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.inputField}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <p className={styles.formSubtitle}>Check your email for the reset token and enter it below along with your new password.</p>
                        <form onSubmit={handleResetPassword} noValidate>
                            <div className={styles.formGroup}>
                                <label htmlFor="token">Reset Token</label>
                                <input
                                    type="text"
                                    id="token"
                                    className={styles.inputField}
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                    placeholder="Enter the token from your email"
                                    disabled={isLoading}
                                />
                            </div>
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
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}

                <div className={styles.alternativeAction}>
                    Remembered your password?{" "}
                    <span 
                        className={styles.linkStyled}
                        onClick={() => navigate("/login")}
                        role="button"
                    >
                        Back to Sign In
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;