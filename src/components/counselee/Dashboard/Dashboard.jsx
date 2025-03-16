import { FaUsers, FaCalendarAlt, FaCheckCircle } from "react-icons/fa"
import "./Dashboard.css"

export default function Dashboard() {
  const counselors = [
    {
      id: "01",
      name: "Tyrone Roberts",
      email: "tyroneroberts@gmail.com",
      date: "05 January 2025",
      status: "PENDING",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    // ... add more counselors as needed
  ]

  return (
    <div className="dashboard-container">
      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <h2>05</h2>
          <p>Mentors Connected</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <h2>12</h2>
          <p>Sessions Booked</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <h2>03</h2>
          <p>Sessions Completed</p>
        </div>
      </div>

      {/* Counselor List Section */}
      <div className="counselor-section">
        <div className="section-header">
          <h2>Counselor Lists</h2>
          <div className="search-bar">
            <input type="text" placeholder="ID, Keywords etc." />
            <button className="search-button">Search</button>
          </div>
        </div>

        <div className="counselor-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Basic Info</th>
                <th>Scheduled Date</th>
                <th>Tags</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {counselors.map((counselor) => (
                <tr key={counselor.id}>
                  <td>{counselor.id}</td>
                  <td>
                    <div className="counselor-info">
                      <img src={counselor.avatar || "/placeholder.svg"} alt={counselor.name} />
                      <div>
                        <h4>{counselor.name}</h4>
                        <p>{counselor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{counselor.date}</td>
                  <td>
                    <span className={`status-badge ${counselor.status.toLowerCase()}`}>{counselor.status}</span>
                  </td>
                  <td>
                    <button className="view-button">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

