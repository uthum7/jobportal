import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  CheckCircle,
  UserCheck,
  Calendar,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    offeredJobs: 1,
    appliedCandidates: 3,
    successfulJobApply: 0,
    admins: 1,
    Counselors: 6,
    Counselees: 3,
    employees: 10,
    appointments: 0
  });

  const [adminInfo, setAdminInfo] = useState({ name: '', role: '', profileImage: '' });

  useEffect(() => {
    const fetchAdminInfo = async () => {
  try {
    const res = await fetch('http://localhost:5001/api/admin/profile', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await res.json();
    setAdminInfo(data);
  } catch (err) {
    console.error('Error fetching admin info:', err);
  }
};

    

    fetchAdminInfo();
  }, []);

  const chartData = [
    { month: 'Jan', offeredJobs: 0, appliedCandidates: 0, successfulJobApply: 0 },
    { month: 'Feb', offeredJobs: 85, appliedCandidates: 75, successfulJobApply: 55 },
    { month: 'Mar', offeredJobs: 95, appliedCandidates: 85, successfulJobApply: 65 },
    { month: 'Apr', offeredJobs: 105, appliedCandidates: 95, successfulJobApply: 75 },
    { month: 'May', offeredJobs: 90, appliedCandidates: 80, successfulJobApply: 60 },
    { month: 'Jun', offeredJobs: 110, appliedCandidates: 100, successfulJobApply: 80 },
    { month: 'Jul', offeredJobs: 125, appliedCandidates: 115, successfulJobApply: 95 },
    { month: 'Aug', offeredJobs: 135, appliedCandidates: 125, successfulJobApply: 105 },
    { month: 'Sep', offeredJobs: 120, appliedCandidates: 20, successfulJobApply: 90 },
    { month: 'Oct', offeredJobs: 115, appliedCandidates: 165, successfulJobApply: 85 },
    { month: 'Nov', offeredJobs: 140, appliedCandidates: 130, successfulJobApply: 110 },
    { month: 'Dec', offeredJobs: 16, appliedCandidates: 140, successfulJobApply: 120 }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const StatCard = ({ icon: Icon, title, value, bgColor, iconColor }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
        active ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
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
            {/* Profile */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                  <img
                    src={adminInfo.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{adminInfo.name}</h3>
                  <p className="text-sm text-gray-600">{adminInfo.role}</p>
                </div>
              </div>
            </div>

            {/* Sidebar Items */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Main Navigation</h4>
              <div className="space-y-2">
                <SidebarItem icon={Calendar} label="Admin Dashboard" active onClick={() => handleNavigation('/admin')} />
                <SidebarItem icon={Users} label="My Profile" onClick={() => handleNavigation('/admin/myprofile')} />

                <div className="pt-4">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Manage</h5>
                  <div className="space-y-1 ml-2">
                    <SidebarItem icon={Users} label="Counselor" onClick={() => handleNavigation('/admin/managecounselor')} />
                    <SidebarItem icon={Users} label="Counselee" onClick={() => handleNavigation('/admin/managecounselee')} />
                    <SidebarItem icon={Users} label="Employee" onClick={() => handleNavigation('/admin/manageemployee')} />
                    <SidebarItem icon={Users} label="Jobseeker" onClick={() => handleNavigation('/admin/managejobseeker')} />
                  </div>
                </div>

                <div className="pt-4">
                  <SidebarItem icon={MessageSquare} label="Messages" onClick={() => handleNavigation('/admin/messages')} />
                  <SidebarItem icon={Settings} label="Change Password" onClick={() => handleNavigation('/admin/changepassword')} />
                  <SidebarItem
                    icon={LogOut}
                    label="Log Out"
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 p-6">
           <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, {adminInfo.username} 👋
        </h1>
        <p className="text-gray-600">Manage your dashboard here.</p>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Users} title="Offered job" value={dashboardData.offeredJobs} bgColor="bg-emerald-100" iconColor="text-emerald-600" />
            <StatCard icon={Eye} title="Applied candidates" value={dashboardData.appliedCandidates} bgColor="bg-red-100" iconColor="text-red-600" />
            <StatCard icon={CheckCircle} title="Success Job Apply" value={dashboardData.successfulJobApply} bgColor="bg-yellow-100" iconColor="text-yellow-600" />
            <StatCard icon={UserCheck} title="Admins" value={dashboardData.admins} bgColor="bg-pink-100" iconColor="text-pink-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={Users} title="Mentors" value={dashboardData.mentors} bgColor="bg-gray-100" iconColor="text-gray-600" />
            <StatCard icon={Users} title="Mentees" value={dashboardData.mentees} bgColor="bg-purple-100" iconColor="text-purple-600" />
            <StatCard icon={Users} title="Employees" value={dashboardData.employees} bgColor="bg-blue-100" iconColor="text-blue-600" />
            <StatCard icon={Calendar} title="Appointments" value={dashboardData.appointments} bgColor="bg-emerald-100" iconColor="text-emerald-600" />
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Analysis Chart</h3>
            <div className="mb-4 flex gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-sm text-gray-600">Offered Jobs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600">Applied Candidates</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm text-gray-600">Success Job Apply</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line type="monotone" dataKey="offeredJobs" stroke="#10b981" />
                  <Line type="monotone" dataKey="appliedCandidates" stroke="#ef4444" />
                  <Line type="monotone" dataKey="successfulJobApply" stroke="#eab308" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
