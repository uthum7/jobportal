import React from 'react'
import "./employee-page.css"
import EmployeeSidebar from '../../components/Employee/Sidebar/EmployeeSidebar'
import EmployeeDashboard from '../../components/Employee/Dashboard/EmployeeDashboard'
import PostJobComponent from '../../components/Employee/PostJob/PostJobComponent'
const EmployeePage = () => {
  return (
    <div className="employee-page">
      <aside className="sidebar">
          <EmployeeSidebar />
      </aside>
      <main className="main-content">
        {/* <EmployeeDashboard/> */}
        <PostJobComponent/>
      </main>
    </div>
  )
}

export default EmployeePage