import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, MessageSquare, Calendar, CheckCircle, Clock, PlusCircle, DollarSign, Briefcase, ChevronDown, ChevronRight, Menu, X
} from 'lucide-react';
import JobTypeChart from '../../../src/components/Employee/Dashboard/Chart/JobTypeChart';
import JobModeChart from '../../../src/components/Employee/Dashboard/Chart/JobModeChart';
import AdminChart from './Dashboard/Component/AdminChart';
import { getUserId, getToken } from '../../utils/auth';

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

const SidebarItem = ({ icon: Icon, label, active = false, onClick, hasSubmenu = false, expanded = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-2 text-left rounded-lg transition-colors ${
      active ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {hasSubmenu && (expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
  </button>
);

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

    <div className="charts-section">
      <div className="side-charts">
        <div className="chart-item"><JobTypeChart /></div>
        <div className="chart-item"><JobModeChart /></div>
      </div>
    </div>
  </>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    counselors: 0, employees: 0, jobseekers: 0, counselees: 0,
    totalJobs: 0, activeJobs: 0, expiredJobs: 0, jobsThisMonth: 0,
    totalSessions: 0, totalEarnings: 0,
  });

  const [adminInfo, setAdminInfo] = useState({ name: '', email: '', roles: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNavigation = (path) => navigate(path);

  useEffect(() => {
    console.log("📦 useEffect mounted");

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5001/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${getToken()}` },
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

    const fetchAdminInfo = async () => {
      console.log("🔍 Fetching admin info...");
      const adminId = getUserId();
      console.log("📍 Admin ID from getUserId():", adminId);

      if (!adminId) {
        console.warn("⚠️ No userId found. Please ensure you are logged in.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5001/api/users/admin/${adminId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        console.log("✅ Admin info response data:", data);

        // ✅ FIX: Access nested admin object safely
        if (res.ok && data.admin) {
          const admin = data.admin;
          setAdminInfo({
            name: admin.username || 'Admin',
            email: admin.email || '',
            roles: admin.roles || [],
          });
        } else {
          console.error('Admin fetch failed:', data.message);
        }
      } catch (err) {
        console.error('Error fetching admin info:', err);
      }
    };

    fetchDashboardStats();
    fetchAdminInfo();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <h2>Error loading dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Retry</button>
      </div>
    );
  }

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
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                  <img src="/api/placeholder/48/48" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{adminInfo.name || 'Admin'}</h3>
                  {/* ✅ FIX: Safe access to roles */}
                  <p className="text-sm text-gray-600 capitalize">{adminInfo.roles?.[0] || 'admin'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 px-4 py-6">
              <SidebarItem icon={Calendar} label="Admin Dashboard" active={true} onClick={() => handleNavigation('/admin/dashboard')} />
              <SidebarItem icon={Users} label="My Profile" onClick={() => handleNavigation('/admin/myprofile')} />
              <div className="pt-6">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Manage</h5>
                <SidebarItem icon={Users} label="Employee" onClick={() => handleNavigation('/admin/manageemployee')} />
                <SidebarItem icon={Users} label="Jobseeker" onClick={() => handleNavigation('/admin/managejobseeker')} />
                <SidebarItem icon={Users} label="Counselor" onClick={() => handleNavigation('/admin/managecounselor')} />
                <SidebarItem icon={Users} label="Counselee" onClick={() => handleNavigation('/admin/managecounselee')} />
              </div>
              <div className="pt-6">
                <SidebarItem icon={MessageSquare} label="Messages" onClick={() => handleNavigation('/admin/messages')} />
                <SidebarItem icon={PlusCircle} label="AddUser" onClick={() => handleNavigation('/admin/adduser')} />
              </div>
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

            <div className="mb-6">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Admin</span>
                <span>/</span>
                <span className="text-emerald-600">Dashboard</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-800 mt-2">Welcome, {adminInfo.name} 👋</h1>
              <p className="text-gray-600">Manage your dashboard here.</p>
            </div>

            <AdminStats data={dashboardStats} loading={loading} />
            <AdminChart chartData={[
              { name: 'Jan', Jobs: 10 },
              { name: 'Feb', Jobs: 20 },
              { name: 'Mar', Jobs: 15 },
              { name: 'Apr', Jobs: 25 },
            ]} />
          </div>
        </div>
      </div>


      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

    </div>
  );
};

export default AdminDashboard;
