import React, { useState } from 'react';
import "./employee-page.css";
import EmployeeSidebar from '../../components/Employee/Sidebar/EmployeeSidebar';
import EmployeeDashboard from '../../components/Employee/Dashboard/EmployeeDashboard';
import PostJobComponent from '../../components/Employee/PostJob/PostJobComponent';
import PostedJobComponent from '../Employee/ShowJobs/PostedJobsComponent';
import AllCandidates from './Candidates/AllCandidates';
import AllJobs from '../../components/Employee/Jobs/AllJobs';
import AdminProfilePage from '../Admin/MyProfile';

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="employee-page">
      <aside className="sidebar-employee">
        <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
      </aside>
      <main className="main-content">
        {activeTab === "Dashboard" && <EmployeeDashboard />}
        {activeTab === "PostJobSpecs" && <PostJobComponent />}
        {activeTab === "PostedJob" && <PostedJobComponent />}
        {activeTab === "Profile" && <AdminProfilePage/>}
        {activeTab === "Candidates" && <AllJobs />}
        {/* Add more tabs as needed */}
      </main>
    </div>
  );
};

export default EmployeePage;
