import React from "react";
import "./Test.css";

const Test = () => {
  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">JOB PORTAL</h1>
        <div className="nav-links">
          <button>For Candidates</button>
          <button>For Employers</button>
          <button>Pages</button>
          <button>Help</button>
        </div>
      </nav>

      {/* Login Section */}
      <div className="login-header">
        <h2>Create An Account</h2>
        <p>Create an account or sign in</p>
      </div>

      <div className="login-container">
        <div className="login-box">
          <div className="login-buttons">
            <button className="login-btn">Login Account</button>
            <button className="create-btn">Create Account</button>
          </div>
          <input type="text" placeholder="User Name" className="input-field" />
          <input type="password" placeholder="Password" className="input-field" />
          <button className="login-submit">Log In</button>
          <div className="login-options">
            <a href="#">Save Password?</a>
            <a href="#">Forgot Password?</a>
          </div>
          <div className="social-buttons">
            <button className="facebook-btn">Facebook</button>
            <button className="google-btn">Google</button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <h2>Find The Perfect Job</h2>
        <p>on Job Stock That is Superb For You</p>
        <div className="info-buttons">
          <button className="upload-btn">Upload Resume</button>
          <button className="join-btn">Join Our Team</button>
        </div>
        <div className="additional-info">
          <p>At www.word.eu/content at www.cdkp.dg/proforma/datmana_gr_failed@gr.properties/en/adoption_details?print=concept!www.2019/09/08.aspx</p>
          <div className="job-stats">
            <span>12K Job Panel</span>
            <span>10M Happy Customer</span>
            <span>76K Purchases</span>
            <span>200+ Corporate</span>
          </div>
        </div>
      </div>

       {/* Footer */}
       <footer className="footer">
  <div className="footer-container">
    <div className="footer-left">
      <h2 className="footer-logo">JOB PORTAL</h2>
      <p>Collins Street West, Victoria Near Bank Road, Australia QHR12456.</p>
      <div className="social-icons">
        <button className="social-btn">🔵</button>
        <button className="social-btn">🔗</button>
        <button className="social-btn">🐦</button>
        <button className="social-btn">🌐</button>
      </div>
    </div>
    <div className="footer-links-container">
      <div className="footer-column">
        <h3>For Clients</h3>
        <a href="#">Talent Marketplace</a>
        <a href="#">Payroll Services</a>
        <a href="#">Direct Contracts</a>
        <a href="#">Hire Workloads</a>
        <a href="#">Hits in the USA</a>
        <a href="#">More to Hire</a>
      </div>
      <div className="footer-column">
        <h3>Our Resources</h3>
        <a href="#">Free Business tools</a>
        <a href="#">Affiliate Program</a>
        <a href="#">Success Stories</a>
        <a href="#">Upwork Reviews</a>
        <a href="#">Resources</a>
        <a href="#">Help & Support</a>
      </div>
      <div className="footer-column">
        <h3>The Company</h3>
        <a href="#">About Us</a>
        <a href="#">Leadership</a>
        <a href="#">Contact Us</a>
        <a href="#">Investor Relations</a>
        <a href="#">Trust, Safety & Security</a>
      </div>
    </div>
  </div>
  <div className="footer-bottom">
    <p>&copy; 2015 - 2025 Job Stock Themezhub.</p>
  </div>
</footer>
    </div>
  );
};

export default Test