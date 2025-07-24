// App.jsx
import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation
} from "react-router-dom";

import { CVFormProvider } from './context/CVFormContext'; // Adjust this path to where your CVFormContext.jsx file is located.
import { Toaster } from 'sonner';


// Component Imports navbar and footer
import Navbar from "./components/Navbar/Navbar.jsx";
import AdminNavbar from './components/Navbar/AdminNavbar';
import MentorNavbar from './components/Navbar/MentorNavbar';
import MenteeNavbar from './components/Navbar/MenteeNavbar';
import JobSeekerNavbar from './components/Navbar/JobSeekerNavbar';
import EmployeeNavbar from './components/Navbar/EmployeeNavbar';
import Footer from "./components/Footer/Footer.jsx";

//login and  registration
import Homepage from "./pages/Homepage/Homepage.jsx";
import LoginPage from "./pages/Login/login.jsx";
import Register from "./pages/Registration/SignUpPage.jsx";
import Unauthorized from "./pages/Unauthorized/Unauthorized.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage.jsx";


//Admin Components
import Admin from "./pages/Admin/Admin.jsx";
import Managecounselor from "./pages/Admin/managecounselor.jsx";


//massages routes
import MessageHomePage from "./pages/Message/MessageHomePage.jsx";

//Counsele components
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



//Counseler Components
import CounselorDashboard from "./pages/counselor/dashboard.jsx";
import CounselorProfile from "./pages/counselor/profile.jsx"
import CounselorBookings from "./pages/counselor/bookings.jsx"
import CounselorSchedule from "./pages/counselor/schedule.jsx"
import CounselorCounselees from "./pages/counselor/counselees.jsx"
import CounselorMessages from "./pages/counselor/messages.jsx"
import CounselorChangePassword from "./pages/counselor/change-password.jsx"
import CounselorDeleteAccount from "./pages/counselor/delete-account.jsx"

import JobSeekerDashboard from "./pages/JobSeeker/Dashboard/Dashboard.jsx";
import ApplyForAjob from "./pages/JobSeeker/ApplyForAjob/ApplyForAjob";
import JobDetails from "./pages/JobSeeker/JobDetails/JobDetails.jsx";
import SavedJobs from "./pages/JobSeeker/SavedJobs/SavedJobs.jsx";
import AppliedJobsPage from "./pages/JobSeeker/AppliedJobs/AppliedJobs.jsx";

//Cv Pages
import CVDashboard from './pages/CVDashboard/CVDashboard';
import Cv from './pages/Cv/Cv';
import Cv2 from './pages/Cv2/Cv2.jsx';
import Cv3 from './pages/Cv3/Cv3.jsx';
import Cv4 from './pages/Cv4/Cv4.jsx';
import Cv5 from './pages/Cv5/Cv5.jsx';
import Cv6 from './pages/Cv6/Cv6.jsx';
import Cv7 from "./pages/Cv7/Cv7.jsx";

import EmployeePage from "./pages/Employee/EmployeePage.jsx";


import MessageRoutes from "./pages/Message/MessageRoutes.jsx";

import JobFormComponent from "./components/Employee/PostJob/JobFormComponent/JobFormComponent.jsx";
import Job from "../../Backend/src/models/Job.model.js";

const dashboardByRole = {
  ADMIN: '/admin',
  MENTOR: '/counselor/dashboard',
  MENTEE: '/counselee/dashboard',
  JOBSEEKER: '/jobseeker/dashboard',
  EMPLOYEE: "/employee" // Assuming you have or will have this
};

