// src/pages/Admin/AddUserForm.jsx

import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUsersCog } from "react-icons/fa";

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'MENTOR',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            setError("Username, email, and password are required.");
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        setError('');

        // --- ✅ START OF THE FIX: Correctly retrieving the auth token ---
        const savedUserString = localStorage.getItem('user');
        if (!savedUserString) {
            setError("Authentication error: No user data found. Please log in again.");
            setIsLoading(false);
            return;
        }

        const savedUser = JSON.parse(savedUserString);
        const token = savedUser?.token;

        if (!token) {
            setError("Authentication error: Token not found. Please log in again.");
            setIsLoading(false);
            return;
        }
        // --- ✅ END OF THE FIX ---

        try {
            const response = await fetch('http://localhost:5001/api/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Use the correctly retrieved token from the logged-in admin
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData) 
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`User '${formData.username}' created successfully as a ${formData.role}.`);
                setFormData({ username: '', email: '', password: '', role: 'MENTOR' });
            } else {
                // Handle both 401 Unauthorized from middleware and other errors from the controller
                throw new Error(data.message || 'Failed to create user.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h3>Create a New User</h3>
            
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleAddUser}>
                {/* Username Input */}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-with-icon">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="e.g., john.doe"
                            required
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div className="form-group">
                    <label htmlFor="email">User Email</label>
                    <div className="input-with-icon">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="form-group">
                    <label htmlFor="password">Initial Password</label>
                    <div className="input-with-icon">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Set an initial password"
                            required
                        />
                    </div>
                </div>

                {/* Role Selection */}
                <div className="form-group">
                    <label htmlFor="role">Assign Role</label>
                    <div className="input-with-icon">
                        <FaUsersCog className="input-icon" />
                        <select 
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="MENTOR">Mentor</option>
                            <option value="EMPLOYEE">Employee</option>
                        </select>
                    </div>
                </div>
                
                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="form-submit-btn"
                >
                    {isLoading ? 'Creating User...' : 'Add User'}
                </button>
            </form>
        </>
    );
};

export default AddUserForm;