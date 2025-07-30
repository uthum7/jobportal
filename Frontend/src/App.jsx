
import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CVFormProvider } from './context/CVFormContext';
import { Toaster } from 'sonner';

// Navbars

import Navbar from "./components/Navbar/Navbar.jsx";
import AdminNavbar from './components/Navbar/AdminNavbar';
import MentorNavbar from './components/Navbar/MentorNavbar';
import MenteeNavbar from './components/Navbar/MenteeNavbar';
import JobSeekerNavbar from './components/Navbar/JobSeekerNavbar';
import EmployeeNavbar from './components/Navbar/EmployeeNavbar';
import Footer from "./components/Footer/Footer.jsx";
import MessageNavbar from "./components/Navbar/MessageNavbar.jsx";
import NavbarSimple from "./components/Navbar/NavbarSimple.jsx";

// Message routes
import MessageRoutes from "./pages/Message/MessageRoutes.jsx";

// Other Pages...
import Homepage from "./pages/Homepage/Homepage.jsx";
import LoginPage from "./pages/Login/login.jsx";
import Register from "./pages/Registration/SignUpPage.jsx";
import Unauthorized from "./pages/Unauthorized/Unauthorized.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage.jsx";
// ✅ FIX: Import the missing component
import ForceResetPasswordPage from './pages/Auth/ForceResetPasswordPage'; 

// Admin Pages...
import Admin from "./pages/Admin/Admin.jsx";
import ManageCounselor from "./pages/Admin/managecounselor.jsx";
import MyProfile from  "./pages/Admin/MyProfile.jsx";
import ManageCounselee from "./pages/Admin/ManageCounselee.jsx";
import ManageEmployee from "./pages/Admin/ManageEmployee.jsx";
import ManageJobseeker from "./pages/Admin/ManageJobseeker.jsx";
import EnhancedEmployeeInfo from "./pages/Admin/Manage/ViewEmployee.jsx";
import ViewAllJobs from "./pages/Admin/Manage/ViewAllJobs.jsx";
import EnhancedCounselorInfo  from "./pages/Admin/Manage/ViewCounselor.jsx";
import BookingManagement from "./pages/Admin/Manage/ViewAllBookings.jsx";
import AddUserForm from "./pages/Admin/AddUserForm.jsx";
import ViewJobseeker from "./pages/Admin/Manage/ViewJobseeker.jsx";
import ViewCounselee from "./pages/Admin/Manage/ViewCounselee.jsx";

// Job Seeker
import JobSeekerDashboard from "./pages/JobSeeker/Dashboard/Dashboard.jsx";
import ApplyForAjob from "./pages/JobSeeker/ApplyForAjob/ApplyForAjob.jsx";
import JobDetails from "./pages/JobSeeker/JobDetails/JobDetails.jsx";
import AppliedJobsPage from "./pages/JobSeeker/AppliedJobs/AppliedJobs.jsx";
import SavedJobs from "./pages/JobSeeker/SavedJobs/SavedJobs.jsx";
import FeedbackInsights from './pages/JobSeeker/feedbackInsights/FeedbackInsights.jsx';

// Counselee components
import CounseleeDashboard from "./pages/counselee/dashboard.jsx";
import CounseleeProfile from "./pages/counselee/profile.jsx";
import CounseleeBookings from "./pages/counselee/bookings.jsx";
import FindCounselor from "./pages/counselee/find-counselor.jsx";
import Messages from "./pages/counselee/messages.jsx";
import ChangePassword from "./pages/counselee/change-password.jsx";
import DeleteAccount from "./pages/counselee/delete-account.jsx";
import Logout from "./pages/counselee/logout.jsx";

// Counselor
import CounselorDashboard from "./pages/counselor/dashboard.jsx";
import CounselorProfile from "./pages/counselor/profile.jsx"
import CounselorBookings from "./pages/counselor/bookings.jsx"
import CounselorSchedule from "./pages/counselor/schedule.jsx"
import CounselorCounselees from "./pages/counselor/counselees.jsx"
import CounselorMessages from "./pages/counselor/messages.jsx"
import CounselorChangePassword from "./pages/counselor/change-password.jsx"
import CounselorDeleteAccount from "./pages/counselor/delete-account.jsx"

// Employee
import EmployeePage from "./pages/Employee/EmployeePage.jsx";

