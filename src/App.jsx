import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Removed BrowserRouter
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage/Homepage.jsx";
import Footer from "./components/Footer/Footer";

import Cv from './pages/Cv/Cv.jsx';
import Cv2 from './pages/Cv2/Cv2.jsx';
import Cv3 from './pages/Cv3/Cv3.jsx';
import Cv4 from './pages/Cv4/Cv4.jsx';
import Cv5 from './pages/Cv5/Cv5.jsx';

function App() {
    return (
        <>
            {/* Navbar always visible */}
            <Navbar />

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/Cv" element={<Cv />} />
                <Route path="/Cv2" element={<Cv2 />} />
                <Route path="/Cv3" element={<Cv3 />} />
                <Route path="/Cv4" element={<Cv4 />} />
                <Route path="/Cv5" element={<Cv5 />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
