import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Removed BrowserRouter
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage.jsx";

import Cv from './Cv';
import Cv2 from './Cv2';
import Cv3 from './Cv3';
import Cv4 from './Cv4';
import Cv5 from './Cv5';

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
        </>
    );
}

export default App;
