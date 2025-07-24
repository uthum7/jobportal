import React, { useState } from 'react';
import "./employee-page.css";
import EmployeeSidebar from '../../components/Employee/Sidebar/EmployeeSidebar';
import EmployeeDashboard from '../../components/Employee/Dashboard/EmployeeDashboard';
import PostJobComponent from '../../components/Employee/PostJob/PostJobComponent';
import PostedJobComponent from '../Employee/ShowJobs/PostedJobsComponent';
import AllCandidates from './Candidates/AllCandidates';
import AllJobs from '../../components/Employee/Jobs/AllJobs';

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="employee-page">
      <aside className="sidebar">
        <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>
      <main className="main-content">
        {activeTab === "Dashboard" && <EmployeeDashboard />}
        {activeTab === "PostJobSpecs" && <PostJobComponent />}
        {activeTab === "PostedJob" && <PostedJobComponent />}
        {activeTab === "Profile" && <div>Profile Component</div>}
        {activeTab === "Candidates" && <AllJobs />}
        {/* Add more tabs as needed */}
      </main>
    </div>
  );
};

export default EmployeePage;