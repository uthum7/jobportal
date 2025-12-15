import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, CheckCircle, Clock, PlusCircle, DollarSign, Briefcase
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminSidebar from '../../components/Admin/Sidebar/AdminSidebar';
import { getUserId, getToken } from '../../utils/auth';

const StatCard = ({ icon: Icon, title, value, bgColor, iconColor }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const AdminStats = ({ data, loading }) => {
  const userDistributionData = [
    { name: 'Counselors', value: data.counselors, color: '#3b82f6' },
    { name: 'Employees', value: data.employees, color: '#10b981' },
    { name: 'Jobseekers', value: data.jobseekers, color: '#8b5cf6' },
    { name: 'Counselees', value: data.counselees, color: '#f59e0b' },
  ];

  const jobsData = [
    { name: 'Total', value: data.totalJobs, color: '#059669' },
    { name: 'Active', value: data.activeJobs, color: '#14b8a6' },
    { name: 'Expired', value: data.expiredJobs, color: '#ef4444' },
    { name: 'This Month', value: data.jobsThisMonth, color: '#6366f1' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} title="Counselors" value={loading ? '...' : data.counselors} bgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatCard icon={Users} title="Employees" value={loading ? '...' : data.employees} bgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Users} title="Job Seekers" value={loading ? '...' : data.jobseekers} bgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatCard icon={Users} title="Counselees" value={loading ? '...' : data.counselees} bgColor="bg-yellow-100" iconColor="text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Briefcase} title="Total Jobs" value={loading ? '...' : data.totalJobs} bgColor="bg-emerald-100" iconColor="text-emerald-600" />
        <StatCard icon={CheckCircle} title="Active Jobs" value={loading ? '...' : data.activeJobs} bgColor="bg-teal-100" iconColor="text-teal-600" />
        <StatCard icon={Clock} title="Expired Jobs" value={loading ? '...' : data.expiredJobs} bgColor="bg-red-100" iconColor="text-red-600" />
        <StatCard icon={PlusCircle} title="This Month" value={loading ? '...' : data.jobsThisMonth} bgColor="bg-indigo-100" iconColor="text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard icon={Calendar} title="Total Sessions" value={loading ? '...' : data.totalSessions} bgColor="bg-pink-100" iconColor="text-pink-600" />
        <StatCard icon={DollarSign} title="Total Earnings" value={loading ? '...' : `$${data.totalEarnings}`} bgColor="bg-green-100" iconColor="text-green-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Jobs Overview Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Jobs Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {jobsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    counselors: 0, employees: 0, jobseekers: 0, counselees: 0,
    totalJobs: 0, activeJobs: 0, expiredJobs: 0, jobsThisMonth: 0,
    totalSessions: 0, totalEarnings: 0,
  });

  const [adminInfo, setAdminInfo] = useState({ name: '', email: '', roles: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar activePage="dashboard" />
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back, {adminInfo.name}! 👋
            </h1>
            <nav className="text-sm text-gray-600">
              <span>Admin</span>
              <span className="mx-2">/</span>
              <span className="text-emerald-600">Dashboard</span>
            </nav>
          </header>

          <AdminStats data={dashboardStats} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
