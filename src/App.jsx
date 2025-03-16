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
import Cv6 from './pages/Cv6/Cv6.jsx';
import Cv7 from './pages/Cv7/Cv7.jsx';

import Login from "./pages/Login/LoginPage";
import Registration from "./pages/Registration/RegistrationModal";  

function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <>
            <Navbar 
              onSignupClick={() => setIsLoginOpen(true)}
              onRegisterClick={() => setIsRegisterOpen(true)} 
            />

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/Cv" element={<Cv />} />
                <Route path="/Cv2" element={<Cv2 />} />
                <Route path="/Cv3" element={<Cv3 />} />
                <Route path="/Cv4" element={<Cv4 />} />
                <Route path="/Cv5" element={<Cv5 />} />
                <Route path="/Cv6" element={<Cv6 />} />
                <Route path="/Cv7" element={<Cv7 />} />
            </Routes>

            {/* ✅ Pass `openLoginModal` to RegistrationModal */}
            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <Registration 
              isOpen={isRegisterOpen} 
              onClose={() => setIsRegisterOpen(false)} 
              openLoginModal={() => setIsLoginOpen(true)} 
            />
            <Footer />
        </>
    );
}

export default App;
