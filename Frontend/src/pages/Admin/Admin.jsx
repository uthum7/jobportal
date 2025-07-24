import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, MessageSquare, Settings, LogOut, Calendar, CheckCircle, Clock, PlusCircle, DollarSign, Briefcase
} from 'lucide-react';
import JobTypeChart from '../../../src/components/Employee/Dashboard/Chart/JobTypeChart';
import JobModeChart from '../../../src/components/Employee/Dashboard/Chart/JobModeChart';
import AdminChart from './Dashboard/Component/AdminChart';


// ------------------- StatCard Component -------------------
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

// ------------------- SidebarItem Component (from your AdminProfilePage sidebar) -------------------
const SidebarItem = ({ icon: Icon, label, active = false, onClick, hasSubmenu = false, expanded = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
      active
        ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
    {hasSubmenu && (expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
  </button>
);

// ------------------- AdminSidebar (adapted from AdminProfilePage sidebar) -------------------
const AdminSidebar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true); // Sidebar always open on desktop
  // You can add submenu state if you want expandable menus, but omitted here for simplicity

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-40 overflow-y-auto"    >
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
              <h3 className="font-semibold text-gray-800">Admin</h3>
              <p className="text-sm text-gray-600">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Main Navigation</h4>
          <div className="space-y-2">
            <SidebarItem
              icon={Calendar}
              label="Admin Dashboard"
              active={true}
              onClick={() => handleNavigation('/admin/dashboard')}
            />
            <SidebarItem
              icon={Users}
              label="My Profile"
              onClick={() => handleNavigation('/admin/myprofile')}
            />
            
            {/* Manage Section */}
            <div className="pt-4">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Manage</h5>
              <div className="space-y-1 ml-2">
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
              </div>
            </div>

            <div className="pt-4">
              <SidebarItem
                icon={MessageSquare}
                label="Messages"
                onClick={() => handleNavigation('/admin/messages')}
              />
              <SidebarItem
                icon={Settings}
                label="Settings"
                onClick={() => handleNavigation('/admin/settings')}
              />
              <SidebarItem
                icon={LogOut}
                label="Logout"
                onClick={() => {
                  // Implement logout logic here
                  console.log('Logging out...');
                  // navigate('/login');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------- Stats Section -------------------
const AdminStats = ({ data, loading }) => (
  <>
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Counselors" value={loading ? '...' : data.counselors} bgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard icon={Users} title="Employees" value={loading ? '...' : data.employees} bgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Users} title="Jobseekers" value={loading ? '...' : data.jobseekers} bgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard icon={Users} title="Counselees" value={loading ? '...' : data.counselees} bgColor="bg-yellow-100" iconColor="text-yellow-600" />
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Briefcase} title="Total Jobs" value={loading ? '...' : data.totalJobs} bgColor="bg-emerald-100" iconColor="text-emerald-600" />
        <StatCard icon={CheckCircle} title="Active Jobs" value={loading ? '...' : data.activeJobs} bgColor="bg-teal-100" iconColor="text-teal-600" />
        <StatCard icon={Clock} title="Expired Jobs" value={loading ? '...' : data.expiredJobs} bgColor="bg-red-100" iconColor="text-red-600" />
        <StatCard icon={PlusCircle} title="Jobs This Month" value={loading ? '...' : data.jobsThisMonth} bgColor="bg-indigo-100" iconColor="text-indigo-600" />
      </div>
    </div>

    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Career Counseling</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Calendar} title="Total Sessions" value={loading ? '...' : data.totalSessions} bgColor="bg-pink-100" iconColor="text-pink-600" />
        <StatCard icon={DollarSign} title="Total Earnings" value={loading ? '...' : `$${data.totalEarnings}`} bgColor="bg-gray-100" iconColor="text-gray-600" />
      </div>
    </div>
     {/* Charts Section */}
                <div className="charts-section">
                    {/* Main Chart */}
                   
                    {/* Side Charts */}
                    <div className="side-charts">
                        <div className="chart-item">
                            <JobTypeChart />
                        </div>
                        <div className="chart-item">
                            <JobModeChart />
                        </div>
                    </div>
                </div>
    

    
  </>
  

  
);




// ------------------- Main Dashboard -------------------
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    counselors: 0,
    employees: 0,
    jobseekers: 0,
    counselees: 0,
    totalJobs: 0,
    activeJobs: 0,
    expiredJobs: 0,
    jobsThisMonth: 0,
    totalSessions: 0,
    totalEarnings: 0,
  });

  const [adminInfo, setAdminInfo] = useState({ name: 'Admin', role: 'Administrator' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartData = [
    { name: 'Jan', Jobs: 10 },
    { name: 'Feb', Jobs: 20 },
    { name: 'Mar', Jobs: 15 },
    { name: 'Apr', Jobs: 25 },
  ];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5001/api/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setDashboardStats(data.stats);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('An error occurred while fetching stats');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (error) {
    return (
      <div className="ml-64 p-6">
        <h2 className="text-xl font-semibold text-red-600">Dashboard Error</h2>
        <p className="text-gray-600">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="ml-64 flex-1 bg-gray-50 p-6 min-h-screen pt-16">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome, {adminInfo.name} 👋</h1>
        <p className="text-gray-600 mb-6">Manage your dashboard here.</p>

        <AdminStats data={dashboardStats} loading={loading} />
        <AdminChart chartData={chartData} />
      </main>
    </div>
  );
};

export default AdminDashboard;
