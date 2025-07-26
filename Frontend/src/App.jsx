import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  Navigate,
  useLocation,
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

import EmployeePage from "./pages/Employee/EmployeePage.jsx";
// Message navbars
import MessageNavbar from "./components/Navbar/MessageNavbar.jsx";
import NavbarSimple from "./components/Navbar/NavbarSimple.jsx"; // Ensure this exists

// Login and registration
import Homepage from "./pages/Homepage/Homepage.jsx";
import LoginPage from "./pages/Login/login.jsx";
import Register from "./pages/Registration/SignUpPage.jsx";
import Unauthorized from "./pages/Unauthorized/Unauthorized.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage.jsx";

// Admin components
import Admin from "./pages/Admin/Admin.jsx";
import ManageCounselor from "./pages/Admin/ManageCounselor.jsx";
import MyProfile from  "./pages/Admin/MyProfile.jsx";
import ManageCounselee from "./pages/Admin/ManageCounselee.jsx";
import ManageEmployee from "./pages/Admin/ManageEmployee.jsx";
import ManageJobseeker from "./pages/Admin/ManageJobseeker.jsx";
import AdminChangePassword from "./pages/Admin/AdminChangePassword.jsx";
import EnhancedEmployeeInfo from "./pages/Admin/Manage/ViewEmployee.jsx";
import ViewAllJobs from "./pages/Admin/Manage/ViewAllJobs.jsx";


//jobseeker
import JobSeekerDashboard from "./pages/JobSeeker/Dashboard/Dashboard.jsx";
import ApplyForAjob from "./pages/JobSeeker/ApplyForAjob/ApplyForAjob.jsx";
import JobDetails from "./pages/JobSeeker/JobDetails/JobDetails.jsx";
import AppliedJobsPage from "./pages/JobSeeker/AppliedJobs/AppliedJobs.jsx";
import SavedJobs from "./pages/JobSeeker/SavedJobs/SavedJobs.jsx";





// Message routes
import MessageRoutes from "./pages/Message/MessageRoutes.jsx";
import MessageHomePage from "./pages/Message/MessageHomePage.jsx";

// Counselee components
import CounseleeDashboard from "./pages/counselee/dashboard.jsx";
import CounseleeProfile from "./pages/counselee/profile.jsx";
import CounseleeBookings from "./pages/counselee/bookings.jsx";
import FindCounselor from "./pages/counselee/find-counselor.jsx";
import Messages from "./pages/counselee/messages.jsx";
import ChangePassword from "./pages/counselee/change-password.jsx";
import DeleteAccount from "./pages/counselee/delete-account.jsx";
import Logout from "./pages/counselee/logout.jsx";

// Counselor components
import CounselorDashboard from "./pages/counselor/dashboard.jsx";
import CounselorProfile from "./pages/counselor/profile.jsx"
import CounselorBookings from "./pages/counselor/bookings.jsx"
import CounselorSchedule from "./pages/counselor/schedule.jsx"
import CounselorCounselees from "./pages/counselor/counselees.jsx"
import CounselorMessages from "./pages/counselor/messages.jsx"
import CounselorChangePassword from "./pages/counselor/change-password.jsx"
import CounselorDeleteAccount from "./pages/counselor/delete-account.jsx"



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

// Job Posting
import JobFormComponent from "./components/Employee/PostJob/JobFormComponent/JobFormComponent.jsx";
//import Job from "../../Backend/src/models/Job.model.js";

// Dashboard redirects
const dashboardByRole = {
  ADMIN: '/admin',
  MENTOR: '/counselor/dashboard',
  MENTEE: '/counselee/dashboard',
  JOBSEEKER: '/jobseeker/dashboard',
  EMPLOYEE: "/employee" // Assuming you have or will have this
};

const RoleBasedRoute = ({ element, allowedRoles, userRole }) => {
  const currentPath = window.location.pathname;
  if (!userRole) return <Navigate to="/login" replace />;
  const normalized = String(userRole).toUpperCase();
  return allowedRoles.includes(normalized) ? element : <Navigate to="/unauthorized" replace />;
};

