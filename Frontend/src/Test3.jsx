import React from "react";
import "./Test3.css";

const Test3 = () => {
    return (
        <div>
            <nav className="navbar">
                <h1 className="logo">JOB PORTAL</h1>
                <div className="nav-links">
                    <button>For Candidates</button>
                    <button>For Employers</button>
                    <button>Pages</button>
                    <button>Help</button>
                </div>
            </nav>
            <div className="container">
                <h2 className="title">Mentor Registration</h2>
                <div className="form-section">
                    <h3 className="section-title">Mentor Detail</h3>
                    <div className="form-grid">
                        <input type="text" placeholder="Mentor ID" className="input-field" />
                        <input type="text" placeholder="Mentor Name" className="input-field" />
                        <input type="text" placeholder="Gender" className="input-field" />
                        <input type="date" placeholder="Date of Birth" className="input-field" />
                        <textarea placeholder="About Info" className="textarea-field"></textarea>
                    </div>
                </div>
                <div className="form-section">
                    <h3 className="section-title">Mentor Contact Detail</h3>
                    <div className="form-grid">
                        <input type="email" placeholder="Mentor Email" className="input-field" />
                        <input type="text" placeholder="Phone no." className="input-field" />
                        <input type="text" placeholder="Temporary Address" className="input-field" />
                        <input type="text" placeholder="Address" className="input-field" />
                        <input type="text" placeholder="Address 2" className="input-field" />
                        <input type="text" placeholder="Zip Code" className="input-field" />
                        <select className="select-field">
                            <option value="">Country</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                        </select>
                        <select className="select-field">
                            <option value="">State/City</option>
                            <option value="Matara">Matara</option>
                        </select>
                    </div>
                </div>
                <button className="register-btn">Register</button>
            </div>
        </div>
    );
};

export default Test3;