import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

// Components
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

// Pages
import Homepage from "./pages/Homepage/Homepage.jsx";
import Cv from './pages/Cv/Cv.jsx';
import Cv2 from './pages/Cv2/Cv2.jsx';
import Cv3 from './pages/Cv3/Cv3.jsx';
import Cv4 from './pages/Cv4/Cv4.jsx';
import Cv5 from './pages/Cv5/Cv5.jsx';
import Cv6 from './pages/Cv6/Cv6.jsx';
import Cv7 from "./pages/Cv7/Cv7.jsx";

// Auth Modals
import Login from "./pages/Login/LoginPage";
import Registration from "./pages/Registration/RegistrationModal.jsx";  

// Context
import {CVFormProvider} from "./context/CVFormContext";// Ensure this is the Provider export

function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <CVFormProvider>
            <div className="app-container">
                <Navbar 
                    onSignupClick={() => setIsLoginOpen(true)}
                    onRegisterClick={() => setIsRegisterOpen(true)} 
                />

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/cv" element={<Cv />} />
                        <Route path="/cv2" element={<Cv2 />} />
                        <Route path="/cv3" element={<Cv3 />} />
                        <Route path="/cv4" element={<Cv4 />} />
                        <Route path="/cv5" element={<Cv5 />} />
                        <Route path="/cv6" element={<Cv6 />} />
                        <Route path="/cv7" element={<Cv7 />} />
                    </Routes>
                </main>

                {/* Auth Modals */}
                <Login 
                    isOpen={isLoginOpen} 
                    onClose={() => setIsLoginOpen(false)} 
                />
                <Registration 
                    isOpen={isRegisterOpen} 
                    onClose={() => setIsRegisterOpen(false)} 
                    openLoginModal={() => setIsLoginOpen(true)} 
                />
                
                <Footer />
            </div>
        </CVFormProvider>
    );
}

export default App;