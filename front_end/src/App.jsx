import React from 'react';
import './App.css';
import Navbar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Calendar from './pages/calendar';
import FamilyGroups from './pages/familyGroups/familyGroups';
import SignIn from './pages/signPages/signIn';
import SignOut from './pages/signPages/signOut';
import {Navigate} from 'react-router-dom';
import SignUp from './pages/signPages/signUp';
import SignUpSuccess from './pages/signPages/signUpSuccess';

function App() {

  let isLoggedIn = (localStorage.getItem("loggedIn") === "true");

return (
    <Router>
    <Navbar />
    <Routes>
      <Route exact path='/' element={isLoggedIn ? <Calendar/> : <SignIn />} />
      <Route path='/calendar' element={isLoggedIn ? <Calendar/> : <Navigate to='/'/>} />
      <Route path='/familygroups' element={isLoggedIn ? <FamilyGroups/> : <Navigate to='/'/>} />
      <Route path='/signout' element={isLoggedIn ? <SignOut/> : <Navigate to='/'/>} />
      <Route path='/sign-up' element={<SignUp/>} />
      <Route path='/signup-success' element={<SignUpSuccess/>} />
    </Routes>
    </Router>
);
}
  
export default App;