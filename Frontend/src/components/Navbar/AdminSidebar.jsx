import React from "react";
import { Users, Settings, LogOut, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="h-full w-full p-6 bg-white">
      <h2 className="text-xl font-bold mb-8 text-center">Admin Panel</h2>
      <ul className="space-y-6">
        <li>
          <Link
            to="/admin/users"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Users size={20} /> Manage Users
          </Link>
        </li>
        <li>
          <Link
            to="/admin/schedule"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Calendar size={20} /> Schedule
          </Link>
        </li>
        <li>
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600"
          >
            <Settings size={20} /> Settings
          </Link>
        </li>
        <li>
          <Link
            to="/logout"
            className="flex items-center gap-3 text-gray-700 hover:text-red-500"
          >
            <LogOut size={20} /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
