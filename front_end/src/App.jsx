import React from 'react';
import './App.css';
import Navbar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Calendar from './pages/calendar';
import Home from './pages';
import FamilyGroups from './pages/familyGroups/familyGroups';
import SignIn from './pages/signPages/signIn';
import SignUp from './pages/signPages/signUp';

function App() {
return (
    <Router>
    <Navbar />
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route path='/calendar' element={<Calendar/>} />
      <Route path='/familygroups' element={<FamilyGroups/>} />
      <Route path='/sign-in' element={<SignIn/>} />
      <Route path='/sign-up' element={<SignUp/>} />
    </Routes>
    </Router>
);
}
  
export default App;