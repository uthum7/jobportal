import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
/*import Test2 from './Test2';*/
/*import Test2 from './Test2';*/
/*import Test3 from './Test3';*/
/*import Test4 from './Test4';*/
import Cv from './Cv';
import Cv2 from './Cv2';
import Cv3 from './Cv3';
import Cv4 from './Cv4';
import Cv5 from './Cv5';

function App() {
    return (
        <Router>
           <Routes>
              <Route path="/Cv" element={<Cv />} />
              <Route path="/Cv2" element={<Cv2 />} />
              <Route path="/Cv3" element={<Cv3 />} />
              <Route path="/Cv4" element={<Cv4 />} />
              <Route path="/" element={<Cv5 />} />
              
          </Routes>
        </Router>
       
        
        );
}

export default App;