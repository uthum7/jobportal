import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

import Homepage from "./pages/Homepage/Homepage.jsx";
import Cv from './pages/Cv/Cv.jsx';
import Cv2 from './pages/Cv2/Cv2.jsx';
import Cv3 from './pages/Cv3/Cv3.jsx';
import Cv4 from './pages/Cv4/Cv4.jsx';
import Cv5 from './pages/Cv5/Cv5.jsx';
import Login from "./pages/Login/LoginPage";  // ✅ Fixed import (previously wrongly named "SignupModal")
import Registration from  "./pages/Registration/RegistrationModal";  // ✅ Fixed import (previously wrongly named "SignupPage")

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <>
            <Navbar onSignupClick={() => setIsModalOpen(true)}
              onRegisterClick={() => setIsRegisterOpen(true)} />  {/* ✅ Ensure prop is passed properly */}

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/Cv" element={<Cv />} />
                <Route path="/Cv2" element={<Cv2 />} />
                <Route path="/Cv3" element={<Cv3 />} />
                <Route path="/Cv4" element={<Cv4 />} />
                <Route path="/Cv5" element={<Cv5 />} />
            </Routes>

            {/* ✅ Show modal when `isModalOpen` is true */}
            <Login isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <Registration isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
            <Footer />
        </>
    );
}

export default App;
