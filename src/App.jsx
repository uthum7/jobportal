import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx"; 
import "./pages/Homepage/Homepage.css";           
import Footer from "./components/Footer/Footer.jsx"; 
import Admin from "./pages/Admin/Admin.jsx";


import Homepage from "./pages/Homepage/Homepage.jsx"; 
import Cv from './pages/Cv/Cv.jsx';
import Cv2 from './pages/Cv2/Cv2.jsx';
import Cv3 from './pages/Cv3/Cv3.jsx';
import Cv4 from './pages/Cv4/Cv4.jsx';
import Cv5 from './pages/Cv5/Cv5.jsx';
import Dashboard from './pages/JobSeeker/Dashboard/Dashboard.jsx';
import JobPortal from './pages/JobSeeker/ApplyForAjob/JobPortal.jsx';

function App() {
    return (
        <>
            <Navbar />
           

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/Cv" element={<Cv />} />
                <Route path="/Cv2" element={<Cv2 />} />
                <Route path="/Cv3" element={<Cv3 />} />
                <Route path="/Cv4" element={<Cv4 />} />
                <Route path="/Cv5" element={<Cv5 />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobportal" element={<JobPortal />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
