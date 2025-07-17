export const rolePermissions = {
  ADMIN: [
    '/admin',
    '/cv',
    '/counselor/dashboard',
    '/counselee/dashboard',
    '/home',
    '/admin/managecounselor'
  ],
  MENTOR: [
    '/counselor/dashboard',
    '/home'
  ],
  MENTEE: [
    '/counselee/dashboard',
    '/cv',
    '/home'
  ],
  JOBSEEKER: [
    '/cv',
    '/home',
    '/jobseeker/dashboard'
  ]
};

export const canAccess = (role, path) => {
  if (!role || !rolePermissions[role]) return false;
  
  // Check if the path starts with any of the allowed paths for the role
  return rolePermissions[role].some(allowedPath => 
    path.startsWith(allowedPath)
  );
};