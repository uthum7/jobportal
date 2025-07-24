// App.jsx

import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation
} from "react-router-dom";

// --- Context and Notifications ---
import { CVFormProvider } from './context/CVFormContext';
import { Toaster } from 'sonner';

// --- Layouts and Components ---
import CVBuilderLayout from './pages/CVBuilderLayout.jsx';
import Navbar from "./components/Navbar/Navbar.jsx";
import AdminNavbar from './components/Navbar/AdminNavbar';
import MentorNavbar from './components/Navbar/MentorNavbar';
import MenteeNavbar from './components/Navbar/MenteeNavbar';
import JobSeekerNavbar from './components/Navbar/JobSeekerNavbar';
import EmployeeNavbar from './components/Navbar/EmployeeNavbar'; // Assumes you will create this component
import Footer from "./components/Footer/Footer.jsx";
import JobFormComponent from "./components/Employee/PostJob/JobFormComponent/JobFormComponent.jsx";

// --- Public Pages & Auth Flow ---
import Homepage from "./pages/Homepage/Homepage.jsx";
import LoginPage from "./pages/Login/login.jsx";
import Register from "./pages/Registration/SignUpPage.jsx";
import Unauthorized from "./pages/Unauthorized/Unauthorized.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage.jsx";
import ForceResetPasswordPage from './pages/Auth/ForceResetPasswordPage';

// --- Role-Based Pages ---
// Admin
import Admin from "./pages/Admin/Admin.jsx";
import Managecounselor from "./pages/Admin/managecounselor.jsx";

// Mentor (Counselor)
import CounselorDashboard from "./pages/counselor/dashboard.jsx";
import CounselorProfile from "./pages/counselor/profile.jsx"
import CounselorBookings from "./pages/counselor/bookings.jsx"
import CounselorSchedule from "./pages/counselor/schedule.jsx"
import CounselorCounselees from "./pages/counselor/counselees.jsx"
import CounselorMessages from "./pages/counselor/messages.jsx"
import CounselorChangePassword from "./pages/counselor/change-password.jsx"
import CounselorDeleteAccount from "./pages/counselor/delete-account.jsx"

// Mentee (Counselee)
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

// Employee
import EmployeePage from "./pages/Employee/EmployeePage.jsx";

// Messaging
import MessageHomePage from "./pages/Message/MessageHomePage.jsx";
import MessageRoutes from "./pages/Message/MessageRoutes.jsx";

// CV Builder
import CVDashboard from './pages/CVDashboard/CVDashboard';
import Cv from './pages/Cv/Cv';
import Cv2 from './pages/Cv2/Cv2.jsx';
import Cv3 from './pages/Cv3/Cv3.jsx';
import Cv4 from './pages/Cv4/Cv4.jsx';
import Cv5 from './pages/Cv5/Cv5.jsx';
import Cv6 from './pages/Cv6/Cv6.jsx';
import Cv7 from "./pages/Cv7/Cv7.jsx";


// --- Configuration for Role-Based Redirects ---
const dashboardByRole = {
  ADMIN: '/admin',
  MENTOR: '/counselor/dashboard',
  MENTEE: '/counselee/dashboard',
  JOBSEEKER: '/jobseeker/dashboard',
  EMPLOYEE: '/employee/dashboard' // ADDED: Employee dashboard path
};

