import React, { useState } from 'react';
import "./employee-page.css";
import EmployeeSidebar from '../../components/Employee/Sidebar/EmployeeSidebar';
import EmployeeDashboard from '../../components/Employee/Dashboard/EmployeeDashboard';
import PostJobComponent from '../../components/Employee/PostJob/PostJobComponent';
import PostedJobComponent from '../Employee/ShowJobs/PostedJobsComponent';
import AllCandidates from './Candidates/AllCandidates';
import AllJobs from '../../components/Employee/Jobs/AllJobs';
import EmployeeProfile from './EmployeeProfile';

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <EmployeeSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          {activeTab === "Dashboard" && <EmployeeDashboard />}
          {activeTab === "PostJobSpecs" && <PostJobComponent />}
          {activeTab === "PostedJob" && <PostedJobComponent />}
          {activeTab === "Profile" && <EmployeeProfile/>}
          {activeTab === "Candidates" && <AllJobs />}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
