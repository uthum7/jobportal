// src/pages/Admin/ViewCounselee.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User, Mail, Phone, Calendar, MapPin
} from 'lucide-react';

const ViewCounselee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [counseleeData, setCounseleeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounselee = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/users/counselees/${id}`);
        setCounseleeData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch counselee data");
      } finally {
        setLoading(false);
      }
    };

    fetchCounselee();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Counselee Information</h1>
          <p className="text-gray-600">Detailed view of counselee profile.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-white px-6 py-5 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-blue-600">
                  {counseleeData.fullName?.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{counseleeData.username}</h2>
                <p className="text-gray-600">Counselee</p>
                <p className="text-sm text-gray-500">{counseleeData.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard icon={<User />} label="User ID" value={counseleeData._id} />
              <InfoCard icon={<Mail />} label="Email Address" value={counseleeData.email} />
              <InfoCard icon={<Phone />} label="Phone Number" value={counseleeData.phone || 'N/A'} />
              <InfoCard icon={<Calendar />} label="Joined At" value={new Date(counseleeData.createdAt).toLocaleDateString()} />
              <InfoCard icon={<MapPin />} label="Status" value={counseleeData.isOnline ? 'Online' : 'Offline'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      {React.cloneElement(icon, { className: "w-5 h-5 text-blue-600" })}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900 text-sm">{value}</p>
    </div>
  </div>
);

export default ViewCounselee;