// --- Protected Route Component ---
const RoleBasedRoute = ({ element, allowedRoles, userRole }) => {
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  const normalizedUserRole = String(userRole).toUpperCase();
  if (!allowedRoles.includes(normalizedUserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return element;
};


// --- Main App Component ---
function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem('user');
      return null;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userIsLoggedIn = !!user?.role && !!user?.userId;
    if (userIsLoggedIn) {
      const userDashboardPath = dashboardByRole[user.role];
      const publicRedirectPaths = ["/", "/login", "/register"];
      if (userDashboardPath && publicRedirectPaths.includes(location.pathname)) {
        navigate(userDashboardPath, { replace: true });
      }
    }
  }, [user, navigate, location]);

  const handleLogin = (userDataFromLogin) => {
    const standardizedUserData = {
      ...userDataFromLogin,
      role: userDataFromLogin.role ? String(userDataFromLogin.role).toUpperCase() : null
    };

    if (!standardizedUserData.role || !standardizedUserData.userId) {
        console.error("Login handled, but role or userId is missing:", standardizedUserData);
        handleLogout();
        return;
    }
    
    localStorage.setItem('user', JSON.stringify(standardizedUserData));
    setUser(standardizedUserData);
    // The useEffect hook will now handle the redirect to the correct dashboard.
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const renderNavbar = () => {
    if (!user?.role) return <Navbar onLogout={handleLogout} user={user} />;
    switch (user.role) {
      case 'ADMIN': return <AdminNavbar onLogout={handleLogout} user={user} />;
      case 'MENTOR': return <MentorNavbar onLogout={handleLogout} user={user} />;
      case 'MENTEE': return <MenteeNavbar onLogout={handleLogout} user={user} />;
      case 'JOBSEEKER': return <JobSeekerNavbar onLogout={handleLogout} user={user} />;
      case 'EMPLOYEE': return <EmployeeNavbar onLogout={handleLogout} user={user} />; // ADDED: Employee navbar case
      default:
        return <Navbar user={user} onLogout={handleLogout} />;
    }
  };

  // Define roles that have access to the CV creator
  const cvCreatorRoles = ['ADMIN', 'MENTEE', 'JOBSEEKER', 'MENTOR', 'EMPLOYEE'];

  return (
    <CVFormProvider>
      <> 
        <Toaster position="top-right" richColors /> 

    

        {renderNavbar()}
        <Routes>
          {/* ================================================================= */}
          {/* ======================= PUBLIC ROUTES =========================== */}
          {/* ================================================================= */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/force-reset-password" element={<ForceResetPasswordPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ================================================================= */}
          {/* ======================= ADMIN ROUTES ============================ */}
          {/* ================================================================= */}
          <Route path="/admin" element={ <RoleBasedRoute element={<Admin />} allowedRoles={['ADMIN']} userRole={user?.role}/>}/>
          <Route path="/admin/managecounselor" element={<RoleBasedRoute element={<Managecounselor />} allowedRoles={['ADMIN']} userRole={user?.role} /> }/>
          <Route path="/admin/MessageHomePage" element={<RoleBasedRoute element={<MessageHomePage />} allowedRoles={['ADMIN']} userRole={user?.role} /> }/>

          {/* ================================================================= */}
          {/* ======================= EMPLOYEE ROUTES ========================= */}
          {/* ================================================================= */}
          <Route path="/employee/dashboard" element={<RoleBasedRoute element={<EmployeePage />} allowedRoles={['ADMIN', 'EMPLOYEE']} userRole={user?.role} />} />
          <Route path="/employee/post-job" element={<RoleBasedRoute element={<JobFormComponent />} allowedRoles={['ADMIN', 'EMPLOYEE']} userRole={user?.role} />} />

          {/* ================================================================= */}
          {/* ======================= MENTOR (COUNSELOR) ROUTES =============== */}
          {/* ================================================================= */}
          <Route path="/counselor/dashboard" element={<RoleBasedRoute element={<CounselorDashboard />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role}/> }/>
          <Route path="/counselor/profile" element={<RoleBasedRoute element={<CounselorProfile />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role}/> }/>
          <Route path="/counselor/bookings" element={<RoleBasedRoute element={<CounselorBookings />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role}/> }/>
          <Route path="/counselor/schedule" element={<RoleBasedRoute element={<CounselorSchedule />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role}/> }/>
          <Route path="/counselor/counselees" element={<RoleBasedRoute element={<CounselorCounselees />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role}/> }/>
          <Route path="/counselor/messages" element={<RoleBasedRoute element={<CounselorMessages />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role}/> }/>
          <Route path="/counselor/change-password" element={<RoleBasedRoute element={<CounselorChangePassword />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role}/> }/>
          <Route path="/counselor/delete-account" element={<RoleBasedRoute element={<CounselorDeleteAccount />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role}/> }/>

          {/* ================================================================= */}
          {/* ======================= MENTEE (COUNSELEE) ROUTES =============== */}
          {/* ================================================================= */}
          <Route path="/counselee/dashboard" element={<RoleBasedRoute element={<CounseleeDashboard />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} /> } />
          <Route path="/counselee/profile" element={<RoleBasedRoute element={<CounseleeProfile />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} /> } />
          <Route path="/counselee/bookings" element={<RoleBasedRoute element={<CounseleeBookings/>} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} /> } />
          <Route path="/counselee/find-counselor" element={<RoleBasedRoute element={<FindCounselor />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} /> } />
          <Route path="/counselee/messages" element={<RoleBasedRoute element={<Messages />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} /> } />
          <Route path="/counselee/change-password" element={<RoleBasedRoute element={<ChangePassword />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} /> } />
          <Route path="/counselee/delete-account" element={<RoleBasedRoute element={<DeleteAccount/>} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} /> } />
          <Route path="/logout" element={<RoleBasedRoute element={<Logout />} allowedRoles={['ADMIN', 'MENTEE', 'MENTOR', 'JOBSEEKER', 'EMPLOYEE']} userRole={user?.role} /> } />

          {/* ================================================================= */}
          {/* ======================= JOB SEEKER ROUTES ======================= */}
          {/* ================================================================= */}
          <Route path="/jobseeker/dashboard" element={<RoleBasedRoute element={<div>Jobseeker Dashboard Coming Soon</div>} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} /> }/>
          
          {/* ================================================================= */}
          {/* ======================= CV BUILDER ROUTES ======================= */}
          {/* ================================================================= */}
          <Route path="/cv" element={<RoleBasedRoute element={<CVDashboard />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
          <Route element={<CVBuilderLayout />}>
             <Route path="/cv-builder/personal-info" element={<RoleBasedRoute element={<Cv />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
             <Route path="/cv-builder/education" element={<RoleBasedRoute element={<Cv2 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> } />
             <Route path="/cv-builder/experience" element={<RoleBasedRoute element={<Cv6 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
             <Route path="/cv-builder/skills" element={<RoleBasedRoute element={<Cv3 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
             <Route path="/cv-builder/summary" element={<RoleBasedRoute element={<Cv4 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
             <Route path="/cv-builder/references" element={<RoleBasedRoute element={<Cv7 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
          </Route>
          <Route path="/cv-builder/preview" element={<RoleBasedRoute element={<Cv5 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
          
          {/* ================================================================= */}
          {/* ======================= FALLBACK ROUTE ========================== */}
          {/* ================================================================= */}
          <Route path="*" element={<Navigate to={user?.role && user?.userId ? (dashboardByRole[user.role] || "/") : "/"} replace />} />
        </Routes>
        <Footer />
      </>
    </CVFormProvider>
  );
}

export default App;