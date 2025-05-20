import { jwtDecode } from "jwt-decode"; // ✅ Use named import

// ==================== TOKEN OPERATIONS ==================== //

export const saveToken = (token) => {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem("authToken", token);
    return true;
  } catch (error) {
    console.error("Failed to save token:", error);
    return false;
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

export const removeToken = () => {
  if (typeof window === "undefined") return false;

  try {
    localStorage.removeItem("authToken");
    return true;
  } catch (error) {
    console.error("Failed to remove token:", error);
    return false;
  }
};

// ==================== AUTH STATE ==================== //

export const validateToken = () => {
  try {
    const payload = getTokenPayload();
    return !!payload;
  } catch (error) {
    return false;
  }
};

export const isAuthenticated = () => {
  return validateToken();
};

export const isTokenExpired = () => {
  const payload = getTokenPayload();
  return !payload || (payload.exp && Date.now() >= payload.exp * 1000);
};

export const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // ✅ Use named import

    if (!decoded.userId) {
      throw new Error("Token missing required userId claim");
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      console.warn("Token expired");
      removeToken();
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    removeToken();
    return null;
  }
};

// ==================== USER OPERATIONS ==================== //

export const getUserId = () => {
  const payload = getTokenPayload();
  return payload?.userId || null;
};

export const getValidUserId = () => {
  const userId = getUserId();
  if (!userId) {
    removeToken();
    throw new Error("User not authenticated - please login again");
  }
  return userId;
};

export const getUserInfo = () => {
  const payload = getTokenPayload();
  return payload
    ? {
        userId: payload.userId,
        email: payload.email || null,
        name: payload.name || null,
      }
    : null;
};

export const logout = ({ redirect = true, redirectPath = "/login" } = {}) => {
  removeToken();
  if (redirect && typeof window !== "undefined") {
    window.location.replace(redirectPath);
  }
};

// ==================== SESSION MANAGEMENT ==================== //

export const initAuth = () => {
  const isValid = validateToken();
  if (!isValid) removeToken();

  return {
    isAuthenticated: isValid,
    userInfo: getUserInfo(),
  };
};
