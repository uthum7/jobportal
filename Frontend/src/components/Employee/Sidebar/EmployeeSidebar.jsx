import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart3,
  User,
  Briefcase,
  PlusCircle,
  Users,
  MessageSquare,
  Lock,
  Camera,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import user from "../../../assets/img/user.jpg";
import { useAuthStore } from '../../../store/useAuthStore';

const EmployeeSidebar = ({ activeTab, setActiveTab }) => {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const fileInputRef = useRef();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [employeeData, setEmployeeData] = useState({
        fullName: 'Loading...',
        roles: ['EMPLOYEE'],
        profilePic: '',
        isOnline: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get employee ID from localStorage
    const getEmployeeId = () => {
        try {
            // Get user object from localStorage
            const userString = localStorage.getItem('user');
            if (!userString) {
                console.error('No user data found in localStorage');
                return null;
            }
            
            const userData = JSON.parse(userString);
            
            // Extract userId from the user object
            if (userData.userId) {
                return userData.userId;
            }
            
            console.error('No userId found in user data:', userData);
            return null;
        } catch (err) {
            console.error('Error parsing user data from localStorage:', err);
            return null;
        }
    };

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setLoading(true);
                const employeeId = getEmployeeId();
                
                if (!employeeId) {
                    throw new Error('No employee ID found');
                }

                const response = await axios.get(`http://localhost:5001/api/users/employees/${employeeId}`);
                
                if (response.status === 200) {
                    setEmployeeData(response.data);
                }
            } catch (err) {
                console.error('Error fetching employee data:', err);
                setError(err.message);
                // Keep default values if API fails
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, []);

    const handleTabClick = (tabName, e) => {
        e.preventDefault();
        setActiveTab(tabName);
        setSidebarOpen(false); // Close mobile sidebar on navigation
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({ profilePic: base64Image });
        };
    };

    const navigationItems = [
        {
            name: "Dashboard",
            label: "Dashboard",
            icon: BarChart3
        },
        {
            name: "Profile",
            label: "My Profile",
            icon: User
        },
        {
            name: "PostedJob",
            label: "Posted Jobs",
            icon: Briefcase
        },
        {
            name: "PostJobSpecs",
            label: "Post New Job",
            icon: PlusCircle
        },
        {
            name: "Candidates",
            label: "Candidates",
            icon: Users
        }
    ];

    // const accountItems = [
    //     {
    //         name: "Password",
    //         label: "Security",
    //         icon: Lock
    //     }
    // ];

    const SidebarItem = ({ icon: Icon, label, active = false, onClick, badge = null }) => (
        <button
            onClick={onClick}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active 
                    ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                    : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
            <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
            </div>
            {badge && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-emerald-600 rounded-full">
                    {badge}
                </span>
            )}
        </button>
    );

    // Helper function to get display role
    const getDisplayRole = (roles) => {
        if (!roles || roles.length === 0) return 'Employee';
        
        // Priority order for display (if user has multiple roles)
        const rolePriority = ['ADMIN', 'EMPLOYEE', 'COUNSELOR', 'JOBSEEKER', 'COUNSELEE'];
        
        for (const role of rolePriority) {
            if (roles.includes(role) && role === 'EMPLOYEE') {
                return "Employee";
            }
        }
        
        return roles[0].charAt(0).toUpperCase() + roles[0].slice(1).toLowerCase();
    };

    // Helper function to get profile image
    const getProfileImage = () => {
        if (selectedImg) return selectedImg;
        if (employeeData.profilePic && employeeData.profilePic.trim() !== '') {
            return employeeData.profilePic;
        }
        if (authUser?.profilePic) return authUser.profilePic;
        return user;
    };

    const capitalizeWords = (str) => {
        if (!str) return '';
        return str.replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const displayName = employeeData.fullName
        ? capitalizeWords(employeeData.fullName)
        : capitalizeWords(employeeData.username || authUser?.username || authUser?.fullName || authUser?.name || 'Employee');

    return (
        <>
            {/* Sidebar toggle button for mobile, below navbar */}
            {!sidebarOpen && (
                <button
                    className="fixed top-20 left-3 z-50 bg-gray-100 border-none rounded-full shadow-md p-2 text-xl text-gray-700 block cursor-pointer transition-colors hover:bg-gray-200 lg:hidden"
                    aria-label="Open sidebar menu"
                    onClick={() => setSidebarOpen(true)}
                >
                    <ChevronRight />
                </button>
            )}
            
            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900 bg-opacity-35 z-40 lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
            
            {/* Sidebar */}
            <div className={`lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-white shadow-lg transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ width: '260px' }}>
                
                {/* Close button for mobile sidebar */}
                {sidebarOpen && (
                    <button
                        className="fixed top-20 right-3 z-50 bg-gray-100 border-none rounded-full shadow-md p-2 text-xl text-gray-700 cursor-pointer transition-colors hover:bg-gray-200 lg:hidden"
                        aria-label="Close sidebar menu"
                        onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }}
                    >
                        <ChevronLeft />
                    </button>
                )}

                {/* Profile Section */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                            <img 
                                src={getProfileImage()} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = user;
                                }}
                            />
                            <label
                                htmlFor="sidebar-avatar-upload"
                                className={`absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md flex items-center justify-center z-10 transition-opacity ${isUpdatingProfile ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg'}`}
                                title={isUpdatingProfile ? 'Uploading...' : 'Change photo'}
                            >
                                <Camera size={14} className="text-gray-600" />
                                <input
                                    type="file"
                                    id="sidebar-avatar-upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                {loading ? 'Loading...' : error ? 'Employee' : displayName}
                            </h3>
                            <p className="text-sm text-gray-600">Recruiter</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="px-4 py-6">
                    <div className="space-y-2">
                        {navigationItems.map((item) => (
                            <div key={item.name} onClick={(e) => handleTabClick(item.name, e)}>
                                <SidebarItem
                                    icon={item.icon}
                                    label={item.label}
                                    active={activeTab === item.name}
                                    onClick={(e) => handleTabClick(item.name, e)}
                                />
                            </div>
                        ))}

                        <Link 
                            to="/message/messagehome" 
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Messages</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeSidebar;
