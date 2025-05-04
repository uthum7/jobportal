import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "../../store/useThemeStore";

import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import SettingPage from "./SettingPage";
import ProfilePage from "./ProfilePage";
import MessageHomePage from "./MessageHomePage";


const MessageRoutes = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    const { theme} = useThemeStore()
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
    <Routes>
  <Route path="messagehome" element={authUser ? <MessageHomePage /> : <Navigate to="/message/login" />} />
  <Route path="signup" element={!authUser ? <SignUpPage /> : <Navigate to="/message/messagehome" />} />
  <Route path="login" element={!authUser ? <LoginPage /> : <Navigate to="/message/messagehome" />} />
  <Route path="setting" element={<SettingPage />} />
  <Route path="profile" element={authUser ? <ProfilePage /> : <Navigate to="/message/login" />} />
</Routes>

    <Toaster/>
    </div>

   
  );
  
};

export default MessageRoutes;
