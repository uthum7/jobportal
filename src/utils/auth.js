import jwt_decode from "jwt-decode";

// Save Token in Local Storage
export const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Get User ID from Token
export const getUserId = () => {
  if (typeof window === "undefined") return null; // Prevents SSR issues

  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No authToken found in localStorage");
    return null;
  }

  try {
    const decoded = jwt_decode(token);
    console.log("Decoded Token:", decoded); // Debugging

    return decoded.user?.id || decoded.sub || null; // Adjust according to your token structure
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// Logout User
export const logout = () => {
  localStorage.removeItem("authToken");
  window.location.reload(); // Refresh page after logout
};
