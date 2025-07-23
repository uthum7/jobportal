import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getRole } from '../../utils/auth';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = getToken();
  const userRole = getRole();

  console.log('Current token:', token); // Debug log
  console.log('Current role:', userRole); // Debug log
  console.log('Allowed roles:', allowedRoles); // Debug log

  if (!token) {
    console.log('No token found, redirecting to login'); // Debug log
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    console.log('Role not allowed, redirecting to unauthorized'); // Debug log
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
