import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Video,
  Clock,
  DollarSign,
  CheckCircle,
  MapPin,
  Eye,
  X,
  Users,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const BookingManagement = () => {
  const { id } = useParams();
  const [currentFilter, setCurrentFilter] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingId, setCurrentBookingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [counselorInfo, setCounselorInfo] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [counselorRes, bookingsRes] = await Promise.all([
        axios.get(`http://localhost:5001/api/users/counselors/${id}`),
        axios.get(`http://localhost:5001/api/users/recentbookings/${id}`)
      ]);

      setCounselorInfo(counselorRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getStats = () => {
    const total = bookings.length;
    const upcoming = bookings.filter(b => b.status === 'upcoming').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    return { total, upcoming, completed, cancelled };
  };

  const stats = getStats();

  const filteredBookings = currentFilter === 'all'
    ? bookings
    : bookings.filter(booking => booking.status === currentFilter);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleFilterChange = (filter) => setCurrentFilter(filter);

  const handleCancelSession = (bookingId) => {
    setCurrentBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancellationReason.trim()) return;

    try {
      await axios.put(`http://localhost:5001/api/users/cancelbooking/${bookingId}`, {
        reason: cancellationReason
      });
      setShowCancelModal(false);
      setCancellationReason('');
      setCurrentBookingId(null);
      fetchData();
      alert('Session cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling session:', err);
      alert('Failed to cancel session.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDisplay = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  if (loading) return <div className="max-w-6xl mx-auto p-6">Loading...</div>;

  if (!counselorInfo) return <div className="max-w-6xl mx-auto p-6">Counselor not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        className="flex items-center gap-2 text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => alert('Navigate back to counselor info page')}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white shadow rounded-lg p-6 my-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 text-white font-bold rounded-full flex items-center justify-center text-2xl">
              {counselorInfo.username.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{counselorInfo.username} - All Bookings</h1>
              <p className="text-gray-500">Counselor</p>
              <p className="text-xs text-gray-400">Counselor ID: {counselorInfo._id}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-500">{stats.total}</div>
            <div className="text-sm font-semibold text-slate-700">Total Bookings</div>
            <div className="text-xs text-slate-400">Sessions in system</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <Users className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-500">{stats.upcoming}</div>
          <div className="text-sm text-slate-500">Upcoming Sessions</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <CheckCircle className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-500">{stats.completed}</div>
          <div className="text-sm text-slate-500">Completed Sessions</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <XCircle className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-500">{stats.cancelled}</div>
          <div className="text-sm text-slate-500">Cancelled Sessions</div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Booking Sessions</h2>
          <div className="flex gap-2">
            {['all', 'upcoming', 'completed', 'cancelled'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-3 py-1 text-sm rounded border ${
                  currentFilter === filter
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y">
          {filteredBookings.length === 0 ? (
            <div className="text-center p-10 text-slate-500">
              <AlertTriangle className="mx-auto mb-2" size={40} />
              <h3 className="text-lg font-medium">No bookings found</h3>
              <p>No {currentFilter === 'all' ? '' : currentFilter} bookings to display.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="p-4 hover:bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-md font-semibold text-slate-800">{booking.topic}</h4>
                    <p className="text-sm text-slate-500">Session with user</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusClass(booking.status)}`}>
                    {getStatusDisplay(booking.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-2">
                  <div className="flex items-center gap-2"><Calendar size={16} /> {formatDate(booking.date)} at {formatTime(booking.time)}</div>
                  <div className="flex items-center gap-2"><Video size={16} /> {booking.type}</div>
                  <div className="flex items-center gap-2"><Clock size={16} /> {booking.duration} minutes</div>
                  <div className="flex items-center gap-2"><DollarSign size={16} /> ${booking.price}</div>
                  <div className="flex items-center gap-2"><CheckCircle size={16} /> {booking.payment_status}</div>
                  <div className="flex items-center gap-2"><MapPin size={16} /> {booking.location}</div>
                </div>

                {booking.notes && (
                  <div className="bg-slate-50 p-2 rounded mb-2">
                    <h5 className="text-xs uppercase font-bold text-slate-400">Session Notes</h5>
                    <p className="text-sm text-slate-600">{booking.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm">
                    <Eye size={16} /> View Details
                  </button>
                  {booking.status === 'upcoming' && (
                    <button
                      onClick={() => handleCancelSession(booking._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm text-red-600"
                    >
                      <X size={16} /> Cancel Session
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-red-500" />
              <h3 className="text-lg font-semibold">Cancel Session</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Please provide a reason for cancelling this booking session. This action cannot be undone.</p>
            <form onSubmit={handleCancelSubmit}>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter reason..."
                required
                className="w-full p-2 border border-slate-300 rounded mb-4"
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancellationReason('');
                    setCurrentBookingId(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  Keep Session
                </button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Cancel Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
