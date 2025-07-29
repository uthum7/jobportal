// src/pages/Admin/AddUserForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUsersCog } from "react-icons/fa";
import {
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Calendar,
  Menu,
  X,
  PlusIcon,
  PlusCircle
} from 'lucide-react';

const AddUserForm = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', role: 'MENTOR',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNavigation = (path) => navigate(path);

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            setError("Username, email, and password are required.");
            return;
        }
        
        setIsLoading(true);
        setMessage('');
        setError('');

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

        try {
            const response = await fetch('http://localhost:5001/api/admin/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // This line is correct.
                },
                body: JSON.stringify(formData) 
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`User '${formData.username}' created successfully as a ${formData.role}.`);
                setFormData({ username: '', email: '', password: '', role: 'MENTOR' });
            } else {
                throw new Error(data.message || 'Failed to create user.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                active ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );

    return (
        <>
            <style>{`
                .add-user-container {
                    padding: 2rem;
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: #f8fafc;
                    min-height: 100vh;
                }

                .add-user-header {
                    margin-bottom: 2rem;
                }

                .add-user-title {
                    font-size: 2rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .add-user-subtitle {
                    color: #64748b;
                    font-size: 1rem;
                    margin: 0;
                }

                .add-user-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e2e8f0;
                }

                .alert {
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                    border: 1px solid;
                }

                .alert-success {
                    background-color: #f0fdf4;
                    border-color: #bbf7d0;
                    color: #166534;
                }

                .alert-error {
                    background-color: #fef2f2;
                    border-color: #fecaca;
                    color: #dc2626;
                }

                .alert-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .alert-icon {
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                .add-user-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .form-label {
                    font-weight: 500;
                    color: #374151;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .label-icon {
                    color: white;
                    font-size: 1.1rem;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    padding: 0.5rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    min-width: 2.5rem;
                    height: 2.5rem;
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .form-input,
                .form-select {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    background-color: white;
                    transition: all 0.3s ease;
                    color: #374151;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .form-input:focus,
                .form-select:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
                    transform: translateY(-1px);
                }

                .form-input::placeholder {
                    color: #9ca3af;
                }

                .form-select {
                    cursor: pointer;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                    appearance: none;
                }

                .form-select option {
                    padding: 0.5rem;
                }

                .form-actions {
                    margin-top: 2rem;
                    display: flex;
                    justify-content: flex-end;
                }

                .submit-btn {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 1rem 2.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    min-width: 140px;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .submit-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
                }

                .submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .submit-btn.loading {
                    pointer-events: none;
                }

                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 640px) {
                    .add-user-container {
                        padding: 1rem;
                    }
                    
                    .add-user-card {
                        padding: 1.5rem;
                    }
                    
                    .add-user-title {
                        font-size: 1.5rem;
                    }
                    
                    .form-actions {
                        justify-content: stretch;
                    }
                    
                    .submit-btn {
                        width: 100%;
                    }
                }

                .form-input:hover,
                .form-select:hover {
                    border-color: #10b981;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
                }

                .alert {
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            
            <div className="min-h-screen flex bg-gray-50">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                                <img src="/api/placeholder/48/48" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Dinusha Herath</h3>
                                <p className="text-sm text-gray-600">Admin</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-4">Main Navigation</h4>
                        <div className="space-y-2">
                            <SidebarItem icon={Calendar} label="Dashboard" onClick={() => handleNavigation('/admin')} />
                            <SidebarItem icon={Users} label="My Profile" onClick={() => handleNavigation('/admin/myprofile')} />
                        </div>
                        <div className="pt-6">
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Manage</h5>
                            <div className="space-y-1">
                                 <SidebarItem icon={Users} label="Employee" onClick={() => handleNavigation('/admin/manageemployee')} />
                                <SidebarItem icon={Users} label="Jobseeker" onClick={() => handleNavigation('/admin/managejobseeker')} />
                                <SidebarItem icon={Users} label="Counselor" onClick={() => handleNavigation('/admin/managecounselor')} />
                                <SidebarItem icon={Users} label="Counselee" onClick={() => handleNavigation('/admin/managecounselee')} />
                               
                            </div>
                        </div>
                        <div className="pt-6">
                            <SidebarItem icon={MessageSquare} label="Messages" onClick={() => handleNavigation('/message/login')} />
                           <SidebarItem icon={PlusCircle} label="AddUser" onClick={() => handleNavigation('/admin/adduser')} />
                            
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    <div className="add-user-container">
                        <div className="lg:hidden mb-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-700 bg-white rounded-lg shadow-sm">
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                        <div className="add-user-header">
                            <h2 className="add-user-title">Create a New User</h2>
                            <p className="add-user-subtitle">Add new team members to your organization</p>
                        </div>

                        <div className="add-user-card">
                            {message && (
                                <div className="alert alert-success">
                                    <div className="alert-content">
                                        <span>{message.replace(/^✓\s*/, '')}</span>
                                    </div>
                                </div>
                            )}
                            
                            {error && (
                                <div className="alert alert-error">
                                    <div className="alert-content">
                                        <span>{error.replace(/^⚠\s*/, '')}</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleAddUser} className="add-user-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">
                                            <FaUser className="label-icon" />
                                            Username
                                        </label>
                                        <div className="input-wrapper">
                                            <input 
                                                type="text" 
                                                id="username" 
                                                name="username" 
                                                value={formData.username} 
                                                onChange={handleInputChange} 
                                                placeholder="e.g., john.doe" 
                                                className="form-input"
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            <FaEnvelope className="label-icon" />
                                            User Email
                                        </label>
                                        <div className="input-wrapper">
                                            <input 
                                                type="email" 
                                                id="email" 
                                                name="email" 
                                                value={formData.email} 
                                                onChange={handleInputChange} 
                                                placeholder="you@example.com" 
                                                className="form-input"
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="password" className="form-label">
                                            <FaLock className="label-icon" />
                                            Initial Password
                                        </label>
                                        <div className="input-wrapper">
                                            <input 
                                                type="password" 
                                                id="password" 
                                                name="password" 
                                                value={formData.password} 
                                                onChange={handleInputChange} 
                                                placeholder="Set an initial password" 
                                                className="form-input"
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="role" className="form-label">
                                            <FaUsersCog className="label-icon" />
                                            Assign Role
                                        </label>
                                        <div className="input-wrapper">
                                            <select 
                                                id="role" 
                                                name="role" 
                                                value={formData.role} 
                                                onChange={handleInputChange}
                                                className="form-select"
                                            >
                                                <option value="MENTOR">Mentor</option>
                                                <option value="EMPLOYEE">Employee</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading} 
                                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                Creating User...
                                            </>
                                        ) : (
                                            'Add User'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
            </div>
        </>
    );
};

export default AddUserForm;