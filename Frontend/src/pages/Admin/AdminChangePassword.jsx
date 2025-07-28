import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Users,
  MessageSquare,
  LogOut,
  Eye,
  EyeOff,
  Calendar,
  Settings
} from 'lucide-react';

export default function PasswordUpdateDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [adminProfile, setAdminProfile] = useState({
    name: 'Loading...',
    role: 'Admin',
    profileImage: '/api/placeholder/48/48'
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5001/api/admin/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        setAdminProfile({
          name: data?.name || 'Admin User',
          role: data?.role || 'Admin',
          profileImage: data?.profileImage || '/api/placeholder/48/48'
        });
      } catch (error) {
        console.error('Failed to fetch admin profile', error);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    console.log('Submitting password change', formData);
    try {
      const res = await axios.put(
        'http://localhost:5001/api/admin/change-password',
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
        {
         headers: {
      Authorization: `Bearer ${token}`,  // ✅ Must include Bearer
      "Content-Type": "application/json"
    },
    withCredentials: true // ✅ If using cookies
        }
      );

      console.log('Password change response:', res.data);
      toast.success(res.data.message);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
              <img src={adminProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{adminProfile.name}</h3>
              <p className="text-sm text-gray-600">{adminProfile.role}</p>
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
              <SidebarItem icon={Users} label="Counselor" onClick={() => handleNavigation('/admin/managecounselor')} />
              <SidebarItem icon={Users} label="Counselee" onClick={() => handleNavigation('/admin/managecounselee')} />
              <SidebarItem icon={Users} label="Employee" onClick={() => handleNavigation('/admin/manageemployee')} />
              <SidebarItem icon={Users} label="Jobseeker" onClick={() => handleNavigation('/admin/managejobseeker')} />
            </div>
          </div>

          <div className="pt-6">
            <SidebarItem icon={MessageSquare} label="Messages" onClick={() => handleNavigation('/message/login')} />
            <SidebarItem icon={Settings} label="Change Password" active={true} onClick={() => handleNavigation('/admin/changepassword')} />
            <SidebarItem icon={LogOut} label="Log Out" onClick={() => console.log('Logging out...')} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col items-center">
        <div className="mb-8 w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800">Update Password</h1>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-blue-600 text-sm">{adminProfile.role}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 text-sm">Update Password</span>
          </div>
        </div>

        {/* Password Change Form */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Change Your Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Old Password</label>
              <div className="relative">
                <input
                  type={showPasswords.old ? 'text' : 'password'}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium mt-6"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
