import React from 'react';
import './App.css';
import Navbar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Calendar from './pages/calendar';
import Home from './pages';
import FamilyGroups from './pages/familyGroups/familyGroups';
  
function App() {
return (
    <Router>
    <Navbar />
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route path='/calendar' element={<Calendar/>} />
      <Route path='/familygroups' element={<FamilyGroups/>} />
    </Routes>
    </Router>
);
}
  
export default App;