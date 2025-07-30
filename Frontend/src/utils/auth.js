// auth.js
import { jwtDecode } from "jwt-decode";

// Store the entire user object, including token, role, userId, etc.
export const saveAuthData = (userData) => {
  if (!userData || !userData.token || !userData.role || !userData.userId) {
    console.error('Incomplete user data provided to saveAuthData:', userData);
    return;
  }
<<<<<<< HEAD

  if (userData.role === 'MENTOR' && !userData.counselors_id) {
    console.error("Mentor role detected, but counselors_id is not a standard field.");
    return;
  }

  console.log('Saving auth data (user object):', userData);
  localStorage.setItem('user', JSON.stringify(userData)); // Store the whole user object
  // No need to store token, role, userId separately if they are in the 'user' object
=======
  console.log('Saving auth data (user object):', userData);
  localStorage.setItem('user', JSON.stringify(userData)); // Store the whole user object
  localStorage.setItem('token', userData.token); // ✅ Add this line// No need to store token, role, userId separately if they are in the 'user' object
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
};

// Get the entire user object
const getUserData = () => {
  try {
    const userDataString = localStorage.getItem('user');
    return userDataString ? JSON.parse(userDataString) : null;
  } catch (e) {
    console.error("Error parsing user data from localStorage", e);
    return null;
  }
};

export const getToken = () => {
  const userData = getUserData();
  return userData ? userData.token : null;
};

export const getRole = () => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

export const getUserId = () => {
  const userData = getUserData();
  // Ensure your user object in localStorage has a 'userId' property.
  // If your backend sends 'id', then use userData.id
  return userData ? userData.userId : null; 
};

export const clearAuth = () => {
  localStorage.removeItem('user'); // Just remove the single 'user' object
<<<<<<< HEAD
=======
  localStorage.removeItem('token'); // ✅ Add this too
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  // Any other app-specific items you might want to clear on logout
};

export const isAuthenticated = () => {
  const userData = getUserData();
  // You might want to add token expiration check here too
  return !!(userData && userData.token && userData.role);
};

export const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    // It's good practice for your JWT to contain userId.
    // If not, you're relying on the userId stored alongside the token.
    if (!decoded.userId && !getUserId()) { 
        // If JWT doesn't have userId, but we have one from login, that's okay.
        // But if JWT is the SOLE source and it's missing, that's an issue.
        // For now, let's assume getUserId() is the primary source if JWT doesn't have it.
    }
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      console.warn("Token expired");
      clearAuth(); // Clear all auth data
      return null;
    }
    // Augment decoded payload with userId from localStorage if not in token
    return { ...decoded, userId: decoded.userId || getUserId() };
  } catch (error) {
    console.error("Invalid token:", error);
    clearAuth();
    return null;
  }
};

// ==================== USER OPERATIONS ==================== //
// getValidUserId can remain similar, using the new getUserId
export const getValidUserId = () => {
  const userId = getUserId();
  if (!userId) {
    clearAuth(); // Ensure full auth data is cleared
    // Optionally throw an error or redirect, depending on how you want to handle this
    // throw new Error("User not authenticated - please login again"); 
    console.warn("getValidUserId: User not authenticated or userId missing.");
    return null; 
  }
  return userId;
};


// getUserInfo can now more reliably get userId
export const getUserInfo = () => {
  const payload = getTokenPayload(); // This now tries to include userId
  const storedUserId = getUserId();   // Get userId directly from stored user object

  return payload || storedUserId // Prioritize payload if available and valid
    ? {
        userId: storedUserId || payload?.userId, // Prefer userId from stored object
        email: payload?.email || null,
        name: payload?.name || null,
        role: getRole(), // Get role from stored object
      }
    : null;
};


export const logout = ({ redirect = true, redirectPath = "/login" } = {}) => {
  clearAuth();
  if (redirect && typeof window !== "undefined") {
    // Better to use react-router's navigate for in-app navigation
    // but window.location is fine for a hard redirect on logout.
    // Consider passing navigate function from App.jsx if you want SPA navigation.
    window.location.replace(redirectPath);
  }
};

// ... (initAuth, hasRole, isMentor etc. can remain largely the same, they'll use the new getters)
export const initAuth = () => {
  const isValid = isAuthenticated(); // isAuthenticated now checks the 'user' object
  if (!isValid) clearAuth();

  return {
    isAuthenticated: isValid,
    userInfo: getUserInfo(), // getUserInfo now uses the 'user' object
  };
};

export const hasRole = (targetRole) => {
  const userRole = getRole(); // Uses new getRole()
  return userRole ? userRole.toUpperCase() === targetRole.toUpperCase() : false;
};

export const isMentor = () => hasRole('MENTOR');
export const isAdmin = () => hasRole('ADMIN');
export const isMentee = () => hasRole('MENTEE');
export const isJobSeeker = () => hasRole('JOBSEEKER');


// removeToken and setAuthToken might be less necessary if you manage the full 'user' object
// but can be kept for direct token manipulation if needed elsewhere.
export const removeToken = () => { // This function is a bit redundant now if clearAuth is used
  const userData = getUserData();
  if (userData) {
    delete userData.token;
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

export const setAuthToken = (token) => { // This function is also a bit redundant
 const userData = getUserData() || {};
 if (token) {
   userData.token = token;
 } else {
   delete userData.token;
 }
 localStorage.setItem('user', JSON.stringify(userData));
};

// getUserRole is now redundant because getRole() does the job based on 'user' object.
// export const getUserRole = () => { ... }; // DELETE THIS