const RoleBasedRoute = ({ element, allowedRoles, userRole }) => {
  const currentPath = window.location.pathname;
  // console.log(`[RoleBasedRoute] Accessing: ${currentPath}`);
  // console.log(`[RoleBasedRoute] Passed userRole: '${userRole}' (Type: ${typeof userRole})`);
  // console.log(`[RoleBasedRoute] Allowed roles: [${allowedRoles.join(', ')}]`);

  if (userRole === null || userRole === undefined || userRole === '') {
    // console.error(`[RoleBasedRoute] User role is null, undefined, or empty for path ${currentPath}. Redirecting to /login.`);
    return <Navigate to="/login" replace />;
  }
  const normalizedUserRole = String(userRole).toUpperCase();
  if (!allowedRoles.includes(normalizedUserRole)) {
    // console.error(`[RoleBasedRoute] Unauthorized for path ${currentPath}. Role '${normalizedUserRole}' is not in allowed roles [${allowedRoles.join(', ')}]. Redirecting to /unauthorized.`);
    return <Navigate to="/unauthorized" replace />;
  }
  // console.log(`[RoleBasedRoute] Authorized for path ${currentPath}. Role '${normalizedUserRole}' is allowed. Rendering element.`);
  return element;
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user'); // This 'user' object should now contain userId
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem('user'); // Clear corrupted data
      return null;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const userIsLoggedIn = !!user?.role && !!user?.userId; // Check for userId too

    if (userIsLoggedIn) {
      const userDashboardPath = dashboardByRole[user.role];
      if (userDashboardPath) {
        const forceRedirectPaths = ["/", "/login", "/register"];
        if (forceRedirectPaths.includes(currentPath)) {
          // console.log(`[App useEffect] Logged-in user '${user.role}' is on a force-redirect path ('${currentPath}'). Redirecting to their dashboard: ${userDashboardPath}`);
          navigate(userDashboardPath, { replace: true });
        } else {
          // console.log(`[App useEffect] Logged-in user '${user.role}' is on internal path ('${currentPath}'). No redirect from App.jsx useEffect.`);
        }
      } else {
        console.warn(`[App useEffect] No dashboard path defined for role: ${user.role}`);
      }
    } else {
      // console.log(`[App useEffect] User is not logged in or user object incomplete. Current path: '${currentPath}'.`);
    }
  }, [user, navigate, location]);

  const handleLogin = (userDataFromLogin) => {
    // userDataFromLogin should now be { token, role, userId, email, name, ... }
    console.log("[App.jsx handleLogin] Received userData:", userDataFromLogin);
    const standardizedUserData = {
      ...userDataFromLogin, // Contains token, userId, email, name, etc.
      role: userDataFromLogin.role ? String(userDataFromLogin.role).toUpperCase() : null
    };

    if (!standardizedUserData.role || !standardizedUserData.userId) {
      console.error("Login handled, but role or userId is missing in standardizedUserData:", standardizedUserData);
      // Potentially clear auth and redirect to login if essential data is missing
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      setUser(null);
      navigate("/login", { replace: true });
      return;
    }

    // Store the comprehensive user object. This will be used by `getUserId` and `getUserRole` from `auth.js`
    localStorage.setItem('user', JSON.stringify(standardizedUserData));

    // Set the user state in App
    setUser(standardizedUserData);
    // The useEffect above will handle navigation to the dashboard.
  };

  const handleLogout = () => {
    // Use clearAuth from auth.js if it correctly clears everything.
    // For now, manually clearing:
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); // If you still use this separately
    localStorage.removeItem('userId');   // If you still use this separately
    localStorage.removeItem('user');     // Most important for current getUserId
    setUser(null);
    navigate('/login', { replace: true });
  };

  const renderNavbar = () => {
    // The `user` object passed to navbars will now contain userId, email, name etc.
    if (!user || !user.role) return <Navbar onLogout={handleLogout} user={user} />;
    switch (user.role) {
      case 'ADMIN': return <AdminNavbar onLogout={handleLogout} user={user} />;
      case 'MENTOR': return <MentorNavbar onLogout={handleLogout} user={user} />;
      case 'MENTEE': return <MenteeNavbar onLogout={handleLogout} user={user} />;
      case 'JOBSEEKER': return <JobSeekerNavbar onLogout={handleLogout} user={user} />;
      case 'EMPLOYEE': return <EmployeeNavbar onLogout={handleLogout} user={user} />;
      default:
        console.warn("Rendering default Navbar for unknown user role:", user.role);
        return <Navbar user={user} onLogout={handleLogout} />;
    }
  };

  const cvCreatorRoles = ['ADMIN', 'MENTEE', 'JOBSEEKER', 'MENTOR', "EMPLOYEE"];



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
    <CVFormProvider>
      {/* React.Fragment shorthand */}
      <>
        {renderNavbar()}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} /> {/* Pass onLogin here */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<RoleBasedRoute element={<Admin />} allowedRoles={['ADMIN']} userRole={user?.role} />} />
          <Route path="/admin/managecounselor" element={<RoleBasedRoute element={<Managecounselor />} allowedRoles={['ADMIN']} userRole={user?.role} />} />
          <Route path="/admin/MessageHomePage" element={<RoleBasedRoute element={<MessageHomePage />} allowedRoles={['ADMIN']} userRole={user?.role} />} />

          {/* Counselor (Mentor) Dashboard */}
          <Route path="/counselor/dashboard" element={<RoleBasedRoute element={<CounselorDashboard />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role} />} />
          <Route path="/counselor/profile" element={<RoleBasedRoute element={<CounselorProfile />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role} />} />
          <Route path="/counselor/bookings" element={<RoleBasedRoute element={<CounselorBookings />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role} />} />
          <Route path="/counselor/schedule" element={<RoleBasedRoute element={<CounselorSchedule />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role} />} />
          <Route path="/counselor/counselees" element={<RoleBasedRoute element={<CounselorCounselees />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role} />} />
          <Route path="/counselor/messages" element={<RoleBasedRoute element={<CounselorMessages />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role} />} />
          <Route path="/counselor/change-password" element={<RoleBasedRoute element={<CounselorChangePassword />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role} />} />
          <Route path="/counselor/delete-account" element={<RoleBasedRoute element={<CounselorDeleteAccount />} allowedRoles={['ADMIN', 'MENTOR']} userRole={user?.role} />} />


          <Route path="/employee" element={<EmployeePage />} />
          {/* Counselee (Mentee) Dashboard */}
          <Route path="/counselee/dashboard" element={<RoleBasedRoute element={<CounseleeDashboard />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} />} />
          <Route path="/counselee/profile" element={<RoleBasedRoute element={<CounseleeProfile />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} />} />
          <Route path="/counselee/bookings" element={<RoleBasedRoute element={<CounseleeBookings />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} />} />
          <Route path="/counselee/find-counselor" element={<RoleBasedRoute element={<FindCounselor />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} />} />
          <Route path="/counselee/messages" element={<RoleBasedRoute element={<Messages />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} />} />
          <Route path="/counselee/change-password" element={<RoleBasedRoute element={<ChangePassword />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} />} />
          <Route path="/counselee/delete-account" element={<RoleBasedRoute element={<DeleteAccount />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} />} />
          <Route path="/logout" element={<RoleBasedRoute element={< Logout />} allowedRoles={['ADMIN', 'MENTEE']} userRole={user?.role} />} />


          {/* Job Seeker Dashboard */}
          <Route path="/jobseeker/dashboard" element={<RoleBasedRoute element={<JobSeekerDashboard />} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} />} />
          <Route path="/jobseeker/apply-for-job" element={<ApplyForAjob />} />
          <Route path="/jobseeker/job-details/:jobId" element={<JobDetails />} />
          <Route path="/JobSeeker/applied-jobs" element={<AppliedJobsPage />} />
          <Route path="/JobSeeker/saved-jobs" element={<SavedJobs />} />
          {/* CV Dashboard */}
          <Route path="/cv" element={<RoleBasedRoute element={<CVDashboard />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />

          {/* CV Creation Steps */}
          <Route path="/cv-builder/personal-info" element={<RoleBasedRoute element={<Cv />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />
          <Route path="/cv-builder/education" element={<RoleBasedRoute element={<Cv2 />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />
          <Route path="/cv-builder/experience" element={<RoleBasedRoute element={<Cv6 />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />
          <Route path="/cv-builder/skills" element={<RoleBasedRoute element={<Cv3 />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />
          <Route path="/cv-builder/summary" element={<RoleBasedRoute element={<Cv4 />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />
          <Route path="/cv-builder/references" element={<RoleBasedRoute element={<Cv7 />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />
          <Route path="/cv-builder/preview" element={<RoleBasedRoute element={<Cv5 />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />

          {/* Protected Home route */}
          <Route path="/home" element={<RoleBasedRoute element={<Homepage />} allowedRoles={['ADMIN', 'MENTOR', 'MENTEE', 'JOBSEEKER']} userRole={user?.role} />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={user?.role && user?.userId ? (dashboardByRole[user.role] || "/") : "/"} replace />} />
        </Routes>
        <Footer />
      </>
    </CVFormProvider>
  );
}

export default App;