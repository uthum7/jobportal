import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart3,
  Users,
  MessageSquare,
  PlusCircle,
  Camera,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import defaultAvatar from "../../../assets/img/user.jpg";
import { useAuthStore } from '../../../store/useAuthStore';
import { getUserId, getToken } from '../../../utils/auth';

const AdminSidebar = ({ activePage }) => {
    const navigate = useNavigate();
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const fileInputRef = useRef();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminData, setAdminData] = useState({
        username: 'Loading...',
        roles: ['ADMIN'],
        profilePic: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const adminId = getUserId();
                
                if (!adminId) {
                    throw new Error('No admin ID found');
                }

                const response = await axios.get(`http://localhost:5001/api/users/admin/${adminId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                
                if (response.status === 200 && response.data.admin) {
                    setAdminData(response.data.admin);
                }
            } catch (err) {
                console.error('Error fetching admin data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            
            try {
                const adminId = getUserId();
                const response = await axios.put(
                    `http://localhost:5001/api/users/admin/${adminId}`,
                    { profilePic: base64Image },
                    { headers: { 
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json'
                    }}
                );
                
                if (response.data.success) {
                    setAdminData(response.data.admin);
                    await updateProfile({ profilePic: base64Image });
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                alert('Failed to upload profile picture');
            }
        };
    };

    const getProfileImage = () => {
        if (selectedImg) return selectedImg;
        if (adminData.profilePic && adminData.profilePic.trim() !== '') {
            return adminData.profilePic;
        }
        if (authUser?.profilePic) return authUser.profilePic;
        return defaultAvatar;
    };

    const capitalizeWords = (str) => {
        if (!str) return '';
        return str.replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const displayName = adminData.username
        ? capitalizeWords(adminData.username)
        : capitalizeWords(authUser?.username || authUser?.fullName || authUser?.name || 'Admin');

    const handleNavigation = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full ${
                active 
                    ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                    : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );

    return (
        <>
            {/* Sidebar toggle button for mobile */}
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
                                    e.target.src = defaultAvatar;
                                }}
                            />
                            <label
                                htmlFor="admin-sidebar-avatar-upload"
                                className={`absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md flex items-center justify-center z-10 transition-opacity ${isUpdatingProfile ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg'}`}
                                title={isUpdatingProfile ? 'Uploading...' : 'Change photo'}
                            >
                                <Camera size={14} className="text-gray-600" />
                                <input
                                    type="file"
                                    id="admin-sidebar-avatar-upload"
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
                                {loading ? 'Loading...' : displayName}
                            </h3>
                            <p className="text-sm text-gray-600">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="px-4 py-6">
                    <div className="space-y-2">
                        <SidebarItem
                            icon={BarChart3}
                            label="Dashboard"
                            active={activePage === 'dashboard'}
                            onClick={() => handleNavigation('/admin')}
                        />
                        <SidebarItem
                            icon={Users}
                            label="My Profile"
                            active={activePage === 'profile'}
                            onClick={() => handleNavigation('/admin/myprofile')}
                        />
                    </div>

                    <div className="pt-6">
                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Manage Users</h5>
                        <div className="space-y-2">
                            <SidebarItem
                                icon={Users}
                                label="Employees"
                                active={activePage === 'employees'}
                                onClick={() => handleNavigation('/admin/manageemployee')}
                            />
                            <SidebarItem
                                icon={Users}
                                label="Job Seekers"
                                active={activePage === 'jobseekers'}
                                onClick={() => handleNavigation('/admin/managejobseeker')}
                            />
                            <SidebarItem
                                icon={Users}
                                label="Counselors"
                                active={activePage === 'counselors'}
                                onClick={() => handleNavigation('/admin/managecounselor')}
                            />
                            <SidebarItem
                                icon={Users}
                                label="Counselees"
                                active={activePage === 'counselees'}
                                onClick={() => handleNavigation('/admin/managecounselee')}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="space-y-2">
                            <SidebarItem
                                icon={MessageSquare}
                                label="Messages"
                                active={activePage === 'messages'}
                                onClick={() => handleNavigation('/message/messagehome')}
                            />
                            <SidebarItem
                                icon={PlusCircle}
                                label="Add User"
                                active={activePage === 'adduser'}
                                onClick={() => handleNavigation('/admin/adduser')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
