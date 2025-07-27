import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import axios from 'axios';

const DeleteUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, username, email } = location.state || {};

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/users/employees/${id}`);
      if (response.status === 200) {
        alert('Employee deleted successfully');
        navigate('/admin/manageemployee');
      } else {
        alert('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  if (!id) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Invalid Request</h2>
        <p>No employee selected for deletion.</p>
        <button
          onClick={() => navigate('/admin/manageemployee')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete User</h2>
          </div>
          <button
            onClick={() => navigate('/admin/manageemployee')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>

        {/* User Info */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 text-lg">{username || 'Unknown User'}</h3>
          <p className="text-gray-600">{email || 'No Email'}</p>
          <p className="text-gray-500 text-sm mt-1">ID: {id}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/manageemployee')}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
          >
            No, Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
