import React from 'react';
import './App.css';
import Navbar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Calendar from './pages/calendar';
import FamilyGroups from './pages/familyGroups/familyGroups';
import SignIn from './pages/signPages/signIn';

function App() {
return (
    <Router>
    <Navbar />
    <Routes>
      <Route exact path='/' element={<SignIn />} />
      <Route path='/calendar' element={<Calendar/>} />
      <Route path='/familygroups' element={<FamilyGroups/>} />
    </Routes>
    </Router>
);
}
  
export default App;