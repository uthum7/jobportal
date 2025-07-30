import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Mail, Clock, Video, Eye, MapPin, Calendar, Phone
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const colorClasses = {
  green: { text: 'text-green-600', bg: 'bg-green-500' },
  blue: { text: 'text-blue-600', bg: 'bg-blue-500' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-500' },
  gray: { text: 'text-gray-600', bg: 'bg-gray-400' }
};

const getTimeAgo = (dateString) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

const EnhancedCounselorInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [counselorData, setCounselorData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const counselorRes = await axios.get(`http://localhost:5001/api/users/counselors/${id}`);
        setCounselorData(counselorRes.data);

        const bookingsRes = await axios.get(`http://localhost:5001/api/users/recentbookings/${id}`);
        setRecentBookings(bookingsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const bookingCount = recentBookings.length;

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Counselor Information</h1>
          <p className="text-gray-600">View detailed counselor information and performance metrics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-white px-6 py-5 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-blue-600">
                      {counselorData?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {counselorData?.username || 'N/A'}
                    </h2>
                    <p className="text-gray-600">Counselor</p>
                    <p className="text-sm text-gray-500">No department info</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard icon={<User />} label="Counselor ID" value={counselorData._id} />
                  <InfoCard icon={<Mail />} label="Email Address" value={counselorData.email || 'N/A'} />
                  <InfoCard icon={<Clock />} label="Last Login" value={new Date(counselorData.updatedAt).toLocaleString()} />
                  <InfoCard icon={<Phone />} label="Phone Number" value={counselorData.phoneNumber || 'N/A'} />
                  <InfoCard icon={<Calendar />} label="Join Date" value={new Date(counselorData.createdAt).toLocaleString()} />
                  <InfoCard icon={<MapPin />} label="Address" value={counselorData.city || 'N/A'} />
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Last 3 bookings</span>
                </div>
              </div>

              <div className="space-y-3">
                {recentBookings.length === 0 ? (
                  <p className="text-sm text-gray-500">No recent bookings for this counselor.</p>
                ) : (
                  recentBookings.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{booking.sessionType}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{booking.clientName}</span>
                            <span>•</span>
                            <span>{getTimeAgo(booking.bookingDate)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Bookings</h3>
              <p className="text-sm text-gray-600 mb-4">Sessions booked with this counselor</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">{bookingCount}</div>
                <p className="text-xs text-gray-500">Bookings in system</p>
              </div>
              <button
                onClick={() => navigate(`/admin/viewallbookings/${counselorData._id}`)}
                className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View All Bookings</span>
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Performance Overview</h4>
              <StatBar label="Completed Sessions" value={12} max={20} color="green" />
              <StatBar label="Total Bookings" value={bookingCount} max={50} color="blue" />
              <StatBar label="Satisfaction Rate" value={95} max={100} color="purple" />
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

const StatBar = ({ label, value, max, color }) => {
  const percent = Math.min((value / max) * 100, 100);
  const textColor = colorClasses[color]?.text || colorClasses.gray.text;
  const bgColor = colorClasses[color]?.bg || colorClasses.gray.bg;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-sm font-medium ${textColor}`}>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${bgColor} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default EnhancedCounselorInfo;
