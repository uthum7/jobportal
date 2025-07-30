import { useNavigate } from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  Edit,
  Camera,
  ChevronDown,
  ChevronRight,
  PlusCircle
} from 'lucide-react';


const AdminProfilePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [manageExpanded, setManageExpanded] = useState(true);
  const [profileData, setProfileData] = useState({
    name: 'Dinusha Herath',
    role: 'Admin',
    email: 'dinushahr@gmail.com',
    phone: '+91 7689248137',
    address: 'Canada, USA',
    profileImage: '/api/placeholder/80/80'
  });

  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({ ...profileData });

  const SidebarItem = ({ icon: Icon, label, active = false, onClick, hasSubmenu = false, expanded = false }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2 text-left rounded-lg transition-colors ${
        active 
          ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasSubmenu && (
        expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
      )}
    </button>
  );
   const handleNavigation = (path) => {
    navigate(path);
  };


  const SubMenuItem = ({ icon: Icon, label, active = false, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-8 py-2 text-left rounded-lg transition-colors ${
        active 
          ? 'bg-emerald-50 text-emerald-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSave = (field) => {
    setProfileData(prev => ({
      ...prev,
      [field]: formData[field]
    }));
    setEditingField(null);
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditingField(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const ProfileField = ({ label, field, value, type = 'text' }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {editingField === field ? (
          <div className="flex items-center space-x-2">
            <input
              type={type}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={() => handleSave(field)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg flex-1 text-gray-800">
              {value}
            </span>
            <button
              onClick={() => handleEdit(field)}
              className="ml-3 p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="flex">
        {/* Sidebar */}
                <div className={`
                  fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                  lg:translate-x-0 lg:static lg:inset-0
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                  <div className="flex flex-col h-full">
                    {/* Profile Section */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                          <img 
                            src="/api/placeholder/48/48" 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Dinusha Herath</h3>
                          <p className="text-sm text-gray-600">Admin</p>
                        </div>
                      </div>
                    </div>
        
                    {/* Navigation */}
                    <div className="flex-1 px-4 py-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Main Navigation</h4>
                      <div className="space-y-2">
                        <SidebarItem 
                          icon={Calendar} 
                          label="Dashboard" 
                          onClick={() => handleNavigation('/admin')}
                        />
                        <SidebarItem 
                          icon={Users} 
                          label="My Profile"
                          active={true}
                          onClick={() => handleNavigation('/admin/myprofile')}
                        />
                        
                        <div className="pt-6">
                          <h5 className="text-sm font-medium text-gray-500 mb-2">Manage</h5>
                          <div className="space-y-1">
                             <SidebarItem 
                              icon={Users} 
                              label="Employee"
                              onClick={() => handleNavigation('/admin/manageemployee')}
                            />
                            <SidebarItem 
                              icon={Users} 
                              label="Jobseeker"  
                              onClick={() => handleNavigation('/admin/managejobseeker')}
                            />
                             <SidebarItem 
                              icon={Users} 
                              label="Counselor"
                              onClick={() => handleNavigation('/admin/managecounselor')}
                            />
                            <SidebarItem 
                              icon={Users} 
                              label="Counselee"
                              onClick={() => handleNavigation('/admin/managecounselee')}
                            />
                           
                          </div>
                        </div>
                        
                        <div className="pt-6">
                          <SidebarItem 
                            icon={MessageSquare} 
                            label="Messages"
                            onClick={() => handleNavigation('/message/login')}
                          />
                        <SidebarItem icon={PlusCircle} label="AddUser" onClick={() => handleNavigation('/admin/adduser')} />
                          
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Mobile Menu Button */}
            <div className="lg:hidden mb-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-700 bg-white rounded-lg shadow-sm">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Breadcrumb */}
            <div className="mb-6">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Admin</span>
                <span>/</span>
                <span className="text-emerald-600">My Profile</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-800 mt-2">My Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden mx-auto mb-4">
                        <img 
                          src={profileData.profileImage}
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-4 right-0 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{profileData.name}</h2>
                    <p className="text-gray-600 mb-4">{profileData.role}</p>
                    
                    <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Change Profile</span>
                    </button>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">@</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800">{profileData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">📞</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Call</p>
                        <p className="text-gray-800">{profileData.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">📍</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-800">{profileData.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Details Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Basic Detail</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                      label="Employer Name"
                      field="name"
                      value={profileData.name}
                    />
                    
                    <ProfileField
                      label="Email ID"
                      field="email"
                      value={profileData.email}
                      type="email"
                    />
                    
                    <ProfileField
                      label="Phone No."
                      field="phone"
                      value={profileData.phone}
                      type="tel"
                    />
                    
                    <ProfileField
                      label="Address"
                      field="address"
                      value={profileData.address}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminProfilePage;