import React from "react";
import { Route, Routes, useLocation } from "react-router-dom"; 
import './index.css';

import Navbar from "./components/Navbar/Navbar.jsx"; 
import NavbarSimple from "./components/Navbar/NavbarSimple.jsx"; 

import Footer from "./components/Footer/Footer.jsx"; 
import "./pages/Homepage/Homepage.css";

import Admin from "./pages/Admin/Admin.jsx";
import Homepage from "./pages/Homepage/Homepage.jsx"; 
import Managecounselor from "./pages/Admin/managecounselor.jsx";

import CounseleeDashboard from "./pages/counselee/dashboard.jsx";
import CounseleeProfile from "./pages/counselee/profile.jsx";
import CounseleeBookings from "./pages/counselee/bookings.jsx";
import FindCounselor from "./pages/counselee/find-counselor.jsx";
import CounselorDetails from "./pages/counselee/counselor-details";
import TimeSlots from "./pages/counselee/time-slots";
import Payment from "./pages/counselee/payment";
import Invoice from "./pages/counselee/invoice";
import Messages from "./pages/counselee/messages.jsx";
import ChangePassword from "./pages/counselee/change-password.jsx";
import DeleteAccount from "./pages/counselee/delete-account.jsx";
import Logout from "./pages/counselee/logout.jsx";



import CounselorDashboard from "./pages/counselor/dashboard.jsx";
import CounselorProfile from "./pages/counselor/profile.jsx";
import CounselorBookings from "./pages/counselor/bookings.jsx";
import CounselorSchedule from "./pages/counselor/schedule.jsx";
import CounselorCounselees from "./pages/counselor/counselees.jsx";
import CounselorMessages from "./pages/counselor/messages.jsx";
import CounselorChangePassword from "./pages/counselor/change-password.jsx";
import CounselorDeleteAccount from "./pages/counselor/delete-account.jsx";

import MessageRoutes from "./pages/Message/MessageRoutes.jsx";
import MessageNavbar from "./components/Navbar/MessageNavbar"; 

function App() {
  const location = useLocation();

  // Check if the current path starts with "/message"
  const isMessagePage = location.pathname.startsWith("/message");

  const showMessageNavbar = [
    "/message/messagehome",
    "/message/signup",
    "/message/login",
    "/message/setting",
    "/message/profile"
  ].includes(location.pathname);

  const showNavbarSimple = [
    "/message/messagehome",
    "/message/signup",
    "/message/login",
    "/message/setting",
    "/message/profile"
  ].includes(location.pathname);


  return (
    <>
      
      {/* Only show main Navbar if NOT on a message page */}
      {!isMessagePage && <Navbar />}
      {showNavbarSimple && <NavbarSimple />}
      
      {showMessageNavbar && <MessageNavbar />}

      
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/managecounselor" element={<Managecounselor />} />
        
        <Route path="/counselee/dashboard" element={<CounseleeDashboard />} />
        <Route path="/counselee/profile" element={<CounseleeProfile />} />
        <Route path="/counselee/bookings" element={<CounseleeBookings />} />
        <Route path="/counselee/find-counselor" element={<FindCounselor />} />
        <Route path="/counselee/counselor/:counselorId" element={<CounselorDetails />} />
        <Route path="/counselee/time-slots/:counselorId" element={<TimeSlots />} />
        <Route path="/counselee/payment/:counselorId" element={<Payment />} />
        <Route path="/counselee/invoice/:counselorId" element={<Invoice />} />
        <Route path="/counselee/messages" element={<Messages />} />
        <Route path="/counselee/change-password" element={<ChangePassword />} />
        <Route path="/counselee/delete-account" element={<DeleteAccount />} />

        <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
        <Route path="/counselor/profile" element={<CounselorProfile />} />
        <Route path="/counselor/bookings" element={<CounselorBookings />} />
        <Route path="/counselor/schedule" element={<CounselorSchedule />} />
        <Route path="/counselor/counselees" element={<CounselorCounselees />} />
        <Route path="/counselor/messages" element={<CounselorMessages />} />
        <Route path="/counselor/change-password" element={<CounselorChangePassword />} />
        <Route path="/counselor/delete-account" element={<CounselorDeleteAccount />} />
        <Route path="/logout" element={<Logout />} />

        
        <Route path="/message/*" element={<MessageRoutes />} />
      </Routes>
      
      
      
      <Footer/>
    </>
  );
}

export default App;
