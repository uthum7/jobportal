import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Menu,
  X
} from 'lucide-react';

const ManageJobseeker = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobseekers, setJobseekers] = useState([]);

  // Fetch jobseekers from backend
  useEffect(() => {
    const fetchJobseekers = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/users/jobseekers');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setJobseekers(data);
      } catch (err) {
        console.error('Error fetching jobseekers:', err);
      }
    };

    fetchJobseekers();
  }, []);

  const filteredJobseekers = jobseekers.filter((js) =>
    js.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    js.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    js._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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
              <SidebarItem icon={Users} label="Counselor" onClick={() => handleNavigation('/admin/managecounselor')} />
              <SidebarItem icon={Users} label="Counselee" onClick={() => handleNavigation('/admin/managecounselee')} />
              <SidebarItem icon={Users} label="Employee" onClick={() => handleNavigation('/admin/manageemployee')} />
              <SidebarItem icon={Users} label="Jobseeker" active={true} onClick={() => handleNavigation('/admin/managejobseeker')} />
            </div>
          </div>

          <div className="pt-6">
            <SidebarItem icon={MessageSquare} label="Messages" onClick={() => handleNavigation('/message/login')} />
            <SidebarItem icon={Settings} label="Change Password" onClick={() => handleNavigation('/admin/changepassword')} />
            <SidebarItem icon={LogOut} label="Log Out" onClick={() => console.log('Logging out...')} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          {/* Mobile Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-700 bg-white rounded-lg shadow-sm"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Jobseekers</h2>

          <div className="flex items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search jobseekers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => console.log('Search:', searchTerm)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="space-y-4">
            {filteredJobseekers.map((js) => (
              <div
                key={js._id}
                className="flex items-center justify-between bg-white px-4 py-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={js.profilePhoto || "/api/placeholder/50/50"}
                    alt={js.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{js.username || 'No username'}</div>
                    <div className="text-sm text-gray-500">{js.email || 'No email'}</div>
                    <div className="text-xs text-gray-400">ID: {js._id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Eye className="cursor-pointer hover:text-emerald-600" onClick={() => console.log('View', js._id)} />
                  <Edit className="cursor-pointer hover:text-emerald-600" onClick={() => console.log('Edit', js._id)} />
                  <Trash2 className="cursor-pointer hover:text-red-600" onClick={() => console.log('Delete', js._id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageJobseeker;
