import React from 'react';
import { hasPermission, hasAnyPermission } from '../../config/permissions.js';

const RoleBasedComponent = ({ 
  requiredPermission, 
  requiredPermissions, 
  fallback = null, 
  children 
}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.roles) {
    return fallback;
  }
  
  let hasAccess = false;
  
  if (requiredPermission) {
    hasAccess = hasPermission(user.roles, requiredPermission);
  } else if (requiredPermissions) {
    hasAccess = hasAnyPermission(user.roles, requiredPermissions);
  }
  
  return hasAccess ? children : fallback;
};

export default RoleBasedComponent;