// CV Pages
import CVDashboard from "./pages/CVDashboard/CVDashboard.jsx";
import Cv from "./pages/Cv/Cv.jsx";
import Cv2 from "./pages/Cv2/Cv2.jsx";
import Cv3 from "./pages/Cv3/Cv3.jsx";
import Cv4 from "./pages/Cv4/Cv4.jsx";
import Cv5 from "./pages/Cv5/Cv5.jsx";
import Cv6 from "./pages/Cv6/Cv6.jsx";
import Cv7 from "./pages/Cv7/Cv7.jsx";
import CVBuilderLayout from "./pages/CVBuilderLayout.jsx";
import JobFormComponent from "./components/Employee/PostJob/JobFormComponent/JobFormComponent.jsx";
// Dashboard redirects
const dashboardByRole = {
  ADMIN: '/admin',
  MENTOR: '/counselor/dashboard',
  MENTEE: '/counselee/dashboard',
  JOBSEEKER: '/jobseeker/dashboard',
  EMPLOYEE: "/employee/dashboard"
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

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      localStorage.removeItem("user");
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
      case 'EMPLOYEE': return <EmployeeNavbar onLogout={handleLogout} user={user} />;
      default:
        return <Navbar user={user} onLogout={handleLogout} />;
    }
  };

  const messageNavbarPaths = [
    "/message/messagehome",
    "/message/signup",
    "/message/setting",
    "/message/profile"
  ];
  const showMessageNavbar = messageNavbarPaths.includes(location.pathname);
  const showNavbarSimple = showMessageNavbar;

  const cvCreatorRoles = ['ADMIN', 'MENTEE', 'JOBSEEKER', 'MENTOR', 'EMPLOYEE'];

  return (
    <CVFormProvider>
      <>
        <Toaster position="top-right" richColors />

        {/* ✅ FIX: Removed duplicate navbar rendering. This block now handles all navbar logic. */}
        {showMessageNavbar ? (
          <MessageNavbar />
        ) : showNavbarSimple ? (
          <NavbarSimple />
        ) 
        : (
          renderNavbar()
        )}

        <Routes>
          {/* Public */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/force-reset-password" element={<ForceResetPasswordPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Message Routes */}
          <Route path="/message/*" element={<MessageRoutes />} />

          {/* Admin */}
          <Route path="/admin" element={<RoleBasedRoute element={<Admin />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/managecounselor" element={<RoleBasedRoute element={<ManageCounselor />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/myprofile" element={<RoleBasedRoute element={<MyProfile />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/managecounselee" element={<RoleBasedRoute element={<ManageCounselee />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/manageemployee" element={<RoleBasedRoute element={<ManageEmployee />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/managejobseeker" element={<RoleBasedRoute element={<ManageJobseeker />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/viewemployee/:id" element={<RoleBasedRoute element={<EnhancedEmployeeInfo />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/viewalljobs/:id" element={<RoleBasedRoute element={<ViewAllJobs />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/viewcounselor/:id" element={<RoleBasedRoute element={<EnhancedCounselorInfo />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/viewallbookings/:id" element={<RoleBasedRoute element={<BookingManagement />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/adduser" element={<RoleBasedRoute element={<AddUserForm />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/viewjobseeker/:id" element={<RoleBasedRoute element={<ViewJobseeker />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/viewcounselee/:id" element={<RoleBasedRoute element={<ViewCounselee />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />


          {/* Counselor */}
          <Route path="/counselor/dashboard" element={<RoleBasedRoute element={<CounselorDashboard />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/profile" element={<RoleBasedRoute element={<CounselorProfile />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/bookings" element={<RoleBasedRoute element={<CounselorBookings />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/schedule" element={<RoleBasedRoute element={<CounselorSchedule />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/counselees" element={<RoleBasedRoute element={<CounselorCounselees />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/messages" element={<RoleBasedRoute element={<CounselorMessages />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/change-password" element={<RoleBasedRoute element={<CounselorChangePassword />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/delete-account" element={<RoleBasedRoute element={<CounselorDeleteAccount />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />

          {/* counselee */}
          <Route path="/counselee/dashboard" element={<RoleBasedRoute element={<CounseleeDashboard />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/profile" element={<RoleBasedRoute element={<CounseleeProfile />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/bookings" element={<RoleBasedRoute element={<CounseleeBookings />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/find-counselor" element={<RoleBasedRoute element={<FindCounselor />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/messages" element={<RoleBasedRoute element={<Messages />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/change-password" element={<RoleBasedRoute element={<ChangePassword />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/delete-account" element={<RoleBasedRoute element={<DeleteAccount />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/logout" element={<RoleBasedRoute element={<Logout />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />

          {/* Employee */}
          <Route path="/employee" element={<EmployeePage />} />

          {/* Job Seeker */}
          {/* ✅ FIX: Correctly wrap elements with RoleBasedRoute */}
          <Route path="/jobseeker/dashboard" element={<RoleBasedRoute element={<JobSeekerDashboard />} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} />} />
          <Route path="/jobseeker/apply-for-job" element={<RoleBasedRoute element={<ApplyForAjob />} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} />} />
          <Route path="/jobseeker/job-details/:jobId" element={<RoleBasedRoute element={<JobDetails />} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} />} />
          <Route path="/JobSeeker/applied-jobs" element={<RoleBasedRoute element={<AppliedJobsPage />} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} />} />
          <Route path="/JobSeeker/saved-jobs" element={<RoleBasedRoute element={<SavedJobs />} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} />} />
          <Route path="/JobSeeker/application/:applicationId/feedback" element={<RoleBasedRoute element={<FeedbackInsights />} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} />} />

          {/* CV BUILDER ROUTES */}
          {/* ✅ FIX: Removed duplicate /cv route */}
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user?.role && user?.userId ? (dashboardByRole[user.role] || "/") : "/"} replace />} />
        </Routes>

        <Footer />
        <Toaster position="top-center" />
      </>
    </CVFormProvider>
  );
}

export default App;