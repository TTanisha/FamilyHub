import React from 'react';
import './App.css';
import Navbar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Calendar from './pages/calendar';
import FamilyGroups from './pages/familyGroups/familyGroups';
import SignIn from './pages/signPages/signIn';
import SignUp from './pages/signPages/signUp';
import SignUpSuccess from './pages/signPages/signUpSuccess';

function App() {
return (
    <Router>
    <Navbar />
    <Routes>
      <Route exact path='/' element={<SignIn />} />
      <Route path='/calendar' element={<Calendar/>} />
      <Route path='/familygroups' element={<FamilyGroups/>} />
      <Route path='/sign-up' element={<SignUp/>} />
      <Route path='/signup-success' element={<SignUpSuccess/>} />
    </Routes>
    </Router>
);
}
  
export default App;