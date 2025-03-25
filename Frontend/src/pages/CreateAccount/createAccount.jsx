import React from "react";
import "./CreateAccount.css"; // Import external CSS
import Navbar from './Navbar/Navbar'; 
const CreateAccount = () => {
  return (
    <div className="create-account-page">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Create An Account</h1>
        <p>Create an account or sign in</p> 
      </section>

      {/* Form Section */}
      <div className="form-container">
        <div className="form-card">
          <div className="tab-buttons">
            <button className="login-btn">Login Account</button>
            <button className="active">Create Account</button>
          </div>
          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="User ID" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit" className="submit-btn">Create An Account</button>
          </form>
        </div>
      </div>

      {/* Info Section */}
      <section className="info-section">
        <h2>Find The Perfect Job</h2>
        <p>on Job Stock That is Superb For You</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
          voluptatem dolorem adipisci error.
        </p>
        <div className="buttons">
          <button className="upload-btn">Upload Resume</button>
          <button className="join-btn">Join Our Team</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logo.png" alt="Job Portal Logo" />
            <p>Job Portal</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>For Clients</h4>
              <ul>
                <li>Market Marketplace</li>
                <li>Browse Jobs</li>
                <li>Direct Contracts</li>
                <li>Find Freelancers</li>
                <li>How It Works</li>
              </ul>
            </div>
            <div>
              <h4>Our Resources</h4>
              <ul>
                <li>Free Business Tools</li>
                <li>Affiliate Program</li>
                <li>Success Stories</li>
                <li>Upcoming Events</li>
                <li>Help & Support</li>
              </ul>
            </div>
            <div>
              <h4>The Company</h4>
              <ul>
                <li>About Us</li>
                <li>Investor Relations</li>
                <li>Contact Us</li>
                <li>Terms & Policies</li>
                <li>Trust, Safety & Security</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="footer-bottom">© 2025 Job Stock. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default CreateAccount;