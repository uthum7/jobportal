import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart3,
  User,
  Briefcase,
  PlusCircle,
  Users,
  MessageSquare,
  Lock
} from 'lucide-react';
import hansi from "../../../assets/img/hansi.jpg"; // Keep as fallback
import './Sidebar.css';

const EmployeeSidebar = ({ activeTab, setActiveTab, sidebarOpen = true, setSidebarOpen }) => {
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
        },
        {
            name: "Messages",
            label: "Messages",
            icon: MessageSquare
        }
    ];

    const accountItems = [
        {
            name: "Password",
            label: "Security",
            icon: Lock
        }
    ];

    const SidebarItem = ({ icon: Icon, label, active = false, onClick, badge = null }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group mt-5 mb-5 ${
                active 
                    ? 'bg-green-100 border-r-[3px] border-r-green-500 text-green-700' 
                    : 'text-gray-800 hover:bg-slate-100 hover:text-green-800 '
            }`}
        >
            <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${active ? 'text-green-700' : 'text-gray-800 group-hover:text-green-800'}`} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            {badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center font-bold">
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
            if (roles.includes(role)) {
                return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
            }
        }
        
        return roles[0].charAt(0).toUpperCase() + roles[0].slice(1).toLowerCase();
    };

    // Helper function to get profile image
    const getProfileImage = () => {
        if (employeeData.profilePic && employeeData.profilePic.trim() !== '') {
            return employeeData.profilePic;
        }
        return hansi; // Fallback to default image
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`sidebar-employee fixed inset-y-0 left-0 z-40 w-64 shadow-2xl transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Profile Section */}
                <div className="p-6 border-b border-slate-700 mt-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden relative mb-3 ring-4 ring-blue-500">
                            <img
                                src={getProfileImage()}
                                alt="User Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = hansi; // Fallback if profile pic fails to load
                                }}
                            />
                            <div className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-slate-800 rounded-full ${
                                employeeData.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                        </div>
                        <div>
                            {loading ? (
                                <div className="animate-pulse">
                                    <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                                </div>
                            ) : error ? (
                                <div>
                                    <h3 className="font-semibold text-lg text-red-600">Error Loading Profile</h3>
                                    <p className="text-sm text-gray-600 mt-1">Employee</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {employeeData.fullName || employeeData.username || 'Unknown User'}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {getDisplayRole(employeeData.roles)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="px-4 py-6">
                    <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-4 px-2">Main Menu</h4>
                    <div className="space-y-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                to="#"
                                onClick={(e) => handleTabClick(item.name, e)}
                            >
                                <SidebarItem
                                    icon={item.icon}
                                    label={item.label}
                                    active={activeTab === item.name}
                                    onClick={(e) => handleTabClick(item.name, e)}
                                    badge={item.name === "Messages" ? "3" : null}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Account Section */}
                    <div className="pt-8">
                        <h5 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-4 px-2">Account</h5>
                        <div className="space-y-2">
                            {accountItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to="#"
                                    onClick={(e) => handleTabClick(item.name, e)}
                                >
                                    <SidebarItem
                                        icon={item.icon}
                                        label={item.label}
                                        active={activeTab === item.name}
                                        onClick={(e) => handleTabClick(item.name, e)}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && setSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
                    onClick={() => setSidebarOpen(false)} 
                />
            )}
        </>
    );
};

export default EmployeeSidebar;