import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const UserChart = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/dashboard/analytics/users-monthly");
        if (res.data.success) {
          setUserData(res.data.data);
        } else {
          console.error("Failed to fetch data:", res.data.message);
        }
      } catch (err) {
        console.error("Error fetching user analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-[410px] p-4 bg-white shadow-lg rounded-xl ">
      <h2 className="text-xl font-semibold mb-4">Monthly User Registrations</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={userData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
          <Legend verticalAlign="top" align="center" height={36} />
          <Line type="monotone" dataKey="employees" stroke="#8884d8" name="Employees" />
          <Line type="monotone" dataKey="counselors" stroke="#82ca9d" name="Counselors" />
          <Line type="monotone" dataKey="counselees" stroke="#ffc658" name="Counselees" />
          <Line type="monotone" dataKey="jobseekers" stroke="#ff7300" name="Jobseekers" />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
