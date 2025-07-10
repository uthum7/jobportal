// config/permissions.js
const permissions = {
  ADMIN: [
    // Admin can access everything
    'admin:access',
    'admin:manage',
    'counselor:access',
    'counselor:manage', 
    'counselee:access',
    'counselee:manage',
    'jobseeker:access',
    'jobseeker:manage',
    'cv:access',
    'cv:create',
    'cv:edit',
    'cv:delete'
  ],
  MENTOR: [ // This is your COUNSELOR role
    'counselor:access',
    'counselor:manage',
    'counselor:profile',
    'counselor:bookings',
    'counselor:schedule',
    'counselor:messages'
  ],
  MENTEE: [ // This is your COUNSELEE role
    'counselee:access',
    'counselee:manage',
    'counselee:profile',
    'counselee:bookings',
    'counselee:messages',
    'cv:access',
    'cv:create',
    'cv:edit'
  ],
  JOBSEEKER: [
    'jobseeker:access',
    'jobseeker:manage',
    'jobseeker:profile',
    'jobseeker:applications',
    'cv:access',
    'cv:create',
    'cv:edit'
  ]
};

// Helper functions
export const hasPermission = (userRoles, requiredPermission) => {
  if (!userRoles || !Array.isArray(userRoles)) return false;
  
  return userRoles.some(role => 
    permissions[role] && permissions[role].includes(requiredPermission)
  );
};

export const hasAnyPermission = (userRoles, requiredPermissions) => {
  return requiredPermissions.some(permission => hasPermission(userRoles, permission));
};

export const getUserPermissions = (userRoles) => {
  if (!userRoles || !Array.isArray(userRoles)) return [];
  
  const allPermissions = new Set();
  userRoles.forEach(role => {
    if (permissions[role]) {
      permissions[role].forEach(permission => allPermissions.add(permission));
    }
  });
  return Array.from(allPermissions);
};

export { permissions };
