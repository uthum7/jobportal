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
  X,
  User,
  Briefcase
} from 'lucide-react';

const ManageJobseeker = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobseekers, setJobseekers] = useState([]);
  const [selectedJobseeker, setSelectedJobseeker] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch jobseekers
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

  const filteredJobseekers = jobseekers.filter((j) =>
    j.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigation = (path) => navigate(path);
  const handleView = (id) => navigate(`/admin/enhancedjobseekerinfo?id=${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this jobseeker?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/users/jobseekers/${id}`, { method: 'DELETE' });
      if (res.ok) setJobseekers(jobseekers.filter(j => j._id !== id));
    } catch (err) {
      console.error('Error deleting jobseeker:', err);
    }
  };

  const handleEdit = (jobseeker) => {
    setSelectedJobseeker({ ...jobseeker });
    setIsEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/users/jobseekers/${selectedJobseeker._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedJobseeker),
      });
      if (res.ok) {
        const updated = await res.json();
        setJobseekers(jobseekers.map(j => j._id === updated._id ? updated : j));
        setIsEditMode(false);
      }
    } catch (err) {
      console.error('Error updating jobseeker:', err);
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
              <SidebarItem icon={Users} label="Counselor" onClick={() => handleNavigation('/admin/managecounselor')} />
              <SidebarItem icon={Users} label="Counselee" onClick={() => handleNavigation('/admin/managecounselee')} />
              <SidebarItem icon={Users} label="Employee" onClick={() => handleNavigation('/admin/manageemployee')} />
              <SidebarItem icon={Users} label="Jobseeker" active onClick={() => handleNavigation('/admin/managejobseeker')} />
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
          <div className="lg:hidden mb-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-700 bg-white rounded-lg shadow-sm">
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
          </div>

          {/* Jobseeker Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobseekers.map((j) => (
              <div key={j._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xl">
                    {j.username?.charAt(0).toUpperCase() || j.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{j.username || j.fullName}</h3>
                    <p className="text-sm text-gray-600">{j.email}</p>
                  </div>
                </div>
                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-blue-600" /> <span>ID: {j._id}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-green-600" /> <span>Role: {j.roles?.join(', ') || 'N/A'}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                  <button onClick={() => handleView(j._id)} className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
                    <Eye className="w-4 h-4" /> <span>View</span>
                  </button>
                  <button onClick={() => handleEdit(j)} className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                    <Edit className="w-4 h-4" /> <span>Edit</span>
                  </button>
                  <button onClick={() => handleDelete(j._id)} className="text-red-600 hover:text-red-700 flex items-center space-x-1">
                    <Trash2 className="w-4 h-4" /> <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Modal */}
          {isEditMode && selectedJobseeker && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Jobseeker</h2>
                <input
                  type="text"
                  value={selectedJobseeker.username || selectedJobseeker.fullName || ''}
                  onChange={(e) => setSelectedJobseeker({ ...selectedJobseeker, username: e.target.value })}
                  className="w-full mb-3 px-4 py-2 border rounded"
                  placeholder="Username"
                />
                <input
                  type="email"
                  value={selectedJobseeker.email || ''}
                  onChange={(e) => setSelectedJobseeker({ ...selectedJobseeker, email: e.target.value })}
                  className="w-full mb-3 px-4 py-2 border rounded"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={selectedJobseeker.roles?.join(', ') || ''}
                  onChange={(e) => setSelectedJobseeker({
                    ...selectedJobseeker,
                    roles: e.target.value.split(',').map(r => r.trim())
                  })}
                  className="w-full mb-3 px-4 py-2 border rounded"
                  placeholder="Roles (comma separated)"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button onClick={handleUpdate} className="px-4 py-2 bg-emerald-600 text-white rounded">Update</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default ManageJobseeker;