function App() {
  <Toaster position="top-center" />
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
    const currentPath = location.pathname;
    const loggedIn = !!user?.role && !!user?.userId;
    if (loggedIn) {
      const redirectPath = dashboardByRole[user.role];
      if ([, "/login", "/register"].includes(currentPath)) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, navigate, location]);

 const handleLogin = (data) => {
  const userData = {
    ...data,
    role: data.role ? String(data.role).toUpperCase() : null,
  };

  if (!userData.role || !userData.userId) {
    console.error("Login handled, but role or userId is missing in userData:", userData);
    // Potentially clear auth and redirect to login if essential data is missing
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setUser(null);
    navigate("/login", { replace: true });
    return;
  }

  // Store the comprehensive user object
  localStorage.setItem('user', JSON.stringify(userData));

  // Set the user state in App
  setUser(userData);
};


  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login", { replace: true });
  };

  // Navbar Rendering
  const renderNavbar = () => {
    if (!user?.role) return <Navbar onLogout={handleLogout} />;
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
    "/message/profile",
  ].includes(location.pathname);

  const showNavbarSimple = showMessageNavbar;

 
  return (
    
    <CVFormProvider>
      {/* React.Fragment shorthand */}
      <>
        {renderNavbar()}
        <Routes>
          {/* Public */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          
          <Route path="/message/*" element={<MessageRoutes />} />

          {/* Admin */}
          <Route path="/admin" element={<RoleBasedRoute element={<Admin/>} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/managecounselor" element={<RoleBasedRoute element={<ManageCounselor/>} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/myprofile" element={<RoleBasedRoute element={<MyProfile/>} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/managecounselee" element={<RoleBasedRoute element={<ManageCounselee/>} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/manageemployee" element={<RoleBasedRoute element={<ManageEmployee/>} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/managejobseeker" element={<RoleBasedRoute element={<ManageJobseeker/>} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/changepassword" element={<RoleBasedRoute element={<AdminChangePassword />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />

          <Route path="/admin/viewemployee/:id" element={<RoleBasedRoute element={< EnhancedEmployeeInfo />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />
          <Route path="/admin/viewalljobs/:id" element={<RoleBasedRoute element={<ViewAllJobs />} allowedRoles={["ADMIN"]} userRole={user?.role} />} />

          
          

          {/* Mentor */}
          <Route path="/counselor/dashboard" element={<RoleBasedRoute element={<CounselorDashboard />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/profile" element={<RoleBasedRoute element={<CounselorProfile />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/bookings" element={<RoleBasedRoute element={<CounselorBookings />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/schedule" element={<RoleBasedRoute element={<CounselorSchedule />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/counselees" element={<RoleBasedRoute element={<CounselorCounselees />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/messages" element={<RoleBasedRoute element={<CounselorMessages />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/change-password" element={<RoleBasedRoute element={<CounselorChangePassword />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />
          <Route path="/counselor/delete-account" element={<RoleBasedRoute element={<CounselorDeleteAccount />} allowedRoles={["ADMIN", "MENTOR"]} userRole={user?.role} />} />

          {/* Mentee */}
          <Route path="/counselee/dashboard" element={<RoleBasedRoute element={<CounseleeDashboard />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/profile" element={<RoleBasedRoute element={<CounseleeProfile />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/bookings" element={<RoleBasedRoute element={<CounseleeBookings />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/find-counselor" element={<RoleBasedRoute element={<FindCounselor />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/messages" element={<RoleBasedRoute element={<Messages />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/change-password" element={<RoleBasedRoute element={<ChangePassword />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/counselee/delete-account" element={<RoleBasedRoute element={<DeleteAccount />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />
          <Route path="/logout" element={<RoleBasedRoute element={<Logout />} allowedRoles={["ADMIN", "MENTEE"]} userRole={user?.role} />} />

          <Route path="/employee" element={<EmployeePage />} />

          {/* Job Seeker Dashboard */}
          <Route path="/jobseeker/dashboard" element={<RoleBasedRoute element={<JobSeekerDashboard />} allowedRoles={['ADMIN', 'JOBSEEKER']} userRole={user?.role} />} />
          <Route path="/jobseeker/apply-for-job" element={<ApplyForAjob />} />
          <Route path="/jobseeker/job-details/:jobId" element={<JobDetails />} />
          <Route path="/JobSeeker/applied-jobs" element={<AppliedJobsPage />} />
          <Route path="/JobSeeker/saved-jobs" element={<SavedJobs />} />
          {/* CV Dashboard */}
          <Route path="/cv" element={<RoleBasedRoute element={<CVDashboard />} allowedRoles={cvCreatorRoles} userRole={user?.role} />} />

          {/* CV Creation Steps */}

          <Route element={<CVBuilderLayout />}>
             <Route path="/cv-builder/personal-info" element={<RoleBasedRoute element={<Cv />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
             <Route path="/cv-builder/education" element={<RoleBasedRoute element={<Cv2 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> } />
             <Route path="/cv-builder/experience" element={<RoleBasedRoute element={<Cv6 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
             <Route path="/cv-builder/skills" element={<RoleBasedRoute element={<Cv3 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
             <Route path="/cv-builder/summary" element={<RoleBasedRoute element={<Cv4 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
             <Route path="/cv-builder/references" element={<RoleBasedRoute element={<Cv7 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
          </Route>
             <Route path="/cv-builder/preview" element={<RoleBasedRoute element={<Cv5 />} allowedRoles={cvCreatorRoles} userRole={user?.role} /> }/>
          

          {/* Protected Home route */}
          <Route path="/home" element={<RoleBasedRoute element={<Homepage />} allowedRoles={['ADMIN', 'MENTOR', 'MENTEE', 'JOBSEEKER']} userRole={user?.role} />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={user?.role && user?.userId ? (dashboardByRole[user.role] || "/") : "/"} replace />} />
        </Routes>

        <Footer />
        <Toaster />
      </>
    </CVFormProvider>
  );
}

export default App;
